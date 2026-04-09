---
name: Paperclip AI
description: Open-source AI agent orchestration platform — "company OS" for autonomous AI agents at ~/paperclip
type: project
---

## Paperclip AI — Agentic Companies Platform

**Location:** `~/paperclip`
**Repo:** github.com/paperclipai/paperclip (cloned, not forked)
**URL:** http://localhost:3100 (dev mode)
**Status:** Running as of 2026-03-26 — all 441 agents configured and operational

**Why:** Platform for orchestrating multiple AI agents as autonomous "companies" with org charts, budgets, task management, governance, and audit trails.

**How to apply:** This is distinct from NERV_02 (single-agent dispatch). Paperclip manages *teams* of agents with proper organizational structure. Can potentially integrate with OpenClaw agents.

## Quick Reference

- **Start:** Admin PowerShell → `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force` → `cd C:\Users\Rohan\paperclip && pnpm --filter server dev`
- **Health:** `curl http://localhost:3100/api/health`
- **Build:** `cd ~/paperclip && pnpm build` (server build needs manual `cp -r` on Windows — known issue)
- **Mode:** `local_trusted` (no auth needed for dev)
- **DB:** Embedded PostgreSQL at `~/.paperclip/instances/default/db` (port 54329)
- **Data:** `~/.paperclip/instances/default/`

## Stack
- **Backend:** Express 5, TypeScript, Drizzle ORM, PostgreSQL 17, Pino logging
- **Frontend:** React 19, Vite 6, Tailwind CSS 4, Radix UI, TanStack Query
- **Agent Adapters:** claude-local, codex-local, cursor-local, gemini-local, openclaw-gateway, opencode-local, pi-local, process, http, hermes-local
- **Active Config:** All 441 agents → claude_local, claude-sonnet-4-6, ~$0.50-0.60/heartbeat
- **Bulk Config Script:** `~/paperclip/configure-company-agents.sh`

## Key Features
- Bring Your Own Agent (any AI agent via adapters)
- Org charts with manager hierarchy
- Token budget enforcement (monthly, per-agent)
- Task management (ticket-based, parent/child)
- Governance board (approve hires, pause agents)
- Full audit trail on all mutations
- Plugin system with SDK
- Multi-company support (data isolation)

## Windows Build Note
### Windows Requirements
- **Developer Mode must be ON** (Settings → System → For Developers) — Paperclip creates symlinks for skill sync
- **Admin PowerShell required** for running server (execution policy must allow scripts)

### Build Note
Server `build` script uses `cp -R` which fails on Windows CMD. Workaround:
```bash
cd server && npx tsc && mkdir -p dist/onboarding-assets && cp -r src/onboarding-assets/* dist/onboarding-assets/
```
