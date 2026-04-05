# Claude Code Setup

A complete, battle-tested Claude Code environment. 54 agents, 281 skills, 16 hooks, 65 rules across 13 languages, persistent memory system, 4 MCP servers, code intelligence via GitNexus, semantic search via QMD, and knowledge management via arscontexta — ready to restore or fork.

## Quick Start

```bash
git clone https://github.com/bludragon66613-sys/Setup.git
cd Setup
bash restore.sh
```

## What's Inside

### Agents (54)

Organized by category in `agents/`:

| Category | Count | Purpose |
|----------|-------|---------|
| **core/** | 5 | Primary agents — architect-builder, senior-engineer, technical-cofounder, UI/UX architect, orchestrator |
| **gsd/** | 18 | Get Shit Done framework — planner, executor, verifier, debugger, researcher, UI auditor, etc. |
| **engineering/** | 9 | AI engineer, backend architect, DevOps, frontend dev, rapid prototyper, security engineer, etc. |
| **design/** | 2 | UI designer, UX architect |
| **specialized/** | 20 | Domain experts — database reviewer, doc updater, product manager, code reviewer, MCP builder, etc. |

All agents have YAML frontmatter with `model`, `tools`, `skills`, `maxTurns`, and `memory` scope configured.

**Core agent highlights:**
- `senior-software-engineer` — adversarial self-verification checklist (5 probes before declaring done)
- `technical-cofounder` — session memory protocol (reads/writes product state across sessions)
- `agent-architect-builder` — skill invocation guide mapping skills to build phases
- `ui-ux-architect` — skill-to-audit-phase mapping for design reviews

### Hooks (16)

Custom lifecycle hooks in `hooks/`:

| Hook | Event | Purpose |
|------|-------|---------|
| `memory-consolidation.js` | SessionStart | Advises memory cleanup if >48h since last or index >150 lines |
| `memory-obsidian-sync.js` | SessionStart + Stop | Syncs memory to Obsidian vault |
| `tool-failure-logger.js` | PostToolUseFailure | Logs failures to `~/.claude/diagnostics/` for pattern analysis |
| `tg-session-end-notify.js` | Stop | Telegram notification when session ends |
| `tg-session-summary.js` | PostToolUse(Write) | Telegram summary on session file writes |
| `vault-session-context.js` | SessionStart | Loads vault context into session |
| `vault-session-logger.js` | Stop | Logs session to vault |
| `session-distill.js` | Stop | Distills session into learnings |
| `gsd-check-update.js` | SessionStart | Checks for GSD framework updates |
| `gsd-context-monitor.js` | PostToolUse | Monitors context window usage |
| `gsd-prompt-guard.js` | PreToolUse(Write\|Edit) | Guards against unintended file writes |
| `gsd-statusline.js` | StatusLine | Custom status bar |
| `gsd-workflow-guard.js` | — | Workflow protection |
| `claude-peers-start.js` | SessionStart | Starts peer services |

Hook events used: `SessionStart`, `Stop`, `PostToolUse`, `PostToolUseFailure`, `PreToolUse`, `StatusLine`

### Rules (65 files, 13 languages)

Coding standards in `rules/`:

```
rules/
├── common/          # Universal — coding-style, git, testing, security, patterns, hooks, agents
├── typescript/      # TS/JS — types, React, Zod, Playwright, Prettier
├── python/          # PEP 8, pytest, Ruff, type hints
├── golang/          # Idiomatic Go, table-driven tests
├── rust/            # Ownership, error handling, cargo
├── swift/           # SwiftUI, actors, concurrency
├── kotlin/          # Coroutines, Compose, KMP
├── java/            # Spring Boot, JPA, layered architecture
├── cpp/             # Modern C++, GoogleTest, CMake
├── csharp/          # .NET patterns
├── perl/            # Modern Perl 5.36+
├── php/             # Laravel patterns
└── README.md        # Installation guide
```

### Memory System

Persistent cross-session memory in `memory/`:

- `MEMORY.md` — Index file (loaded every session)
- `user_profile.md` — User context and preferences
- `feedback_*.md` — Behavioral corrections and confirmations
- `project_*.md` — Active project context (NERV, TallyAI, OpenClaw, etc.)
- `reference_*.md` — Architecture references and external system pointers
- `session_savepoint_*.md` — Session state snapshots for resumption

### Settings

`settings.json` — Full Claude Code configuration:
- Hook wiring (all events mapped)
- Plugin enable/disable list (11 enabled)
- Extra marketplaces (qmd, claude-mem, arscontexta)
- Effort level: high
- Voice enabled
- Auto-updates: latest channel

### MCP Servers (4)

See `mcp-servers.json`. Configured in `~/.claude.json`:

| Server | Purpose | Install |
|--------|---------|---------|
| **gitnexus** | Code intelligence knowledge graph — indexes repos via Tree-sitter AST, exposes 16 tools (query, context, impact, rename, Cypher) | `npm i -g gitnexus` |
| **qmd** | Local semantic search — hybrid BM25 + vector search over markdown collections | `npm i -g @tobilu/qmd` |
| **pencil** | Design tool integration for .pen files | Desktop app |
| **claude-peers** | Multi-instance Claude coordination | HTTP on :7355 |

### Skills (281)

Not included directly (installed via plugins). See `skills-manifest.json` for the full list.

**Install via:**
```
/configure-ecc          # Everything Claude Code (superpowers plugin)
/gsd:update             # Get Shit Done framework
```

### Plugins (11 enabled)

See `plugins-manifest.json`. Enabled:
- `superpowers` — ECC skills framework
- `github` — GitHub MCP integration
- `chrome-devtools-mcp` — Browser debugging
- `vercel` — Vercel platform skills
- `claude-mem` — Persistent memory MCP
- `qmd` — Local markdown search engine
- `arscontexta` — Knowledge graph builder (research vault management)
- `code-review`, `frontend-design`, `skill-creator`, `claude-code-setup`

## Architecture Reference

Based on deep-dive into Claude Code's source (512K lines TypeScript):

- **5 hook types**: command, prompt (LLM validation), agent (multi-turn sub-agent), http (webhook), function
- **23+ hook events**: SessionStart, Stop, PreToolUse, PostToolUse, PostToolUseFailure, etc.
- **Memory system**: 4 types (user/feedback/project/reference), Sonnet side-query picks 5 relevant files/turn
- **Background services**: extractMemories (auto), autoDream (24h consolidation), MagicDocs (auto-docs)
- **Forked agent pattern**: background agents share parent prompt cache for near-zero cost

See `memory/reference_cc_source_architecture.md` for the complete map.

## Customization

### For Your Own Setup

1. Fork this repo
2. Run `bash restore.sh`
3. Edit `~/CLAUDE.md` with your own project context
4. Edit `memory/user_profile.md` with your identity
5. Remove project-specific memory files you don't need
6. Add your own agents to `agents/specialized/`

### Adding an Agent

Create `agents/specialized/my-agent.md`:

```yaml
---
name: my-agent
description: "What this agent does and when to use it"
model: sonnet
tools: [Read, Write, Edit, Bash, Glob, Grep]
maxTurns: 30
skills: [tdd-workflow]
---

Your agent's system prompt here...
```

### Adding a Hook

Create `hooks/my-hook.js`, then add to `settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "node \"~/.claude/hooks/my-hook.js\"",
        "timeout": 10,
        "async": true
      }]
    }]
  }
}
```

## New in This Update (2026-04-05)

### GitNexus — Code Intelligence Layer
Local knowledge graph engine that indexes codebases via Tree-sitter AST parsing into a graph database (LadybugDB). Exposes 16 MCP tools to Claude Code agents: hybrid search, 360-degree symbol context, blast radius analysis, git-diff impact detection, coordinated multi-file renames, and raw Cypher queries. Agents stop coding blind — every dependency is pre-computed at index time.

```bash
npm install -g gitnexus
gitnexus analyze ~/your-repo    # indexes into .gitnexus/
gitnexus list                   # show all indexed repos
gitnexus query "concept" --repo name
gitnexus impact "symbol" --repo name
```

### QMD — Semantic Search Engine
Local semantic search over markdown collections. Hybrid BM25 keyword + vector search with LLM query expansion and neural reranking. All models run locally on GPU (embeddinggemma-300M + Qwen3-Reranker-0.6B + qmd-query-expansion-1.7B).

```bash
npm install -g @tobilu/qmd
cd ~ && qmd collection add vault vault && qmd embed
qmd query "your search" -c vault
```

### Arscontexta — Knowledge Management Plugin
Research vault management system. Builds atomic knowledge graphs with prose-as-title notes, wiki-link connections, topic maps, and a full processing pipeline (capture -> reduce -> reflect -> verify). Includes 16 skills for knowledge work.

```
/plugin marketplace add agenticnotetaking/arscontexta
/plugin install arscontexta@agenticnotetaking
# restart, then: /arscontexta:setup
```

## License

MIT — fork, customize, and share.
