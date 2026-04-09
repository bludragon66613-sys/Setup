---
name: openclaw_startup_pitfalls
description: Known pitfalls when restarting OpenClaw gateway — zombie shells, duplicate instances, plugin conflicts
type: feedback
---

Don't run `openclaw gateway start` / `restart` / `install --force` multiple times in sequence.
Each invocation spawns a new `cmd.exe /d /s /c gateway.cmd` wrapper that loops retrying every 10s if the gateway is already running, flooding the terminal indefinitely.

**Why:** gateway.cmd has no built-in deduplication — the loop is in the wrapper shell, not the node process.

**How to apply:**
- Run `openclaw gateway start` exactly once. If it says "already running", don't repeat.
- If zombie shells appear (`gateway already running under schtasks` every 10s), kill them: `powershell -c "Get-WmiObject Win32_Process | Where-Object { \$_.Name -eq 'cmd.exe' -and \$_.CommandLine -like '*gateway.cmd*' } | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force }"`
- If two gateway node instances exist simultaneously, keep the one bound to port 18789 and kill the other.

**Telegram 409 conflict:** The Claude Code official `telegram` plugin (`telegram@claude-plugins-official`) uses the same bot token as OpenClaw. Having both enabled causes perpetual 409. Keep it disabled in `~/.claude/settings.json` unless using a separate bot token.

**Stale entrypoint fix:** After OpenClaw updates, run `openclaw doctor`. If it reports entrypoint mismatch (`entry.js` vs `index.js`), run `openclaw gateway install --force` (doctor --fix does NOT apply this fix automatically).
