# Session: 2026-03-25

**Started:** ~11:30pm IST
**Last Updated:** ~12:15am IST (Mar 26)
**Project:** ~/paperclip (Paperclip AI)
**Topic:** Cloned Paperclip AI, built it, imported all 15 companies from companies.sh

---

## What We Are Building

Paperclip AI — an open-source agent orchestration platform ("company OS" for autonomous AI agents). It manages teams of agents with org charts, token budgets, task management, governance, and audit trails. This is distinct from NERV_02 (single-agent dispatch) — Paperclip manages *teams* of agents with proper organizational structure.

The goal is to have a local Paperclip instance running with all available pre-built companies from companies.sh imported and ready to use.

---

## What WORKED (with evidence)

- **Git clone** — confirmed by: repo at ~/paperclip, all files present
- **pnpm install** — confirmed by: completed in 23.7s, all deps resolved (cosmetic bin warnings only)
- **pnpm build (shared/db/adapter-utils)** — confirmed by: `pnpm --filter=@paperclipai/shared --filter=@paperclipai/db --filter=@paperclipai/adapter-utils build` succeeded
- **Server build (manual)** — confirmed by: `cd server && npx tsc && mkdir -p dist/onboarding-assets && cp -r src/onboarding-assets/* dist/onboarding-assets/` succeeded
- **UI build** — confirmed by: `pnpm --filter=@paperclipai/ui build` completed in 27.24s
- **pnpm dev** — confirmed by: `curl http://localhost:3100/api/health` returns `{"status":"ok","version":"0.3.1","deploymentMode":"local_trusted"}`
- **Embedded PostgreSQL** — confirmed by: auto-created at ~/.paperclip/instances/default/db, 45 migrations applied
- **All 15 company imports** — confirmed by: `npx paperclipai company list` shows all 15 companies active

### Companies imported (all confirmed created):
1. Aeon Intelligence (4 agents, 32 skills)
2. Agency Agents (167 agents)
3. AgentSys Engineering (5 agents, 14 skills)
4. ClawTeam Capital (7 agents, 1 skill)
5. ClawTeam Engineering (5 agents, 1 skill)
6. ClawTeam Research Lab (4 agents, 1 skill)
7. Donchitos Game Studio (49 agents, 38 skills)
8. Fullstack Forge (49 agents, 66 skills)
9. GStack (5 agents, 27 skills)
10. K-Dense Science Lab (54 agents, 177 skills)
11. MiniMax Studio (5 agents, 10 skills)
12. Product Compass Consulting (48 agents, 65 skills)
13. RedOak Review (5 agents, 6 skills)
14. TACHES Creative (6 agents, 35 skills)
15. Trail of Bits Security (28 agents, 35 skills)

---

## What Did NOT Work (and why)

- **`pnpm build` (full workspace)** — failed because: server build script uses `cp -R src/onboarding-assets/. dist/onboarding-assets/` which fails on Windows CMD ("The syntax of the command is incorrect"). Workaround: build server manually with bash-compatible `cp -r`.
- **Superpowers Dev Shop import** — failed because: `API error 422: GitHub company package is missing COMPANY.md`. The company template is incomplete on GitHub (paperclipai/companies repo).
- **`npx companies.sh` CLI** — produced no output on Windows, appears to be a no-op or interactive-only tool. Used `npx paperclipai company import` instead.

---

## What Has NOT Been Tried Yet

- Configure agent adapters (connect agents to Claude, OpenClaw, Codex, etc. for actual execution)
- Set token budgets per company/agent
- Create custom companies
- Wire up OpenClaw gateway adapter to connect existing Telegram bot agents
- Deploy Paperclip to Vercel or cloud hosting
- Run agent heartbeats (trigger agents to wake and work)
- Explore plugin system

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/paperclip/` | ✅ Complete | Cloned from GitHub, all deps installed |
| `~/paperclip/server/dist/` | ✅ Complete | Built manually (Windows workaround) |
| `~/paperclip/ui/dist/` | ✅ Complete | Vite build succeeded |
| `~/.paperclip/instances/default/db` | ✅ Complete | Embedded PostgreSQL, 45 migrations applied |
| `~/.claude/projects/C--Users-Rohan/memory/project_paperclip.md` | ✅ Complete | Memory file created |
| `~/.claude/projects/C--Users-Rohan/memory/MEMORY.md` | ✅ Complete | Index updated with paperclip entry |

---

## Decisions Made

- **Used embedded PostgreSQL** — reason: zero-config for local dev, auto-created by Paperclip
- **`local_trusted` deployment mode** — reason: dev mode, no auth needed for local use
- **Manual server build on Windows** — reason: build script uses Unix-only `cp -R .` syntax; bash `cp -r *` works
- **Used `npx paperclipai company import` over `npx companies.sh add`** — reason: companies.sh CLI produced no output on Windows; paperclipai CLI worked perfectly

---

## Blockers & Open Questions

- Superpowers Dev Shop company is missing COMPANY.md on GitHub — cannot import until fixed upstream
- Agents need adapter configuration to actually run (currently all using default `claude-local`)
- No API keys configured yet — agents will fail if heartbeats are triggered without proper adapter setup

---

## Exact Next Step

User was presented with options: configure adapters, set budgets, create custom company, wire OpenClaw, or deploy. They chose to open the dashboard (option 1). Dashboard opened at http://localhost:3100. Next logical step is to configure agent adapters so agents can actually execute work.

---

## Environment & Setup Notes

```bash
# Start Paperclip
cd ~/paperclip && pnpm dev

# Health check
curl http://localhost:3100/api/health

# List companies
cd ~/paperclip && npx paperclipai company list

# Import a company
npx paperclipai company import paperclipai/companies/<name> --yes

# Windows build workaround (server only)
cd ~/paperclip/server && npx tsc && mkdir -p dist/onboarding-assets && cp -r src/onboarding-assets/* dist/onboarding-assets/

# Data locations
# DB: ~/.paperclip/instances/default/db (port 54329)
# Secrets: ~/.paperclip/instances/default/secrets/master.key
# Storage: ~/.paperclip/instances/default/data/storage
```

### Company Dashboard URLs
- http://localhost:3100/AEO/dashboard (Aeon Intelligence)
- http://localhost:3100/AGE/dashboard (Agency Agents)
- http://localhost:3100/AGS/dashboard (AgentSys Engineering)
- http://localhost:3100/CLA/dashboard (ClawTeam Capital)
- http://localhost:3100/CLAA/dashboard (ClawTeam Engineering)
- http://localhost:3100/CLAAA/dashboard (ClawTeam Research Lab)
- http://localhost:3100/DON/dashboard (Donchitos Game Studio)
- http://localhost:3100/FUL/dashboard (Fullstack Forge)
- http://localhost:3100/GST/dashboard (GStack)
- http://localhost:3100/KDE/dashboard (K-Dense Science Lab)
- http://localhost:3100/MIN/dashboard (MiniMax Studio)
- http://localhost:3100/PRO/dashboard (Product Compass Consulting)
- http://localhost:3100/RED/dashboard (RedOak Review)
- http://localhost:3100/TCH/dashboard (TACHES Creative)
- http://localhost:3100/TRA/dashboard (Trail of Bits Security)
