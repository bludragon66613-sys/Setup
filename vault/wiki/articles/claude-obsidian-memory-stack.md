# Claude + Obsidian: 3-Layer Compounding Memory Stack

> Source: WorldofAI via X article
> Date: 2026-04-01
> Related: [[Karpathy's LLM Knowledge Bases]]
---

## Summary
A 3-layer memory stack permanently wiring project DNA, personal knowledge graph, and external research into one living, searchable brain.

## The Three Layers

### 1. Session Memory (CLAUDE.md + Auto-Memory)
- CLAUDE.md at repo root — read first every session
- Auto-generated from codebase
- Sections: Nouns, Verbs, Boundaries
- ~/.claude/projects/<hash>/memory/MEMORY.md for auto-learnings

### 2. Knowledge Graph (Obsidian + MCP)
- Smart-Connections MCP — vector search across vault
- QMD — hybrid search with wikilinks/aliases
- Claude reads entire second brain in real time

### 3. Ingestion Pipeline
- brain-ingest tool — YouTube/PDF/podcast → structured markdown
- Auto wikilinking, claims extraction, action items

## Our Current Status vs This Blueprint

| Pattern | Status | Action Needed |
|---------|--------|---------------|
| CLAUDE.md per repo | Partial (SOUL.md covers workspace) | Add repo-specific CLAUDE.md |
| Auto-Memory | Unknown | Check ~/.claude/config |
| MCP Bridge to Obsidian | Not set up | Install Smart-Connections + QMD |
| Separation (work vs brain) | Partial (knowledge-base created) | Clean up ~/claude/ vs ~/knowledge-base/ |
| Top of Mind doc | Not created | Create 01-polaris/Top\ of\ Mind.md |
| brain-ingest pipeline | Using web_fetch | Could install brain-ingest tool |

---

## What We'll Implement
1. Install QMD for hybrid search
2. Create CLAUDE.md at key repos (nerve-dashboard, paperclip, nerv-desktop)
3. Create 01-polaris/Top of Mind.md with Totoro's goals and life razors
4. Set up MCP bridge so agents can search the knowledge base