#!/usr/bin/env bash
# Re-apply model aliases to agent frontmatter. Run after `omc setup`, which
# rewrites OMC-managed agents with pinned IDs (claude-opus-4-6 etc.).
#   agent-model-pins.sh [agents_dir]   (default: ~/.claude/agents)
set -euo pipefail

DIR="${1:-$HOME/.claude/agents}"
OPUS_OVERRIDES=(debugger verifier tracer)

cd "$DIR"
for f in *.md; do
  sed -i '' -E '1,10s/^model: claude-(opus|sonnet|haiku)-[0-9][-0-9a-z]*$/model: \1/' "$f"
done
for a in "${OPUS_OVERRIDES[@]}"; do
  [ -f "$a.md" ] && sed -i '' -E '1,10s/^model: (sonnet|haiku)$/model: opus/' "$a.md"
done

pinned=$(grep -l -E '^model: claude-' *.md || true)
if [ -n "$pinned" ]; then
  echo "still pinned: $pinned" >&2
  exit 1
fi
grep -h '^model:' *.md | sort | uniq -c
