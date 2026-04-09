---
name: 3-Layer Memory Architecture
description: Claude Code 3-layer memory system — session memory, Obsidian knowledge graph (qmd + server-memory MCP), and web ingestion pipeline
type: reference
originSessionId: 719e33fe-7aa0-4373-ac54-265d1bc404dc
---
## Architecture (implemented 2026-04-06)

**Layer 1 — Session Memory:**
- Auto-memory at `~/.claude/projects/C--Users-Rohan/memory/` with MEMORY.md index
- claude-mem plugin for cross-session search/timeline/observations
- continuous-learning-v2 hooks for pattern extraction

**Layer 2 — Knowledge Graph:**
- Obsidian vault: `~/OneDrive/Documents/Agentic knowledge/`
- qmd MCP: semantic search (BM25 + vector embeddings), 2 collections (obsidian + vault)
- `@modelcontextprotocol/server-memory` MCP: entity/relation knowledge graph at `~/.claude/memory-graph/knowledge.json`
- arscontexta plugin: knowledge architecture
- Hooks wire Memory→Obsidian sync on SessionStart+Stop

**Layer 3 — Ingestion Pipeline:**
- `web-ingest-to-vault.js` PostToolUse hook on WebFetch/WebSearch → uses markitdown for HTML→MD → saves to vault `raw/`
- Session sync merged into `memory-obsidian-sync.js` → sessions → vault `Claude Sessions/`
- qmd re-indexes + re-embeds on session end
- `markitdown` CLI available for any document→markdown conversion (PDF, DOCX, PPTX, etc.)

**MCP Servers:**
- qmd (semantic search over Obsidian)
- memory (entity persistence)
- gitnexus (code intelligence)
- pencil (design files)
- claude-peers (multi-agent)

**Hooks registered in settings.json:**
- SessionStart: memory-obsidian-sync.js
- PostToolUse: web-ingest-to-vault.js (WebFetch|WebSearch)
- Stop: memory-obsidian-sync.js (unified — includes session sync + qmd reindex)

**Maintenance:** `qmd update && qmd embed` after major vault changes
