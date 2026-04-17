#!/usr/bin/env bash
# ccg_judge.sh — 3-way cross-model judge (Claude + Codex + Gemini).
# Usage: ccg_judge.sh <baseline> <candidate> <direction:lower|higher> <description>
# Returns JSON to stdout: {"verdict":"keep|discard|unknown","votes":{"claude":"...","codex":"...","gemini":"..."},"reasoning":"<=500 chars"}
#
# Model invocation strategy (in order of preference):
#   1. claude CLI + omc ask codex + omc ask gemini  (all three in parallel, 2-of-3 wins)
#   2. omc ask codex + omc ask gemini only          (majority of available wins)
#   3. claude CLI only                               (single-model verdict)
#   4. No models available — emit verdict:unknown

set -euo pipefail

BASELINE="${1:?baseline required}"
CANDIDATE="${2:?candidate required}"
DIRECTION="${3:?direction required}"
DESC="${4:-}"

PROMPT="Autoresearch experiment judgment.
Baseline=$BASELINE, Candidate=$CANDIDATE, Direction=$DIRECTION (${DIRECTION}=better).
Description: $DESC

Is this improvement genuine? Consider: (1) beyond measurement noise, (2) not a measurement artifact, (3) no masked regressions.
Reply with exactly one word on the first line -- KEEP or DISCARD -- then one sentence rationale."

JUDGE_TIMEOUT=60
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

# Detect available models
HAS_CLAUDE=false
HAS_OMC=false
command -v claude >/dev/null 2>&1 && HAS_CLAUDE=true
command -v omc    >/dev/null 2>&1 && HAS_OMC=true

# Launch judges in background, writing output to temp files
if [ "$HAS_CLAUDE" = true ]; then
  (
    if command -v timeout >/dev/null 2>&1; then
      timeout "${JUDGE_TIMEOUT}s" claude --print "$PROMPT" >"$WORK/claude.out" 2>&1
    else
      claude --print "$PROMPT" >"$WORK/claude.out" 2>&1
    fi
  ) &
  CLAUDE_PID=$!
fi

if [ "$HAS_OMC" = true ]; then
  (
    if command -v timeout >/dev/null 2>&1; then
      timeout "${JUDGE_TIMEOUT}s" omc ask codex "$PROMPT" >"$WORK/codex.out" 2>&1
    else
      omc ask codex "$PROMPT" >"$WORK/codex.out" 2>&1
    fi
  ) &
  CODEX_PID=$!

  (
    if command -v timeout >/dev/null 2>&1; then
      timeout "${JUDGE_TIMEOUT}s" omc ask gemini "$PROMPT" >"$WORK/gemini.out" 2>&1
    else
      omc ask gemini "$PROMPT" >"$WORK/gemini.out" 2>&1
    fi
  ) &
  GEMINI_PID=$!
fi

# Wait for all launched jobs
[ "$HAS_CLAUDE" = true ] && wait "$CLAUDE_PID" 2>/dev/null || true
[ "$HAS_OMC" = true ]    && wait "$CODEX_PID"  2>/dev/null || true
[ "$HAS_OMC" = true ]    && wait "$GEMINI_PID" 2>/dev/null || true

# Parse a single output file for KEEP/DISCARD
# Returns: keep | discard | unknown
parse_vote() {
  local file="$1"
  [ -f "$file" ] || { echo "unknown"; return; }
  local content
  content=$(cat "$file" 2>/dev/null || echo "")
  [ -z "$content" ] && { echo "unknown"; return; }
  # First line takes precedence
  local first
  first=$(echo "$content" | head -1 | tr '[:lower:]' '[:upper:]')
  if echo "$first" | grep -qw "KEEP"; then
    echo "keep"
  elif echo "$first" | grep -qw "DISCARD"; then
    echo "discard"
  elif echo "$content" | grep -iqw "KEEP"; then
    echo "keep"
  elif echo "$content" | grep -iqw "DISCARD"; then
    echo "discard"
  else
    echo "unknown"
  fi
}

# Collect votes
VOTE_CLAUDE="unknown"
VOTE_CODEX="unknown"
VOTE_GEMINI="unknown"
[ "$HAS_CLAUDE" = true ] && VOTE_CLAUDE=$(parse_vote "$WORK/claude.out")
[ "$HAS_OMC"    = true ] && VOTE_CODEX=$(parse_vote "$WORK/codex.out")
[ "$HAS_OMC"    = true ] && VOTE_GEMINI=$(parse_vote "$WORK/gemini.out")

# Tally non-unknown votes
KEEP_COUNT=0
DISCARD_COUNT=0
for v in "$VOTE_CLAUDE" "$VOTE_CODEX" "$VOTE_GEMINI"; do
  [ "$v" = "keep" ]    && KEEP_COUNT=$((KEEP_COUNT+1))
  [ "$v" = "discard" ] && DISCARD_COUNT=$((DISCARD_COUNT+1))
done
TOTAL=$((KEEP_COUNT + DISCARD_COUNT))

# Verdict: majority of non-unknown votes wins; tie or all-unknown → unknown
if   [ "$TOTAL" -eq 0 ];                          then VERDICT="unknown"
elif [ "$KEEP_COUNT" -gt "$DISCARD_COUNT" ];       then VERDICT="keep"
elif [ "$DISCARD_COUNT" -gt "$KEEP_COUNT" ];       then VERDICT="discard"
else                                                    VERDICT="unknown"
fi

# Collect reasoning snippets (first 2 lines per model, combined ≤500 chars)
REASONING=""
for model in claude codex gemini; do
  f="$WORK/${model}.out"
  [ -f "$f" ] || continue
  snippet=$(head -2 "$f" 2>/dev/null | tr '\n' ' ' | cut -c1-150)
  [ -n "$snippet" ] && REASONING="${REASONING}[${model}] ${snippet} "
done
REASONING="${REASONING:0:500}"

# Emit JSON — pass all values via env to avoid shell-escaping issues in node
VERDICT="$VERDICT" \
VOTE_CLAUDE="$VOTE_CLAUDE" \
VOTE_CODEX="$VOTE_CODEX" \
VOTE_GEMINI="$VOTE_GEMINI" \
REASONING="$REASONING" \
node -e '
const v       = process.env.VERDICT;
const claude  = process.env.VOTE_CLAUDE;
const codex   = process.env.VOTE_CODEX;
const gemini  = process.env.VOTE_GEMINI;
const reason  = process.env.REASONING.slice(0, 500);
const obj = { verdict: v, votes: { claude, codex, gemini }, reasoning: reason };
process.stdout.write(JSON.stringify(obj) + "\n");
'
