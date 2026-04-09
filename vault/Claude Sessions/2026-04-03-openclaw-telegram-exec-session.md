# Session: 2026-04-03

**Started:** ~5:27am IST
**Last Updated:** 5:50am IST
**Project:** OpenClaw (Telegram AI Gateway)
**Topic:** Fixing Telegram exec approvals — TUI popup required every time, allow-always not persisting between sessions

---

## What We Are Building

Permanent exec approval configuration for OpenClaw's Telegram channel so that commands sent via the @kaneda6bot Telegram bot execute without requiring manual TUI approval popups each time. The allow-always flag wasn't persisting between gateway sessions on Windows, requiring a config-level fix rather than runtime approvals.

---

## What WORKED (with evidence)

- **`approvals.exec.enabled: true`** — confirmed by: `openclaw config get approvals` returns `{"exec":{"enabled":true,"mode":"targets"}}`
- **`approvals.exec.mode: "targets"`** — confirmed by: config set accepted, gateway restarted
- **`approvals.exec.targets: [{"channel":"telegram","to":"6871336858"}]`** — confirmed by: config validation passed, gateway accepted
- **`channels.telegram.allowFrom: ["6871336858"]`** — confirmed by: config set accepted
- **`channels.telegram.execApprovals: {"enabled":true,"approvers":["6871336858"],"target":"dm"}`** — confirmed by: config set accepted (this was the key missing piece from the docs)
- **`channels.telegram.capabilities: {"inlineButtons":"all"}`** — confirmed by: config set accepted (required for approve/deny buttons in Telegram)
- **`exec-approvals.json` defaults set to `security: "full"`, `ask: "off"`, `askFallback: "full"`** — confirmed by: file edited successfully
- **Wildcard allowlist `*` for agent `*`** — confirmed by: `openclaw approvals get` shows the entry

**NOT YET CONFIRMED**: Whether the full combination actually resolves the Telegram approval flow. The user reported "Failed to submit approval" after the targets config, then we added the full `execApprovals` object with `approvers` + `capabilities.inlineButtons` + `exec-approvals.json` defaults. Gateway was restarted but user hasn't tested the latest config yet.

---

## What Did NOT Work (and why)

- **Writing `gateway.json` directly** — failed because: `gateway.json` is not part of the exec approvals system. It was empty (0 bytes) by design. The real controls are `openclaw.json` (config) + `exec-approvals.json` (allowlist).
- **Wildcard allowlist on Windows** — failed because: "allowlist auto-execution is unavailable on win32; explicit approval is required." Windows doesn't support the allowlist auto-exec path.
- **`approvals.exec.mode: "targets"` alone** — failed because: Telegram wasn't registered as a native approval client. The per-channel `execApprovals` object was missing.
- **`channels.telegram.exec` config key** — failed because: "Unrecognized key" — exec is not a valid key on the channel object. The correct key is `execApprovals`.
- **`channels.telegram.execApprovals: {"enabled": true}` without `approvers`** — failed because: error "chat exec approvals are not enabled on Telegram" still appeared. The `approvers` array is required to explicitly register authorized users.
- **Various invalid config keys tried**: `approvals.exec.channels`, `approvals.exec.approvers`, `approvals.exec.autoApproveFrom`, `approvals.exec.defaultAction`, `approvals.exec.skipAllowlist` — all rejected by schema validation.

---

## What Has NOT Been Tried Yet

- User hasn't tested the latest config (with `execApprovals.approvers`, `capabilities.inlineButtons`, and `exec-approvals.json` defaults all set together)
- If still failing: try `security: "full"` + `ask: "off"` at the per-agent level (`agents.main` in `exec-approvals.json`) instead of just defaults
- If inline buttons don't render: check if bot has inline keyboard permissions in BotFather
- If auto-approve doesn't work: the `/approve <id> allow-always` command in Telegram chat might be needed once to seed the persistent allowlist
- Consider `openclaw update` (2026.4.2 available) — might fix win32 allowlist bug

---

## Current State of Files

| File | Status | Notes |
| --- | --- | --- |
| `~/.openclaw/openclaw.json` | 🔄 In Progress | Full config with exec targets, telegram execApprovals, capabilities — awaiting user test |
| `~/.openclaw/exec-approvals.json` | 🔄 In Progress | Defaults set to security:full, ask:off — awaiting user test |
| `~/.openclaw/gateway.json` | ❌ Dead code | Written early in session but not used by the system — can be deleted |

---

## Decisions Made

- **Config-level fix over TUI allow-always** — reason: TUI allow-always uses hashed command IDs that don't persist across gateway restarts on Windows
- **`approvals.exec.mode: "targets"` over `"session"`** — reason: Windows doesn't support allowlist auto-execution, so approval must route to chat channels
- **`exec-approvals.json` defaults `security: "full"` + `ask: "off"`** — reason: eliminates prompting entirely when combined with proper channel config

---

## Blockers & Open Questions

- User hasn't confirmed whether the latest config works from Telegram
- The `gateway.json` file we created early on is dead code — should be cleaned up (emptied or deleted)
- OpenClaw 2026.4.2 update is available — might contain relevant fixes

---

## Exact Next Step

User needs to test from Telegram. If still failing, check `openclaw logs` immediately after the failed attempt to see the exact error. The three most likely remaining issues are:
1. Bot needs inline keyboard permission in BotFather
2. Need to run `/approve <id> allow-always` once from Telegram to seed the persistent allowlist
3. The `exec-approvals.json` defaults might need to be set per-agent (`agents.main`) not just in `defaults`

---

## Environment & Setup Notes

- OpenClaw 2026.4.1 (update 2026.4.2 available)
- Gateway: ws://127.0.0.1:18789 (local loopback)
- Telegram bot: @kaneda6bot (8573892946)
- Rohan's Telegram user ID: 6871336858
- Config: `~/.openclaw/openclaw.json`
- Exec approvals: `~/.openclaw/exec-approvals.json`
- Restart gateway after config changes: `openclaw gateway restart`

## Key Documentation URLs

- Exec approvals schema: https://docs.openclaw.ai/tools/exec-approvals.md
- Telegram channel config: https://docs.openclaw.ai/channels/telegram.md
- CLI approvals: https://docs.openclaw.ai/cli/approvals
