# Claude Code Setup

Complete Claude Code environment backup. 77 agents, 280+ skills, 16 hooks, 65 rules, 3-layer memory system, Obsidian knowledge vault.

## Quick Start

```bash
git clone https://github.com/bludragon66613-sys/Setup.git
cd Setup
bash restore.sh
```

## Structure

```
Setup/
  agents/              # 77 agents (canonical source)
    *.md               # OMC root agents + custom agents
    core/              # Primary custom agents (6)
    gsd/               # Get Shit Done framework (18)
    engineering/       # Engineering specialists (9)
    design/            # Design agents (2)
    specialized/       # Domain experts (20)
  config/              # Claude Code configuration
    settings.json      # Hooks, plugins, permissions
    mcp-servers.json   # MCP server templates
    plugins-manifest.json
    skills-manifest.json
    claude-config-CLAUDE.md   # ~/.claude/CLAUDE.md
    project-root-CLAUDE.md    # ~/CLAUDE.md
  hooks/               # 16 lifecycle hooks
  rules/               # 65 rules (common + 11 languages)
  scripts/             # Startup + utility scripts
  vault/               # Obsidian knowledge vault (single source of truth)
    Memory/            # Claude Code memory mirror
    Claude Sessions/   # Session logs
    daily/             # Daily sync notes
    wiki/              # Articles, entities, concepts
    skill-graph/       # 285 skill stubs + 11 domain MOCs
    MOC.md             # Map of Content
    MindMap.md         # Auto-generated mind map
  restore.sh           # One-command full restore
```

### No duplication

- **Memory** lives only in `vault/Memory/` -- restored to `~/.claude/projects/*/memory/`
- **Agents** live only in `agents/` -- restored to `~/.claude/agents/`
- **Sessions** live in `vault/Claude Sessions/` and `vault/sessions/` (by month)
- **Daily notes** live in `vault/daily/` only

### Agents (77)

| Category | Count | Purpose |
|----------|-------|---------|
| root | 22 | OMC framework agents + custom core |
| core/ | 6 | architect-builder, product-manager, senior-engineer, technical-cofounder, UI/UX, orchestrator |
| gsd/ | 18 | Get Shit Done -- planner, executor, verifier, debugger, researcher |
| engineering/ | 9 | AI, backend, DevOps, frontend, security, rapid prototyper |
| design/ | 2 | UI designer, UX architect |
| specialized/ | 20 | database, docs, code review, MCP builder, chief-of-staff |

### Hooks (16)

| Hook | Event | Purpose |
|------|-------|---------|
| `memory-obsidian-sync.js` | SessionStart + Stop | Syncs memory + agents + daily notes to Obsidian |
| `web-ingest-to-vault.js` | PostToolUse | Auto-ingests web content to vault |
| `vault-session-logger.js` | Stop | Copies session logs to vault |
| `session-distill.js` | Stop | Distills session learnings |
| `tg-session-*.js` | Various | Telegram notifications |
| `gsd-*.js` | Various | GSD framework hooks |

### 3-Layer Memory

1. **Session Memory** (`vault/Memory/`) -- MEMORY.md index, projects, feedback, references, savepoints
2. **Knowledge Graph** (Obsidian) -- QMD semantic search, Memory MCP entity graph, arscontexta, MindMap.md
3. **Ingestion Pipeline** -- web-ingest-to-vault.js, session logger, qmd re-index

## Customization

1. Fork this repo
2. Run `bash restore.sh`
3. Edit `~/CLAUDE.md` with your project context
4. Edit `vault/Memory/user_profile.md` with your identity
5. Remove project-specific memory you don't need

## License

MIT
