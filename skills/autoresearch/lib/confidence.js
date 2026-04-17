#!/usr/bin/env node
/**
 * MAD-based confidence score for autoresearch.
 * Usage: node confidence.js <path/to/autoresearch.jsonl>
 * Emits: {"confidence": <number|null>, "best_kept": <number|null>, "baseline": <number|null>, "mad": <number|null>, "n": <int>}
 *
 * Algorithm (ported from davebcn87/pi-autoresearch):
 *   1. Take all metric values in current segment (metric > 0).
 *   2. median = sortedMedian(values)
 *   3. deviations = values.map(v => abs(v - median))
 *   4. MAD = sortedMedian(deviations)
 *   5. best_kept = best metric among status=="keep" rows
 *   6. baseline = first row in segment (run=0 or earliest)
 *   7. confidence = |best_kept - baseline| / MAD
 *   8. null if n<3 or MAD==0 or baseline missing
 */

const fs = require('fs');

function sortedMedian(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function isBetter(candidate, incumbent, direction) {
  return direction === 'lower' ? candidate < incumbent : candidate > incumbent;
}

function readJsonl(path) {
  if (!fs.existsSync(path)) return [];
  return fs
    .readFileSync(path, 'utf-8')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((x) => x !== null);
}

function compute(results) {
  const latestSegment = results.reduce((m, r) => Math.max(m, r.segment ?? 0), 0);
  const cur = results.filter((r) => (r.segment ?? 0) === latestSegment && r.metric > 0);
  if (cur.length < 3) return { confidence: null, best_kept: null, baseline: null, mad: null, n: cur.length };

  const values = cur.map((r) => r.metric);
  const median = sortedMedian(values);
  const deviations = values.map((v) => Math.abs(v - median));
  const mad = sortedMedian(deviations);

  if (mad === 0) return { confidence: null, best_kept: null, baseline: null, mad: 0, n: cur.length };

  const firstWithBaseline = cur.find((r) => r.baseline != null && r.baseline > 0);
  const baseline = firstWithBaseline ? firstWithBaseline.baseline : cur[0].metric;

  const direction = cur.find((r) => r.direction)?.direction ?? 'lower';

  let bestKept = null;
  for (const r of cur) {
    if (r.status === 'keep' && r.metric > 0) {
      if (bestKept === null || isBetter(r.metric, bestKept, direction)) bestKept = r.metric;
    }
  }
  if (bestKept === null) return { confidence: null, best_kept: null, baseline, mad, n: cur.length };

  const delta = Math.abs(bestKept - baseline);
  return { confidence: delta / mad, best_kept: bestKept, baseline, mad, n: cur.length };
}

const path = process.argv[2];
if (!path) {
  console.error('Usage: confidence.js <autoresearch.jsonl>');
  process.exit(2);
}

const results = readJsonl(path);
const out = compute(results);
process.stdout.write(JSON.stringify(out) + '\n');
