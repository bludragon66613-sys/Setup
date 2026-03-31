#!/usr/bin/env node
/**
 * Memory Consolidation Hook (inspired by CC's autoDream)
 *
 * Runs on SessionStart to check if memory consolidation is needed.
 * Outputs a reminder to the model if memories haven't been consolidated recently.
 *
 * Gate logic (cheapest first):
 * 1. Time: hours since last consolidation >= 48h
 * 2. Memory size: MEMORY.md > 150 lines (approaching 200-line cap)
 *
 * If either gate passes, injects a system message suggesting consolidation.
 */
const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE,
  '.claude', 'projects', 'C--Users-Rohan', 'memory'
);
const MEMORY_INDEX = path.join(MEMORY_DIR, 'MEMORY.md');
const LOCK_FILE = path.join(MEMORY_DIR, '.last-consolidation');
const MIN_HOURS = 48;
const LINE_WARNING_THRESHOLD = 150;

function main() {
  try {
    // Time gate
    let hoursSince = Infinity;
    try {
      const stat = fs.statSync(LOCK_FILE);
      hoursSince = (Date.now() - stat.mtimeMs) / 3_600_000;
    } catch {
      // No lock file = never consolidated
    }

    // Memory size gate
    let lineCount = 0;
    try {
      const content = fs.readFileSync(MEMORY_INDEX, 'utf-8');
      lineCount = content.split('\n').length;
    } catch {
      // No MEMORY.md
      return;
    }

    const needsTimeConsolidation = hoursSince >= MIN_HOURS;
    const needsSizeConsolidation = lineCount >= LINE_WARNING_THRESHOLD;

    if (!needsTimeConsolidation && !needsSizeConsolidation) {
      return;
    }

    // Build advisory message
    const reasons = [];
    if (needsTimeConsolidation) {
      reasons.push(`${Math.round(hoursSince)}h since last memory consolidation`);
    }
    if (needsSizeConsolidation) {
      reasons.push(`MEMORY.md is ${lineCount} lines (cap: 200)`);
    }

    // Touch lock file to prevent re-triggering until next threshold
    try {
      fs.writeFileSync(LOCK_FILE, new Date().toISOString());
    } catch { /* ignore */ }

    // Output as additionalContext for the model
    const output = JSON.stringify({
      additionalContext: `[Memory Consolidation Advisory] ${reasons.join('; ')}. Consider reviewing memory files for: stale entries to remove, verbose index lines to shorten, duplicate memories to merge, relative dates to convert to absolute. Run \`ls ${MEMORY_DIR}\` to see current state.`
    });

    process.stdout.write(output);
  } catch {
    // Silent failure
  }
}

main();
