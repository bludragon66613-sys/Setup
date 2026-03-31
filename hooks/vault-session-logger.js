#!/usr/bin/env node
/**
 * vault-session-logger.js
 * Stop hook: copies new session .tmp files to Obsidian vault, then re-indexes qmd.
 */

const fs = require('fs');
const path = require('path');

const SESSIONS_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.claude', 'sessions');
const VAULT_DIR = path.join(process.env.USERPROFILE || process.env.HOME,
  'OneDrive', 'Documents', 'Agentic knowledge', 'Claude Sessions');

const SYNC_MARKER = path.join(SESSIONS_DIR, '.last-vault-sync');

function getLastSyncTime() {
  try {
    return fs.statSync(SYNC_MARKER).mtimeMs;
  } catch {
    return 0; // never synced
  }
}

function main() {
  if (!fs.existsSync(SESSIONS_DIR)) return;
  if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
  }

  const lastSync = getLastSyncTime();
  // Support both legacy .tmp and current .json session formats
  const files = fs.readdirSync(SESSIONS_DIR).filter(f => f.endsWith('.tmp') || f.endsWith('.json'));
  let copied = 0;

  for (const file of files) {
    const src = path.join(SESSIONS_DIR, file);
    const stat = fs.statSync(src);
    if (stat.mtimeMs <= lastSync) continue;

    let content = fs.readFileSync(src, 'utf8');

    // Convert .json sessions to readable markdown
    if (file.endsWith('.json')) {
      try {
        const data = JSON.parse(content);
        const msgs = (data.messages || data.conversation || []);
        // Skip process metadata files (pid-only files with no conversation content)
        if (msgs.length === 0) continue;
        const date = data.created_at ? new Date(data.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        const lines = [`# Session: ${file.replace('.json', '')}\n`, `**Date:** ${date}\n`, `**Messages:** ${msgs.length}\n\n---\n`];
        for (const m of msgs) {
          const role = m.role || m.type || 'unknown';
          const text = typeof m.content === 'string' ? m.content : JSON.stringify(m.content || '').slice(0, 500);
          lines.push(`\n**[${role.toUpperCase()}]**\n${text}\n`);
        }
        content = lines.join('');
      } catch {
        // If JSON parse fails, skip (likely process metadata, not a conversation)
        continue;
      }
    }

    const dest = path.join(VAULT_DIR, file.replace(/\.(tmp|json)$/, '.md'));
    fs.writeFileSync(dest, content);
    copied++;
  }

  // Update sync marker
  fs.writeFileSync(SYNC_MARKER, new Date().toISOString());

  if (copied > 0) {
    // Re-index qmd so new files are searchable
    const { execSync } = require('child_process');
    try {
      execSync('qmd update', { stdio: 'ignore', timeout: 30000 });
      execSync('qmd embed', { stdio: 'ignore', timeout: 120000 });
    } catch {
      // qmd not critical, don't fail the hook
    }
    process.stderr.write(`[vault-logger] Synced ${copied} session(s) to vault\n`);
  }
}

main();
