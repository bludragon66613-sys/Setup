---
name: browser-harness (Windows-patched)
description: browser-use/browser-harness installed locally with Windows-native TCP-loopback port to replace AF_UNIX sockets. Global `browser-harness` CLI attaches to user's real Chrome via CDP.
type: project
originSessionId: a733168d-22b9-48f2-8086-2a31c37426d1
---
# browser-harness (Windows port)

**Installed**: 2026-04-19. Clone at `~/Developer/browser-harness`. Global command `browser-harness` via `uv tool install -e .` (editable — edits to helpers.py take effect immediately).

**Why**: Self-healing CDP browser harness (~592 LOC Python). Attaches to user's already-running Chrome, reuses logged-in sessions (GitHub, X, LinkedIn, drip.markets). Complements gstack `/browse` (stateless Playwright) — use harness when session auth is required.

**Windows patches applied** (not upstream — fork risk on `git pull`):
1. `socket.AF_UNIX` unavailable on Windows Python builds → replaced with TCP `127.0.0.1:ephemeral` IPC. Daemon binds port 0, writes chosen port to `%TEMP%/bu-<NAME>.port`; clients read file, connect.
2. `/tmp/` hardcoded → `tempfile.gettempdir()`.
3. `run.py` reconfigures stdout/stderr to UTF-8 so Windows CP1252 doesn't choke on the 🟢 tab-marker glyph.

**Files touched**: `helpers.py`, `daemon.py`, `admin.py`, `run.py`. Docs (`SKILL.md`, `interaction-skills/connection.md`) still reference `/tmp/bu-*.sock` — cosmetic only.

**Registered with Claude Code**: `@~/Developer/browser-harness/SKILL.md` imported at bottom of `~/.claude/CLAUDE.md`.

**Chrome first-connect**: Remote-debugging per-profile checkbox at `chrome://inspect/#remote-debugging` was ticked 2026-04-19 on default profile. Sticky — no re-ticking needed unless the profile is reset.

**Not done yet**:
- Upstream PR for Windows TCP fallback (patch is surgical, good candidate).
- Aeon remote-daemon wrapper (`~/aeon/skills/browser-task/`) — Aeon runs on GitHub Actions, needs `BROWSER_USE_API_KEY` + `start_remote_daemon()` path, not local Chrome attach.
- Domain skills for Hyperliquid / DexScreener / drip.markets.

**When to use**:
- Logged-in scrapes (Twitter, LinkedIn, GitHub)
- drip.markets creator-account QA
- Anything where `/browse` hits an auth wall

**Typical invocation**:
```bash
browser-harness <<'PY'
new_tab("https://example.com")
wait_for_load()
print(page_info())
screenshot("/tmp/shot.png")
PY
```
