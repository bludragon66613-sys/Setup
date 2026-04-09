# Agent Harness Architectures
> Source: https://x.com/aparnadhinak/status/2016915570503938452
> Author: Aparna Dhinakaran (@aparnadhinak) / Arize AI
> Date: 2026-01-29
> Tags: #agents #memory #unix #filesystem #context-window #knowledge-base
---

## Core Thesis
The best agent memory systems emerge bottom-up from composable primitives.
Unix philosophy: small tools doing one thing well, composing infinitely.
Make memory feel infinite by making it hierarchical. Make it hierarchical by making it composable.

## Why Filesystem + Unix > Everything Else
- File system provides effectively infinite memory context
- Unix commands (grep, ls, find, sort, uniq) act as dynamic index generators
- No pre-built index needed - scan at runtime, produce outputs that function as indexes
- No complex embeddings needed - agents already know bash natively
- Composable: pipe output of one command to input of next

## Dynamic Index Concept
Traditional DB index: pre-computed structure (key -> pointer)
Unix dynamic index: scan at runtime, stream through stdout, same semantic role
Advantages: always fresh, no maintenance cost, infinitely composable

## Memory Hierarchy for Agents
1. Context window (fast, small, expensive)
2. File system (medium, composable, free)
3. Database (infinite, slow, structured)
Agents choose the right tradeoff based on task complexity.

## Claude Code and Cursor Evidence
Both use grep, cut, sort, uniq to:
- Search across 10,000+ files
- Narrow down to relevant rows
- Handle structured extraction
- Right-size data to fit context window
Claude self-corrects when data exceeds context - backs out, finds alternative approach

## Composability Principle
Original agent tools: large, performed many actions, returned complex results = bad
Better pattern: every tool designed for composability, explicit focus on how tools combine

## Applied to Our Setup

| Arize Pattern | Our Setup |
|--------------|-----------|
| File system as memory | ~/knowledge-base/raw/ and wiki/ |
| Dynamic indexing | grep, ls, find across knowledge-base |
| Hierarchy (context -> file -> DB) | Context + KB files + Supabase (Munshi) |
| Composable tools | Paperclip agents chaining tasks |

## What We Should Apply
1. Knowledge base agents should use grep/find to search before loading full files
2. Avoid loading entire wiki into context — use dynamic indexes first
3. Design Paperclip agent prompts with explicit composability focus
4. Consider adding a simple index file per topic area in wiki/ for fast lookup