#!/usr/bin/env node
/**
 * memory-obsidian-sync.js
 * Runs on SessionStart + Stop: syncs Claude memory, Aeon logs, and CLAUDE.md
 * to Obsidian vault. Rebuilds MindMap.md with wikilinks on every run.
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.USERPROFILE || process.env.HOME;
const MEMORY_DIR = path.join(HOME, '.claude', 'projects', 'C--Users-Rohan', 'memory');
const VAULT_BASE = path.join(HOME, 'OneDrive', 'Documents', 'Agentic knowledge');
const MEMORY_VAULT = path.join(VAULT_BASE, 'Memory');
const AEON_LOGS_DIR = path.join(HOME, 'aeon', 'memory', 'logs');
const AEON_LOGS_VAULT = path.join(VAULT_BASE, 'Aeon Logs');
const CLAUDE_MD = path.join(HOME, 'CLAUDE.md');
const MINDMAP_FILE = path.join(VAULT_BASE, 'MindMap.md');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: match[2].trim() };
}

function syncMemoryFiles() {
  if (!fs.existsSync(MEMORY_DIR)) return [];
  fs.mkdirSync(MEMORY_VAULT, { recursive: true });

  const files = fs.readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md'));
  const synced = [];

  for (const file of files) {
    const src = path.join(MEMORY_DIR, file);
    const dest = path.join(MEMORY_VAULT, file);
    fs.copyFileSync(src, dest);
    synced.push(file);
  }

  return synced;
}

function buildMindMap(files) {
  const allFiles = files.map(f => {
    const raw = fs.readFileSync(path.join(MEMORY_DIR, f), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    return { file: f, name: meta.name || f.replace('.md', ''), type: meta.type || 'unknown', description: meta.description || '', body };
  });

  const byType = {};
  for (const f of allFiles) {
    if (!byType[f.type]) byType[f.type] = [];
    byType[f.type].push(f);
  }

  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const lines = [
    `# 🧠 Claude Memory Mind Map`,
    ``,
    `> Auto-generated on session start. Last updated: **${now} IST**`,
    ``,
    `---`,
    ``,
    `## 🗺️ Map`,
    ``,
    `\`\`\``,
    `CLAUDE MEMORY`,
  ];

  const typeIcons = { user: '👤', project: '📁', feedback: '💬', reference: '🔗', savepoint: '📍', index: '◈' };

  for (const [type, items] of Object.entries(byType)) {
    const icon = typeIcons[type] || '○';
    lines.push(`├── ${icon} ${type.toUpperCase()}`);
    for (const item of items) {
      const desc = item.description ? ` — ${item.description.slice(0, 60)}` : '';
      lines.push(`│   ├── [[Memory/${item.file.replace('.md', '')}|${item.name}]]${desc}`);
    }
  }
  lines.push(`\`\`\``);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Sections per type
  const typeOrder = ['index', 'user', 'project', 'feedback', 'reference', 'savepoint'];
  const typeHeaders = { index: '◈ Index', user: '👤 User Profile', project: '📁 Projects', feedback: '💬 Feedback', reference: '🔗 References', savepoint: '📍 Session Savepoints' };

  for (const type of [...typeOrder, ...Object.keys(byType).filter(t => !typeOrder.includes(t))]) {
    const items = byType[type];
    if (!items) continue;
    lines.push(`## ${typeHeaders[type] || type}`);
    lines.push(``);
    for (const item of items) {
      lines.push(`### [[Memory/${item.file.replace('.md', '')}|${item.name}]]`);
      if (item.description) lines.push(`> ${item.description}`);
      // First 5 non-empty lines of body as preview
      const preview = item.body.split('\n').filter(l => l.trim()).slice(0, 5).join('\n');
      if (preview) lines.push(`\n${preview}`);
      lines.push(``);
    }
  }

  // Session timeline (savepoints sorted by name desc)
  const savepoints = (byType['savepoint'] || []).sort((a, b) => b.file.localeCompare(a.file));
  if (savepoints.length > 0) {
    lines.push(`---`);
    lines.push(`## 📅 Session Timeline`);
    lines.push(``);
    for (const s of savepoints) {
      const date = s.file.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || '';
      lines.push(`- **${date}** — [[Memory/${s.file.replace('.md', '')}|${s.name}]]: ${s.description.slice(0, 80)}`);
    }
    lines.push(``);
  }

  return lines.join('\n');
}

function syncAeonLogs() {
  if (!fs.existsSync(AEON_LOGS_DIR)) return 0;
  fs.mkdirSync(AEON_LOGS_VAULT, { recursive: true });

  const files = fs.readdirSync(AEON_LOGS_DIR).filter(f => f.endsWith('.md'));
  let count = 0;
  for (const file of files) {
    const src = path.join(AEON_LOGS_DIR, file);
    const dest = path.join(AEON_LOGS_VAULT, file);
    // Only copy if source is newer
    const srcStat = fs.statSync(src);
    const destExists = fs.existsSync(dest);
    if (!destExists || srcStat.mtimeMs > fs.statSync(dest).mtimeMs) {
      fs.copyFileSync(src, dest);
      count++;
    }
  }
  return count;
}

function syncClaudeMd() {
  if (!fs.existsSync(CLAUDE_MD)) return false;
  const dest = path.join(VAULT_BASE, 'CLAUDE.md');
  fs.copyFileSync(CLAUDE_MD, dest);
  return true;
}

function writeDailyNote() {
  const today = new Date().toISOString().slice(0, 10);
  const dailyFile = path.join(VAULT_BASE, `${today}.md`);

  // Collect what's active
  const lines = [
    `# ${today} — Daily Sync`,
    ``,
    `> Auto-generated by memory-obsidian-sync.js`,
    ``,
    `## Active Services`,
    `- OpenClaw: \`bash ~/openclaw-healthcheck.sh\``,
    `- Paperclip: http://localhost:3100`,
    `- Dashboard: http://localhost:5555`,
    ``,
    `## Memory Files`,
  ];

  if (fs.existsSync(MEMORY_DIR)) {
    const files = fs.readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md') && !f.startsWith('session_savepoint'));
    for (const f of files) {
      lines.push(`- [[Memory/${f.replace('.md', '')}]]`);
    }
  }

  lines.push(``);
  lines.push(`## Aeon Logs`);
  if (fs.existsSync(AEON_LOGS_DIR)) {
    const todayLog = path.join(AEON_LOGS_DIR, `${today}.md`);
    if (fs.existsSync(todayLog)) {
      lines.push(`- [[Aeon Logs/${today}]]`);
    } else {
      lines.push(`- No Aeon activity today`);
    }
  }

  fs.writeFileSync(dailyFile, lines.join('\n'));
  return true;
}

function main() {
  try {
    const synced = syncMemoryFiles();
    const aeonCount = syncAeonLogs();
    const claudeSynced = syncClaudeMd();
    writeDailyNote();

    if (synced.length > 0) {
      const mindmap = buildMindMap(synced);
      fs.writeFileSync(MINDMAP_FILE, mindmap);
    }

    const parts = [`${synced.length} memory`];
    if (aeonCount > 0) parts.push(`${aeonCount} aeon logs`);
    if (claudeSynced) parts.push('CLAUDE.md');
    process.stderr.write(`[memory-sync] Synced ${parts.join(' + ')} → Obsidian. MindMap.md updated.\n`);
  } catch (err) {
    process.stderr.write(`[memory-sync] Error: ${err.message}\n`);
  }
}

main();
