#!/usr/bin/env bash
# obsidian_sync.sh — Sync autoresearch.md into the Obsidian vault.
#
# Usage:
#   obsidian_sync.sh [path/to/autoresearch.md]
#   (if no argument, auto-detects ./autoresearch.md in cwd)
#
# Copies autoresearch.md → ~/OneDrive/Documents/Agentic knowledge/_autoresearch/<slug>/autoresearch.md
# Slug is derived from the git branch name (autoresearch/<slug>) or from the
# "Goal:" line inside autoresearch.md.
# Overwrites only when source is newer than destination (mtime comparison).
# After copying, triggers `qmd update && qmd embed` in background.
# Skips paths containing "shueb.io" (global Obsidian exclusion rule).
#
# Errors are non-fatal — caller should redirect stderr if desired.

set -uo pipefail

VAULT_BASE="${HOME}/OneDrive/Documents/Agentic knowledge/_autoresearch"

# ── Resolve source file ─────────────────────────────────────────────────────
if [ $# -ge 1 ]; then
  SRC="$1"
else
  SRC="$(pwd)/autoresearch.md"
fi

# Expand ~ if present
SRC="${SRC/#\~/$HOME}"

if [ ! -f "$SRC" ]; then
  echo "[obsidian_sync] ERROR: source not found: $SRC" >&2
  exit 1
fi

# ── shueb.io exclusion ──────────────────────────────────────────────────────
if echo "$SRC" | grep -qi "shueb\.io"; then
  echo "[obsidian_sync] SKIP: path matches shueb.io exclusion rule: $SRC" >&2
  exit 0
fi

# ── Derive slug ─────────────────────────────────────────────────────────────
# Try git branch first: autoresearch/<slug>-YYYYMMDD → take just <slug>
BRANCH=$(git -C "$(dirname "$SRC")" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
SLUG=$(echo "$BRANCH" \
  | grep -oP 'autoresearch/\K[^/]+' \
  | sed 's/-[0-9]\{8\}$//' \
  | head -1)

# Fall back to "Goal:" line in autoresearch.md
if [ -z "$SLUG" ]; then
  SLUG=$(grep -m1 -iP '^\*{0,2}goal\*{0,2}\s*[:：]' "$SRC" 2>/dev/null \
    | sed 's/.*[:：][[:space:]]*//' \
    | tr '[:upper:]' '[:lower:]' \
    | sed 's/[^a-z0-9_-]/-/g' \
    | sed 's/--*/-/g; s/^-//; s/-$//' \
    | head -c 60)
fi

# Ultimate fallback: use source directory basename
if [ -z "$SLUG" ]; then
  SLUG=$(basename "$(dirname "$SRC")")
fi

DST_DIR="${VAULT_BASE}/${SLUG}"
DST="${DST_DIR}/autoresearch.md"

# ── Vault dir exists? ───────────────────────────────────────────────────────
mkdir -p "$DST_DIR" 2>/dev/null || {
  echo "[obsidian_sync] ERROR: cannot create vault dir: $DST_DIR" >&2
  exit 1
}

# ── mtime comparison ────────────────────────────────────────────────────────
if [ -f "$DST" ]; then
  # stat is portable across Git-Bash/macOS/Linux via this approach
  src_mtime=$(stat -c %Y "$SRC" 2>/dev/null || stat -f %m "$SRC" 2>/dev/null || echo "0")
  dst_mtime=$(stat -c %Y "$DST" 2>/dev/null || stat -f %m "$DST" 2>/dev/null || echo "0")

  if [ "$src_mtime" -le "$dst_mtime" ] 2>/dev/null; then
    echo "[obsidian_sync] UP-TO-DATE: $DST (dst newer or same mtime)" >&2
    exit 0
  fi
fi

# ── Copy ────────────────────────────────────────────────────────────────────
cp "$SRC" "$DST" && echo "[obsidian_sync] Synced → $DST" >&2 || {
  echo "[obsidian_sync] ERROR: cp failed: $SRC → $DST" >&2
  exit 1
}

# ── Re-index vault in background (fail-soft) ────────────────────────────────
if command -v qmd >/dev/null 2>&1; then
  (qmd update && qmd embed) >/dev/null 2>&1 &
  echo "[obsidian_sync] qmd re-index started in background (pid $!)" >&2
else
  echo "[obsidian_sync] WARN: qmd not found — vault not re-indexed" >&2
fi

exit 0
