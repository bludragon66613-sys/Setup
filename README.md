# Claude Code Setup

Complete Claude Code environment backup. 77 agents, 280+ skills, 16 hooks, 65 rules, 3-layer memory system, Obsidian knowledge vault.

## Platform Support

| Platform | Status | Notes |
|---|---|---|
| **Windows** (Git Bash) | fully supported | canonical environment — most tested |
| **macOS** | supported with 3 quirks | see [macOS Installation](#macos-installation) below |
| **Linux** | untested but likely works | same shape as macOS, no OneDrive path, use `xdg-open` in lieu of `open` |

## Quick Start — Windows (Git Bash)

```bash
git clone https://github.com/bludragon66613-sys/Setup.git
cd Setup
bash restore.sh
```

## Quick Start — macOS

```bash
# Prerequisites (one-time)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"   # Homebrew
brew install node gh git
npm install -g @anthropic-ai/claude-code

# Clone + restore
git clone https://github.com/bludragon66613-sys/Setup.git
cd Setup
bash restore.sh
```

The restore script auto-detects macOS via `$OSTYPE` and:
- Writes memory to `~/.claude/projects/Users-$USER/memory/` (Windows uses `C--Users-$USER`)
- Skips copying Windows-only scripts (`.bat`, `.ps1`) to `~/`
- Warns if `startup-services.sh` uses PowerShell (you'll need a Mac rewrite — see below)

## macOS Installation

### 1. Install prerequisites via Homebrew

```bash
brew install node gh git
npm install -g @anthropic-ai/claude-code
```

Verify:
```bash
node --version     # v20+
gh --version       # 2.x
claude --version   # 2.x
```

### 2. Run restore

```bash
git clone https://github.com/bludragon66613-sys/Setup.git
cd Setup
bash restore.sh
```

### 3. Post-restore — macOS-specific steps

#### Obsidian vault path

On Windows, the vault lives at `~/OneDrive/Documents/Agentic knowledge/`. On macOS, OneDrive (if used) typically mounts at `~/Library/CloudStorage/OneDrive-Personal/Documents/Agentic knowledge/`. After restore:

```bash
# Create or link the vault path where Memory hooks expect it
VAULT_SRC="$HOME/Library/CloudStorage/OneDrive-Personal/Documents/Agentic knowledge"
VAULT_DST="$HOME/OneDrive/Documents/Agentic knowledge"

# Option A — symlink so scripts using the Windows-style path just work
mkdir -p "$HOME/OneDrive/Documents"
ln -s "$VAULT_SRC" "$VAULT_DST"

# Option B — update hooks to use the macOS path
# grep -rl "OneDrive/Documents/Agentic knowledge" ~/.claude/hooks | \
#   xargs sed -i '' 's|OneDrive/Documents/Agentic knowledge|Library/CloudStorage/OneDrive-Personal/Documents/Agentic knowledge|g'
```

If you don't use OneDrive, point the vault at any local folder you prefer (e.g. `~/Documents/AgenticKnowledge`). Update `memory-obsidian-sync.js` accordingly, or set `VAULT_PATH=...` as an env var if the hook supports it.

#### PowerShell-dependent scripts

Two scripts in `Setup/scripts/` are Windows-only and will NOT be copied to `~/` on macOS:

- `dedup-claude-mem-mcp.ps1` — kills duplicate claude-mem MCP processes. On Mac, use `pkill -f claude-mem` instead.
- `refresh-openclaw-auth.bat` — refreshes OpenClaw's Anthropic auth. On Mac, run `openclaw auth refresh` from Terminal (if OpenClaw is installed — see project_openclaw memory entry).

The SessionStart hook in `config/settings.json` references `dedup-claude-mem-mcp.ps1`. On macOS, either disable that hook entry or replace it with a Mac equivalent:

```bash
# Disable the PowerShell hook (safe — claude-mem MCP usually deduplicates itself)
# Edit ~/.claude/settings.json and remove the entry whose command contains "powershell.exe"
```

`startup-services.sh` in `scripts/` uses PowerShell throughout for process cleanup. On Mac you'll need to either:
- Rewrite the PowerShell `Get-CimInstance`/`Stop-Process` blocks as `pkill`/`launchctl` equivalents, or
- Skip that script and start services (OpenClaw, Paperclip, Dashboard) manually

#### Shell configuration

macOS defaults to zsh. The restore script writes scripts to `~/` and they're invoked via `bash script.sh` — this works on both shells because we explicitly invoke bash. If you want the scripts on your PATH, add to `~/.zshrc`:

```bash
export PATH="$HOME:$PATH"
```

#### Plugin install flow (same on both platforms)

After restore, run `claude` once and execute:

```
/configure-ecc
/gsd:update
/plugin marketplace add agenticnotetaking/arscontexta
/plugin install arscontexta@agenticnotetaking
```

Then restart Claude Code and run `/arscontexta:setup`.

## macOS gotchas

- **`npm install -g` permission errors** — if you installed Node via the official installer (not Homebrew), global installs need `sudo`. Prefer `brew install node` to avoid this.
- **Apple Silicon (M1/M2/M3) vs Intel** — Homebrew lives at `/opt/homebrew` on Apple Silicon and `/usr/local` on Intel. Scripts that hardcode one path will break on the other. All Setup scripts use `command -v` to locate binaries, so both work.
- **OneDrive sync lag** — macOS OneDrive sometimes delays file writes. If the Obsidian sync hook fires faster than OneDrive syncs, you may see "file not found" warnings. Harmless, retry on next session.
- **PostgreSQL via Homebrew** — Paperclip ships an embedded Postgres, so `brew services start postgresql` is not required. Do NOT install Postgres separately on macOS unless you want to override the embedded DB.
- **Git credential helper** — if `git push` prompts for credentials, run `gh auth setup-git` to route git through the `gh` CLI's OAuth token.

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
