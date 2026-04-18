---
name: session-savepoint-2026-03-25c
description: OpenClaw auth fixed. Telegram bot restored. Auth switched to openai-codex/gpt-5.4 (valid 8d). Anthropic token expired — refresh batch script created.
type: savepoint
---

## Session: 2026-03-25 (OpenClaw Auth Fix)

### Problem
OpenClaw Anthropic OAuth token (`sk-ant-oat01-...`, profileId `sha256:154a23a3efe6`) expired/revoked.
Both primary (`claude-sonnet-4-6`) and fallback (`claude-haiku-4-5-20251001`) returned HTTP 401.
Telegram bot completely non-functional.

### Fix Applied
Switched OpenClaw default model to `openai-codex/gpt-5.4` which has valid OAuth (expires ~April 5, 2026).
- Primary: `openai-codex/gpt-5.4`
- Fallback: `openai-codex/gpt-5.4-mini`
- Config: `~/.openclaw/openclaw.json`
- Auth file: `~/.openclaw/agents/main/agent/auth-profiles.json`
- Gateway restarted — now running on pid (check `openclaw status`)

### State
- Telegram bot: ONLINE (gpt-5.4)
- OpenClaw gateway: :18789 running
- openclaw-proxy: :5557 running
- Dashboard: :5555 running

### To Restore Claude (when ready)
1. Open Windows Terminal (NOT Claude Code)
2. Run: `C:\Users\Rohan\refresh-openclaw-auth.bat`
   - Runs `claude setup-token` → copy the `sk-ant-oat01-...` token shown
   - Runs `openclaw models auth paste-token --provider anthropic` → paste token
3. Then: `openclaw models set anthropic/claude-sonnet-4-6`
4. Then: `openclaw gateway restart`

### Key Files
- `~/.openclaw/openclaw.json` — model config
- `~/.openclaw/agents/main/agent/auth-profiles.json` — stored tokens
- `C:\Users\Rohan\refresh-openclaw-auth.bat` — token refresh helper
- `~/aeon/dashboard/openclaw-proxy/index.js` — proxy sidecar (:5557)
