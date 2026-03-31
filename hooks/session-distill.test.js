#!/usr/bin/env node
/**
 * session-distill.test.js
 * Run: node ~/.claude/hooks/session-distill.test.js
 */
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Require from __dirname so path resolution is CWD-independent
let lib;
try {
  lib = require(require('path').join(__dirname, 'session-distill.js'));
} catch (e) {
  console.error('session-distill.js not found — implement it first');
  process.exit(1);
}
const { findLatestSession, extractManifest, formatEntry, appendToSessionsFile, getISTTimestamp } = lib;

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ✗ ${name}: ${e.message}`);
    failed++;
  }
}

// ── TEST: getISTTimestamp ──
console.log('\ngetISTTimestamp');

test('returns string in YYYY-MM-DDTHH:MM IST format', () => {
  const ts = getISTTimestamp();
  assert.match(ts, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2} IST$/, `unexpected format: ${ts}`);
});

// ── TEST: findLatestSession ──
console.log('\nfindLatestSession');

test('returns null when directory does not exist', () => {
  const result = findLatestSession('/nonexistent/path/xyz');
  assert.strictEqual(result, null);
});

test('returns null when all JSON files have empty messages', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sd-test-'));
  fs.writeFileSync(path.join(dir, 'stub.json'), JSON.stringify({ pid: 123 }));
  const result = findLatestSession(dir);
  assert.strictEqual(result, null);
  fs.rmSync(dir, { recursive: true });
});

test('returns the session with non-empty messages array', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sd-test-'));
  const session = { messages: [{ role: 'user', content: 'hello' }] };
  const stub = { pid: 999 };
  fs.writeFileSync(path.join(dir, 'stub.json'), JSON.stringify(stub));
  fs.writeFileSync(path.join(dir, 'session.json'), JSON.stringify(session));
  const result = findLatestSession(dir);
  assert.ok(result !== null, 'should find a session');
  assert.deepStrictEqual(result.data, session);
  fs.rmSync(dir, { recursive: true });
});

test('prefers conversation field if messages is absent', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sd-test-'));
  const session = { conversation: [{ role: 'human', content: 'hi' }] };
  fs.writeFileSync(path.join(dir, 'conv.json'), JSON.stringify(session));
  const result = findLatestSession(dir);
  assert.ok(result !== null);
  fs.rmSync(dir, { recursive: true });
});

test('scans .tmp files as well as .json files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sd-test-'));
  const session = { messages: [{ role: 'human', content: 'tmp session' }] };
  // Only a .tmp file — no .json
  fs.writeFileSync(path.join(dir, 'active.tmp'), JSON.stringify(session));
  const result = findLatestSession(dir);
  assert.ok(result !== null, 'should find .tmp session');
  assert.deepStrictEqual(result.data, session);
  fs.rmSync(dir, { recursive: true });
});

// ── TEST: extractManifest ──
console.log('\nextractManifest');

test('extracts relative file paths (not basenames) from tool_use messages', () => {
  const home = os.homedir().replace(/\\/g, '/');
  const data = {
    messages: [
      {
        role: 'assistant',
        content: [
          {
            type: 'tool_use',
            name: 'Write',
            input: { file_path: `${home}/aeon/memory/MEMORY.md` },
          },
        ],
      },
      { role: 'human', content: 'do something' },
    ],
  };
  const m = extractManifest(data);
  // Should contain the path relative to home, not just the basename
  assert.ok(m.files.includes('aeon/memory/MEMORY.md'), `expected relative path in files, got: ${m.files}`);
  assert.ok(!m.files.startsWith('MEMORY.md'), `should not be basename-only, got: ${m.files}`);
});

test('extracts user message snippets (max 80 chars each)', () => {
  const longMsg = 'a'.repeat(200);
  const data = {
    messages: [
      { role: 'human', content: longMsg },
      { role: 'assistant', content: 'ok' },
    ],
  };
  const m = extractManifest(data);
  const snippets = m.topics.split(' | ');
  assert.ok(snippets[0].length <= 80, `snippet too long: ${snippets[0].length}`);
});

test('exchange count equals total message count', () => {
  const data = {
    messages: [
      { role: 'human', content: 'hi' },
      { role: 'assistant', content: 'hello' },
      { role: 'human', content: 'bye' },
    ],
  };
  const m = extractManifest(data);
  assert.strictEqual(m.exchanges, 3);
});

test('returns "unknown" duration when no timestamps', () => {
  const data = { messages: [{ role: 'human', content: 'x' }] };
  const m = extractManifest(data);
  assert.strictEqual(m.duration, 'unknown');
});

test('calculates duration from created_at timestamps', () => {
  const t0 = new Date('2026-03-25T04:00:00Z').toISOString();
  const t1 = new Date('2026-03-25T04:23:00Z').toISOString();
  const data = {
    messages: [
      { role: 'human', content: 'start', created_at: t0 },
      { role: 'assistant', content: 'end', created_at: t1 },
    ],
  };
  const m = extractManifest(data);
  assert.strictEqual(m.duration, '~23 min');
});

test('filters out plugin and node_modules paths', () => {
  const data = {
    messages: [
      {
        role: 'assistant',
        content: [
          { type: 'tool_use', name: 'Read', input: { file_path: '/some/.claude/plugins/foo/bar.js' } },
          { type: 'tool_use', name: 'Read', input: { file_path: '/some/node_modules/pkg/index.js' } },
          { type: 'tool_use', name: 'Read', input: { file_path: '/some/aeon/skills/foo/SKILL.md' } },
        ],
      },
    ],
  };
  const m = extractManifest(data);
  assert.ok(!m.files.includes('bar.js'), 'plugin file should be filtered');
  assert.ok(!m.files.includes('index.js'), 'node_modules file should be filtered');
  assert.ok(m.files.includes('SKILL.md'), 'real file should be present');
});

// ── TEST: formatEntry ──
console.log('\nformatEntry');

test('entry contains all required fields', () => {
  const manifest = {
    timestamp: '2026-03-25T04:21 IST',
    files: 'aeon/memory/MEMORY.md, aeon/app/page.tsx',
    topics: 'fix the hook | test it',
    exchanges: 12,
    duration: '~10 min',
  };
  const entry = formatEntry(manifest);
  assert.ok(entry.includes('## 2026-03-25T04:21 IST'), 'missing timestamp header');
  assert.ok(entry.includes('- **Files:** aeon/memory/MEMORY.md'), 'missing files');
  assert.ok(entry.includes('- **Topics:** fix the hook'), 'missing topics');
  assert.ok(entry.includes('- **Exchanges:** 12'), 'missing exchanges');
  assert.ok(entry.includes('- **Status:** pending-distillation'), 'missing status line');
});

test('status line is exact string for parsing', () => {
  const manifest = { timestamp: 'T', files: 'f', topics: 't', exchanges: 1, duration: 'd' };
  const entry = formatEntry(manifest);
  assert.ok(
    entry.includes('- **Status:** pending-distillation'),
    'status line must be exactly: - **Status:** pending-distillation'
  );
});

// ── TEST: appendToSessionsFile ──
console.log('\nappendToSessionsFile');

test('creates file with header when it does not exist', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sd-test-'));
  const filePath = path.join(dir, 'sessions.md');
  appendToSessionsFile('## entry\n', filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(content.includes('# Claude Code Session Manifests'), 'missing header');
  assert.ok(content.includes('This file is auto-maintained'), 'missing spec header text');
  assert.ok(content.includes('## entry'), 'missing entry');
  fs.rmSync(dir, { recursive: true });
});

test('appends to existing file without rewriting header', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sd-test-'));
  const filePath = path.join(dir, 'sessions.md');
  fs.writeFileSync(filePath, '# existing header\n\n---\n\n');
  appendToSessionsFile('## new entry\n', filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  assert.strictEqual(content.indexOf('# existing header'), 0, 'header should be preserved');
  assert.ok(content.includes('## new entry'), 'new entry should be appended');
  assert.strictEqual(
    content.split('# existing header').length - 1, 1,
    'header should appear exactly once'
  );
  fs.rmSync(dir, { recursive: true });
});

test('returns false and skips when lock file already exists', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sd-test-'));
  const filePath = path.join(dir, 'sessions.md');
  const lockFile = filePath + '.lock';
  // Simulate another process holding the lock
  fs.writeFileSync(lockFile, '');
  const result = appendToSessionsFile('## blocked entry\n', filePath);
  assert.strictEqual(result, false, 'should return false when locked');
  assert.ok(!fs.existsSync(filePath), 'file should not be created when locked');
  fs.rmSync(dir, { recursive: true });
});

// ── Summary ──
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
