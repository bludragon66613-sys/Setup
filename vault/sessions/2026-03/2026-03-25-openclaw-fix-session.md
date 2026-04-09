# Session: 2026-03-25

**Started:** ~11:19 AM IST
**Last Updated:** 11:42 AM IST
**Project:** OpenClaw (local AI gateway) — `~/.openclaw/`
**Topic:** Diagnosing and fixing OpenClaw gateway crash + Telegram 409 conflict storm

---

## What We Are Building

This was a diagnostic/repair session, not a build. OpenClaw is the local AI gateway that powers the Kaneda Telegram bot (`@kaneda6bot`). It runs as a Windows Startup login item on Rohan's machine and connects Claude Code / Codex to Telegram.

The session started because the claw terminal was "going bonkers" — flooding with errors. Two distinct problems were found and fixed:

1. **Gateway not auto-starting on boot** — the startup script pointed to the old entrypoint (`dist/entry.js`) after a recent update to `2026.3.23-2`. The correct entrypoint is `dist/index.js`. This caused the gateway to silently fail on login, requiring manual restart each time.

2. **Telegram 409 conflict storm** — two consumers were simultaneously calling `getUpdates` on the same Kaneda bot token: (a) OpenClaw gateway, and (b) the Claude Code official `telegram` plugin (running as a bun MCP server). Telegram only allows one `getUpdates` consumer per token, so both kept getting 409d and retrying endlessly.

---

## What WORKED (with evidence)

- **Gateway stale entrypoint fixed** — confirmed by: `openclaw doctor` no longer shows "Gateway service config" section after `openclaw gateway install --force`
- **Gateway running and reachable** — confirmed by: `openclaw gateway probe` returns `Connect: ok (39ms) · RPC: ok`; gateway PID 448052 bound to `ws://127.0.0.1:18789`
- **Telegram 409 errors stopped** — confirmed by: last 409 in logs at `11:37:46`; subsequent log checks showed no new 409 entries
- **Telegram plugin disabled** — confirmed by: `~/.claude/settings.json` line 26 set to `"telegram@claude-plugins-official": false`; MCP server system reminder confirms "plugin:telegram:telegram disconnected"
- **All zombie gateway shells killed** — confirmed by: no `cmd.exe /d /s /c *gateway*` processes in process list after cleanup; schtasks loop warnings stopped appearing in logs
- **PM2 processes healthy** — confirmed by: `pm2 list` shows both `nerv-dashboard` (online, :5555) and `openclaw-proxy` (online, forwarding to :18789)

---

## What Did NOT Work (and why)

- **`openclaw doctor --fix`** — did not apply the stale entrypoint fix automatically. The doctor detected the issue but the `--fix` flag made no change. Manual `openclaw gateway install --force` was required.
- **Killing parent process (PID 429136) stopping the bun telegram plugin** — failed because: killing the parent didn't kill the child (bun server.ts, PID 429848); had to kill each pid separately. Also the plugin kept respawning because Claude Code's plugin system auto-restarts registered MCP servers. The only permanent fix was disabling it in settings.json.

---

## What Has NOT Been Tried Yet

- **Verify Kaneda responds to messages end-to-end** — haven't sent a test message to Kaneda on Telegram to confirm the full pipeline (receive → OpenClaw → Claude → notify reply) works post-fix.
- **Re-enable telegram plugin with a different token** — the Claude Code telegram plugin could coexist with OpenClaw if configured with a *different* bot token (a dedicated Claude Code bot). Not needed right now, but an option if Telegram MCP tools are wanted in Claude Code sessions again.

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/.claude/settings.json` | ✅ Modified | Line 26: `"telegram@claude-plugins-official": false` |
| `~/.openclaw/gateway.cmd` | ✅ Fixed | Now points to `dist/index.js` (was `dist/entry.js`) |
| `~/.claude/channels/telegram/.env` | ✅ Unchanged | Kaneda token: `8573892946:AAFzDV6e...LD4` |

No application code was modified. All fixes were config/process-level.

---

## Decisions Made

- **Disable telegram plugin, not reconfigure it** — reason: OpenClaw already handles all Telegram routing for Kaneda. The Claude Code plugin was redundant and conflicted. No reason to keep it active unless a second dedicated bot token is set up.
- **Keep OpenClaw as the sole Telegram consumer** — reason: it's the full gateway (Kaneda persona, skills, Aeon routing). The Claude Code plugin only provides basic MCP tools (reply, react, edit_message) and doesn't integrate with the OpenClaw agent stack.

---

## Blockers & Open Questions

- **Why did two gateway node instances exist simultaneously?** — Our `gateway start` + `install --force` + `restart` sequence spawned a second full node process (PID 451192). The gateway's schtasks check catches this and warns, but the process persisted. May want to add a `--force` kill-existing step to the startup sequence in future.
- **The `gateway already running under schtasks` warning loop** — came from the zombie `cmd.exe` shells retrying every ~10s. Root cause: `openclaw gateway start/restart` spawns a `cmd.exe /d /s /c gateway.cmd` wrapper that loops on failure. Multiple invocations = multiple loops. No built-in cleanup. Manually killed with `taskkill`. No permanent fix needed unless this happens again.

---

## Exact Next Step

Send a test message to `@kaneda6bot` on Telegram and verify it responds normally. This confirms the full pipeline is healthy post-fix:
- OpenClaw receives via `getUpdates` (no 409)
- Routes to main agent session
- Claude processes and responds via `./notify`

If it doesn't respond, run `openclaw channels logs` to see where it's getting stuck.

---

## Environment & Setup Notes

- **OpenClaw gateway**: auto-starts via `C:\Users\Rohan\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\OpenClaw Gateway.cmd` → `~/.openclaw/gateway.cmd`
- **If gateway is down**: run `openclaw gateway start` (one time only — don't repeat or you'll get zombie shells again)
- **Active model**: `claude-sonnet-4-6` (Anthropic token valid; openai-codex OAuth has ~4 days left before reset)
- **PM2 services**: `pm2 list` → `nerv-dashboard` (:5555) + `openclaw-proxy` (:5557 → :18789)
- **Telegram plugin**: disabled in `~/.claude/settings.json`. Re-enable only if assigning a separate bot token to avoid 409 conflicts.
