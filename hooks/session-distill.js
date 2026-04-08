#!/usr/bin/env node
/**
 * session-distill.js
 * Stop hook: extracts a lightweight manifest from the latest Claude Code session,
 * appends it to ~/aeon/memory/topics/claude-sessions.md,
 * commits + pushes to NERV_02, then dispatches session-sync via GH Actions.
 *
 * Every external operation is non-blocking — failures are logged, never thrown.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const HOME = process.env.HOME || process.env.USERPROFILE;
const SESSIONS_DIR = path.join(HOME, '.claude', 'sessions');
const AEON_DIR = path.join(HOME, 'aeon');
const SESSIONS_MD = path.join(AEON_DIR, 'memory', 'topics', 'claude-sessions.md');
const ENV_FILE = path.join(AEON_DIR, 'dashboard', '.env.local');

// ── Load Telegram credentials from ~/aeon/dashboard/.env.local ──
function loadTelegramCreds() {
  try {
    const creds = { token: '', chatId: '' };
    for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const k = line.slice(0, eq).trim(), v = line.slice(eq + 1).trim();
      if (k === 'TELEGRAM_BOT_TOKEN') creds.token = v;
      if (k === 'TELEGRAM_CHAT_ID') creds.chatId = v;
    }
    return creds;
  } catch {
    return { token: '', chatId: '' };
  }
}

// ── Send Telegram message (fire-and-forget, non-blocking) ──
function notifyTelegram(text) {
  const { token, chatId } = loadTelegramCreds();
  if (!token || !chatId) return;
  try {
    const body = JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' });
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    });
    req.on('error', () => {});
    req.write(body);
    req.end();
  } catch {}
}

const HEADER = [
  '# Claude Code Session Manifests',
  '',
  'This file is auto-maintained by session-distill.js (local Stop hook).',
  'Each entry is a lightweight manifest from a Claude Code session.',
  'Status values: pending-distillation | distilled',
  '',
  '---',
  '',
].join('\n');

// ── Stable IST timestamp — manual arithmetic avoids toLocaleString instability on Windows ──
function getISTTimestamp() {
  const now = new Date();
  const istOffsetMs = (5 * 60 + 30) * 60000; // UTC+5:30 in ms
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utcMs + istOffsetMs);
  const pad = n => String(n).padStart(2, '0');
  return `${ist.getFullYear()}-${pad(ist.getMonth() + 1)}-${pad(ist.getDate())}T${pad(ist.getHours())}:${pad(ist.getMinutes())} IST`;
}

// ── Find the most recent session file that contains conversation messages ──
function findLatestSession(sessionsDir) {
  if (!fs.existsSync(sessionsDir)) return null;

  let entries;
  try {
    entries = fs.readdirSync(sessionsDir);
  } catch {
    return null;
  }

  const candidates = entries
    .filter(f => f.endsWith('.json') || f.endsWith('.tmp'))
    .map(f => {
      const full = path.join(sessionsDir, f);
      try {
        return { full, mtime: fs.statSync(full).mtimeMs };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.mtime - a.mtime);

  for (const { full } of candidates) {
    try {
      const raw = fs.readFileSync(full, 'utf8');
      const data = JSON.parse(raw);
      const msgs = data.messages || data.conversation || [];
      if (msgs.length > 0) return { data, path: full };
    } catch {
      // skip unparseable or stub files
    }
  }
  return null;
}

// ── Extract manifest metadata from session data (no AI) ──
function extractManifest(data) {
  const msgs = data.messages || data.conversation || [];
  const homeNorm = (HOME || '').replace(/\\/g, '/');

  // Files touched: scan tool_use blocks for file_path inputs — keep relative paths
  const files = new Set();
  for (const msg of msgs) {
    const blocks = Array.isArray(msg.content) ? msg.content : [];
    for (const block of blocks) {
      if (block.type !== 'tool_use' || !block.input) continue;
      const fp = block.input.file_path || block.input.path || '';
      if (!fp) continue;
      let rel = fp.replace(/\\/g, '/');
      // Strip home prefix to get a clean relative path
      if (homeNorm && rel.startsWith(homeNorm)) {
        rel = rel.slice(homeNorm.length).replace(/^\//, '');
      }
      // Skip noise paths
      if (rel.includes('.claude/plugins') || rel.includes('node_modules') || rel.includes('/.npm/')) continue;
      files.add(rel);
    }
  }

  // User message snippets: first 80 chars of each human turn
  const topics = msgs
    .filter(m => m.role === 'human' || m.role === 'user')
    .map(m => {
      const text =
        typeof m.content === 'string'
          ? m.content
          : Array.isArray(m.content)
          ? m.content.filter(b => b.type === 'text').map(b => b.text).join(' ')
          : '';
      return text.replace(/\n/g, ' ').trim().slice(0, 80);
    })
    .filter(Boolean)
    .slice(0, 5);

  // Duration from timestamps
  const times = msgs
    .map(m => m.created_at || m.timestamp)
    .filter(Boolean)
    .map(t => new Date(t).getTime())
    .filter(n => !isNaN(n));

  let duration = 'unknown';
  if (times.length >= 2) {
    const mins = Math.round((Math.max(...times) - Math.min(...times)) / 60000);
    duration = `~${mins} min`;
  }

  return {
    timestamp: getISTTimestamp(),
    files: [...files].slice(0, 8).join(', ') || 'none',
    topics: topics.join(' | ') || 'no topics captured',
    exchanges: msgs.length,
    duration,
  };
}

// ── Format the manifest entry in the exact spec format ──
function formatEntry(manifest) {
  return [
    `## ${manifest.timestamp}`,
    `- **Files:** ${manifest.files}`,
    `- **Topics:** ${manifest.topics}`,
    `- **Exchanges:** ${manifest.exchanges} | **Duration:** ${manifest.duration}`,
    `- **Status:** pending-distillation`,
    '',
  ].join('\n');
}

// ── Append entry to the sessions file, seeding header if needed ──
// Uses a .lock file (O_EXCL atomic create) to prevent concurrent writes.
function appendToSessionsFile(entry, filePath) {
  const lockFile = filePath + '.lock';

  // Acquire lock atomically — if another process holds it, skip (don't block)
  let lockFd;
  try {
    lockFd = fs.openSync(lockFile, 'wx'); // wx = write + fail if exists
  } catch {
    process.stderr.write('[session-distill] lock held by another process — skipping append\n');
    return false;
  }

  try {
    fs.closeSync(lockFd);
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, HEADER);
    }
    fs.appendFileSync(filePath, entry + '\n');
    return true;
  } catch (e) {
    process.stderr.write(`[session-distill] append failed: ${e.message}\n`);
    return false;
  } finally {
    try { fs.unlinkSync(lockFile); } catch {}
  }
}

// ── Git commit + push (non-blocking) ──
function gitCommitAndPush(aeonDir, timestamp) {
  try {
    execSync(`git -C "${aeonDir}" add memory/topics/claude-sessions.md`, { timeout: 10000, stdio: 'pipe' });
    execSync(`git -C "${aeonDir}" commit -m "session: manifest ${timestamp}"`, { timeout: 10000, stdio: 'pipe' });
    execSync(`git -C "${aeonDir}" push origin main`, { timeout: 30000, stdio: 'pipe' });
    process.stderr.write('[session-distill] manifest committed and pushed\n');
    return true;
  } catch (e) {
    const msg = e.message || '';
    if (msg.includes('nothing to commit') || msg.includes('nothing added')) {
      process.stderr.write('[session-distill] nothing to commit — already up to date\n');
    } else {
      process.stderr.write(`[session-distill] git push failed (non-fatal): ${msg}\n`);
    }
    return false;
  }
}

// ── Dispatch GH Actions session-sync (non-blocking) ──
function dispatchWorkflow() {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    process.stderr.write('[session-distill] GITHUB_PERSONAL_ACCESS_TOKEN not set — skipping dispatch\n');
    return;
  }
  try {
    execSync(
      'gh workflow run aeon.yml --repo bludragon66613-sys/NERV_02 -f skill=session-sync',
      { timeout: 15000, stdio: 'pipe', env: { ...process.env, GH_TOKEN: token } }
    );
    process.stderr.write('[session-distill] session-sync dispatched\n');
  } catch (e) {
    process.stderr.write(`[session-distill] workflow dispatch failed (non-fatal): ${e.message}\n`);
  }
}

// ── Main ──
function main() {
  const session = findLatestSession(SESSIONS_DIR);
  if (!session) {
    process.stderr.write('[session-distill] no valid session found — skipping\n');
    return;
  }

  const manifest = extractManifest(session.data);
  const entry = formatEntry(manifest);

  const appended = appendToSessionsFile(entry, SESSIONS_MD);
  if (!appended) return;
  process.stderr.write(`[session-distill] manifest appended: ${manifest.timestamp}\n`);

  // Notify Kaneda — brief session summary
  const topicPreview = manifest.topics.split(' | ').slice(0, 3).join(', ');
  notifyTelegram(
    `🧠 *Session captured* (${manifest.timestamp})\n` +
    `📁 ${manifest.files.split(', ').length} files · ${manifest.exchanges} exchanges · ${manifest.duration}\n` +
    `💬 ${topicPreview}\n` +
    `_Distillation queued via session-sync_`
  );

  // C-1 fix: dispatch is independent of push success.
  // The local manifest entry is the source of truth — session-sync reads from the repo,
  // but even a failed push is retried next session when session-distill runs again.
  // Dispatch always fires after a successful append, regardless of git outcome.
  gitCommitAndPush(AEON_DIR, manifest.timestamp);
  dispatchWorkflow();
}

// Export all functions for testing; only run main() when executed directly
if (require.main === module) {
  main();
} else {
  module.exports = { findLatestSession, extractManifest, formatEntry, appendToSessionsFile, gitCommitAndPush, dispatchWorkflow, getISTTimestamp };
}
