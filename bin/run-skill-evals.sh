#!/usr/bin/env bash
# Trigger evals for custom skills: baseline (old) description vs current.
#   run-skill-evals.sh [skill ...]   (default: every evals/skills/*.json)
# Needs python3.11+ and a logged-in `claude` CLI.
set -euo pipefail

SETUP="$HOME/Documents/Setup"
EVALS="$SETUP/evals/skills"
RESULTS="$EVALS/results/$(date +%Y-%m-%d_%H%M)"
SC="$HOME/.claude/plugins/cache/claude-plugins-official/skill-creator/unknown/skills/skill-creator"
PY="${PYTHON:-python3.11}"

# run_eval.py discards claude's stderr, so an auth failure would score as "no trigger".
if ! echo 'reply ok' | claude -p --model haiku >/dev/null 2>&1; then
  echo "claude CLI not authenticated. Run: claude /login" >&2
  exit 1
fi

skills=("$@")
if [ ${#skills[@]} -eq 0 ]; then
  for f in "$EVALS"/*.json; do skills+=("$(basename "$f" .json)"); done
fi

mkdir -p "$RESULTS"
cd "$SC"
for s in "${skills[@]}"; do
  args=(--eval-set "$EVALS/$s.json" --skill-path "$HOME/.claude/skills/$s" --runs-per-query 3 --num-workers 4)
  if [ -f "$EVALS/baseline/$s.description.txt" ]; then
    echo "== $s: baseline =="
    "$PY" -m scripts.run_eval "${args[@]}" --description "$(cat "$EVALS/baseline/$s.description.txt")" \
      > "$RESULTS/$s.baseline.json"
  fi
  echo "== $s: current =="
  "$PY" -m scripts.run_eval "${args[@]}" > "$RESULTS/$s.current.json"
done
echo "results: $RESULTS"
