---
name: drip 2026-04-28 ship-list batch — non-Matteo-blocked work
description: 10 commits while Matteo silent on PR #1. 3 SPEC-mode workspaces scaffolded mock-first (tokens + contracts + vendors). Specs ingested into version control. Python Researcher SDK at clients/. Eval baseline written. /decode page shipped. Ratelimit cleanup. Design.md devDep slip caught + reverted. Branch 49 → 58 ahead. PR #1 still draft, CI green on every push.
type: project
originSessionId: 2026-04-28_drip-shiplist
---
# 2026-04-28 ship-list batch — drip non-Matteo-blocked work

Plowed through the ship-list while waiting on Matteo's 14 PR-#1 questions.
Goal of the session: keep momentum without over-extending into work that
will need rework when Matteo's answers land.

## What landed on `phase-0-novelty-gateway`

Branch went 49 → 58 ahead of master. PR #1 still draft. CI re-kicked
on every push, all jobs green.

| Commit | Effect |
|---|---|
| `e9c9471` | Standalone eval baseline runner at `evals/scripts/run-once.ts`. First baseline against Neon prod 2026-04-27: registry_count=10, lifecycle_count=0, brand_tokens_present_ratio=0, brands_total=33. Output dir gitignored. |
| `8b09c04` | `@drip/tokens` workspace — mock-first $DRIP client (SPL-2022 + DLMM + Streamflow + Jupiter shells). 16 tests. Public surface: `mint()`, `swap(USDC<->SOL<->DRIP)`, `price()`. Real wiring opt-in via `DRIP_TOKENS_REAL=1`. `PublicKey` is branded base58 string — package ships zero `@solana/web3.js` dep. |
| `bbdc87e` | `@drip/contracts` workspace — mock-first agent-wallet client (Squads + Light Protocol + reputation registry shells). 19 tests. Public surface: `provisionWallet`, `updatePolicy`, `slash`, `anchorReputation`, `getWallet`. `ScopedAction` union locked at 5 entries — must stay in lock-step with `apps/api/src/middleware/agent-ratelimit.ts`. |
| `492d065` | `@drip/vendors` workspace — Phase A vendor adapter scaffold. 31 tests. 3 China CMOs pre-modeled post-WuXi BIOSECURE: `shanghai-pep` (min 100mg), `guangzhou-bio` (min 50mg), `shenzhen-syn` (min 200mg). Quotes deterministic per `(vendor, sequence_hash)`. Email parser harness with mock regex impl + real Haiku stub gated on `ANTHROPIC_API_KEY`. Auction runner picks lowest price under purity + lead-time SLAs. |
| `e0b8bf1` | Unit tests for `/app/launch?activity=<slug>` seed derivation. Refactor extracted `nicheFor` + `seedFrom` from `step-1-describe/page.tsx` into `apps/web/lib/launch-seed.ts`. 10 tests. **Carried a stash-pop residue: `@google/design.md` devDep + scripts accidentally swept into root `package.json`** — reverted in `e7f60be`. |
| `3f88fbb` | 8 canonical Matteo specs ingested from Telegram into `~/drip/specs/` — eliminates dependency on Telegram-folder being source-of-truth. Files: MASTER_PIPELINE, DISCOVERY_STACK, NOVELTY_GATEWAY (pipeline-folder), RESEARCHER_STACK (Telegram-root newer), AUTOMATION_STACK, BRIEF, VS_CLARITY, patches/PATCH_WEBSITE_CONTENT.md. README documents provenance + NOT-ingested rationale + code → spec cross-reference table. |
| `14a24d8` | `/decode` page + `apps/web/lib/peptide-decode.ts` — unblocked half of PATCH §addition-E. Inverse index from atlas activities → commodity peptides with cross-alias merge ("Matrixyl" alone merges into "KTTKS / Matrixyl" entry from another activity). Public Swiss Clinical page with hero + index + alternatives-stub. 13 new tests. /decode added to footer. Section 03 "drip alternatives" callout deferred until brand-by-target schema (PR #1). |
| `e7f60be` | Revert: removed `@google/design.md` devDep accidentally committed in `e0b8bf1`. Restored prior convention. Local design lint workflow continues via `pnpm dlx @google/design.md@0.1.1 lint brand/DESIGN.md`. |
| `cc65ce6` | Ratelimit `as never` cleanup. Replaced cast with structural alias `RatelimitRedis = ConstructorParameters<typeof Ratelimit>[0]['redis']` + cast through `unknown`. Documents the shape it's targeting rather than escape-hatching. |
| `d1621ff` | Python Researcher SDK at `clients/python-researcher/` — new top-level `clients/` directory, separate from `packages/*` (pnpm) and `pipeline/` (server Python). 15 pytest cases. Public surface matches spec §4: `generate`, `predict`, `embed`, `batch_submit`, `batch_status` (5 methods, NOT 7 — stale memory corrected). Mock backend SHA-256-derived for determinism. |

## Workspace + tests state

- **9 pnpm workspaces** (apps/api, apps/web, packages/db, packages/payments, packages/sdk, packages/ui, packages/tokens, packages/contracts, packages/vendors) + 1 Python client (`clients/python-researcher/`).
- All SPEC-mode `packages/*/SPEC.md` files now have mock-first scaffolds.
- Repo-wide `pnpm -r typecheck` clean.
- Test counts: apps/api 60 + apps/web 39 + @drip/db 33 + @drip/tokens 16 + @drip/contracts 19 + @drip/vendors 31 + drip-researcher 15 = **213 tests green** (up from ~67 at session start).

## Memory corrections logged

1. **Migrations 0001/0002/0003 already applied to prod Neon** — memory said unapplied; audit script proved 18/18 applied as of 2026-04-26 batch. project_drip.md "Known issues remaining" updated.
2. **Researcher API has 4 endpoints, not 7** — `fold`/`simulate`/`score`/`calibrate` are explicitly out of scope per spec §4.5 ("DRIP is peptides, not the whole protein universe"). The Q11 ping to Matteo needs rewording.
3. **`@google/design.md` devDep deliberately uncommitted** — slipped into `e0b8bf1` via stash-pop residue, reverted in `e7f60be`.

## Open with Matteo (14 questions, all blocked-on-Matteo)

PR #1 thread carries 7 + 7 from PATCH §7 + Phase B + ops. Numbered list at end of `2026-04-27b` savepoint + this session's report. **Q11 needs rewording: 5 endpoints not 7.**

## What did NOT happen this session

- **Telegram Matteo ping** — chat-side, not tool-doable. 14 questions still queued.
- **PR #1 merge** — still draft. Unblocks L2 schema + T4.6b + brand-by-target index + Addition E completion + Phase B researcher-lane real wiring.
- **L1 perf+race against staging Neon** — needs a DATABASE_URL session, deferred.
- **`/decode/[name]` per-peptide detail page** — needs brand-by-target.
- **Auth0 + ORCID scaffold** — Q12 gates real provisioning, scaffold deferred.
- **Atlas Section 04 live data wiring** — PR #1 schema dependent.
- **Section 03 "drip alternatives" callout on /decode** — PR #1 schema dependent.

## Files changed (high-level by directory)

```
NEW:
  evals/scripts/run-once.ts
  packages/tokens/                          (9 files, 605 insertions)
  packages/contracts/                       (10 files, 757 insertions)
  packages/vendors/                         (11 files)
  apps/web/lib/launch-seed.ts
  apps/web/lib/__tests__/launch-seed.test.ts
  apps/web/lib/peptide-decode.ts
  apps/web/lib/__tests__/peptide-decode.test.ts
  apps/web/app/decode/page.tsx
  specs/                                    (9 files, 3,964 insertions)
  clients/python-researcher/                (8 files)

EDITED:
  apps/web/components/footer.tsx            (+/decode entry)
  apps/web/app/app/launch/step-1-describe/page.tsx  (extracted seedFrom import)
  apps/api/src/middleware/ratelimit.ts      (as never -> structural alias)
  package.json                              (revert: design.md devDep removed)
  pnpm-lock.yaml                            (regen: design.md transitives removed)
```

## Working tree at session end

```
M apps/web/next-env.d.ts          (Next 16 auto-gen, harmless)
?? .env.vercel.prod               (secret, gitignored intent)
?? docs/PENDING.md                (held back pending secret rotation)
```

Currently checked out: `phase-0-novelty-gateway`. Tree is cleaner than session start — design.md devDep dirt removed permanently, the rest is the same baseline.

## Next session priorities

1. **Telegram Matteo** — send the 14-question ping (Q11 reworded to 5 endpoints). Without this, half the work tree stays blocked.
2. **Watch PR #1 CI** — auto-restarts on each push, currently green on the latest `d1621ff` commit.
3. **Atlas Section 04 stub copy (item 7 from ship-list)** — 5-min copy task, doesn't touch live data.
4. **Auth0 + ORCID tenant scaffold (item 9)** — Phase B prep, Q12 gates real wire but scaffold can land.
5. **Once PR #1 merges:**
   - L2 schema integration into `/v1/brand` novelty-check call site
   - T4.6b: profile pipeline persistence to `brands.profile_json`
   - Brand-by-target index for atlas section 04 + /decode section 03
   - Addition E completion + `/decode/[name]` detail page
6. **L1 perf+race against staging Neon** — needs DATABASE_URL session.
7. **CLAUDE.md update** — log Phase 0 done, design-mastery agent already in table.

## Source-of-truth pointers

- Phase 0 plan: `~/drip/.planning/phase_000_novelty_gateway_v0/PLAN.md`
- Phase 0.5 plan: `~/drip/.planning/phase_005_layer23_v0/PLAN.md`
- Specs (canonical, version-controlled): `~/drip/specs/` + `~/drip/specs/README.md`
- Vercel preview: `https://drip-samples-git-phase-0-nov-78a3bb-bludragon66613-sys-projects.vercel.app`
- PR #1: https://github.com/bludragon66613-sys/Drip/pull/1 (draft)
- PR #2: https://github.com/bludragon66613-sys/Drip/pull/2 (draft, gated on PR #1 merge)
