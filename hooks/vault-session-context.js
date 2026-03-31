#!/usr/bin/env node
/**
 * vault-session-context.js
 * SessionStart hook: pulls recent Claude session logs from Obsidian vault via qmd.
 * Outputs additionalContext JSON so Claude Code injects it into the session.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const VAULT_DIR = path.join(
  process.env.USERPROFILE || process.env.HOME,
  'OneDrive', 'Documents', 'Agentic knowledge', 'Claude Sessions'
);

function getRecentSessionsFromFiles() {
  // Fallback: read the 2 most recent .md session files directly
  if (!fs.existsSync(VAULT_DIR)) return null;

  const files = fs.readdirSync(VAULT_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ name: f, mtime: fs.statSync(path.join(VAULT_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, 2);

  if (files.length === 0) return null;

  const parts = files.map(({ name }) => {
    const content = fs.readFileSync(path.join(VAULT_DIR, name), 'utf8');
    // Extract just the header + key sections (first 60 lines)
    return content.split('\n').slice(0, 60).join('\n');
  });

  return parts.join('\n\n---\n\n');
}

function getRecentSessionsViaQmd() {
  try {
    const result = execSync(
      'qmd search "claude session" -c obsidian -n 3 --json',
      { timeout: 15000, encoding: 'utf8' }
    );
    const parsed = JSON.parse(result);
    if (!parsed || parsed.length === 0) return null;

    return parsed
      .map(r => `**${r.title || r.path}** (score: ${Math.round((r.score || 0) * 100)}%)\n${r.snippet || ''}`)
      .join('\n\n');
  } catch {
    return null;
  }
}

function main() {
  // Try qmd first, fall back to direct file read
  let context = getRecentSessionsViaQmd() || getRecentSessionsFromFiles();

  if (!context) {
    // No sessions yet - silent exit
    process.exit(0);
  }

  const output = {
    additionalContext: `## Recent Claude Session Logs (from Obsidian vault)\n\n${context}\n\n---\n`
  };

  process.stdout.write(JSON.stringify(output));
}

main();
