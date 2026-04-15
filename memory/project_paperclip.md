---
name: Paperclip AI
description: Open-source AI agent orchestration platform — "company OS" for autonomous AI agents at ~/paperclip
type: project
originSessionId: a2b3024e-10e1-4001-8b89-8f32d2774b9f
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

## Cleanup PR #3746 — 2026-04-15

Open upstream PR from `bludragon66613-sys:cleanup/ai-slop-2026-04-15` → `paperclipai/paperclip:master`.

**11 commits, 99 files, +335 / −2,774 (≈ −2,440 net lines), typecheck green throughout.**

URL: https://github.com/paperclipai/paperclip/pull/3746

| Pass | Theme | Files / Impact |
|---|---|---|
| 1 | Dead file deletion (knip) | per report |
| 2 | AI slop comment removal | per report |
| 3 | Defensive try/catch removal around localStorage | per report |
| 4 | Weak any/unknown → strong types | per report |
| 4+ | DbOrTx union + issues.ts narrowing (followup) | 2 files |
| 5 | Types to `@paperclipai/shared`: AdapterModel, AdapterEnvironmentCheck, QuotaWindow, ProviderQuotaResult | 6 files + new workspace dep |
| 6 | OrgNode to `@paperclipai/shared` | 5 files |
| 7 | `probe-helpers.ts` (firstNonEmptyLine, commandLooksLike, summarizeStatus) | 13 files, −109 lines |
| 8 | `config-parser.ts` (parseCommaArgs, parseEnvVars, parseEnvBindings, parseJsonObject) | 7 files, −258 lines |
| 9 | `type-coercion.ts` (asString, asNumber, asRecord, errorText, stringifyUnknown, safeJsonParse, asNonEmptyString) | 20 files, −221 lines |
| 10 | `resolveAdapterSkillsHome(config, ...segments)` factory | 5 adapter skills.ts files |
| 11 | CLI check barrel cycle break + `run`↔`onboard` dynamic import | 12 files, 16→7 cycles |

**Key adapter-utils gains:** three new shared modules (`probe-helpers`, `config-parser`, `type-coercion`) plus `resolveAdapterSkillsHome` in `server-utils.ts`. Every adapter package now depends on `@paperclipai/shared` via workspace:* (added in pass 5).

**Deliberately NOT done:**
- `.cleanup-reports/01-dedup.md` MEDIUM #1 (parse.ts stream loop) — only ~6 lines of true skeleton overlap, output models diverge per adapter, extracting would be premature abstraction
- `.cleanup-reports/01-dedup.md` MEDIUM #2 remaining items (ephemeral-mode skills.ts builders) — semantically distinct from persistent-mode, already using `buildPersistentSkillSnapshot` where applicable
- `.cleanup-reports/07-legacy.md` items — all require database audits before removal
- `.cleanup-reports/04-circular.md` cycle 11 (bidirectional FK schemas) — cannot be fixed with type-only imports because Drizzle's deferred `references()` callbacks access runtime values on the imported table (`executionWorkspaces.id`)

**Remaining cycles (7):** all either intentional mutual-type patterns (plugin-lifecycle ↔ plugin-loader), type-only false positives (UI adapters/registry), or bidirectional Drizzle FKs that can't be broken without schema-module restructure.

**Behaviour preserved:** every extraction verified byte-for-byte identical before removal. Where variants diverged (`claude-local/parse-stdout.ts` `asNumber` without default, `openclaw-gateway/parse-stdout.ts` `asString` without fallback, `errorText` with per-adapter field checks), the local copy was kept, not normalized.

**Test status:** pre-existing test failures (Windows-spawn ENOENT flakes in `claude-local-execute` and friends) are unchanged — verified by running the same file on both sides of the stash. Earlier session memory claimed a +3 files / +13 tests regression from the consolidation — that was flaky Windows test output, confirmed by stashed/unstashed A/B runs.

**PR review guide:** Maintainers can split into 4 smaller PRs if preferred — natural cut points are passes 1-4+ (dead code + types), 5-6 (shared types), 7-10 (adapter-utils dedup), 11 (circular deps).
