---
name: drip.markets platform
description: Solana peptide-creator platform — main product, monorepo at bludragon66613-sys/Drip, parent to fatfk + other creator brands
type: project
---

drip.markets — Solana-native peptide discovery + creator-brand platform.
Repo `bludragon66613-sys/Drip` (private). Co-founder Matteo
(cybergenesis621) owns peptide discovery model + token contracts; Rohan
owns platform + brand + GTM.

**Stack:** Next.js 16 (Turbopack build) + Hono API + Solana (SPL-2022 +
Meteora DLMM + Streamflow + Squads). pnpm workspaces. Postgres via Neon
(Drizzle ORM). Vercel for web (project `drip-samples`,
`prj_5Xb3rDAIGTYGWLdPJumHChyY7ZPS`, team `team_EOpai4nuwLAUOHrzOrMfPB5S`,
root `apps/web`). Inngest for async jobs. Domain `drip.markets`.

**Monorepo layout:**
- `apps/{web,api,pipeline,agents}` — 2 active (web + api), others scaffold
- `packages/{aurora,auth,contracts,db,payments,sdk,tokens,ui,vendors}` — 9 workspace pkgs
- `specs/` — canonical specs (`DRIP_BRIEF.md`, `DRIP_MASTER_PIPELINE.md`,
  `DRIP_RESEARCHER_STACK.md`, `DRIP_AUTOMATION_STACK.md`, `AURORA_OUTPUT_SPEC.md`)
- `docs/phase-0-5-retrospective.md` — most recent phase wrap

**Current state (2026-05-11):** master tip `f147215` after PR #10 Aurora
ingest scaffold merged. Tests at master: 47 aurora + 105 api + 103 web +
94 db, all green. Migrations 0019-0026 staged in repo but **not yet
applied to Neon prod** (user-gated DB action).

**Open gates on Matteo (cybergenesis621):**
- Q1: Aurora sample bundle (unblocks real ZIP parser in `@drip/aurora`)
- Q2: Aurora live API shape — ZIP download only or OpenAPI surface?
- Q4: `sequences_claimed` retire timeline (blocks migration cleanup)
- Q5: ontology split (blocks L2/L3 collision wiring + literature ingest
  T5.4-T5.6)

**Key pitfalls (learned the hard way):**
- Workspace pkg `src/index.ts` re-exports must use bare relative paths
  (`from "./mock"` not `from "./mock.js"`). Next webpack can't remap
  `.js` → `.ts` during bundling; chokes with "Module not found" even
  with `transpilePackages` set. `@drip/auth` is the canonical pattern.
- Any new `@drip/*` pkg consumed by `apps/web` MUST be added to
  `transpilePackages` in `apps/web/next.config.ts`.
- Vercel rejects deploys when commit author email isn't linked to a GH
  account (`No GitHub account was found matching the commit author
  email address` status). Always commit on Drip with
  `--author="bludragon66613-sys <bludragon66613@gmail.com>"` since the
  default git config on this mac is `Tetsuo <tetsuo@Tetsuos-MBP.dlink>`
  (unverified).
- DB scripts (e.g., `backfill-brand-tokens.ts`) must gate
  `process.exit(1)` on missing `DATABASE_URL` inside the `isMain` guard,
  not top-level — otherwise vitest crashes on import.

**Build flow:** `pnpm install --frozen-lockfile` → `pnpm -r typecheck`
→ per-pkg `pnpm --filter <pkg> test` → `cd apps/web && pnpm build`.
Local Next build = Turbopack (Next 16 default). Vercel also uses
Turbopack. CI jobs: `install`, `lint (tier nomenclature)`,
`typecheck (-r)`, `test (api|web|db)`. Vercel preview deploy runs
separately as commit status.

**Hosting + Vercel ops:**
- Vercel MCP team slug `bludragon66613-sys-projects`,
  team id `team_EOpai4nuwLAUOHrzOrMfPB5S`
- `drip-samples` project id `prj_5Xb3rDAIGTYGWLdPJumHChyY7ZPS`
- Domains: `drip.markets`, `www.drip.markets`,
  `drip-samples.vercel.app`, `*-bludragon66613-sys-projects.vercel.app`
- Build logs scope unavailable via current MCP token (401 on
  `get_deployment_build_logs`); use `gh api commits/.../statuses` for
  GitHub status surface or Vercel dashboard for full logs.

**Local checkout:** `~/Applications/Drip` (mac). Cloned 2026-05-11.
