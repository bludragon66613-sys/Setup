# Paperclip — AI Agent Orchestration Platform

> Synced from Claude Code memory — 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_paperclip.md`

---

Paperclip is an open-source platform for orchestrating multiple AI agents as autonomous "companies" — with org charts, token budgets, task management, governance boards, and full audit trails.

**Location:** `~/paperclip`
**Repo:** `github.com/paperclipai/paperclip` (cloned, not forked)
**URL:** `http://localhost:3100`
**Status:** Running — all 441 agents configured and operational as of 2026-03-26

## What Makes It Distinct

Unlike [[nerv-autonomous-agent]] (single-agent skill dispatch), Paperclip manages *teams* of agents with proper organizational structure. Think of it as a "company OS" for AI.

Key distinction: NERV dispatches one skill at a time. Paperclip runs an org of agents with hierarchies, budgets, tickets, and governance.

## Core Features

- **Bring Your Own Agent** — any AI agent via adapters (claude-local, codex-local, cursor-local, gemini-local, openclaw-gateway, opencode-local, pi-local, http, process)
- **Org charts** with manager hierarchy
- **Token budget enforcement** — monthly limits per agent
- **Task management** — ticket-based with parent/child relationships
- **Governance board** — approve hires, pause agents
- **Audit trail** — full record of all mutations
- **Plugin system** — extensible via SDK
- **Multi-company** — data isolation per company

## Stack

- **Backend:** Express 5, TypeScript, Drizzle ORM, PostgreSQL 17, Pino logging
- **Frontend:** React 19, Vite 6, Tailwind CSS 4, Radix UI, TanStack Query
- **DB:** Embedded PostgreSQL at `~/.paperclip/instances/default/db` (port 54329)
- **Mode:** `local_trusted` (no auth for dev)
- **Active config:** All 441 agents → claude_local, claude-sonnet-4-6, ~$0.50-0.60/heartbeat

## Windows Setup Notes

- **Developer Mode must be ON** — Paperclip creates symlinks for skill sync
- **Admin PowerShell required** for running server
- **Start:** `cd C:\Users\Rohan\paperclip && pnpm --filter server dev`
- **Build quirk:** `cp -R` fails on Windows CMD; use manual `npx tsc && mkdir -p dist/onboarding-assets && cp -r src/onboarding-assets/* dist/onboarding-assets/`

## Integration with Munshi

[[tallyai-munshi]] runs as a 10-agent company on Paperclip:
- Company ID: `7cf2c89a-a57a-48c0-a41f-07191d2bb8a0`
- Issue prefix: TAL
- 10 agents: CTO, Frontend Lead, Backend Lead, AI Engineer, Database Architect, Tally Domain Expert, WhatsApp Bot Engineer, QA, DevOps, PM

## Related

- [[nerv-autonomous-agent]] — Complementary but distinct; NERV = single dispatch, Paperclip = org management
- [[signal-consultancy]] — Paperclip is the open-source credibility signal in the SIGNAL brand architecture
- [[openclaw-ai-gateway]] — openclaw-gateway adapter available in Paperclip
- [[tallyai-munshi]] — Runs a 10-agent company on this platform
