#!/usr/bin/env node
/**
 * Helper called by run_experiment.sh. Reads benchmark/checks output files
 * from WORK_DIR env var and produces .autoresearch-pending.json.
 * All inputs come through env vars so bash never has to escape strings.
 */

const fs = require('fs');
const path = require('path');

const workDir = process.env.WORK_DIR;
const status = process.env.STATUS || 'crash';
const checksStatus = process.env.CHECKS_STATUS || 'skipped';
const durationMs = parseInt(process.env.DURATION_MS || '0', 10);

if (!workDir) {
  console.error('WORK_DIR env var required');
  process.exit(2);
}

const benchOut = fs.existsSync(path.join(workDir, 'bench.out'))
  ? fs.readFileSync(path.join(workDir, 'bench.out'), 'utf-8')
  : '';
const checksOut = fs.existsSync(path.join(workDir, 'checks.out'))
  ? fs.readFileSync(path.join(workDir, 'checks.out'), 'utf-8')
  : '';

const state = JSON.parse(fs.readFileSync('.autoresearch-state.json', 'utf-8'));

// Parse METRIC lines: "METRIC name=value" — primary match is last occurrence
let primary = null;
const secondary = {};
for (const line of benchOut.split(/\r?\n/)) {
  const m = line.match(/^METRIC ([A-Za-z_][\w]*)=([-\d.eE+]+)$/);
  if (!m) continue;
  const name = m[1];
  const value = parseFloat(m[2]);
  if (Number.isNaN(value)) continue;
  if (name === state.metric_name) primary = value;
  else secondary[name] = value;
}

let finalStatus = status;
if (status === 'ok' && primary === null) finalStatus = 'crash';

const tailLines = (s, n) => s.split(/\r?\n/).slice(-n).join('\n');

const pending = {
  ts: new Date().toISOString(),
  status: finalStatus,
  metric: primary,
  metric_name: state.metric_name,
  direction: state.direction,
  unit: state.unit,
  segment: state.segment,
  duration_ms: durationMs,
  secondary,
  checks_status: checksStatus,
  checks_output: checksOut ? tailLines(checksOut, 80) : '',
  output_tail: benchOut ? tailLines(benchOut, 80) : '',
};

fs.writeFileSync('.autoresearch-pending.json', JSON.stringify(pending, null, 2));
