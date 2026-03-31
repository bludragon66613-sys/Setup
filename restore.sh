#!/usr/bin/env bash
# ============================================================================
# Claude Code Setup — Full Restore Script
# ============================================================================
# Usage: git clone https://github.com/bludragon66613-sys/Setup.git && cd Setup && bash restore.sh
#
# This restores a complete Claude Code environment:
#   - 54 custom agents (organized by category)
#   - 16 hook scripts + settings.json with all hook wiring
#   - 65 rule files across 13 language-specific directories
#   - Memory system with MEMORY.md index
#   - Sanitized settings with plugin list
#   - Startup scripts
#
# After running, you still need to:
#   1. Set your GITHUB_PERSONAL_ACCESS_TOKEN in ~/.bashrc
#   2. Run `claude` once to trigger plugin installation
#   3. Install GSD: /gsd:update (inside a Claude session)
#   4. Install ECC skills: /configure-ecc (inside a Claude session)
# ============================================================================

set -euo pipefail

CLAUDE_HOME="${HOME}/.claude"
SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "╔═══════════════════════════════════════════╗"
echo "║  Claude Code Setup — Full Restore         ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# ── Pre-flight checks ──────────────────────────────────────────────
if ! command -v claude &>/dev/null; then
  echo "⚠  Claude Code CLI not found. Install first:"
  echo "   npm install -g @anthropic-ai/claude-code"
  echo ""
fi

if ! command -v gh &>/dev/null; then
  echo "⚠  GitHub CLI not found. Install first:"
  echo "   https://cli.github.com/"
  echo ""
fi

# ── Create directory structure ─────────────────────────────────────
echo "→ Creating directory structure..."
mkdir -p "${CLAUDE_HOME}/agents"
mkdir -p "${CLAUDE_HOME}/hooks"
mkdir -p "${CLAUDE_HOME}/rules"
mkdir -p "${CLAUDE_HOME}/diagnostics"

# ── Restore Agents ─────────────────────────────────────────────────
echo "→ Restoring agents..."
agent_count=0
for category in core gsd engineering design specialized; do
  if [ -d "${SETUP_DIR}/agents/${category}" ]; then
    for f in "${SETUP_DIR}/agents/${category}"/*.md; do
      [ -f "$f" ] || continue
      cp "$f" "${CLAUDE_HOME}/agents/"
      agent_count=$((agent_count + 1))
    done
  fi
done
echo "  ✓ ${agent_count} agents restored"

# ── Restore Hooks ──────────────────────────────────────────────────
echo "→ Restoring hooks..."
hook_count=0
for f in "${SETUP_DIR}/hooks"/*.js; do
  [ -f "$f" ] || continue
  cp "$f" "${CLAUDE_HOME}/hooks/"
  chmod +x "${CLAUDE_HOME}/hooks/$(basename "$f")"
  hook_count=$((hook_count + 1))
done
# Copy hooks.json if present
if [ -f "${SETUP_DIR}/hooks/hooks.json" ]; then
  cp "${SETUP_DIR}/hooks/hooks.json" "${CLAUDE_HOME}/hooks/"
fi
echo "  ✓ ${hook_count} hook scripts restored"

# ── Restore Rules ──────────────────────────────────────────────────
echo "→ Restoring rules..."
cp -r "${SETUP_DIR}/rules/"* "${CLAUDE_HOME}/rules/" 2>/dev/null || true
rule_count=$(find "${CLAUDE_HOME}/rules" -name '*.md' 2>/dev/null | wc -l)
echo "  ✓ ${rule_count} rule files restored"

# ── Restore Settings ───────────────────────────────────────────────
echo "→ Restoring settings..."
if [ -f "${CLAUDE_HOME}/settings.json" ]; then
  cp "${CLAUDE_HOME}/settings.json" "${CLAUDE_HOME}/settings.json.bak"
  echo "  ℹ Existing settings.json backed up to settings.json.bak"
fi
cp "${SETUP_DIR}/settings.json" "${CLAUDE_HOME}/settings.json"
echo "  ✓ Settings restored (edit env.GITHUB_PERSONAL_ACCESS_TOKEN)"

# ── Restore Memory ─────────────────────────────────────────────────
echo "→ Restoring memory..."
# Detect project memory path
PROJECT_MEM="${CLAUDE_HOME}/projects/C--Users-$(whoami)/memory"
mkdir -p "${PROJECT_MEM}"
mem_count=0
for f in "${SETUP_DIR}/memory"/*.md; do
  [ -f "$f" ] || continue
  cp "$f" "${PROJECT_MEM}/"
  mem_count=$((mem_count + 1))
done
echo "  ✓ ${mem_count} memory files restored to ${PROJECT_MEM}"

# ── Restore CLAUDE.md files ────────────────────────────────────────
echo "→ Restoring CLAUDE.md files..."
if [ -f "${SETUP_DIR}/claude-config-CLAUDE.md" ]; then
  cp "${SETUP_DIR}/claude-config-CLAUDE.md" "${CLAUDE_HOME}/CLAUDE.md"
  echo "  ✓ ~/.claude/CLAUDE.md restored"
fi
if [ -f "${SETUP_DIR}/project-root-CLAUDE.md" ]; then
  cp "${SETUP_DIR}/project-root-CLAUDE.md" "${HOME}/CLAUDE.md"
  echo "  ✓ ~/CLAUDE.md restored"
fi

# ── Restore Scripts ────────────────────────────────────────────────
echo "→ Restoring utility scripts..."
if [ -d "${SETUP_DIR}/scripts" ]; then
  for f in "${SETUP_DIR}/scripts"/*; do
    [ -f "$f" ] || continue
    cp "$f" "${HOME}/"
    chmod +x "${HOME}/$(basename "$f")" 2>/dev/null || true
  done
  echo "  ✓ Scripts restored to ~/"
fi

# ── Summary ────────────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  Restore Complete                         ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "  Agents:  ${agent_count}"
echo "  Hooks:   ${hook_count}"
echo "  Rules:   ${rule_count}"
echo "  Memory:  ${mem_count}"
echo ""
echo "── Next Steps ──────────────────────────────"
echo ""
echo "  1. Set your GitHub PAT:"
echo "     echo 'export GITHUB_PERSONAL_ACCESS_TOKEN=\"ghp_...\"' >> ~/.bashrc"
echo ""
echo "  2. Edit settings.json PAT placeholder:"
echo "     nano ~/.claude/settings.json"
echo ""
echo "  3. Start Claude Code and install plugins + skills:"
echo "     claude"
echo "     > /configure-ecc     # Install Everything Claude Code skills"
echo "     > /gsd:update        # Install Get Shit Done framework"
echo ""
echo "  4. (Optional) Start services:"
echo "     bash ~/startup-services.sh"
echo ""
echo "  Done! Your Claude Code environment is ready."
