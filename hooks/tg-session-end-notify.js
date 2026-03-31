#!/usr/bin/env node
/**
 * tg-session-end-notify.js
 * Stop hook: sends a concise Telegram message when a Claude Code session ends.
 *
 * Message format: "🔴 Session ended | {duration} | {summary}"
 *
 * Credentials: read from ~/aeon/dashboard/.env.local
 * Errors: swallowed — this hook must never block session close.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Load Telegram credentials ---
const ENV_FILE = path.join(process.env.USERPROFILE || process.env.HOME, 'aeon', 'dashboard', '.env.local');
let BOT_TOKEN = '', CHAT_ID = '';
try {
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim();
    if (k === 'TELEGRAM_BOT_TOKEN') BOT_TOKEN = v;
    if (k === 'TELEGRAM_CHAT_ID') CHAT_ID = v;
  }
} catch { /* missing .env.local — skip */ }

if (!BOT_TOKEN || !CHAT_ID) process.exit(0);

// --- Read Stop hook input from stdin ---
let hookInput = {};
try {
  const buf = Buffer.alloc(65536);
  const n = fs.readSync(0, buf, 0, buf.length, null);
  if (n > 0) hookInput = JSON.parse(buf.slice(0, n).toString('utf8').trim());
} catch { /* stdin unavailable or not JSON */ }

// --- Derive duration from session_id if it encodes a timestamp ---
// CC session IDs are typically UUIDs, so we fall back to wall-clock time.
// We track the process start time as a proxy for "now", since the hook fires
// at session end. Duration is only shown if hookInput contains start_time.
function formatDuration(startIso) {
  if (!startIso) return null;
  const diffMs = Date.now() - new Date(startIso).getTime();
  if (isNaN(diffMs) || diffMs < 0) return null;
  const mins = Math.floor(diffMs / 60000);
  const secs = Math.floor((diffMs % 60000) / 1000);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

const duration = formatDuration(hookInput.start_time) || null;

// --- Extract a summary from the transcript or session .tmp files ---
let summary = '';

const transcriptPath = hookInput.transcript_path;
if (transcriptPath) {
  try {
    const data = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));
    const msgs = data.messages || data.conversation || [];
    const lastUser = [...msgs].reverse().find(m => (m.role || m.type) === 'user');
    if (lastUser) {
      const c = lastUser.content;
      const text = Array.isArray(c)
        ? ((c.find(b => b.type === 'text') || {}).text || '')
        : (typeof c === 'string' ? c : '');
      const preview = text.slice(0, 60).replace(/\n/g, ' ').trim();
      if (preview) summary = `"${preview}${text.length > 60 ? '…' : ''}"`;
    }
  } catch { /* skip */ }
}

// Fallback: most recent .tmp session file PROJECT line
if (!summary) {
  const sessDir = path.join(process.env.HOME || process.env.USERPROFILE, '.claude', 'sessions');
  try {
    const files = fs.readdirSync(sessDir)
      .filter(f => f.endsWith('-session.tmp'))
      .map(f => ({ f, mtime: fs.statSync(path.join(sessDir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    if (files.length > 0) {
      const content = fs.readFileSync(path.join(sessDir, files[0].f), 'utf8');
      const m = content.match(/PROJECT[:\s]+([^\n]+)/i);
      if (m) summary = m[1].trim();
    }
  } catch { /* skip */ }
}

// --- Build message ---
const parts = ['🔴 Session ended'];
if (duration) parts.push(duration);
if (summary) parts.push(summary);

const text = parts.join(' | ');
const body = JSON.stringify({ chat_id: CHAT_ID, text });

// --- Send to Telegram (fire-and-forget) ---
const req = https.request({
  hostname: 'api.telegram.org',
  path: `/bot${BOT_TOKEN}/sendMessage`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
}, (res) => { res.resume(); });

req.on('error', () => { /* never block session close */ });
req.write(body);
req.end();
