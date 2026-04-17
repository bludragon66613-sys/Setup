#!/usr/bin/env bash
set -euo pipefail
# Correctness gate — runs after every passing benchmark.
# Keep output minimal: only last 80 lines are fed back to the agent.
# Example:
# pnpm test --run --reporter=dot 2>&1 | tail -50
# pnpm typecheck 2>&1 | grep -i error || true
