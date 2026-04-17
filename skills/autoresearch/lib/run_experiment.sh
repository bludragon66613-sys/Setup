#!/usr/bin/env bash
# run_experiment.sh — execute autoresearch.sh, parse METRIC lines, run checks if present.
# Writes .autoresearch-pending.json for log_experiment.sh to finalize.
# Usage: run_experiment.sh [timeout_seconds] [checks_timeout_seconds]

set -euo pipefail

TIMEOUT="${1:-600}"
CHECKS_TIMEOUT="${2:-300}"
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[ -f ".autoresearch-state.json" ] || { echo "No .autoresearch-state.json — run init_experiment.sh first" >&2; exit 1; }
[ -f "autoresearch.sh" ] || { echo "autoresearch.sh not found in cwd" >&2; exit 1; }

WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

RUNNER="bash"
command -v rtk >/dev/null 2>&1 && RUNNER="rtk bash"

START_NS=$(date +%s%N)
STATUS="ok"

if command -v timeout >/dev/null 2>&1; then
  $RUNNER -c "timeout ${TIMEOUT}s bash autoresearch.sh" >"$WORK_DIR/bench.out" 2>&1 || STATUS="crash"
else
  $RUNNER -c "bash autoresearch.sh" >"$WORK_DIR/bench.out" 2>&1 || STATUS="crash"
fi

END_NS=$(date +%s%N)
DURATION_MS=$(( (END_NS - START_NS) / 1000000 ))

CHECKS_STATUS="skipped"
if [ "$STATUS" = "ok" ] && [ -f "autoresearch.checks.sh" ]; then
  if command -v timeout >/dev/null 2>&1; then
    $RUNNER -c "timeout ${CHECKS_TIMEOUT}s bash autoresearch.checks.sh" >"$WORK_DIR/checks.out" 2>&1 && CHECKS_STATUS="pass" || CHECKS_STATUS="fail"
  else
    $RUNNER -c "bash autoresearch.checks.sh" >"$WORK_DIR/checks.out" 2>&1 && CHECKS_STATUS="pass" || CHECKS_STATUS="fail"
  fi
  [ "$CHECKS_STATUS" = "fail" ] && STATUS="checks_failed"
else
  : > "$WORK_DIR/checks.out"
fi

# Let node parse everything — no more bash string escaping
DURATION_MS="$DURATION_MS" STATUS="$STATUS" CHECKS_STATUS="$CHECKS_STATUS" WORK_DIR="$WORK_DIR" \
node "$SKILL_DIR/_parse_pending.js"

PRIMARY=$(node -e "const p = require('fs').readFileSync('.autoresearch-pending.json','utf-8'); const j = JSON.parse(p); process.stdout.write(String(j.metric ?? ''));")
METRIC_NAME=$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('.autoresearch-state.json','utf-8')).metric_name);")

if [ "$STATUS" = "ok" ]; then
  echo "✓ Run complete: ${METRIC_NAME}=${PRIMARY} (${DURATION_MS}ms)"
  [ "$CHECKS_STATUS" = "pass" ] && echo "  ✓ checks passed"
elif [ "$STATUS" = "checks_failed" ]; then
  echo "✗ Checks failed"
  tail -20 "$WORK_DIR/checks.out"
else
  echo "✗ Crashed"
  tail -20 "$WORK_DIR/bench.out"
fi
echo ""
echo "Next: bash lib/log_experiment.sh <keep|discard|crash|checks_failed> \"<description>\" ['{\"asi\":\"...\"}']"
