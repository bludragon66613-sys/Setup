---
name: Session Startup Services
description: At every session start, ensure OpenClaw, Paperclip, and NERV dashboard are all running and healthy before doing any work
type: feedback
originSessionId: 60a70f0a-72c9-4edc-afda-1146df59db7b
---
At every Claude Code session start, bring up all three core services before doing any work. The user loses time when these are down.

**Why:** Services die between sessions (PC restarts, orphaned processes, stale locks). Every session that touches dashboard, companies, or Telegram bot wastes 10+ minutes debugging if these aren't checked first.

**How to apply:** Run the startup check sequence below at session start, silently fix issues, and only report if something can't be auto-fixed.

## Startup Sequence

### 1. OpenClaw (Telegram AI bot gateway)
```bash
bash ~/openclaw-healthcheck.sh
```
- Auto-fixes most issues (zombie processes, duplicate instances, stale locks)
- If auth expired: tell user to run `C:\Users\Rohan\refresh-openclaw-auth.bat` in Windows Terminal

### 2. Paperclip (Agent orchestration platform, port 3100)
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100/api/health
```
- **Always use PM2** — never raw `pnpm dev:server` (causes duplicate spawns)
- If not running: `pm2 restart paperclip --update-env`
- Wait ~8s for embedded PostgreSQL to initialize
- Verify: `curl http://localhost:3100/api/health` returns 200
- Common issue: stale PostgreSQL lock file — Paperclip auto-removes it

### 3. NERV Dashboard (port 5555)
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5555/
```
- If not running: `cd ~/aeon/dashboard && npx next dev --webpack --port 5555 &`
- **MUST use `--webpack` flag** — Turbopack has a Windows-specific PostCSS panic (exit code 0xc0000142)
- Wait ~15s for webpack compilation
- Verify all pages: `/`, `/nerv`, `/intel`, `/companies`
- Companies page requires Paperclip on :3100 (start Paperclip first)

## Process Cleanup (Step 0 in startup-services.sh)
The startup script runs orphan cleanup first, before starting any services:
- **Orphaned claude-mem MCP servers** — new ones spawn per session; old ones linger and waste ~66 MB each
- **Chrome DevTools MCP** — disabled from auto-start (plugin set to `false` in settings.json); killed if found lingering. Use `/chrome-devtools-mcp` skill on-demand only
- **Stale pnpm dev:server** — legacy raw spawns from before PM2 migration; killed to prevent duplicate Paperclip instances

## Common Pitfalls
- **Duplicate Paperclip processes**: Never run `pnpm dev:server` directly — always use PM2 (`pm2 restart paperclip`). Raw pnpm spawns multiple child processes that don't get cleaned up
- **Chrome DevTools MCP**: Disabled from auto-start to save ~398 MB. Enable on-demand via `/connect-chrome` or re-enable in settings.json when needed
- **Orphaned node processes**: `taskkill //F //IM "node.exe"` if ports are occupied but services not responding — but prefer targeted kills over blanket kill
- **Stale lock files**: Dashboard has `.next/` lock, Paperclip has PG lock — both auto-clean but check if startup hangs
- **Port conflicts**: Dashboard=5555, Paperclip=3100, OpenClaw gateway=varies (check healthcheck output)
- **Order matters**: Start Paperclip before Dashboard (companies page depends on :3100)

## Dashboard Dev Mode
- `package.json` script is `"dev": "next dev --webpack"` — webpack mode is permanent, not turbopack
- Production build (`next build`) uses Turbopack and works fine — only dev mode has the Windows panic

## 4. Obsidian Sync (automatic)
- Runs on **SessionStart** and **Stop** hooks via `memory-obsidian-sync.js`
- Also runs in `startup-services.sh`
- Syncs: memory files, Aeon logs, CLAUDE.md, daily note
- Vault: `~/OneDrive/Documents/Agentic knowledge/`
  - `Memory/` — all Claude memory .md files
  - `Aeon Logs/` — daily Aeon activity logs
  - `CLAUDE.md` — master project config
  - `MindMap.md` — auto-generated wikilink index
  - `2026-MM-DD.md` — daily notes with active service links
