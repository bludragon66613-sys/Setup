#!/usr/bin/env node
// Auto-starts the claude-peers MCP server if not already running.
const { execSync, spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PEERS_DIR = path.join(process.env.USERPROFILE || process.env.HOME, '.claude', 'peers');
const PORT = 7355;

function check(cb) {
  const req = http.request({ hostname: 'localhost', port: PORT, path: '/mcp', method: 'GET' }, r => {
    cb(r.statusCode < 500);
  });
  req.on('error', () => cb(false));
  req.setTimeout(1000, () => { req.destroy(); cb(false); });
  req.end();
}

check(running => {
  if (running) {
    process.exit(0); // already up
  }
  const child = spawn('node', ['server.js'], {
    cwd: PEERS_DIR,
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });
  child.unref();
  process.exit(0);
});
