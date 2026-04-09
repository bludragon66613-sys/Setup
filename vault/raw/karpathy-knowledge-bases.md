# Karpathy's LLM Knowledge Bases
> Source: https://x.com/karpathy/status/2039805659525644595
> Author: Andrej Karpathy
> Date: 2026-04-03
> Tags: #ai #knowledge-management #llm #obsidian #automation
---

## Summary
Karpathy describes using LLMs to build personal knowledge bases. The pattern:
1. Index sources in 
aw/ directory
2. LLM compiles into a .md wiki with summaries, backlinks, concept articles
3. Obsidian = IDE frontend for viewing everything
4. Q&A against the wiki — no RAG needed at small scale
5. LLM "lints" for inconsistent data, missing info, new article candidates
6. Every query output gets filed back — knowledge compounds

## Key Quote
> "I rarely ever write or edit the wiki manually, it's the domain of the LLM."

## How We Apply It
- Raw sources: X articles, blog posts, docs, agent configs, research outputs
- LLM compiler: OpenClaw (Spike) + Paperclip agents
- Obsidian vault: ~/knowledge-base/
- Wiki maintenance: heartbeat task to lint and enhance
- Output: Munshi GTM strategy, NERV architecture, OpenClaw setup docs