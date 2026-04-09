# Claude Code Setup

A complete, battle-tested Claude Code environment. 77 agents, 280+ skills, 16 hooks, 65 rules across 13 languages, 3-layer persistent memory system, 5 MCP servers, code intelligence via GitNexus, semantic search via QMD, and knowledge management via arscontexta.

## Quick Start

```bash
git clone https://github.com/bludragon66613-sys/Setup.git
cd Setup
bash restore.sh
```

## What's Inside

### Agents (77)

Organized by category in `agents/`:

| Category | Count | Purpose |
|----------|-------|---------|
| **root** | 22 | OMC framework agents + custom core agents |
| **core/** | 6 | architect-builder, product-manager, senior-engineer, technical-cofounder, UI/UX architect, orchestrator |
| **gsd/** | 18 | Get Shit Done framework -- planner, executor, verifier, debugger, researcher, UI auditor |
| **engineering/** | 9 | AI engineer, backend architect, DevOps, frontend dev, rapid prototyper, security engineer |
| **design/** | 2 | UI designer, UX architect |
| **specialized/** | 20 | database reviewer, doc updater, code reviewer, MCP builder, chief-of-staff, etc. |

Root agents loaded by OMC (oh-my-claudecode) with smart model routing: Haiku for search, Sonnet for execution, Opus for planning. Subdirectory agents are custom-built with YAML frontmatter.

### Hooks (16)

Custom lifecycle hooks in `hooks/`:

| Hook | Event | Purpose |
|------|-------|---------|
| `memory-obsidian-sync.js` | SessionStart + Stop | Syncs memory to Obsidian vault, rebuilds MindMap.md |
| `memory-consolidation.js` | SessionStart | Advises cleanup if >48h since last or index >150 lines |
| `web-ingest-to-vault.js` | PostToolUse | Auto-ingests web content to vault via MarkItDown |
| `tool-failure-logger.js` | PostToolUseFailure | Logs failures to `~/.claude/diagnostics/` |
| `tg-session-end-notify.js` | Stop | Telegram notification when session ends |
| `tg-session-notify.js` | SessionStart | Telegram notification when session starts |
| `tg-session-summary.js` | PostToolUse(Write) | Telegram summary on file writes |
| `session-distill.js` | Stop | Distills session learnings |
| `vault-session-context.js` | SessionStart | Loads vault context into session |
| `claude-peers-start.js` | SessionStart | Starts peer coordination service |
| `gsd-check-update.js` | SessionStart | Checks for GSD framework updates |
| `gsd-context-monitor.js` | PostToolUse | Monitors context window usage |
| `gsd-prompt-guard.js` | PreToolUse | Guards against unintended file writes |
| `gsd-statusline.js` | StatusLine | Custom status bar with GSD state |
| `gsd-workflow-guard.js` | -- | Workflow protection |

### Rules (65 files, 13 directories)

Coding standards in `rules/`: common/ (universal), typescript/, python/, golang/, rust/, swift/, kotlin/, java/, cpp/, csharp/, perl/, php/

### 3-Layer Memory System

Persistent cross-session memory synced to Obsidian:

**Layer 1 -- Session Memory** (`memory/`): MEMORY.md index, user_profile, feedback, project, reference, session savepoints

**Layer 2 -- Knowledge Graph (Obsidian)**: QMD MCP (BM25 + vector), Memory MCP (entity/relation graph), arscontexta, MindMap.md auto-rebuilt

**Layer 3 -- Ingestion Pipeline**: web-ingest-to-vault.js (auto-captures web content), session sync (.tmp/.json to vault markdown)

### MCP Servers (5)

See `mcp-servers.json` for configuration templates:

| Server | Purpose | Install |
|--------|---------|---------|
| **gitnexus** | Code intelligence -- Tree-sitter AST, 16 tools | `npm i -g gitnexus` |
| **qmd** | Semantic search -- BM25 + vector, local GPU | `npm i -g @tobilu/qmd` |
| **pencil** | Design tool integration for .pen files | Pencil desktop app |
| **memory** | Entity/relation knowledge graph | Auto via npx |
| **claude-peers** | Multi-instance coordination | Auto via hook |

### Settings

`settings.json` -- Full Claude Code configuration: hook wiring (SessionStart, PostToolUse, Stop), 8 plugins enabled, 3 extra marketplaces, MCP permissions, effort level high, voice enabled, auto-updates latest.

### Skills (280+)

Installed via plugins. Install: `/configure-ecc` (ECC) + `/gsd:update` (GSD). PM skills (65) from `phuryn/pm-skills`.

### Plugins (9 enabled)

superpowers, chrome-devtools-mcp, vercel, claude-mem, qmd, arscontexta, code-review, frontend-design, skill-creator

## Architecture

```
~/.claude/
  CLAUDE.md              # Global config
  settings.json          # Hooks, plugins, permissions
  agents/                # 77 agents (root + 5 subdirs)
    *.md                 # OMC framework agents
    core/                # Custom primary agents
    gsd/                 # Get Shit Done agents
    engineering/         # Engineering specialists
    design/              # Design agents
    specialized/         # Domain expert agents
  hooks/                 # 16 lifecycle hooks
  rules/                 # 65 rules (common + 11 languages)
  skills/                # 280+ skills (plugin-managed)
  memory-graph/          # Entity/relation knowledge graph
  projects/C--Users-*/memory/  # Session memory

~/CLAUDE.md              # Project root instructions
~/startup-services.sh    # Service bootstrap
```

## Customization

1. Fork this repo
2. Run `bash restore.sh`
3. Edit `~/CLAUDE.md` with your project context
4. Edit `memory/user_profile.md` with your identity
5. Remove project-specific memory you don't need
6. Add agents to `agents/specialized/`

## License

MIT -- fork, customize, and share.
