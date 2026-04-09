# OpenClaw — Local AI Gateway

> Synced from Claude Code memory — 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_openclaw.md`

---

OpenClaw is a local AI gateway running on Windows, bridging the Telegram bot (@kaneda6bot) to AI models (Anthropic, OpenRouter, Google, OpenAI). It is the infrastructure layer for Rohan's Telegram-based AI interface.

## Role in the Stack

```
Telegram (@kaneda6bot)
        ↓
OpenClaw gateway (:18789)
        ↓
openclaw-proxy sidecar (:5557)
        ↓
NERV dashboard (:5555)
```

The proxy also bridges dashboard → OpenClaw hooks API, enabling the [[nerv-autonomous-agent]] interface to dispatch through OpenClaw.

## Current Model Routing (as of 2026-04-03)

```
Primary:   anthropic/claude-sonnet-4-6
Fallback 1: openrouter/qwen/qwen3.6-plus:free
Fallback 2: openai-codex/gpt-5.4-mini
Fallback 3: google/gemini-2.5-flash
Fallback 4: google/gemini-2.5-flash-lite
```

## Auth Status

| Provider | Auth Type | Status |
|---------|-----------|--------|
| Anthropic | Static token (sk-ant-oat01-) | Active — refreshes periodically |
| Google | Static API key (AI Studio) | Active, no expiry |
| OpenRouter | Static API key | Active (free tier) |
| openai-codex | OAuth | EXPIRED — needs re-login |

**Token refresh:** Run `C:\Users\Rohan\refresh-openclaw-auth.bat` in Windows Terminal (not Claude Code).

## Security Configuration

- **Telegram DMs:** Pairing mode (requires pairing code)
- **Telegram groups:** Disabled
- **Tools:** `group:web`, `group:ui`, `image` only — filesystem and runtime access removed
- **Audit:** 0 critical, 1 warn, 2 info

## Health Check

```bash
bash ~/openclaw-healthcheck.sh   # checks + auto-fixes
openclaw status                  # manual check
openclaw models status           # verify model connectivity
```

## Key Config Files

| Path | Purpose |
|------|---------|
| `~/.openclaw/openclaw.json` | Model, fallbacks, Telegram token, gateway config |
| `~/.openclaw/agents/main/agent/auth-profiles.json` | Stored OAuth/API tokens |
| `~/aeon/dashboard/openclaw-proxy/index.js` | Proxy sidecar |
| `~/openclaw-healthcheck.sh` | Automated health check |

## Planned: VPS Migration

Move from local Windows to Linux VPS ($4-6/mo) for 24/7 uptime:
- Replace OAuth tokens with static API keys
- Run as systemd service
- Rewrite healthcheck for Linux
- Update NERV proxy to point at VPS

**Why it matters:** When OpenClaw's auth breaks, the Telegram bot silently fails.

## In SIGNAL Brand Architecture

In [[signal-consultancy]]: OpenClaw = AI gateway infrastructure sub-brand. It represents the raw connectivity layer that SIGNAL delivers to clients.

## Related

- [[nerv-autonomous-agent]] — NERV dashboard communicates through openclaw-proxy
- [[signal-consultancy]] — OpenClaw as named infrastructure component of the consultancy brand
- [[omc-orchestration]] — OMC and OpenClaw are parallel AI-access layers (OMC for Claude Code, OpenClaw for Telegram)
