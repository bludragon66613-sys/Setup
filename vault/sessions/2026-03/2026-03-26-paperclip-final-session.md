# Session: 2026-03-26

**Started:** ~11:30pm IST (Mar 25)
**Last Updated:** ~1:10am IST (Mar 26)
**Project:** ~/paperclip + ~/aeon/dashboard
**Topic:** Set up Paperclip AI with 15 companies, integrated into NERV dashboard with working /companies page

---

## What We Are Building

Paperclip AI — an open-source agent orchestration platform that manages teams of AI agents as autonomous "companies" with org charts, budgets, task management, governance, and audit trails. Cloned from github.com/paperclipai/paperclip, built locally, imported all 15 pre-built companies from companies.sh (441 agents total). Integrated into the NERV dashboard by adding a COMPANIES nav button and a /companies page that displays all Paperclip companies with agent rosters via a server-side API proxy.

---

## What WORKED (with evidence)

- **Paperclip clone + install + build** — confirmed by: health endpoint returns `{"status":"ok","version":"0.3.1"}`
- **15 company imports** — confirmed by: `npx paperclipai company list` returns 15 active companies
- **COMPANIES button in NERV header** — confirmed by: Chrome DevTools snapshot shows green COMPANIES button in nav
- **API proxy route `/api/companies`** — confirmed by: `curl http://localhost:5555/api/companies` returns 15 companies; `?path=health` returns Paperclip health
- **Companies page loads in browser** — confirmed by: Chrome DevTools snapshot shows all 15 companies with stats bar (15 companies, 441 agents, 15 active)
- **Company detail panel** — confirmed by: clicked Agency Agents in Chrome DevTools, snapshot shows all 167 agents listed with names, titles, and IDLE status
- **"OPEN IN PAPERCLIP ↗" link** — confirmed by: snapshot shows link to `http://localhost:3100/AGE/dashboard`
- **CSP relaxation for /companies** — confirmed by: `curl -sI localhost:5555/companies` shows no X-Frame-Options or CSP (only X-Content-Type-Options and Referrer-Policy)

---

## What Did NOT Work (and why)

- **`pnpm build` full workspace on Windows** — failed because: server build script uses Unix `cp -R src/onboarding-assets/. dist/onboarding-assets/` syntax. Workaround: manual bash `cp -r`.
- **Superpowers Dev Shop import** — failed because: `API error 422: GitHub company package is missing COMPANY.md`. Broken upstream.
- **Direct browser fetch to localhost:3100** — failed because: NERV's CSP had `connect-src 'self'` blocking cross-origin requests. Fixed with server-side proxy.
- **iframe embedding Paperclip UI** — failed because: NERV's next.config.ts had `X-Frame-Options: DENY` and `frame-ancestors 'none'`. Browser showed "This content is blocked." Abandoned iframe.
- **Relaxing CSP for iframe** — would have required removing security headers globally. Bad tradeoff. Server-side proxy is cleaner.

---

## What Has NOT Been Tried Yet

- Configure Paperclip agent adapters (connect agents to Claude, OpenClaw, Codex for actual execution)
- Set token budgets per company/agent
- Create custom companies tailored to Rohan's workflows
- Wire OpenClaw gateway adapter to connect Telegram bot agents
- Deploy Paperclip to cloud hosting
- Run agent heartbeats (trigger agents to wake and work)
- Commit the NERV dashboard changes to git

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/paperclip/` | ✅ Complete | Cloned, installed, built, running on :3100 |
| `~/aeon/dashboard/app/page.tsx` | ✅ Complete | Added green COMPANIES button to header nav |
| `~/aeon/dashboard/app/companies/page.tsx` | ✅ Complete | NERV-styled page: header breadcrumb, stats bar, company card grid, agent detail panel |
| `~/aeon/dashboard/app/api/companies/route.ts` | ✅ Complete | Server-side proxy to Paperclip API (no auth, supports ?path= for sub-routes) |
| `~/aeon/dashboard/next.config.ts` | ✅ Complete | Relaxed CSP for /companies, added localhost:3100 to connect-src, added Vite asset rewrites |
| `~/.claude/projects/C--Users-Rohan/memory/project_paperclip.md` | ✅ Complete | Memory file for Paperclip project |
| `~/.claude/projects/C--Users-Rohan/memory/MEMORY.md` | ✅ Complete | Updated index with paperclip entry |

---

## Decisions Made

- **Server-side proxy over iframe** — reason: NERV's CSP blocks iframes (`X-Frame-Options: DENY`, `frame-ancestors 'none'`). Proxy at `/api/companies` forwards to Paperclip server-side, no CORS/CSP issues.
- **No auth on proxy route** — reason: Paperclip runs in `local_trusted` mode. Proxy only accessible from localhost.
- **Separate CSP rules for /companies vs rest** — reason: /companies needs relaxed headers (no frame restrictions), while all other NERV pages keep strict security policy.
- **"FULL UI ↗" opens Paperclip in new tab** — reason: some features (org charts, task management, governance) need the full Paperclip UI. The NERV /companies page is an overview/launcher.
- **Embedded PostgreSQL** — reason: zero-config for local dev, auto-created at ~/.paperclip/instances/default/db.

---

## Blockers & Open Questions

- No active blockers. Everything is working.
- Future consideration: changes to NERV dashboard (page.tsx, next.config.ts, new files) should be committed to git and pushed.

---

## Exact Next Step

All issues are resolved. Next logical steps when resuming:
1. Commit NERV dashboard changes (`git add` the new companies page, api route, and config changes)
2. Configure agent adapters in Paperclip to connect agents to Claude/OpenClaw for actual execution
3. Or explore the Paperclip full UI at http://localhost:3100 to manage companies

---

## Environment & Setup Notes

```bash
# Start Paperclip (required for /companies page)
cd ~/paperclip && pnpm dev
# → http://localhost:3100

# Start NERV dashboard
cd ~/aeon/dashboard && ./aeon
# → http://localhost:5555

# Companies page
http://localhost:5555/companies

# Paperclip Windows build workaround
cd ~/paperclip/server && npx tsc && mkdir -p dist/onboarding-assets && cp -r src/onboarding-assets/* dist/onboarding-assets/

# Data locations
~/.paperclip/instances/default/db      # PostgreSQL (port 54329)
~/.paperclip/instances/default/secrets/ # master.key
```

### Imported Companies (15, sorted by agent count)
Agency Agents (167), K-Dense Science Lab (54), Fullstack Forge (49), Donchitos Game Studio (49), Product Compass Consulting (48), Trail of Bits Security (28), ClawTeam Capital (7), TACHES Creative (6), ClawTeam Engineering (5), GStack (5), RedOak Review (5), AgentSys Engineering (5), MiniMax Studio (5), ClawTeam Research Lab (4), Aeon Intelligence (4)
