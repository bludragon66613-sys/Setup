---
name: Session savepoint 2026-03-25g
description: Kaneda Telegram bot fully enabled — groups, DMs, web/browser tools, client-facing persona, Aeon dispatch
type: project
---

Kaneda (@kaneda6bot) configured as a fully capable client-facing Telegram agent.

**Why:** Totoro wants Spike to be his point of contact with clients — taking requests in Telegram groups, executing tasks via Aeon, and using web/browser tools.

**How to apply:** Bot is live. Test by DMing @kaneda6bot or @mentioning in a group. Next action: verify with real Telegram message + get Brave API key for reliable search.

## What was changed

- `~/.openclaw/openclaw.json` — groupPolicy=open, dmPolicy=open, allowFrom=["*"], tools.allow explicit
- `~/.openclaw/workspace/SOUL.md` — Client Groups section: Spike is Totoro's voice in client groups
- `~/.openclaw/workspace/AEON.md` — New file: all 40+ Aeon skills, gh dispatch command, client request flow
- `~/.openclaw/workspace/TOOLS.md` — Rewritten: web search fallback chain, image send, browser, Telegram tips
- `~/.openclaw/workspace/AGENTS.md` — Load AEON.md in client group sessions

## Watch out

- web_search (DuckDuckGo) gets bot-blocked — Spike routes around via direct APIs + browser
- Fix: get Brave Search free API key → `openclaw config set tools.web.search.braveApiKey KEY`
- Security CRITICALs in openclaw status are intentional (open DM + group policy)
- Tools tested via CLI only — real Telegram end-to-end not yet verified
