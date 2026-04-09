#!/usr/bin/env bash
# ============================================================================
# Claude Code Setup — Full Restore Script
# ============================================================================
# Usage: git clone https://github.com/bludragon66613-sys/Setup.git && cd Setup && bash restore.sh
#
# This restores a complete Claude Code environment:
#   - 77 custom agents (22 root + 55 in subdirectories)
#   - 16 hook scripts + settings.json with all hook wiring
#   - 65 rule files across 13 language-specific directories
#   - Memory system with MEMORY.md index
#   - 5 MCP servers (gitnexus, qmd, pencil, memory, claude-peers)
#   - Sanitized settings with plugin list
#   - Startup scripts
#
# After running, you still need to:
#   1. Run `claude` once to trigger plugin installation
#   2. Install GSD: /gsd:update (inside a Claude session)
#   3. Install ECC skills: /configure-ecc (inside a Claude session)
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
mkdir -p "${CLAUDE_HOME}/memory-graph"

# ── Restore Agents ─────────────────────────────────────────────────
echo "→ Restoring agents..."
agent_count=0

# Root-level agents (OMC core + custom)
for f in "${SETUP_DIR}/agents"/*.md; do
  [ -f "$f" ] || continue
  cp "$f" "${CLAUDE_HOME}/agents/"
  agent_count=$((agent_count + 1))
done

# Subdirectory agents (preserve structure)
for category in core gsd engineering design specialized; do
  if [ -d "${SETUP_DIR}/agents/${category}" ]; then
    mkdir -p "${CLAUDE_HOME}/agents/${category}"
    for f in "${SETUP_DIR}/agents/${category}"/*.md; do
      [ -f "$f" ] || continue
      cp "$f" "${CLAUDE_HOME}/agents/${category}/"
      agent_count=$((agent_count + 1))
    done
  fi
done
echo "  ✓ ${agent_count} agents restored (root + 5 subdirectories)"

# ── Restore Hooks ──────────────────────────────────────────────────
echo "→ Restoring hooks..."
hook_count=0
for f in "${SETUP_DIR}/hooks"/*.js; do
  [ -f "$f" ] || continue
  cp "$f" "${CLAUDE_HOME}/hooks/"
  chmod +x "${CLAUDE_HOME}/hooks/$(basename "$f")" 2>/dev/null || true
  hook_count=$((hook_count + 1))
done
# Copy hooks.json and README if present
[ -f "${SETUP_DIR}/hooks/hooks.json" ] && cp "${SETUP_DIR}/hooks/hooks.json" "${CLAUDE_HOME}/hooks/"
[ -f "${SETUP_DIR}/hooks/README.md" ] && cp "${SETUP_DIR}/hooks/README.md" "${CLAUDE_HOME}/hooks/"
echo "  ✓ ${hook_count} hook scripts restored"

# ── Restore Rules ──────────────────────────────────────────────────
echo "→ Restoring rules..."
cp -r "${SETUP_DIR}/rules/"* "${CLAUDE_HOME}/rules/" 2>/dev/null || true
rule_count=$(find "${CLAUDE_HOME}/rules" -name '*.md' 2>/dev/null | wc -l)
echo "  ✓ ${rule_count} rule files restored (common + 11 languages)"

# ── Restore Settings ───────────────────────────────────────────────
echo "→ Restoring settings..."
if [ -f "${CLAUDE_HOME}/settings.json" ]; then
  cp "${CLAUDE_HOME}/settings.json" "${CLAUDE_HOME}/settings.json.bak"
  echo "  ℹ Existing settings.json backed up to settings.json.bak"
fi
cp "${SETUP_DIR}/config/settings.json" "${CLAUDE_HOME}/settings.json"
echo "  ✓ Settings restored (hooks, plugins, effort level)"

# ── Restore Memory (from vault/Memory/) ───────────────────────────
echo "→ Restoring memory..."
PROJECT_MEM="${CLAUDE_HOME}/projects/C--Users-$(whoami)/memory"
mkdir -p "${PROJECT_MEM}"
mem_count=0
for f in "${SETUP_DIR}/vault/Memory"/*.md; do
  [ -f "$f" ] || continue
  cp "$f" "${PROJECT_MEM}/"
  mem_count=$((mem_count + 1))
done
echo "  ✓ ${mem_count} memory files restored to ${PROJECT_MEM}"

# ── Restore CLAUDE.md files (from config/) ────────────────────────
echo "→ Restoring CLAUDE.md files..."
if [ -f "${SETUP_DIR}/config/claude-config-CLAUDE.md" ]; then
  cp "${SETUP_DIR}/config/claude-config-CLAUDE.md" "${CLAUDE_HOME}/CLAUDE.md"
  echo "  ✓ ~/.claude/CLAUDE.md restored"
fi
if [ -f "${SETUP_DIR}/config/project-root-CLAUDE.md" ]; then
  cp "${SETUP_DIR}/config/project-root-CLAUDE.md" "${HOME}/CLAUDE.md"
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

# ── Install Global Tools ──────────────────────────────────────────
echo "→ Installing global tools..."
if command -v npm &>/dev/null; then
  echo "  → Installing oh-my-claudecode (multi-agent framework)..."
  npm install -g oh-my-claude-sisyphus@latest 2>/dev/null && {
    omc install 2>/dev/null
    omc setup 2>/dev/null
    echo "  ✓ OMC installed"
  } || echo "  ⚠ OMC install failed (optional)"

  echo "  → Installing GitNexus (code intelligence)..."
  npm install -g gitnexus 2>/dev/null && echo "  ✓ GitNexus installed" || echo "  ⚠ GitNexus install failed"

  echo "  → Installing QMD (semantic search)..."
  npm install -g @tobilu/qmd 2>/dev/null && echo "  ✓ QMD installed" || echo "  ⚠ QMD install failed"
else
  echo "  ⚠ npm not found — skip global tool installation"
fi

# ── Restore PM Skills (65 from phuryn/pm-skills) ──────────────────
echo "→ Restoring PM skills..."
pm_count=0
if command -v gh &>/dev/null; then
  PM_TMP=$(mktemp -d)
  gh repo clone phuryn/pm-skills "${PM_TMP}" -- --depth 1 2>/dev/null || true
  if [ -d "${PM_TMP}" ]; then
    for plugin_dir in "${PM_TMP}"/pm-*/; do
      [ -d "${plugin_dir}/skills" ] || continue
      for skill_dir in "${plugin_dir}"/skills/*/; do
        skill_name="pm-$(basename "${skill_dir}")"
        mkdir -p "${CLAUDE_HOME}/skills/${skill_name}"
        cp "${skill_dir}/SKILL.md" "${CLAUDE_HOME}/skills/${skill_name}/SKILL.md"
        pm_count=$((pm_count + 1))
      done
    done
    rm -rf "${PM_TMP}"
  fi
fi
echo "  ✓ ${pm_count} PM skills restored"

# ── Configure MCP Servers ────────────────────────────────────────
echo "→ Configuring MCP servers..."
CLAUDE_JSON="${HOME}/.claude.json"
if [ -f "${CLAUDE_JSON}" ] && command -v node &>/dev/null; then
  node -e "
    const fs = require('fs');
    const os = require('os');
    const path = '${CLAUDE_JSON}'.replace(/\\\\/g, '/');
    const d = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (!d.mcpServers) d.mcpServers = {};
    const nodeExe = process.execPath.replace(/\\\\/g, '\\\\\\\\');
    const npmRoot = require('child_process').execSync('npm root -g').toString().trim().replace(/\\\\/g, '\\\\\\\\');
    const sep = process.platform === 'win32' ? '\\\\\\\\' : '/';

    d.mcpServers['gitnexus'] = {
      command: nodeExe,
      args: [npmRoot + sep + 'gitnexus' + sep + 'dist' + sep + 'cli' + sep + 'index.js', 'mcp'],
      type: 'stdio'
    };
    d.mcpServers['qmd'] = {
      command: nodeExe,
      args: [npmRoot + sep + '@tobilu' + sep + 'qmd' + sep + 'dist' + sep + 'cli' + sep + 'qmd.js', 'mcp']
    };
    d.mcpServers['memory'] = {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-memory'],
      env: { MEMORY_FILE_PATH: os.homedir().replace(/\\\\/g, '\\\\\\\\') + sep + '.claude' + sep + 'memory-graph' + sep + 'knowledge.json' },
      type: 'stdio'
    };
    fs.writeFileSync(path, JSON.stringify(d, null, 2));
    console.log('  ✓ MCP servers configured (gitnexus, qmd, memory)');
  " 2>/dev/null || echo "  ⚠ MCP config failed — see mcp-servers.json for manual setup"
else
  echo "  ⚠ ~/.claude.json not found — configure MCP after first claude session"
fi

# ── Summary ────────────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  Restore Complete                         ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "  Agents:    ${agent_count} (22 root + subdirectories)"
echo "  Hooks:     ${hook_count}"
echo "  Rules:     ${rule_count}"
echo "  Memory:    ${mem_count}"
echo "  PM Skills: ${pm_count}"
echo ""
echo "── Next Steps ──────────────────────────────"
echo ""
echo "  1. Start Claude Code and install plugins + skills:"
echo "     claude"
echo "     > /configure-ecc     # Install Everything Claude Code skills"
echo "     > /gsd:update        # Install Get Shit Done framework"
echo ""
echo "  2. Install arscontexta plugin (knowledge graph):"
echo "     /plugin marketplace add agenticnotetaking/arscontexta"
echo "     /plugin install arscontexta@agenticnotetaking"
echo "     # restart Claude Code, then: /arscontexta:setup"
echo ""
echo "  3. Index repos with GitNexus:"
echo "     gitnexus analyze ~/your-project"
echo ""
echo "  4. Set up QMD vault search:"
echo "     qmd collection add vault ~/OneDrive/Documents/your-vault && qmd embed"
echo ""
echo "  5. (Optional) Start services:"
echo "     bash ~/startup-services.sh"
echo ""
echo "  Done! Your Claude Code environment is ready."
