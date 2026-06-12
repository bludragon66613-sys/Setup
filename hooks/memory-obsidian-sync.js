#!/usr/bin/env node
/**
 * memory-obsidian-sync.js
 * Runs on SessionStart + Stop: syncs Claude memory, Aeon logs, and CLAUDE.md
 * to Obsidian vault. Rebuilds MindMap.md with wikilinks on every run.
 */

const fs = require('fs');
const path = require('path');
const { claudeMemoryDir, homeDir, vaultBase } = require('./lib/paths');

const HOME = homeDir();
const MEMORY_DIR = claudeMemoryDir();
const VAULT_BASE = vaultBase();
const MEMORY_VAULT = path.join(VAULT_BASE, 'Memory');
const MEMORY_PROJECTS = path.join(MEMORY_VAULT, 'projects');
// All per-directory memory silos live under ~/.claude/projects/<key>/memory.
// Claude Code keys memory by launch directory, so learnings scatter across many
// silos; the hook used to read only one. Scan them all → nothing stays siloed.
const PROJECTS_ROOT = path.join(HOME, '.claude', 'projects');
// High-value learnings get promoted into the knowledge graph (qmd-indexed, linked).
const LEARNINGS_VAULT = path.join(VAULT_BASE, 'wiki', 'learnings');
// Agents are NOT synced to vault — canonical source is ~/.claude/agents/
// and backed up to Setup/agents/ on GitHub. No duplication.
const AEON_LOGS_DIR = path.join(HOME, 'aeon', 'memory', 'logs');
const AEON_LOGS_VAULT = path.join(VAULT_BASE, 'Aeon Logs');
const CLAUDE_MD = path.join(HOME, 'CLAUDE.md');
const DAILY_DIR = path.join(VAULT_BASE, 'daily');
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

// Every ~/.claude/projects/<key>/memory dir that exists, plus the canonical one.
function allMemoryDirs() {
  const dirs = new Set();
  if (fs.existsSync(PROJECTS_ROOT)) {
    for (const entry of fs.readdirSync(PROJECTS_ROOT, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const md = path.join(PROJECTS_ROOT, entry.name, 'memory');
      if (fs.existsSync(md)) dirs.add(md);
    }
  }
  if (fs.existsSync(MEMORY_DIR)) dirs.add(MEMORY_DIR);
  return [...dirs];
}

// A learning is high-value if its type is durable knowledge, or it is explicitly
// flagged. Deterministic — no model call, predictable every run.
function isHighValue(meta) {
  const type = String(meta.type || '').toLowerCase();
  if (['feedback', 'decision', 'reference'].includes(type)) return true;
  const value = String(meta.value || '').toLowerCase();
  if (value === 'high' || value === 'critical') return true;
  const priority = String(meta.priority || '').toLowerCase();
  if (priority && !['no', 'false', 'low', ''].includes(priority)) return true;
  return false;
}

function syncMemoryFiles() {
  fs.mkdirSync(MEMORY_VAULT, { recursive: true });
  fs.mkdirSync(MEMORY_PROJECTS, { recursive: true });

  // Merge all silos, deduped by filename (= the `name` slug by convention).
  // On collision the newest source wins. MEMORY.md is a per-silo index, not a learning.
  const byFile = new Map();
  for (const dir of allMemoryDirs()) {
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
      if (file === 'MEMORY.md') continue;
      const src = path.join(dir, file);
      let mtime;
      try { mtime = fs.statSync(src).mtimeMs; } catch { continue; }
      const prev = byFile.get(file);
      if (!prev || mtime > prev.mtime) byFile.set(file, { src, mtime });
    }
  }

  const synced = [];
  for (const [file, { src }] of byFile) {
    fs.copyFileSync(src, path.join(MEMORY_VAULT, file));
    synced.push(file);
    if (file.startsWith('project_')) {
      fs.copyFileSync(src, path.join(MEMORY_PROJECTS, file));
    }
  }

  return synced;
}


function buildMindMap(files) {
  const allFiles = files.map(f => {
    const raw = fs.readFileSync(path.join(MEMORY_VAULT, f), 'utf8');
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

const KANEDA_WORKSPACE = path.join(HOME, '.openclaw', 'workspace');
const KANEDA_VAULT = path.join(MEMORY_VAULT, 'agents');
const KANEDA_EXCLUDE_TOP = new Set(['.git', '.openclaw', 'tmp', 'node_modules']);
const KANEDA_INCLUDE_FILES = [
  'MEMORY.md',
  'INDEX.md',
  'PROGRAM.md',
  'ROADMAP.md',
  'HEARTBEAT.md',
  'AGENTS.md',
  'CLAUDE.md',
  'VAULT.md',
  'SOUL.md',
  'IDENTITY.md',
  'USER.md',
  'TOOLS.md',
];
const KANEDA_INCLUDE_DIRS = [
  'feedback',
  'projects',
  'clawchief',
  'knowledge-base',
  'evals',
  'scripts',
  'hooks',
  'memory',
  'inbox',
  'notes',
  'ideas',
  'briefs',
  'wiki',
];
const KANEDA_TEXT_EXTS = new Set(['.md', '.txt', '.json', '.jsonl', '.js', '.ts', '.mjs', '.yaml', '.yml', '.csv']);

function shouldSkipKanedaPath(srcPath) {
  const lower = srcPath.toLowerCase();
  if (lower.includes('shueb.io')) return true;
  const base = path.basename(srcPath).toLowerCase();
  if (base.startsWith('.env') || base.includes('credentials')) return true;
  return false;
}

function shouldSkipKanedaFile(srcPath) {
  if (shouldSkipKanedaPath(srcPath)) return true;
  const ext = path.extname(srcPath).toLowerCase();
  if (!KANEDA_TEXT_EXTS.has(ext)) return false;
  try {
    const stat = fs.statSync(srcPath);
    if (stat.size > 2 * 1024 * 1024) return false;
    return fs.readFileSync(srcPath, 'utf8').toLowerCase().includes('shueb.io');
  } catch {
    return true;
  }
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src) || shouldSkipKanedaPath(src)) return 0;
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (KANEDA_EXCLUDE_TOP.has(entry.name) || shouldSkipKanedaPath(srcPath)) continue;
      count += copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      if (shouldSkipKanedaFile(srcPath)) continue;
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

function syncKanedaWorkspace() {
  if (!fs.existsSync(KANEDA_WORKSPACE)) return 0;
  fs.mkdirSync(KANEDA_VAULT, { recursive: true });

  let count = 0;

  for (const f of KANEDA_INCLUDE_FILES) {
    const src = path.join(KANEDA_WORKSPACE, f);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, path.join(KANEDA_VAULT, f));
    count++;
  }

  for (const d of KANEDA_INCLUDE_DIRS) {
    const src = path.join(KANEDA_WORKSPACE, d);
    if (!fs.existsSync(src)) continue;
    count += copyDirRecursive(src, path.join(KANEDA_VAULT, d));
  }

  // Compatibility alias: previous loop tracked workspace MEMORY.md as SPIKE_MEMORY.md.
  // Mirror Kaneda's curated MEMORY.md to KANEDA_MEMORY.md alongside Spike's legacy file.
  const kanedaMem = path.join(KANEDA_WORKSPACE, 'MEMORY.md');
  if (fs.existsSync(kanedaMem)) {
    fs.copyFileSync(kanedaMem, path.join(MEMORY_VAULT, 'KANEDA_MEMORY.md'));
    count++;
  }

  return count;
}

function writeDailyNote() {
  const today = new Date().toISOString().slice(0, 10);
  fs.mkdirSync(DAILY_DIR, { recursive: true });
  const dailyFile = path.join(DAILY_DIR, `${today}.md`);

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

  if (fs.existsSync(MEMORY_VAULT)) {
    const files = fs.readdirSync(MEMORY_VAULT).filter(f => f.endsWith('.md') && !f.startsWith('session_savepoint'));
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

// Promote high-value learnings from the merged Memory set into the knowledge
// graph at wiki/learnings/, with a backlink to the Memory source. Idempotent:
// rewrites the curated copies + index every run so they stay fresh.
function promoteHighValue(syncedFiles) {
  fs.mkdirSync(LEARNINGS_VAULT, { recursive: true });
  const promoted = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const file of syncedFiles) {
    if (file.startsWith('session_savepoint')) continue;
    let raw;
    try { raw = fs.readFileSync(path.join(MEMORY_VAULT, file), 'utf8'); } catch { continue; }
    const { meta, body } = parseFrontmatter(raw);
    if (!isHighValue(meta)) continue;

    const slug = file.replace('.md', '');
    const name = meta.name || slug;
    const type = meta.type || 'learning';
    const desc = meta.description || '';
    const out = [
      '---',
      `name: ${name}`,
      `type: ${type}`,
      desc ? `description: ${desc}` : null,
      `source: "[[Memory/${slug}]]"`,
      `promoted: ${today}`,
      '---',
      '',
      body,
      '',
      '---',
      `> High-value ${type} promoted from [[Memory/${slug}]] · [[MindMap]]`,
    ].filter(l => l !== null).join('\n');

    fs.writeFileSync(path.join(LEARNINGS_VAULT, file), out);
    promoted.push({ file, name, type, desc });
  }

  writeLearningsIndex(promoted);
  return promoted;
}

function writeLearningsIndex(promoted) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const byType = {};
  for (const p of promoted) (byType[p.type] ||= []).push(p);

  const lines = [
    '# 🎓 High-Value Learnings',
    '',
    `> Auto-promoted from Claude memory by memory-obsidian-sync.js. Last updated: **${now} IST**`,
    `> ${promoted.length} learnings across ${Object.keys(byType).length} types.`,
    '',
    '---',
    '',
  ];
  for (const [type, items] of Object.entries(byType).sort()) {
    lines.push(`## ${type} (${items.length})`);
    lines.push('');
    for (const p of items.sort((a, b) => a.name.localeCompare(b.name))) {
      const d = p.desc ? ` — ${p.desc.slice(0, 80)}` : '';
      lines.push(`- [[wiki/learnings/${p.file.replace('.md', '')}|${p.name}]]${d}`);
    }
    lines.push('');
  }
  fs.writeFileSync(path.join(LEARNINGS_VAULT, 'INDEX.md'), lines.join('\n'));
}

function syncToGoogleDrive() {
  const { execSync } = require('child_process');
  try {
    // Check if rclone is available and gdrive remote exists
    try {
      execSync('command -v rclone', { timeout: 5000, stdio: 'ignore' });
    } catch {
      return 'no rclone';
    }
    const remotes = execSync('rclone listremotes', { timeout: 5000 }).toString();
    if (!remotes.includes('gdrive:')) return 'no remote';

    // Background sync — don't block the hook
    const { spawn } = require('child_process');
    const child = spawn('rclone', [
      'copy', VAULT_BASE, 'gdrive:Agentic knowledge',
      '--exclude', '.git/**',
      '--exclude', '.obsidian/workspace.json',
    ], { detached: true, stdio: 'ignore' });
    child.unref();
    return 'started';
  } catch {
    return 'skipped';
  }
}

function main() {
  try {
    const synced = syncMemoryFiles();
    const promoted = promoteHighValue(synced);
    const aeonCount = syncAeonLogs();
    const claudeSynced = syncClaudeMd();
    const kanedaCount = syncKanedaWorkspace();
    writeDailyNote();

    if (synced.length > 0) {
      const mindmap = buildMindMap(synced);
      fs.writeFileSync(MINDMAP_FILE, mindmap);
    }

    // Mirror to Google Drive as backup
    const gdriveStatus = syncToGoogleDrive();

    const parts = [`${synced.length} memory`];
    if (promoted.length > 0) parts.push(`${promoted.length} high-value→wiki/learnings`);
    if (aeonCount > 0) parts.push(`${aeonCount} aeon logs`);
    if (claudeSynced) parts.push('CLAUDE.md');
    if (kanedaCount > 0) parts.push(`${kanedaCount} kaneda files`);
    const gdrivePart = gdriveStatus === 'started' ? ' + gdrive backup' : '';
    process.stderr.write(`[memory-sync] Synced ${parts.join(' + ')} → Obsidian. MindMap.md updated.${gdrivePart}\n`);
  } catch (err) {
    process.stderr.write(`[memory-sync] Error: ${err.message}\n`);
  }
}

main();
