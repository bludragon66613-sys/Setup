---
name: MCP servers wired
description: gitnexus, qmd, memory MCP — config location and activation requirement
type: reference
originSessionId: a0253b8a-0fdf-43a1-8a43-6fdcd070c60f
---
Wired in `~/.claude.json` (added 2026-05-09):

- **gitnexus** — code intelligence over indexed repos. 16 tools (`mcp__gitnexus__*`). Indexed: aeon (2,576 symbols), paperclip (38,498), aeon/dashboard (1,424). Re-index: `gitnexus analyze <path>` (use `--skip-git` for non-git dirs).
- **qmd** — local search engine over markdown. Tools: `mcp__qmd__{get,multi_get,query,status}`. Index at `~/.cache/qmd/index.sqlite`. Re-index: `qmd update && qmd embed`. Vault collection: `~/Downloads/Agentic knowledge/`.
- **memory** — knowledge graph (`mcp__memory__{create_entities,create_relations,search_nodes,...}`).

**Activation:** Restart Claude Code so all three MCP servers spawn fresh on session start. Until restart, tools may queue or be partially available.

Notes:
- Both `~/aeon` and `~/aeon/dashboard` share alias NERV_02 in gitnexus despite different paths.
- qmd home-dir scan fails on `~/.Trash` (perm denied) — always specify `--name` and target path explicitly when adding collections.
