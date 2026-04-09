# Session: 2026-03-26

**Started:** ~11:30pm IST (Mar 25)
**Last Updated:** ~12:45am IST (Mar 26)
**Project:** ~/paperclip + ~/aeon/dashboard
**Topic:** Set up Paperclip AI, imported 15 companies, added Companies page to NERV dashboard

---

## What We Are Building

Paperclip AI — an open-source agent orchestration platform that manages teams of AI agents as autonomous "companies." Cloned from github.com/paperclipai/paperclip, built locally, and imported all 15 pre-built companies from companies.sh (440+ agents total). Then integrated it into the NERV dashboard at ~/aeon/dashboard by adding a "COMPANIES" nav button and a /companies page that shows all Paperclip companies with agent rosters via a server-side API proxy.

---

## What WORKED (with evidence)

- **Paperclip clone + install** — confirmed by: `pnpm install` completed, all deps resolved
- **Paperclip build** — confirmed by: shared/db/adapter-utils/ui all built successfully; server needed manual build on Windows
- **Paperclip dev server** — confirmed by: `curl http://localhost:3100/api/health` returns `{"status":"ok","version":"0.3.1"}`
- **Embedded PostgreSQL** — confirmed by: auto-created at ~/.paperclip/instances/default/db, 45 migrations applied
- **All 15 company imports** — confirmed by: `npx paperclipai company list` returns 15 active companies
- **NERV dashboard COMPANIES button** — confirmed by: visible in header nav at http://localhost:5555
- **API proxy route** — confirmed by: `curl http://localhost:5555/api/companies` returns 15 companies; `curl http://localhost:5555/api/companies?path=health` returns Paperclip health
- **Companies page renders** — confirmed by: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5555/companies` returns 200
- **CSP relaxed for /companies** — confirmed by: next.config.ts updated with separate header rules

---

## What Did NOT Work (and why)

- **`pnpm build` (full workspace on Windows)** — failed because: server build script uses `cp -R src/onboarding-assets/. dist/onboarding-assets/` which is Unix-only syntax. Workaround: build server manually with bash `cp -r`.
- **Superpowers Dev Shop import** — failed because: `API error 422: GitHub company package is missing COMPANY.md`. Broken upstream.
- **`npx companies.sh` CLI** — produced no output on Windows. Used `npx paperclipai company import` instead.
- **Direct browser fetch to localhost:3100 from NERV page** — failed because: NERV's CSP has `connect-src 'self'` which blocks cross-origin requests. Fixed with server-side proxy.
- **iframe embedding Paperclip** — failed because: NERV's next.config.ts had `X-Frame-Options: DENY` and `frame-ancestors 'none'` in CSP. Browser showed "This content is blocked." Abandoned iframe approach entirely.

---

## What Has NOT Been Tried Yet

- Verify the /companies page actually renders companies in the browser (proxy works server-side, but user may still see issues with the client-side fetch if auth token is needed)
- Configure Paperclip agent adapters (connect agents to Claude, OpenClaw, etc. for actual execution)
- Set token budgets per company/agent
- Create custom Paperclip companies
- Wire OpenClaw gateway adapter
- Deploy Paperclip to cloud hosting
- Run agent heartbeats

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/paperclip/` | ✅ Complete | Cloned, installed, built, running on :3100 |
| `~/aeon/dashboard/app/page.tsx` | ✅ Complete | Added green COMPANIES button to header nav |
| `~/aeon/dashboard/app/companies/page.tsx` | 🔄 In Progress | NERV-styled page with company grid + agent detail panel. Fetches via proxy. May need auth token fix. |
| `~/aeon/dashboard/app/api/companies/route.ts` | ✅ Complete | Proxy to Paperclip API. No auth required (Paperclip is local_trusted). |
| `~/aeon/dashboard/next.config.ts` | ✅ Complete | Added rewrites for Vite assets, relaxed CSP for /companies, added localhost:3100 to connect-src |
| `~/.claude/projects/C--Users-Rohan/memory/project_paperclip.md` | ✅ Complete | Memory file for Paperclip project |
| `~/.claude/projects/C--Users-Rohan/memory/MEMORY.md` | ✅ Complete | Updated index |

---

## Decisions Made

- **Server-side proxy over iframe** — reason: NERV's CSP blocks iframes and cross-origin fetches. Proxy route at /api/companies forwards to Paperclip API server-side, avoiding all CORS/CSP issues.
- **No auth on proxy route** — reason: Paperclip runs in local_trusted mode (no auth needed), and the proxy is only accessible from localhost.
- **Separate CSP for /companies** — reason: /companies needs relaxed CSP (no frame restrictions, connect to localhost:3100), while all other NERV pages keep strict security.
- **"FULL UI ↗" opens Paperclip directly** — reason: some Paperclip features (org charts, task management, governance) need the full Paperclip UI. The NERV /companies page is an overview/launcher.
- **Embedded PostgreSQL** — reason: zero-config for local dev. No external DB setup needed.

---

## Blockers & Open Questions

- The /companies page fetches via `/api/companies` proxy without auth. If the NERV proxy route needs a JWT token (like other NERV API routes), the client-side fetch may fail with 401. Current implementation removed auth requirement, but this should be verified in browser.
- User mentioned "still isn't working" after iframe fix — the final proxy-based version was deployed but user hasn't confirmed it works in browser yet.
- Paperclip Vite rewrites in next.config.ts are set up but untested (only needed if embedding Paperclip UI directly, which we abandoned).

---

## Exact Next Step

Open http://localhost:5555/companies in browser and verify companies load. If the page shows "PAPERCLIP OFFLINE" despite Paperclip running, check browser DevTools Network tab for 401/502 on `/api/companies?path=health`. If 401, the proxy route needs the auth token — add `apiFetch` import back to the page. If 502, Paperclip server may have stopped — restart with `cd ~/paperclip && pnpm dev`.

---

## Environment & Setup Notes

```bash
# Start Paperclip (must be running for /companies to work)
cd ~/paperclip && pnpm dev
# → http://localhost:3100

# Start NERV dashboard (usually already running)
cd ~/aeon/dashboard && ./aeon
# → http://localhost:5555

# Companies page
http://localhost:5555/companies

# Windows build workaround (server only)
cd ~/paperclip/server && npx tsc && mkdir -p dist/onboarding-assets && cp -r src/onboarding-assets/* dist/onboarding-assets/

# Paperclip data
~/.paperclip/instances/default/db (PostgreSQL, port 54329)
~/.paperclip/instances/default/secrets/master.key
```

### Imported Companies (15)
Aeon Intelligence (4), Agency Agents (167), AgentSys Engineering (5), ClawTeam Capital (7), ClawTeam Engineering (5), ClawTeam Research Lab (4), Donchitos Game Studio (49), Fullstack Forge (49), GStack (5), K-Dense Science Lab (54), MiniMax Studio (5), Product Compass Consulting (48), RedOak Review (5), TACHES Creative (6), Trail of Bits Security (28)
