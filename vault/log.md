# Knowledge Base Log

Append-only record of ingests, queries, and maintenance.

## [2026-04-06] upgrade | Full LLM Wiki Pattern Implementation
- Type: Architecture Upgrade
- Status: Complete
- Source: [Karpathy LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- Changes:
  - **WIKI_SCHEMA.md created** — schema layer defining 4 page types (article, entity, concept, summary), frontmatter templates, naming conventions, cross-reference rules, ingest/query/lint workflows
  - **13 entity pages created** in `wiki/entities/` — nerv, paperclip, claude-code, omc, openclaw, vercel, github-actions, signal, anthropic, next-js, autoagent, mcp, obsidian
  - **`/wiki-ingest` skill created** — full compilation workflow from raw → wiki (articles + entities + concepts + cross-refs + index + log)
  - **`/wiki-lint` skill created** — comprehensive health check (broken links, orphans, stale content, missing entities, index drift)
  - **`wiki-linter.mjs` upgraded** — 8 check categories (broken links, index drift, unprocessed sources, orphans, stale content, missing entities, cross-ref gaps, empty sections)
  - **`web-ingest-to-vault.js` updated** — added `/wiki-ingest` reminder on raw capture
  - **`Karpathy's LLM Knowledge Bases.md` filled** — full pattern reference with our implementation notes
  - **`index.md` updated** — entities section (13 pages), WIKI_SCHEMA entry, updated counts
- Notes: Vault now fully implements the Karpathy LLM Wiki pattern. The three layers are cleanly separated: raw/ (immutable sources) → wiki/ (LLM-maintained synthesis) → WIKI_SCHEMA.md (conventions). Two new skills (`/wiki-ingest`, `/wiki-lint`) automate the compile and maintain loops.

## [2026-04-06] reorg | Full vault restructuring
- Type: Structural Reorganization
- Status: Complete
- Changes:
  - **Directories normalized** — lowercase kebab-case throughout
  - **Sessions organized by month** — `Claude Sessions/` → `sessions/2026-03/` (49 files) + `sessions/2026-04/` (16 files)
  - **Memory organized by type** — flat `Memory/` → `memory/projects/` (10), `memory/feedback/` (5), `memory/references/` (4), `memory/savepoints/` (8), `memory/agents/` (11)
  - **Skill graph promoted** — `wiki/articles/skill-graph/` → top-level `skill-graph/` (12 files)
  - **Daily logs collected** — scattered root files → `daily/` (10 files, normalized names)
  - **Aeon logs normalized** — `Aeon Logs/` → `aeon-logs/`
  - **Concepts merged** — root `concepts/` → `wiki/concepts/`
  - **CLAUDE.md removed** — stale duplicate of `~/CLAUDE.md`
  - **MOC.md rewritten** — single navigation entry point with section tables
  - **index.md rebuilt** — comprehensive flat file catalog (162 files)
  - **MindMap.md updated** — all wikilinks point to new paths
  - **3-23-2026.md renamed** — normalized to `daily/2026-03-23.md`
- Notes: Structure now matches `~/knowledge-base/` pattern while preserving operational extensions (sessions, memory, tasks, aeon-logs, skill-graph, evals)

## [2026-04-06] fix | Broken wikilinks + skill graph stubs
- Type: Link Repair + Content Generation
- Status: Complete
- Changes:
  - **29 broken links fixed** in 9 daily log files — old Memory/ flat paths → new memory/projects/, memory/feedback/ etc.
  - **5 broken links fixed** in `PROGRAM.md` — external refs to code, internal refs to correct paths
  - **3 broken links fixed** in `decision-traces-context-graphs.md` — display-name mismatches
  - **2 broken links fixed** in `skill-graphs.md` — filename corrections
  - **2 broken links fixed** in `reference_skill_graphs.md` and `MOC.md` — generic terms de-linked
  - **2 false-positive refs fixed** in skill-graph (devops → existing skills, wikilinks → plain text)
  - **273 skill stub files created** in `skill-graph/skills/` — each has title, description (extracted from `~/.claude/skills/<name>/SKILL.md`), location path, and invoke command
- Result: 0 broken wikilinks remaining. All 275 previously-grey skill-graph nodes now resolve to stubs with real descriptions.

## [2026-04-05] sync | Claude Code Memory → Obsidian Vault
- Source: `~/.claude/projects/C--Users-Rohan/memory/` (9 project files)
- Type: Memory Sync
- Status: Complete
- Files created:
  - `outputs/munshi/project-summary.md` — TallyAI/Munshi full build status, GTM, pricing
  - `outputs/nerv/project-summary.md` — NERV_02 architecture, skills, brand hierarchy
  - `outputs/openclaw/project-summary.md` — OpenClaw auth state, config, VPS migration plan
  - `wiki/articles/tallyai-munshi.md` — Munshi article with Paperclip integration context
  - `wiki/articles/nerv-autonomous-agent.md` — NERV system, 41 skills, brand role
  - `wiki/articles/signal-consultancy.md` — SIGNAL GTM, pricing, brand architecture
  - `wiki/articles/openclaw-ai-gateway.md` — Gateway config, auth, security hardening
  - `wiki/articles/paperclip-agent-platform.md` — Paperclip stack, 441 agents, Windows notes
  - `wiki/articles/rei-ai-vtuber.md` — Rei 4 phases, Solana launcher, multistream
  - `wiki/articles/virama-branding.md` — SSquare brand, Virāma project, 10-brand pipeline
  - `wiki/articles/autoagent-optimization.md` — AutoAgent patterns, autoskills, results.tsv
  - `wiki/articles/omc-orchestration.md` — OMC 19 agents, magic keywords, model routing
  - `wiki/summaries/2026-04-05-project-landscape.md` — Full ecosystem map, status table, interdependencies
- Updates: `index.md` (articles: 7 → 16), `MOC.md` (topic counts updated, 2 new rows), `log.md` (this entry)
- Notes: All articles cross-linked with Obsidian wikilinks; outputs capture operational detail; summary captures strategic landscape

## [2026-04-05] init | Knowledge Base Indexing
- Created `index.md` with 7 workflows and 1 tooling doc
- Established append-only log format
- Status: Active

## [2026-04-04] ingest | ClawChief Executive Assistant
- Source: Ryan Carson (@ryancarson)
- Type: Article/Repo
- Status: Integrated
- Updates: Merged HEARTBEAT.md, installed 4 skills, created priority-map/auto-resolver
- Notes: GOG (Google Ops) deferred in favor of browser-based access

## [2026-04-04] ingest | AutoAgent Self-Optimization
- Source: Kevin Gu (@kevinrgu)
- Type: Article/Repo
- Status: Documented
- Updates: Added to index, noted in deferred infrastructure
- Notes: Full Harbor/Docker implementation deferred until scale requires it

## [2026-04-04] ingest | Kaneda AutoAgent Loop
- Source: Internal Design
- Type: System Implementation
- Status: Live
- Updates: Created `evals/meta-agent.js`, `evals/suite.json`, `memory/failures.jsonl`
- Notes: Lightweight version of AutoAgent for personal workflow compounding

## [2026-04-04] ingest | Anthropic Emotion Concepts
- Source: Anthropic Research
- Type: Research Paper
- Status: Analyzed
- Updates: Added to `autoagent-deferred.md` as Phase 3 target
- Notes: "Emotion as Memory" — functional vectors shaping agent behavior

## [2026-04-04] ingest | Karpathy LLM Wiki Pattern
- Source: Andrej Karpathy (Gist)
- Type: Conceptual Framework
- Status: Implemented
- Updates: Created `index.md` and `log.md`
- Notes: Shifted from loose KB to structured, compounding wiki
