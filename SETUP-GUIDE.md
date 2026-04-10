# Setup Guide — Fork to a New Machine

> Works on **macOS** and **Windows**. Tested April 2026.
> Keeps both machines running independently with shared config via GitHub.

## Prerequisites

Install these before running restore:

| Tool | macOS | Windows |
|------|-------|---------|
| **Node.js 24 LTS** | `brew install node` | [nodejs.org](https://nodejs.org) |
| **pnpm** | `npm i -g pnpm` | `npm i -g pnpm` |
| **GitHub CLI** | `brew install gh` then `gh auth login` | `winget install GitHub.cli` then `gh auth login` |
| **Claude Code** | `npm i -g @anthropic-ai/claude-code` | `npm i -g @anthropic-ai/claude-code` |
| **Ollama** | `brew install ollama` | [ollama.com/download](https://ollama.com/download) |
| **PM2** | `npm i -g pm2` | `npm i -g pm2` |
| **Git** | Pre-installed | `winget install Git.Git` |

## Step 1 — Clone and Restore Core

```bash
# Clone the Setup repo
gh repo clone bludragon66613-sys/Setup ~/Setup
cd ~/Setup

# Run the restore script — installs agents, hooks, rules, memory, tools
bash restore.sh
```

This restores:
- 76 agents → `~/.claude/agents/`
- 31 hooks → `~/.claude/hooks/`
- 65 rules → `~/.claude/rules/`
- 39 memory files → `~/.claude/projects/C--Users-$(whoami)/memory/`
- settings.json with all hook wiring
- MCP servers (gitnexus, qmd, memory)
- PM skills (65 from phuryn/pm-skills)
- OMC (oh-my-claudecode multi-agent framework)

## Step 2 — Clone Working Repos

```bash
# Core repos
gh repo clone bludragon66613-sys/NERV_02 ~/aeon
gh repo clone bludragon66613-sys/nerv-dashboard ~/aeon/dashboard
gh repo clone paperclipai/paperclip ~/paperclip
gh repo clone bludragon66613-sys/claudecodemem ~/claudecodemem

# Install dependencies
cd ~/aeon/dashboard && npm install
cd ~/paperclip && pnpm install
```

## Step 3 — Install Plugins (inside Claude Code)

Start Claude Code (`claude`) and run:

```
/gsd:update                                         # Get Shit Done framework
/configure-ecc                                      # Everything Claude Code skills
/plugin marketplace add agenticnotetaking/arscontexta
/plugin install arscontexta@agenticnotetaking
# Restart Claude Code, then:
/arscontexta:setup
```

## Step 4 — Set Up Services

### OpenClaw (Telegram bot gateway)

```bash
npm i -g openclaw

# First-time auth (needs browser — do this once)
openclaw models auth login --provider openai-codex
openclaw models auth login --provider anthropic
openclaw models auth login --provider google

# Set model chain
openclaw models set openrouter/qwen/qwen3.6-plus:free
openclaw models fallbacks add anthropic/claude-sonnet-4-6
openclaw models fallbacks add openai-codex/gpt-5.4-mini
openclaw models fallbacks add google/gemini-2.5-flash
openclaw models fallbacks add google/gemini-2.5-flash-lite
openclaw models fallbacks add openrouter/google/gemma-4-26b-a4b-it

# Start gateway
openclaw gateway start
```

### n8n (workflow automation)

```bash
npm i -g n8n
n8n start &
# Open http://localhost:5678 in browser for first-time setup
# Copy API key → set in ~/.claude/.mcp.json for n8n-mcp
```

### Paperclip (agent platform)

```bash
cd ~/paperclip && pnpm install

# Start with PM2 for auto-restart
# macOS:
pm2 start "$(npm root -g)/pnpm/bin/pnpm.cjs" --name paperclip --cwd ~/paperclip -- dev:server

# Windows:
pm2 start "$(npm root -g)/pnpm/bin/pnpm.cjs" --name paperclip --cwd ~/paperclip -- dev:server

# Save for auto-resurrect
pm2 save
```

### NERV Dashboard

```bash
cd ~/aeon/dashboard
npx next dev --webpack --port 5555
# macOS: turbopack works fine, --webpack flag optional
# Windows: MUST use --webpack (turbopack has Windows bugs)
```

### Ollama (local models)

```bash
ollama pull qwen2.5:1.5b    # Fast, lightweight
ollama pull llama3.2         # General purpose
```

## Step 5 — Set Up Obsidian Vault (Optional)

The knowledge graph layer needs an Obsidian vault:

```bash
# Create vault directory (or point to your OneDrive/iCloud synced folder)
mkdir -p ~/Documents/Agentic\ knowledge/{Memory,raw,wiki,daily,Tasks,sessions}

# Update the vault path in memory-obsidian-sync.js if different from default:
# Default Windows: ~/OneDrive/Documents/Agentic knowledge/
# Default macOS:   ~/Documents/Agentic knowledge/
#
# Edit ~/.claude/hooks/memory-obsidian-sync.js line 7 (VAULT_BASE) if needed

# Index the vault
qmd collection add vault ~/Documents/Agentic\ knowledge
qmd embed
```

## Step 6 — Auto-Start on Boot

### macOS

```bash
# PM2 auto-start (resurrects Paperclip)
pm2 startup
pm2 save

# OpenClaw — create a LaunchAgent
cat > ~/Library/LaunchAgents/com.openclaw.gateway.plist << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openclaw.gateway</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/openclaw</string>
        <string>gateway</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
PLIST
launchctl load ~/Library/LaunchAgents/com.openclaw.gateway.plist
```

### Windows

Already configured:
- `Startup/OpenClaw Gateway.cmd` — starts OpenClaw
- `Startup/PM2 Resurrect.cmd` — resurrects PM2 processes (Paperclip)
- `Startup/Ollama.lnk` — starts Ollama

## Dual-Machine Workflow

Both machines share config via the **Setup** GitHub repo. Here's how to keep them in sync:

### Push changes from either machine

```bash
# After making changes on Machine A (agents, hooks, memory, scripts)
cd ~/Setup

# Sync live state to repo
cp ~/.claude/agents/*.md agents/
cp -r ~/.claude/hooks/* hooks/
cp ~/.claude/settings.json config/
cp ~/CLAUDE.md config/CLAUDE.md
cp ~/.claude/projects/C--Users-$(whoami)/memory/*.md config/

git add -A && git commit -m "chore: sync from $(hostname)" && git push
```

### Pull changes on the other machine

```bash
cd ~/Setup && git pull
bash restore.sh   # Idempotent — safe to re-run
```

### What syncs automatically

| What | Mechanism | Direction |
|------|-----------|-----------|
| Memory → Obsidian vault | `memory-obsidian-sync.js` hook | Local → Vault (session start/stop) |
| Agents/hooks/config → GitHub | Manual `git push` from ~/Setup | Local → GitHub |

### What does NOT sync automatically

| What | Action needed |
|------|---------------|
| OpenClaw auth tokens | Re-auth on each machine (`openclaw models auth login`) |
| n8n workflows | Export/import via n8n UI or API |
| Paperclip company/agent data | SQLite local — recreate or copy `~/paperclip/.data/` |
| Obsidian vault content | Use OneDrive/iCloud/Syncthing to sync the vault folder |
| Git repo clones (aeon, paperclip) | `git pull` on each machine independently |

### macOS-Specific Notes

- **Paths**: `~` resolves to `/Users/rohan` not `/c/Users/Rohan`
- **Shell**: zsh default (bash on Windows). All scripts use `#!/usr/bin/env bash` and work on both
- **Turbopack**: Works fine on macOS — `--webpack` flag not needed for NERV dashboard
- **PM2 startup**: `pm2 startup` works natively on macOS (creates LaunchAgent)
- **Ollama**: Runs as a background service automatically after `brew install`
- **Memory path**: `~/.claude/projects/C--Users-rohan/memory/` (lowercase username on Mac)

## Quick Reference — All Ports

| Service | Port | URL |
|---------|------|-----|
| OpenClaw Gateway | 18789 | http://localhost:18789/health |
| n8n | 5678 | http://localhost:5678 |
| Paperclip | 3100 | http://localhost:3100/api/health |
| NERV Dashboard | 5555 | http://localhost:5555 |
| Ollama | 11434 | http://localhost:11434 |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `restore.sh` fails on permissions | `chmod +x restore.sh` |
| Paperclip crashes on start | `cd ~/paperclip && pnpm install` then `pm2 restart paperclip` |
| OpenClaw auth expired | `openclaw models auth login --provider <name>` |
| MCP servers not connecting | Restart Claude Code — MCP servers init on startup |
| Memory path wrong on Mac | Edit `memory-obsidian-sync.js` VAULT_BASE to Mac path |
| Hooks not firing | Check `~/.claude/settings.json` has hooks array populated |
| GitNexus stale index | `gitnexus analyze ~/aeon` |
| qmd no results | `qmd update && qmd embed` |
