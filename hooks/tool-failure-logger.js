#!/usr/bin/env node
/**
 * PostToolUseFailure hook — logs tool failures for diagnostics.
 * Writes a failure log to ~/.claude/diagnostics/tool-failures.jsonl
 * so patterns can be identified across sessions.
 */
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const input = JSON.parse(await new Promise(resolve => {
      let data = '';
      process.stdin.on('data', chunk => data += chunk);
      process.stdin.on('end', () => resolve(data));
    }));

    const logDir = path.join(process.env.HOME || process.env.USERPROFILE, '.claude', 'diagnostics');
    const logFile = path.join(logDir, 'tool-failures.jsonl');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const entry = {
      timestamp: new Date().toISOString(),
      session_id: input.session_id || 'unknown',
      tool_name: input.tool_name || 'unknown',
      tool_input: input.tool_input ? JSON.stringify(input.tool_input).slice(0, 500) : '',
      error: input.tool_error || input.error || 'unknown error',
    };

    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');

    // Rotate if file exceeds 1MB
    const stats = fs.statSync(logFile);
    if (stats.size > 1024 * 1024) {
      const archived = logFile.replace('.jsonl', `-${Date.now()}.jsonl`);
      fs.renameSync(logFile, archived);
    }
  } catch {
    // Silent failure — hooks should never block
  }
}

main();
