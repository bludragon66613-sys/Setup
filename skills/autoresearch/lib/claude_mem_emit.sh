#!/usr/bin/env bash
# Emit a claude-mem observation on keep.
set -euo pipefail
DESC="${1:-}"
COMMIT="${2:-}"
[ -z "$DESC" ] && exit 0
MEM_FILE=~/.claude/projects/C--Users-Rohan/memory/autoresearch_wins.md
mkdir -p "$(dirname "$MEM_FILE")"
if [ ! -f "$MEM_FILE" ]; then
  cat > "$MEM_FILE" <<'HDR'
---
name: autoresearch-wins
description: Kept experiments from autoresearch sessions — cross-project pattern mining
type: project
---

# Autoresearch Wins

HDR
fi
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
BRANCH=$(git branch --show-current 2>/dev/null || echo "?")
printf -- "- **%s** \`%s\` (%s): %s\n" "$TS" "${COMMIT:0:8}" "$BRANCH" "$DESC" >> "$MEM_FILE"
