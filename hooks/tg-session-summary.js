#!/usr/bin/env node
/**
 * tg-session-summary.js
 * PostToolUse/Write hook: when a *-session.tmp file is saved, send its
 * summary to Telegram so Kaneda stays in sync with Claude Code sessions.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Only fire for session .tmp files ---
let filePath = '';
try {
  const chunks = [];
  // Read stdin synchronously via fd 0
  const buf = Buffer.alloc(4096);
  let n;
  try { n = require('fs').readSync(0, buf, 0, buf.length, null); } catch { n = 0; }
  const raw = buf.slice(0, n).toString('utf8').trim();
  if (raw) {
    const input = JSON.parse(raw);
    filePath = (input.tool_input && input.tool_input.file_path) || '';
  }
} catch { /* stdin unavailable */ }

if (!filePath) process.exit(0);
if (!filePath.endsWith('-session.tmp')) process.exit(0);

// --- Load Telegram credentials ---
const ENV_FILE = path.join(process.env.USERPROFILE || process.env.HOME, 'aeon', 'dashboard', '.env.local');
let BOT_TOKEN = '', CHAT_ID = '';
try {
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const k = line.slice(0, eq).trim(), v = line.slice(eq + 1).trim();
    if (k === 'TELEGRAM_BOT_TOKEN') BOT_TOKEN = v;
    if (k === 'TELEGRAM_CHAT_ID') CHAT_ID = v;
  }
} catch { process.exit(0); }
if (!BOT_TOKEN || !CHAT_ID) process.exit(0);

// --- Read and parse session file ---
let content = '';
try { content = fs.readFileSync(filePath, 'utf8'); } catch { process.exit(0); }

function extract(label, text) {
  const re = new RegExp(`${label}[:\\s]*([\\s\\S]*?)(?=\\n#+\\s|\\n[A-Z ]{4,}:|$)`, 'i');
  const m = text.match(re);
  return m ? m[1].replace(/^[-\s]+/, '').trim().split('\n')[0].trim() : '';
}

const project = extract('PROJECT', content);
const building = extract('WHAT WE(?:\'RE| ARE) BUILDING', content) || extract('WHAT WE BUILT', content);
const nextStep = extract('NEXT STEP', content);

// --- Build message (plain text, no MarkdownV2 headaches) ---
const name = path.basename(filePath).replace('-session.tmp', '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });

const lines = [`📋 Session saved: ${name} (${now} IST)`];
if (project)  lines.push(`Project: ${project}`);
if (building) lines.push(`Building: ${building}`);
if (nextStep) lines.push(`Next: ${nextStep}`);

const text = lines.join('\n');
const body = JSON.stringify({ chat_id: CHAT_ID, text });

const req = https.request({
  hostname: 'api.telegram.org',
  path: `/bot${BOT_TOKEN}/sendMessage`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
}, res => { res.resume(); });
req.on('error', () => {});
req.write(body);
req.end();
