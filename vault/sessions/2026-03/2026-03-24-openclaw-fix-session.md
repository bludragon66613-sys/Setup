# Session: 2026-03-24

**Started:** ~11:06 PM IST
**Last Updated:** 11:24 PM IST
**Project:** NERV_02 / aeon dashboard (`~/aeon/dashboard`)
**Topic:** Fixing OpenClaw OAuth token expiry + replacing WS proxy with HTTP hooks

---

## What We Are Building

OpenClaw is the local AI assistant daemon (port 18789) used by the NERV dashboard
for "local" agent dispatch (as opposed to GitHub Actions dispatch). The session fixed
two compounding issues that were causing `openclaw logs --follow` to show errors:
1. Expired OAuth token preventing Anthropic model calls
2. openclaw-proxy sidecar spamming WS handshake timeouts due to wrong protocol

The openclaw-proxy (`dashboard/openclaw-proxy/index.js`) is a small Express server
on port 5557 that the Next.js dispatch route calls to trigger local OpenClaw agents.
It previously used a raw WebSocket connection that didn't implement OpenClaw's
challenge-response handshake protocol. Replaced with HTTP `POST /hooks/agent`.

---

## What WORKED (with evidence)

- **OAuth token refresh** — confirmed by: `openclaw models list` shows `Auth: yes` for both models, no more 401 errors in logs
- **Removed broken fallback model** — confirmed by: `openai-codex/codex-mini-latest` no longer appears in `openclaw models list`; `openclaw.json` updated
- **HTTP hooks proxy** — confirmed by: `curl http://localhost:5557/health` returns `{"ok":true,"openclaw":"reachable"}`
- **WS spam stopped** — confirmed by: `openclaw logs` shows no new `handshake timeout` entries after 17:52:44 UTC (the restart point)
- **Hooks config enabled** — confirmed by: `hooks.enabled: true` + `hooks.token` written to `~/.openclaw/openclaw.json`
- **OpenClaw gateway** — confirmed by: `openclaw status` shows Telegram ON/OK, 2 active sessions, gateway running

---

## What Did NOT Work (and why)

- **`openclaw models auth setup-token`** — failed because: requires interactive TTY, cannot be run non-interactively. Worked around by manually copying `claudeAiOauth.accessToken` from `~/.claude/.credentials.json` into `~/.openclaw/agents/main/agent/auth-profiles.json`.
- **`pm2 restart --update-env`** — failed because: PM2 rejects `--env` without an ecosystem config file. Fixed by using `pm2 stop` then `pm2 start` with explicit env vars inline.
- **`openclaw restart`** — failed because: not a valid command. Used `openclaw gateway stop && openclaw gateway start` instead.

---

## What Has NOT Been Tried Yet

- Actually dispatching a `local` job through the dashboard to verify the full HTTP hooks path end-to-end (only `/health` was tested)
- Persisting the new PM2 env vars into an ecosystem config so they survive reboots (`pm2 save` was not run)
- The `nexus-scenario` dispatch path also uses `OPENCLAW_PROXY_URL` — untested with new setup

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/.openclaw/openclaw.json` | ✅ Complete | Added `hooks.enabled: true` + `hooks.token`; removed `openai-codex/codex-mini-latest` fallback |
| `~/.openclaw/agents/main/agent/auth-profiles.json` | ✅ Complete | `anthropic:default` token refreshed from Claude Code credentials; error stats cleared |
| `~/aeon/dashboard/openclaw-proxy/index.js` | ✅ Complete | Rewritten: WebSocket → HTTP `POST /hooks/agent`. No more WS reconnect loop |
| `~/aeon/dashboard/.env.local` | ✅ Complete | Added `OPENCLAW_PROXY_URL`, `OPENCLAW_PROXY_SECRET`, `OPENCLAW_HOOKS_TOKEN` |
| `~/aeon/dashboard/openclaw-proxy/package.json` | ⚠️ Stale | Still lists `ws` as dependency — no longer needed, can remove |

---

## Decisions Made

- **HTTP hooks over WebSocket** — reason: OpenClaw's WS protocol requires cryptographic nonce signing (challenge-response), too complex for a simple sidecar. `POST /hooks/agent` achieves the same result with a single HTTP call + Bearer token.
- **Separate hooks token from gateway token** — reason: OpenClaw docs explicitly say "use a dedicated hook token; do not reuse gateway auth tokens." New random token generated for `hooks.token`.
- **Manual token copy instead of `setup-token`** — reason: `setup-token` needs TTY; direct file manipulation is equivalent and avoids blocking on interactivity.

---

## Blockers & Open Questions

- **Token rotation**: The `claudeAiOauth.accessToken` in `~/.claude/.credentials.json` expires ~March 2027. When it rotates, OpenClaw's `anthropic:default` profile will break again. Either automate the sync or run `openclaw models auth setup-token` manually when that happens.
- **PM2 env persistence**: The new env vars (`OPENCLAW_HOOKS_TOKEN`, `OPENCLAW_URL`) were passed inline at startup. `pm2 save` was not run. A reboot will lose them unless an ecosystem config is created.
- **End-to-end local dispatch untested**: `/health` confirms the proxy can reach OpenClaw, but an actual `POST /dispatch` → `/hooks/agent` → agent run hasn't been verified.

---

## Exact Next Step

Test an actual local dispatch from the NERV dashboard:
1. Open http://localhost:5555/agency
2. Dispatch a simple skill (e.g. `heartbeat`) with `dispatchType: local`
3. Check the job board for status
4. Check `openclaw logs --follow` to confirm `/hooks/agent` was called

If it fails, check: (a) does OpenClaw return an error from the hooks endpoint? (b) is `OPENCLAW_HOOKS_TOKEN` matching `hooks.token` in `openclaw.json`?

---

## Environment & Setup Notes

- OpenClaw gateway: `openclaw gateway start/stop` (Windows login item, auto-starts)
- openclaw-proxy: managed by PM2 as process id 1 (`pm2 restart openclaw-proxy`)
- NERV dashboard: managed by PM2 as process id 0 (`pm2 restart nerv-dashboard`)
- New hooks token: `7b2eb38c72245e55d8cf844eef28352aadba2c6a85d100ae` (stored in `openclaw.json` and `.env.local`)
- Gateway token (for direct API calls): `bedcc591be26fa61290d51e76659d5f1fa81e62fd0dbedc7`
