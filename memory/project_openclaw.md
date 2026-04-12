---
name: project-openclaw
description: OpenClaw local AI gateway — config, auth, Telegram bot setup, startup procedure, token refresh
type: project
originSessionId: d02bea36-f4a6-455f-bc2d-de9530d03cb5
---
## OpenClaw — Local AI Gateway for Telegram Bot

OpenClaw runs locally and connects the Telegram bot (@kaneda6bot) to AI models.

| Service | Port | Start command |
|---------|------|---------------|
| OpenClaw gateway | :18789 | auto (Windows Scheduled Task / login item) |
| openclaw-proxy | :5557 | `./aeon` script or `node ~/aeon/dashboard/openclaw-proxy/index.js` |
| NERV dashboard | :5555 | `./aeon` from `~/aeon` |

**Quick health check:** `bash ~/openclaw-healthcheck.sh` (checks everything + auto-fixes)
**Manual check:** `openclaw status` then `openclaw models status`

## Current Auth State (as of 2026-04-12 ~11:00 IST)
- **Primary:** `ollama/qwen3.5:397b-cloud` (262k ctx, runs via ollama.com cloud backend, free tier)
- **Fallback chain:** `google/gemini-2.5-flash` → `gemini-2.5-flash-lite` → `claude-sonnet-4-6` → `openrouter/google/gemma-4-31b-it:free` → `openai-codex/gpt-5.4-mini`
- **Routing reality:** Gateway uses latency-aware routing — light/quick turns get gemini-2.5-flash-lite; heavy turns get qwen primary. Both verified working.
- **Verified working today:** qwen3.5:397b-cloud returned PONG via gateway agent path at 05:25:51 (api=ollama, provider=ollama, 0 cost)
- **Anthropic auth:** Two static tokens — **BOTH `[disabled:billing 4h]`** as of session start. Auto-resolves or run `refresh-openclaw-auth.bat`.
- **Google auth:** `google:aistudio` + `google:default` (same key `AIzaSyCT...6KH8CRh8`) — active
- **OpenRouter auth:** `openrouter:manual` token `sk-or-v1...5ffae41f` — active
- **OpenAI Codex auth:** `:bludragon66613@gmail.com` OAuth ok, expires in 2d. `:default` in cooldown 11h.
- **Ollama auth:** `ollama:default = token:marker(ollama-local)` — works, baseUrl `http://127.0.0.1:11434`
- **Local ollama models:** qwen3.5:397b-cloud, gemma4:31b (19GB), qwen2.5:1.5b, llama3.2, llama3.1
- **Memory search:** Disabled (no embedding provider)
- **Config:** `~/.openclaw/openclaw.json`
- **Agent providers/models:** `~/.openclaw/agents/main/agent/models.json`
- **Auth profiles:** `~/.openclaw/agents/main/agent/auth-profiles.json`

## Security audit findings (deferred — pre-existing)
- 4 CRITICAL: telegram `groupPolicy=open` + small-model sandbox warnings (gemma-4-31b in fallbacks)
- 2 WARN: untrusted reverse proxy headers, multi-user heuristic
- All pre-existing, not introduced this session

## Security Hardening (applied 2026-03-27)
- **Telegram DMs:** `pairing` mode (requires pairing code, not open to anyone)
- **Telegram groups:** `disabled` (bot cannot be added to any group)
- **Tools:** Restricted to `group:web`, `group:ui`, `image` (removed `group:fs`, `group:runtime`, `group:sessions`, `subagents`)
- **Hooks:** `defaultSessionKey: "hook:ingress"`, `allowedAgentIds: ["main"]`
- **Security audit:** 0 critical, 1 warn (trusted proxies — N/A for local-only), 2 info
- **Skills symlinks:** Replaced 8 broken symlinks in `~/.openclaw/skills/` with real copies (fixes repeated warnings in logs)

## Known Conflict Sources (all resolved as of 2026-03-25)
1. **Claude Code telegram plugin** — DISABLED in `~/.claude/settings.json` (causes 409 if enabled with same bot token)
2. **GitHub Actions "Messages" workflow** — DISABLED (was actively polling Telegram, caused 409)
3. **Phantom auth profiles** — Removed `anthropic:openclaw` and `anthropic:default` from openclaw.json

## Token Refresh — Restore Claude (requires Windows Terminal, not Claude Code)
The `sk-ant-oat01-` token expires periodically. To refresh:
```
1. Open Windows Terminal
2. Run: C:\Users\Rohan\refresh-openclaw-auth.bat
   - Step 1: claude setup-token → copy the sk-ant-oat01-... token
   - Step 2: openclaw models auth paste-token --provider anthropic → paste
3. openclaw models set anthropic/claude-sonnet-4-6
4. openclaw gateway restart
```

## Key config paths
- `~/.openclaw/openclaw.json` — model, fallbacks, Telegram token, gateway config
- `~/.openclaw/agents/main/agent/auth-profiles.json` — stored OAuth/API tokens
- `~/aeon/dashboard/openclaw-proxy/index.js` — proxy sidecar bridging dashboard → OpenClaw hooks API
- `~/openclaw-healthcheck.sh` — automated health check script

## TODO: VPS Migration (planned, not started)
- Migrate OpenClaw from local Windows to a cheap Linux VPS ($4-6/mo) for 24/7 uptime
- Replace all OAuth/CLI tokens with static API keys (Anthropic console key, OpenAI platform key, Google already static)
- Run as systemd service with auto-restart
- Rewrite healthcheck for Linux (no more PowerShell/zombie cmd.exe issues)
- Update NERV dashboard proxy to point at VPS IP or use SSH tunnel
- Full migration plan discussed in session 2026-04-03

**Why:** OpenClaw is the bridge for the Telegram AI bot. When its auth breaks, the bot silently fails.
**How to apply:** If user reports Telegram bot not responding, run `bash ~/openclaw-healthcheck.sh` first.
