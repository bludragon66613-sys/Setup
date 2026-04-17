#!/usr/bin/env bash
# nightly_iterate.sh — Overnight autoresearch orchestrator.
# Called by n8n workflow at 02:00 daily.
#
# Behaviour:
#   1. Scans PROJECT_DIRS for autoresearch.config.json files.
#   2. For each project that has not yet hit maxIterations, picks the
#      top idea from autoresearch.ideas.md and runs one experiment cycle:
#        run_experiment.sh  →  log_experiment.sh keep/discard
#   3. On error or maxIterations reached, sends a Telegram notification
#      via OpenClaw if TELEGRAM_CHAT_ID is set.
#
# Config:
#   PROJECT_DIRS — space-separated list of absolute dirs to scan.
#                  Override via env or edit the default below.
#   TELEGRAM_CHAT_ID — Telegram chat/user ID for @kaneda6bot notifications.
#                      Set in environment or ~/.env.autoresearch.
#
# Usage:
#   bash nightly_iterate.sh
#   PROJECT_DIRS="$HOME/aeon $HOME/paperclip" bash nightly_iterate.sh

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Config ─────────────────────────────────────────────────────────────────
: "${PROJECT_DIRS:="$HOME/aeon $HOME/paperclip"}"
: "${OPENCLAW_URL:="http://localhost:18789"}"
: "${LOG_FILE:="$HOME/.n8n/autoresearch-nightly.log"}"

# Load env overrides (optional — fail-soft)
# shellcheck disable=SC1090
[ -f "$HOME/.env.autoresearch" ] && source "$HOME/.env.autoresearch" 2>/dev/null || true

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# ── Helpers ────────────────────────────────────────────────────────────────
log() { echo "[$TIMESTAMP][nightly] $*" | tee -a "$LOG_FILE"; }

# send_telegram <message>
# TODO: Replace with a real telegram-send helper if you create one at
#       ~/.claude/scripts/telegram-send.sh — just call that instead.
send_telegram() {
  local msg="$1"
  if [ -z "${TELEGRAM_CHAT_ID:-}" ]; then
    log "WARN: TELEGRAM_CHAT_ID not set — skipping Telegram notification."
    return 0
  fi
  # Try OpenClaw's Telegram relay endpoint (fail-soft)
  curl -sf -X POST "$OPENCLAW_URL/api/telegram/send" \
    -H "Content-Type: application/json" \
    -d "{\"chat_id\":\"$TELEGRAM_CHAT_ID\",\"text\":\"$msg\"}" >/dev/null 2>&1 \
    || log "WARN: Telegram notification failed (OpenClaw unreachable)"
}

# pick_top_idea <ideas_file>
# Returns the first non-empty, non-header line from autoresearch.ideas.md.
pick_top_idea() {
  local ideas_file="$1"
  if [ ! -f "$ideas_file" ]; then
    echo "no idea — autoresearch.ideas.md not found"
    return 0
  fi
  grep -m1 -E '^\s*[-*]|^\s*[0-9]+\.' "$ideas_file" 2>/dev/null \
    | sed 's/^[[:space:]]*[-*0-9.]*[[:space:]]*//' \
    | head -c 120 \
    || echo "no ideas left"
}

# ── Main loop ──────────────────────────────────────────────────────────────
log "=== nightly_iterate.sh starting | PROJECT_DIRS: $PROJECT_DIRS ==="
TOTAL_PROJECTS=0
TOTAL_ITERATED=0

for proj_dir in $PROJECT_DIRS; do
  # Expand ~ manually (bash doesn't expand inside variables)
  proj_dir="${proj_dir/#\~/$HOME}"

  if [ ! -d "$proj_dir" ]; then
    log "SKIP: $proj_dir — directory not found"
    continue
  fi

  # Find all config files inside the project (including subdirs)
  while IFS= read -r config_file; do
    TOTAL_PROJECTS=$((TOTAL_PROJECTS + 1))
    work_dir="$(dirname "$config_file")"
    log "--- Project: $work_dir"

    # Parse maxIterations (default 50 if not set)
    max_iters=$(node -e "
      try {
        const c = JSON.parse(require('fs').readFileSync('$config_file','utf-8'));
        process.stdout.write(String(c.maxIterations || 50));
      } catch(e) { process.stdout.write('50'); }
    " 2>/dev/null || echo "50")

    # Read current run_count from state file
    state_file="$work_dir/.autoresearch-state.json"
    if [ ! -f "$state_file" ]; then
      log "SKIP: $work_dir — no .autoresearch-state.json (session not initialised)"
      continue
    fi

    run_count=$(node -e "
      try {
        const s = JSON.parse(require('fs').readFileSync('$state_file','utf-8'));
        process.stdout.write(String(s.run_count || 0));
      } catch(e) { process.stdout.write('0'); }
    " 2>/dev/null || echo "0")

    log "  run_count=$run_count  maxIterations=$max_iters"

    # Check if we've hit the cap
    if [ "$run_count" -ge "$max_iters" ]; then
      log "  DONE: maxIterations ($max_iters) reached"
      send_telegram "[autoresearch] $work_dir hit maxIterations ($max_iters). Review results."
      continue
    fi

    # Pick an idea from autoresearch.ideas.md
    idea=$(pick_top_idea "$work_dir/autoresearch.ideas.md")
    log "  Idea: $idea"

    # Run one experiment cycle inside the project directory
    (
      cd "$work_dir" || exit 1
      log "  Running run_experiment.sh in $work_dir"

      if bash "$SKILL_DIR/run_experiment.sh"; then
        # Decide keep/discard from last pending result (auto-keep in nightly mode)
        log "  Logging as keep: $idea"
        bash "$SKILL_DIR/log_experiment.sh" "keep" "nightly: $idea" || true
        TOTAL_ITERATED=$((TOTAL_ITERATED + 1))
      else
        log "  CRASH in $work_dir — logging as crash"
        bash "$SKILL_DIR/log_experiment.sh" "crash" "nightly crash: $idea" || true
        send_telegram "[autoresearch] CRASH in $work_dir during nightly run. Check log."
      fi
    ) || {
      log "  ERROR: subshell failed for $work_dir"
      send_telegram "[autoresearch] ERROR in $work_dir during nightly_iterate. Check ~/.n8n/autoresearch-nightly.log"
    }

  done < <(find "$proj_dir" -maxdepth 3 -name "autoresearch.config.json" 2>/dev/null)
done

log "=== Done. Projects scanned: $TOTAL_PROJECTS | Iterations run: $TOTAL_ITERATED ==="
