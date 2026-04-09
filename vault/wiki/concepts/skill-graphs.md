---
title: skill graphs
type: concept
status: active
---

# Skill Graphs — Interconnected Knowledge Networks

**Source:** Heinrich (@arscontexta)  
**Date:** 2026-02-18  
**Link:** https://x.com/arscontexta/status/2023957499183829467

## Core Thesis

"People underestimate the power of structured knowledge. It enables entirely new kinds of applications."

Current skills are too shallow: one file = one capability. Real depth requires **Skill Graphs** — networks of skill files connected with wikilinks where each file is one complete thought or technique.

## The Primitives

1.  **Wikilinks in prose:** They carry meaning and act as traversal paths.
2.  **YAML Frontmatter:** Descriptions allow the agent to scan without reading full files.
3.  **MOCs (Maps of Content):** Organize clusters of related skills into navigable sub-topics.

## Progressive Disclosure

The agent navigates the graph in layers:
`Index → Descriptions → Links → Sections → Full Content`

Most decisions happen *before* the agent reads a single full file. It reads the index, understands the landscape, and follows only the relevant links.

## Implementation for Kaneda

We are already building a proto-skill graph in our `knowledge-base/`. To upgrade it:

1.  **YAML Frontmatter:** Add metadata to every workflow file (e.g., `purpose:`, `triggers:`, `related:`).
2.  **Structured Index:** Use `index.md` as a "traversable map" with one-line summaries.
3.  **Recursive Discovery:** The meta-agent should read `index.md` first, then "load" only the relevant nodes for the current task.

## Related Workflows
- [[Karpathy's LLM Knowledge Bases]] — The foundational pattern for persistent, compounding wikis.
- [[clawchief-executive-assistant]] — Uses a structured priority map similar to a skill graph index.
- [[autoagent-optimization]] — Uses traces (a form of graph) to identify failure clusters.

