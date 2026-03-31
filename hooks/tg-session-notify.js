#!/usr/bin/env node
/**
 * tg-session-notify.js
 * Stop hook: sends a Telegram message when a Claude Code session ends.
 * Reads env from ~/aeon/dashboard/.env.local for TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID.
 * Reads session context from stdin (transcript_path) or falls back to latest session file.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- Load Telegram credentials from dashboard .env.local ---
const ENV_FILE = path.join(process.env.USERPROFILE || process.env.HOME, 'aeon', 'dashboard', '.env.local');
let BOT_TOKEN = '', CHAT_ID = '';
try {
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const [k, v] = line.split('=');
    if (k && v) {
      if (k.trim() === 'TELEGRAM_BOT_TOKEN') BOT_TOKEN = v.trim();
      if (k.trim() === 'TELEGRAM_CHAT_ID') CHAT_ID = v.trim();
    }
  }
} catch { /* no creds — skip */ }

if (!BOT_TOKEN || !CHAT_ID) process.exit(0);

// --- Read stop hook input from stdin ---
let hookInput = {};
try {
  const raw = fs.readFileSync('/dev/stdin', { encoding: 'utf8', flag: 'r' });
  if (raw.trim()) hookInput = JSON.parse(raw);
} catch { /* stdin unavailable or not JSON */ }

// --- Build session summary ---
let summary = '';

// Option 1: read transcript if provided
const transcriptPath = hookInput.transcript_path;
if (transcriptPath) {
  try {
    const data = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));
    const msgs = data.messages || data.conversation || [];
    const count = msgs.length;
    const lastUser = [...msgs].reverse().find(m => (m.role || m.type) === 'user');
    let preview = '';
    if (lastUser) {
      const c = lastUser.content;
      const text = Array.isArray(c) ? (c.find(b => b.type === 'text') || {}).text || '' : (typeof c === 'string' ? c : '');
      preview = text.slice(0, 80).replace(/\n/g, ' ');
    }
    summary = `${count} msgs${preview ? ` · "${preview}${preview.length >= 80 ? '…' : ''}"` : ''}`;
  } catch { /* fall through */ }
}

// Option 2: fallback to most recent session json in ~/.claude/sessions/
if (!summary) {
  const sessDir = path.join(process.env.HOME || process.env.USERPROFILE, '.claude', 'sessions');
  try {
    const files = fs.readdirSync(sessDir)
      .filter(f => f.endsWith('.json') || f.endsWith('.tmp'))
      .map(f => ({ f, mtime: fs.statSync(path.join(sessDir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    if (files.length > 0) {
      const { f } = files[0];
      const content = fs.readFileSync(path.join(sessDir, f), 'utf8');
      if (f.endsWith('.tmp')) {
        const m = content.match(/PROJECT:\s*(.+)/);
        summary = m ? m[1].trim() : f.replace('-session.tmp', '');
      } else {
        const data = JSON.parse(content);
        const msgs = data.messages || data.conversation || [];
        summary = `${msgs.length} msgs`;
      }
    }
  } catch { /* skip */ }
}

// --- Send Telegram notification ---
const now = new Date().toLocaleTimeString('en-US', {
  hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
});

// Escape MarkdownV2 special chars
function escape(s) {
  return s.replace(/[_*[\]()~`>#+=|{}.!\-]/g, '\\$&');
}

const lines = [`🖥️ *Claude Code session ended* \\(${escape(now)} IST\\)`];
if (summary) lines.push(`_${escape(summary)}_`);

const body = JSON.stringify({ chat_id: CHAT_ID, text: lines.join('\n'), parse_mode: 'MarkdownV2' });

const req = https.request({
  hostname: 'api.telegram.org',
  path: `/bot${BOT_TOKEN}/sendMessage`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
}, (res) => {
  // drain response
  res.resume();
});
req.on('error', () => { /* silent — don't block session close */ });
req.write(body);
req.end();
