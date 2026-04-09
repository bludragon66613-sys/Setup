---
title: "Karpathy's LLM Wiki Pattern"
type: reference
created: 2026-04-04
updated: 2026-04-06
source: "https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f"
---

# Karpathy's LLM Wiki Pattern

> Source: [Andrej Karpathy's Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
> This vault implements this pattern. See [[WIKI_SCHEMA]] for our conventions.

## The Core Idea

Instead of RAG (retrieving from raw documents at query time), the LLM **incrementally builds and maintains a persistent wiki** — a structured, interlinked collection of markdown files between you and the raw sources. When you add a new source, the LLM reads it, extracts key information, and integrates it into the existing wiki — updating entity pages, revising topic summaries, noting contradictions, strengthening the evolving synthesis.

**The wiki is a persistent, compounding artifact.** Cross-references are already there. Contradictions already flagged. Synthesis reflects everything read. Gets richer with every source and every question.

You never write the wiki yourself — the LLM writes and maintains all of it. You source, explore, and ask the right questions. The LLM summarizes, cross-references, files, and maintains.

> "Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase."

## Architecture (Three Layers)

1. **Raw sources** (`raw/`) — immutable source documents. Articles, papers, images, data. The LLM reads but never modifies. Source of truth.

2. **The wiki** (`wiki/`) — LLM-generated markdown. Summaries, entity pages, concept pages, comparisons, synthesis. The LLM owns this entirely — creates, updates, maintains cross-references, keeps consistent. You read it; the LLM writes it.

3. **The schema** (`WIKI_SCHEMA.md`) — conventions document. Tells the LLM how the wiki is structured, what workflows to follow. Co-evolved over time.

## Operations

### Ingest
Drop source into `raw/`, tell LLM to process. Flow: read source → discuss takeaways → write summary → update index → update entity/concept pages → append to log. A single source might touch 10-15 pages.

### Query
Ask questions against the wiki. LLM searches index → reads relevant pages → synthesizes answer. **Good answers can be filed back as new wiki pages** — explorations compound just like ingested sources.

### Lint
Periodic health-check. Look for: contradictions, stale claims, orphan pages, missing concepts, missing cross-references, data gaps.

## Indexing and Logging

- **index.md** — content-oriented catalog. Each page listed with link and one-line summary. LLM reads this first to find relevant pages. Works well at moderate scale (~100 sources, ~hundreds of pages).
- **log.md** — chronological append-only record. Ingests, queries, lint passes. Parseable with `grep "^## \[" log.md | tail -5`.

## Why This Works

The tedious part of maintaining a knowledge base is the bookkeeping — updating cross-references, keeping summaries current, noting contradictions, maintaining consistency. Humans abandon wikis because maintenance burden grows faster than value. LLMs don't get bored, don't forget cross-references, can touch 15 files in one pass. The wiki stays maintained because the cost is near zero.

Related in spirit to Vannevar Bush's Memex (1945) — a personal, curated knowledge store with associative trails. The part Bush couldn't solve was who does the maintenance. The LLM handles that.

## Our Implementation

This vault extends the pattern with:
- **Entity pages** (`wiki/entities/`) — first-class pages for people, tools, companies
- **Skill graph** (`skill-graph/`) — 285 Claude Code skills with domain MOCs
- **Memory mirror** (`memory/`) — Claude Code session memory synced to vault
- **Operational logs** (`sessions/`, `daily/`, `aeon-logs/`) — agent activity capture
- **Skills**: `/wiki-ingest` (compile raw → wiki), `/wiki-lint` (health check)
- **Search**: qmd MCP (BM25 + vector embeddings, on-device)
- **Hooks**: `web-ingest-to-vault.js` auto-captures web content to `raw/`

## See Also

- [[WIKI_SCHEMA]] — This vault's conventions and workflows
- [[wiki/articles/claude-obsidian-memory-stack|Claude + Obsidian Memory Stack]]
- [[wiki/entities/obsidian|Obsidian]]
