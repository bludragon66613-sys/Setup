# Agentic Knowledge Vault

> Operational knowledge base for Rohan's AI agent ecosystem.
> Last reorganized: 2026-04-10
> Pattern: Karpathy's LLM Knowledge Bases + operational extensions
> Auto-maintained by LLM. You rarely touch it manually.

---

## Navigation

| Section | Path | Count | Purpose |
|---------|------|-------|---------|
| [[#Strategic North Star]] | `01-polaris/` | 1 | Non-negotiables, quarterly goals |
| [[#Projects]] | `wiki/articles/` | 11 | LLM-compiled project articles |
| [[#Skill Graph]] | `skill-graph/` | 285 | 11 domain MOCs + 273 skill stubs with descriptions |
| [[#Sessions]] | `sessions/` | 68 | Claude Code session logs by month |
| [[#Daily Logs]] | `daily/` | 15 | Auto-generated daily sync snapshots |
| [[#Aeon Logs]] | `aeon-logs/` | 5 | NERV agent operational logs |
| [[#Memory]] | `memory/` | 38 | Claude Code memory mirror (projects, feedback, refs, savepoints, agents) |
| [[#Tasks]] | `tasks/` | 3 | Live task tracking (ClawChief-style) |
| [[#Raw Sources]] | `raw/` | 12 | Unedited ingests (articles, repos, tweets) |
| [[#Workflows]] | `workflows/` | 6 | Reusable workflow patterns |
| [[#Outputs]] | `outputs/` | 3 | Rendered project summaries |
| [[#Tooling]] | `tooling/` | 1 | Tool and skill documentation |
| [[#Entities]] | `wiki/entities/` | 13 | People, tools, companies, frameworks |
| [[#Concepts]] | `wiki/concepts/` | 1 | Extracted cross-cutting concepts |
| [[#Summaries]] | `wiki/summaries/` | 1 | Periodic knowledge snapshots |
| [[#Evals]] | `evals/` | 3 | Evaluation scripts (meta-agent, suite) |

**Total: ~470 files** | **Flat index:** [[index]] | **Schema:** [[WIKI_SCHEMA]]

---

## Strategic North Star

- [[01-polaris/Top of Mind]] — Quarterly goals, life razors, open decisions, human-vs-agent boundary

---

## Projects

Wiki-compiled articles for each active project. Cross-linked with wikilinks.

- [[tallyai-munshi]] — AI accounting copilot for Indian SMEs; branded as Munshi
- [[nerv-autonomous-agent]] — NERV_02 agent system on GitHub Actions; 41 skills
- [[signal-consultancy]] — SIGNAL/NERV AI agent consultancy; India + Global
- [[openclaw-ai-gateway]] — Local AI gateway bridging Telegram to AI models
- [[paperclip-agent-platform]] — Agent organization orchestration; 441 agents
- [[rei-ai-vtuber]] — Rei: AI VTuber + Solana token launcher
- [[virama-branding]] — Virama real estate branding by SSquare
- [[autoagent-optimization]] — Autonomous skill improvement loop
- [[omc-orchestration]] — oh-my-claudecode multi-agent orchestration
- [[dexfolioexp-analytics]] — DexFolioExp: real-time Solana DEX analytics, Rust+React
- [[claude-obsidian-memory-stack]] — Claude + Obsidian knowledge architecture
- [[decision-traces-context-graphs]] — Decision trace patterns for agent memory

---

## Skill Graph

285 Claude Code skills organized into 11 domain MOCs. Based on arscontexta plugin pattern.
273 skill stubs in `skill-graph/skills/` with descriptions and invoke commands.

**Entry point:** [[skill-graph/index]] | Navigate: domain MOC → skill stub → `/$skill` to invoke

| Domain | Skills | Covers |
|--------|--------|--------|
| [[skill-graph/security]] | ~30 | OWASP, scanning, auditing, crypto |
| [[skill-graph/fuzzing]] | ~12 | AFL++, libFuzzer, harness writing |
| [[skill-graph/blockchain]] | ~7 | 6 chain vuln scanners |
| [[skill-graph/engineering]] | ~25 | APIs, databases, Docker, AI/ML |
| [[skill-graph/languages]] | ~35 | Python/Go/Rust/Kotlin/Swift/Java |
| [[skill-graph/testing]] | ~15 | TDD, verification, E2E |
| [[skill-graph/product-management]] | ~65 | Full PM lifecycle |
| [[skill-graph/design-creative]] | ~10 | Brand, UI/UX, presentations |
| [[skill-graph/content-marketing]] | ~12 | Content, SEO, sales, growth |
| [[skill-graph/workflow]] | ~25 | Agent orchestration, dev pipeline |
| [[skill-graph/business-ops]] | ~15 | Supply chain, logistics, IR |

---

## Sessions

Claude Code session logs organized by month. Each captures what was built, debugged, or configured.

### 2026-04 (19 sessions)
Latest: [[sessions/2026-04/2026-04-08-setup-sync-session|Apr 8 — Setup sync]]

### 2026-03 (49 sessions)
Latest: [[sessions/2026-03/2026-03-27-tallyai-auth-fix-session|Mar 27 — TallyAI auth fix]]

---

## Daily Logs

Auto-generated daily sync snapshots showing active services, memory state, and session activity.

Covers: 2026-03-23 through 2026-04-10 (15 days)

---

## Aeon Logs

NERV agent operational logs — heartbeat checks, R&D council memos, skill execution.

- [[aeon-logs/2026-03-25]] — Heartbeat + R&D Council (solar energy analysis)
- [[aeon-logs/rd-council-2026-03-25]] — Full R&D Council memo
- [[aeon-logs/2026-03-24]], [[aeon-logs/2026-03-21]], [[aeon-logs/2026-03-19]]

---

## Memory

Mirror of Claude Code memory (`~/.claude/projects/C--Users-Rohan/memory/`), organized by type.

| Type | Path | Count | Contents |
|------|------|-------|----------|
| Projects | `memory/projects/` | 13 | One file per active project |
| Feedback | `memory/feedback/` | 5 | Behavioral guidance (model selection, startup, design quality) |
| References | `memory/references/` | 6 | Pointers to external systems (skill graphs, CC architecture, design library, memory arch, summarize) |
| Savepoints | `memory/savepoints/` | 10 | Session state snapshots (Mar 25 — Apr 8) |
| Agents | `memory/agents/` | 11 | Agent-specific files (MEMORY, HEARTBEAT, PROGRAM, SPIKE_MEMORY, user_profile, etc.) |

---

## Tasks

ClawChief-style task management.

- [[tasks/current]] — Today's priorities + backlog
- [[tasks/tasks]] — Canonical task file (principal + assistant)
- [[tasks/tasks-completed]] — Archive of completed tasks

---

## Raw Sources

Unedited ingests — articles, repos, tweets. Never edited manually.

12 files covering: agent harness architectures, AI trends, decision traces, taste/design, GTM skills, knowledge bases, skill chaining, human-agent division.

---

## Workflows

Reusable workflow patterns and frameworks.

- [[stitch-mcp-design-system]] — Google Stitch 2.0 + Claude Code MCP
- [[30-day-saas-claude-code]] — Rapid SaaS validation playbook
- [[structured-design-critique-ai]] — Structured taste signals for AI design
- [[subconscious-agent-loop]] — Self-improving agent architecture
- [[auto-harness-self-improving-loop]] — Production failure mining (NeoSigma)
- [[clawchief-executive-assistant]] — ClawChief operating system

---

## Outputs

Rendered project summaries for quick reference.

- [[outputs/munshi/project-summary]] — Munshi/TallyAI full build + GTM
- [[outputs/nerv/project-summary]] — NERV_02 architecture + skills
- [[outputs/openclaw/project-summary]] — OpenClaw config + auth state

---

## Tooling

- [[tooling/claude-code-hooks]] — Pre/Post hooks for safety and quality

---

## Entities

First-class pages for people, tools, companies, and frameworks. Connective tissue between articles.

| Entity | Kind | Articles |
|--------|------|----------|
| [[wiki/entities/nerv\|NERV]] | platform | 8 |
| [[wiki/entities/paperclip\|Paperclip]] | platform | 5 |
| [[wiki/entities/omc\|OMC]] | framework | 5 |
| [[wiki/entities/vercel\|Vercel]] | platform | 5 |
| [[wiki/entities/claude-code\|Claude Code]] | tool | 4 |
| [[wiki/entities/openclaw\|OpenClaw]] | platform | 4 |
| [[wiki/entities/github-actions\|GitHub Actions]] | tool | 4 |
| [[wiki/entities/next-js\|Next.js]] | framework | 4 |
| [[wiki/entities/signal\|SIGNAL]] | company | 3 |
| [[wiki/entities/anthropic\|Anthropic]] | company | 3 |
| [[wiki/entities/autoagent\|AutoAgent]] | project | 3 |
| [[wiki/entities/mcp\|MCP]] | framework | 3 |
| [[wiki/entities/obsidian\|Obsidian]] | tool | 2 |

---

## Concepts

- [[wiki/concepts/skill-graphs]] — Skill graph architecture pattern

---

## Summaries

- [[2026-04-05-project-landscape]] — Full ecosystem map, status table, interdependencies

---

## Compilation Workflow

1. **Ingest** — article/repo/tweet → `raw/`
2. **Compile** — LLM reads `raw/` → creates/updates `wiki/`
3. **Lint** — LLM scans for gaps, inconsistencies, connections
4. **Query** — ask questions against `wiki/` → renders output
5. **File** — output goes back → knowledge compounds

---

## Reference

- [[Karpathy's LLM Knowledge Bases]] — Pattern this vault follows
- [[index]] — Flat file catalog
- [[log]] — Append-only changelog
