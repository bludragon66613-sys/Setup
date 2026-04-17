#!/usr/bin/env bash
set -euo pipefail

# Fast pre-check — abort in <1s on syntax errors before expensive benchmark.
# Example: node --check src/*.js || exit 1

# Run the benchmark. Output METRIC lines for every measurement.
# For noisy fast (<5s) benchmarks, loop and emit median to stabilize confidence.

START_NS=$(date +%s%N)

# === your workload here ===
# example:
# pnpm test --run --reporter=dot >/dev/null 2>&1

END_NS=$(date +%s%N)
ELAPSED_MS=$(( (END_NS - START_NS) / 1000000 ))

# Primary metric (must match init_experiment's metric_name)
echo "METRIC total_time=$ELAPSED_MS"

# Secondary metrics (optional)
# echo "METRIC memory_mb=$(ps -o rss= -p $$ | awk '{print $1/1024}')"
