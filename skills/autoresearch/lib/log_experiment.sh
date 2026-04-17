#!/usr/bin/env bash
# log_experiment.sh — finalize a pending experiment.
# Usage: log_experiment.sh <keep|discard|crash|checks_failed> "<description>" ['{"asi_json":"..."}']
#
# Effects:
#   - keep            → commits changed files, updates baseline if first run
#   - discard         → reverts changed files (autoresearch.* preserved)
#   - crash           → reverts, same as discard
#   - checks_failed   → reverts, same as discard
# Appends a JSON line to autoresearch.jsonl and recomputes session confidence.

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ $# -lt 2 ]; then
  echo "Usage: $0 <keep|discard|crash|checks_failed> \"<description>\" [asi_json]" >&2
  exit 2
fi

DECISION="$1"
DESCRIPTION="$2"
ASI_JSON="${3:-{}}"

[ -f ".autoresearch-pending.json" ] || { echo "No .autoresearch-pending.json — run run_experiment.sh first" >&2; exit 1; }
[ -f ".autoresearch-state.json" ] || { echo "No .autoresearch-state.json — run init_experiment.sh first" >&2; exit 1; }

case "$DECISION" in
  keep|discard|crash|checks_failed) ;;
  *) echo "Invalid decision: $DECISION" >&2; exit 2 ;;
esac

# If keep and checks failed, refuse
if [ "$DECISION" = "keep" ]; then
  CHECKS=$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('.autoresearch-pending.json','utf-8')).checks_status);")
  if [ "$CHECKS" = "fail" ]; then
    echo "Cannot keep — checks failed. Log as checks_failed instead." >&2
    exit 1
  fi
fi

# Stage autoresearch bookkeeping files separately so they never revert
git add -f autoresearch.md autoresearch.sh autoresearch.jsonl autoresearch.checks.sh autoresearch.ideas.md autoresearch.config.json .autoresearch-state.json 2>/dev/null || true

case "$DECISION" in
  keep)
    # Commit all changes (code + bookkeeping)
    git add -A
    if git diff --cached --quiet; then
      COMMIT_SHA=$(git rev-parse HEAD)
    else
      DESC_SHORT=$(echo "$DESCRIPTION" | head -c 60)
      git commit -m "autoresearch: $DESC_SHORT" >/dev/null
      COMMIT_SHA=$(git rev-parse HEAD)
    fi
    ;;
  discard|crash|checks_failed)
    # Revert unstaged+staged code changes, keep autoresearch files
    git stash push --keep-index -m "autoresearch-stash-ignore" -- $(git ls-files -m -o --exclude-standard | grep -v '^autoresearch\.' | grep -v '^\.autoresearch-' || true) 2>/dev/null || true
    git checkout -- . 2>/dev/null || true
    git clean -fd --exclude=autoresearch.* --exclude=.autoresearch-* 2>/dev/null || true
    # Drop the stash — we only used it to segregate session files
    git stash drop 2>/dev/null || true
    COMMIT_SHA=$(git rev-parse HEAD)
    ;;
esac

# Append JSONL + recompute confidence via node helper
DECISION="$DECISION" DESCRIPTION="$DESCRIPTION" ASI_JSON="$ASI_JSON" COMMIT_SHA="$COMMIT_SHA" SKILL_DIR="$SKILL_DIR" \
node "$SKILL_DIR/_append_log.js"

# Emit claude-mem observation on keep
if [ "$DECISION" = "keep" ] && [ -x "$SKILL_DIR/claude_mem_emit.sh" ]; then
  bash "$SKILL_DIR/claude_mem_emit.sh" "$DESCRIPTION" "$COMMIT_SHA" 2>/dev/null || true
fi

# Sync autoresearch.md to Obsidian vault on keep (fail-soft)
if [ "$DECISION" = "keep" ] && [ -x "$SKILL_DIR/obsidian_sync.sh" ]; then
  bash "$SKILL_DIR/obsidian_sync.sh" "$(pwd)/autoresearch.md" 2>/dev/null || true
fi

rm -f .autoresearch-pending.json
