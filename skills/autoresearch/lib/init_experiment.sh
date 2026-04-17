#!/usr/bin/env bash
# init_experiment.sh — one-time session config.
# Usage: init_experiment.sh <session_name> <metric_name> <unit> <direction:lower|higher>
# Writes .autoresearch-state.json in project root (or workingDir from config).

set -euo pipefail

if [ $# -lt 4 ]; then
  echo "Usage: $0 <session_name> <metric_name> <unit> <direction:lower|higher>" >&2
  exit 2
fi

SESSION_NAME="$1"
METRIC_NAME="$2"
UNIT="$3"
DIRECTION="$4"

if [ "$DIRECTION" != "lower" ] && [ "$DIRECTION" != "higher" ]; then
  echo "direction must be 'lower' or 'higher'" >&2
  exit 2
fi

# Resolve workingDir from autoresearch.config.json if present
WORKING_DIR="."
if [ -f "autoresearch.config.json" ]; then
  WD=$(node -e "try { const c = JSON.parse(require('fs').readFileSync('autoresearch.config.json','utf-8')); if (c.workingDir) process.stdout.write(c.workingDir); } catch(e) {}")
  [ -n "$WD" ] && WORKING_DIR="$WD"
fi

cd "$WORKING_DIR"

# Bump segment if state already exists
SEGMENT=0
if [ -f ".autoresearch-state.json" ]; then
  SEGMENT=$(node -e "const s = JSON.parse(require('fs').readFileSync('.autoresearch-state.json','utf-8')); process.stdout.write(String((s.segment||0)+1));")
fi

TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "")
BRANCH=$(git branch --show-current 2>/dev/null || echo "")

node -e "
const fs = require('fs');
const state = {
  session_name: '$SESSION_NAME',
  metric_name: '$METRIC_NAME',
  unit: '$UNIT',
  direction: '$DIRECTION',
  segment: $SEGMENT,
  started_at: '$TS',
  branch: '$BRANCH',
  start_commit: '$COMMIT',
  baseline: null,
  run_count: 0
};
fs.writeFileSync('.autoresearch-state.json', JSON.stringify(state, null, 2));
"

echo "Initialized session '$SESSION_NAME'"
echo "  Metric:    $METRIC_NAME ($UNIT, $DIRECTION is better)"
echo "  Segment:   $SEGMENT"
echo "  Branch:    $BRANCH"
echo "  Commit:    ${COMMIT:0:12}"
echo ""
echo "Next: run 'bash lib/run_experiment.sh' then 'bash lib/log_experiment.sh keep \"baseline\"'"
