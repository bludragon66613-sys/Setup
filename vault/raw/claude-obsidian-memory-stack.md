# Claude + Obsidian: 3-Layer Compounding Memory Stack
> Source: https://x.com/intheworldofai/status/2039255561280057794
> Author: WorldofAI (@intheworldofai)
> Date: 2026-04-01
> Tags: #claude #obsidian #memory #mcp #knowledge-graph #context
---

## Core Thesis
Memory is no longer a feature. It is the operating system for your attention.
Developers who win won't prompt fastest — they'll build a graph worth traversing.

## The 3-Layer Stack

### Layer 1: Session Memory (CLAUDE.md + Auto-Memory)
- CLAUDE.md at repo root — first file Claude reads every session
- Auto-generated ~80% from codebase scan via /init command
- Three sections: Nouns (stack, structure), Verbs (build commands), Boundaries (hard rules)
- Auto-Memory writes to ~/.claude/projects/<hash>/memory/MEMORY.md
- Single lines save 10+ minutes next session

### Layer 2: Knowledge Graph (Obsidian + MCP Bridge)
- **Smart-Connections MCP**: semantic/vector search across entire vault
- **QMD (Query Markup Documents)**: hybrid search understanding wikilinks, aliases, code snippets
- MCP config: ~/.claude/mcp-servers.json
- Claude reads the entire second brain in real time — no more guessing

### Layer 3: Ingestion Pipeline
- brain-ingest local tool — turns YouTube/PDFs/podcasts into structured markdown
- LLM extraction: Claims, Frameworks, Action Items, Open Questions
- Auto wikilinking to existing notes
- Review in <60s, move to commonplace if evergreen

## Key Insight: Separation of Concerns
Two parallel worlds:
- ~/claude/ — The "Work" folder (AI-heavy: repos, PRDs, meeting notes)
- ~/obsidian-vault/ — The "Brain" (human-first, high-signal only)
- AI noise stays out of Obsidian. Claude reads both.

## Polaris Strategy (Accountability Partner)
- 01-polaris/Top of Mind.md: quarterly goals, active projects, Life Razors
- Start each feature by asking Claude to evaluate against stated direction
- Claude pushes back on architectural drift

## Compounding Payoff
"Before three months: Claude starts anticipating your needs.
References notes from six weeks ago without prompting.
Catches architectural drift before it happens."

---

## What We Should Steal for Our Stack

1. **CLAUDE.md at each repo root** — already partially in SOUL.md, but needs repo-specific version
2. **MCP bridge to Obsidian** — install Smart-Connections MCP + QMD
3. **mcp-servers.json** — wire up so Claude reads our knowledge-base directly
4. **Separation** — keep ~/claude/ (work) separate from ~/knowledge-base/ (brain)
5. **Top of Mind doc** — create for your goals and principles
6. **Auto-Memory** — verify ~/.claude/projects/*/memory/MEMORY.md is populating