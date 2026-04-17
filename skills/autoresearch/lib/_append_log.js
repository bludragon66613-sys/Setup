#!/usr/bin/env node
/**
 * Helper called by log_experiment.sh. Reads pending result + state + jsonl,
 * appends new row, updates state (baseline, run_count), recomputes confidence.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const decision = process.env.DECISION;
const description = process.env.DESCRIPTION || '';
const commitSha = process.env.COMMIT_SHA || '';
const skillDir = process.env.SKILL_DIR;

let asi = {};
try { asi = JSON.parse(process.env.ASI_JSON || '{}'); } catch { asi = {}; }

const pending = JSON.parse(fs.readFileSync('.autoresearch-pending.json', 'utf-8'));
const state = JSON.parse(fs.readFileSync('.autoresearch-state.json', 'utf-8'));

state.run_count = (state.run_count || 0) + 1;
if (state.baseline == null && pending.metric != null && decision === 'keep') {
  state.baseline = pending.metric;
}

const baseline = state.baseline;
const deltaPct = baseline != null && pending.metric != null
  ? ((pending.metric - baseline) / baseline) * 100
  : null;

const row = {
  ts: pending.ts,
  run: state.run_count,
  segment: state.segment,
  status: decision,
  metric: pending.metric,
  metric_name: pending.metric_name,
  direction: pending.direction,
  unit: pending.unit,
  duration_ms: pending.duration_ms,
  secondary: pending.secondary || {},
  commit: commitSha,
  baseline,
  delta_pct: deltaPct,
  checks_status: pending.checks_status,
  description,
  asi,
  confidence: null,
};

// Append to JSONL
fs.appendFileSync('autoresearch.jsonl', JSON.stringify(row) + '\n');

// Recompute confidence using confidence.js
let confidence = null;
try {
  const out = execSync(`node "${path.join(skillDir, 'confidence.js')}" autoresearch.jsonl`, { encoding: 'utf-8' });
  const parsed = JSON.parse(out);
  confidence = parsed.confidence;
  state.confidence = confidence;
} catch (e) {
  // ignore — confidence stays null
}

// Rewrite last line with confidence (simple: read all, replace last, write back)
if (confidence != null) {
  const lines = fs.readFileSync('autoresearch.jsonl', 'utf-8').split('\n').filter(Boolean);
  const last = JSON.parse(lines[lines.length - 1]);
  last.confidence = confidence;
  lines[lines.length - 1] = JSON.stringify(last);
  fs.writeFileSync('autoresearch.jsonl', lines.join('\n') + '\n');
}

fs.writeFileSync('.autoresearch-state.json', JSON.stringify(state, null, 2));

// Report
const confStr = confidence != null ? ` │ conf ${confidence.toFixed(2)}×` : '';
const metricStr = pending.metric != null ? `${pending.metric_name}=${pending.metric}` : 'crash';
const deltaStr = deltaPct != null ? ` (${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(1)}%)` : '';
console.log(`[${decision}] run ${state.run_count} │ ${metricStr}${deltaStr}${confStr}`);
console.log(`  ${description}`);
if (confidence != null) {
  if (confidence >= 2.0) console.log(`  📊 ${confidence.toFixed(1)}× noise — likely real`);
  else if (confidence >= 1.0) console.log(`  📊 ${confidence.toFixed(1)}× noise — marginal, consider re-run`);
  else console.log(`  ⚠ ${confidence.toFixed(1)}× noise — within jitter, re-run to confirm`);
}
