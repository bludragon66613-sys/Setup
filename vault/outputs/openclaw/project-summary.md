# OpenClaw — Project Summary

> Last synced: 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_openclaw.md`

---

## Overview

OpenClaw is a local AI gateway that connects the Telegram bot (@kaneda6bot) to AI models. It runs locally on Windows and bridges dashboard requests via a proxy sidecar.

## Services

| Service | Port | Start Command |
|---------|------|---------------|
| OpenClaw gateway | :18789 | Auto (Windows Scheduled Task / login item) |
| openclaw-proxy | :5557 | `./aeon` script or `node ~/aeon/dashboard/openclaw-proxy/index.js` |
| NERV dashboard | :5555 | `./aeon` from `~/aeon` |

**Quick health check:** `bash ~/openclaw-healthcheck.sh` (checks everything + auto-fixes)
**Manual check:** `openclaw status` then `openclaw models status`

## Current Auth State (as of 2026-04-03)

- **Primary model:** `anthropic/claude-sonnet-4-6`
- **Fallback chain:** `openrouter/qwen/qwen3.6-plus:free` → `openai-codex/gpt-5.4-mini` → `google/gemini-2.5-flash` → `google/gemini-2.5-flash-lite`
- **Auth status:** `openai-codex:default` OAuth EXPIRED — needs re-login
- **Anthropic:** Two static tokens (`anthropic:claude` and `anthropic:default`) in auth-profiles.json
- **Google:** `google:aistudio` static API key (free tier, no expiry)
- **OpenRouter:** `openrouter:manual` static API key (free tier, added 2026-04-03)
- **Memory search:** Disabled (no embedding provider configured)

## Config Paths

| Path | Purpose |
|------|---------|
| `~/.openclaw/openclaw.json` | Model, fallbacks, Telegram token, gateway config |
| `~/.openclaw/agents/main/agent/auth-profiles.json` | Stored OAuth/API tokens |
| `~/aeon/dashboard/openclaw-proxy/index.js` | Proxy sidecar bridging dashboard → OpenClaw hooks API |
| `~/openclaw-healthcheck.sh` | Automated health check script |

## Security Hardening (applied 2026-03-27)

- **Telegram DMs:** `pairing` mode (requires pairing code, not open to anyone)
- **Telegram groups:** `disabled`
- **Tools restricted:** `group:web`, `group:ui`, `image` only (removed `group:fs`, `group:runtime`, `group:sessions`, `subagents`)
- **Security audit:** 0 critical, 1 warn (trusted proxies — N/A for local-only), 2 info

## Known Conflict Sources (all resolved)

1. **Claude Code telegram plugin** — DISABLED in `~/.claude/settings.json`
2. **GitHub Actions "Messages" workflow** — DISABLED
3. **Phantom auth profiles** — Removed from openclaw.json

## Token Refresh — Restore Claude

The `sk-ant-oat01-` token expires periodically. Requires Windows Terminal (not Claude Code):

```
1. Open Windows Terminal
2. Run: C:\Users\Rohan\refresh-openclaw-auth.bat
   - Step 1: claude setup-token → copy the sk-ant-oat01-... token
   - Step 2: openclaw models auth paste-token --provider anthropic → paste
3. openclaw models set anthropic/claude-sonnet-4-6
4. openclaw gateway restart
```

## VPS Migration (planned, not started)

- Migrate from local Windows to cheap Linux VPS ($4-6/mo) for 24/7 uptime
- Replace all OAuth/CLI tokens with static API keys
- Run as systemd service with auto-restart
- Rewrite healthcheck for Linux
- Update NERV dashboard proxy to point at VPS IP
- Full migration plan discussed in session 2026-04-03

## Related Projects

- [[nerv-autonomous-agent]] — NERV dashboard and OpenClaw-proxy integration
- [[signal-consultancy]] — OpenClaw as AI gateway infrastructure for SIGNAL brand
