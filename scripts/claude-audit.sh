#!/bin/bash
# claude-audit.sh — Mnimiy 9-pattern audit. Run weekly.
# Usage: bash ~/claude-audit.sh

echo "=== CLAUDE.md size ==="
wc -w ~/.claude/CLAUDE.md 2>/dev/null
wc -w ~/CLAUDE.md 2>/dev/null
echo "Target: combined < 1,200 words"

echo
echo "=== Active hooks (event types) ==="
cat ~/.claude/settings.json 2>/dev/null | jq '.hooks // {} | keys' 2>/dev/null

echo
echo "=== UserPromptSubmit hooks (fires every prompt) ==="
cat ~/.claude/settings.json 2>/dev/null | jq '.hooks.UserPromptSubmit' 2>/dev/null

echo
echo "=== Enabled plugins ==="
cat ~/.claude/settings.json 2>/dev/null | jq '.enabledPlugins | to_entries | map(select(.value == true) | .key)' 2>/dev/null
echo "Target: 3-5"

echo
echo "=== Active skills (excluding archives) ==="
ls -1d ~/.claude/skills/*/ 2>/dev/null | grep -v _archive | grep -v node_modules | wc -l
echo "Target: 30-50"

echo
echo "=== MCP servers ==="
node -e "try { const c = require(process.env.HOME + '/.claude.json'); console.log(Object.keys(c.mcpServers || {})); } catch(e) { console.log('error reading .claude.json'); }"
echo "Target: 3 always-on"

echo
echo "=== effortLevel (extended thinking) ==="
cat ~/.claude/settings.json 2>/dev/null | jq -r '.effortLevel' 2>/dev/null
echo "Target: medium or low (off by default, toggle with Alt+T)"

echo
echo "=== MEMORY.md size ==="
wc -w ~/.claude/projects/C--Users-Rohan/memory/MEMORY.md 2>/dev/null
echo "Target: < 800 words (load full tree on demand)"

echo
echo "=== rules/common loaded files ==="
ls -1 ~/.claude/rules/common/*.md 2>/dev/null | wc -l
echo "Each ~150-300w. Consider compressing into single rules-summary.md"
