---
name: drip Sprint 3 shipped + audit/apply tooling + CI bootstrap
description: One-shot Phase 0 finish on drip. 12 commits added on phase-0-novelty-gateway (24 → 38 ahead). Wrote read-only prod schema audit + apply helper, applied 6 missing migrations (0012-0017) to drip-samples Neon, bootstrapped monorepo CI (4 jobs, 70 tests green), shipped all 7 Sprint 3 tasks (lifecycle SM, LOCKED handler, auction cron stub, science block, dashboard whats-next card, eval harness daily cron, tier nomenclature grep guard), swept 3 value-semantic "—" sites with text labels. PR #1 CI green.
type: project
originSessionId: c3d684ef-41d9-46c6-b93f-25e2e24680f9
---
# 2026-04-26b — drip Phase 0 finish

## What landed

Branch `phase-0-novelty-gateway` jumped from 24 → 38 commits ahead of master.
PR #1 still draft, CI green, awaiting Matteo on the 7 Phase B questions.

| Commit | Effect |
|---|---|
| `4da570e` | `chore(db): add read-only prod schema audit script` — packages/db/scripts/audit-prod-schema.ts probes pg_catalog/information_schema for marker artifacts of each migration; reports APPLIED/MISSING/PARTIAL/INFER. Replaces stale MIGRATIONS.md "Applied" checklist. |
| `03ad909` | `ci: bootstrap monorepo workflow` — first .github/workflows/ci.yml (T3.7a). install + typecheck + test matrix [api, web, @drip/db]. |
| `001fcef` | `copy(p0): replace value-semantic "—" placeholders with text labels` — 3 sites: pipeline funnel-view (4× SSE loading → "…"), molecules final_rank → "unranked", thanks formatAmount → "unavailable". |
| `9fc1634` | `chore(db): add migration apply helper paired with audit script` — packages/db/scripts/apply-missing-migrations.ts; one-shot, halts on error. |
| `a4ff0c7` | `fix(ci): drop explicit pnpm version` — first CI run failed with ERR_PNPM_BAD_PM_VERSION because root package.json's `packageManager: pnpm@9.0.0` conflicts with `version: 9` input on action-setup@v4. Drop the input, action reads packageManager. CI green after this. |
| `704cba3` | `docs(db): point MIGRATIONS.md at audit script as source of truth` — strip stale "Applied: ☐ preview · ☐ prod" checklist, point to the audit/apply scripts. |
| `b3aa4bd` | `ci: T3.7b grep guard against tier A/B/C nomenclature` — scripts/check-tier-nomenclature.sh (rg word-boundary `\btier[ -]?[abc]\b`) + new lint job in ci.yml. Exit 1 with ::error:: annotation on hit; exit 2 FATAL when rg missing. Baseline clean. |
| `442ae35` | `feat(p0): T3.1 sequence_lifecycle state machine table` — 0017 migration (renumbered from PLAN's 0016, collision with waitlist_source_metadata). 20-state lifecycle_state enum. lifecycle table (PK = sequence_hash, FK → sequence_registry, current_tier, attestation_tx). lifecycle_audit (BIGSERIAL, indexed by hash + at). Schema files added; audit script extended for 0017 marker. |
| `7533b07` | `feat(p0): T3.2 inngest handler seeds lifecycle on lock` — packages/db sequenceLifecycleRepo.seedLocked (transactional, ON CONFLICT DO NOTHING, returns created:bool so replays are no-ops not duplicate audit rows). apps/api on-sequence-locked.ts wires `creator/phase.1.sequence_locked`. Pure handler exported separately for unit tests. 3 vitest cases (first event, replay, error propagation). |
| `7f4025e` | `feat(p0): T3.3 synthesis auction cron skeleton` — generic transitionAll(from, to, actor) repo method. Inngest cron `0 15 * * 1` transitions QUEUED → AUCTIONED, emits `vendor/synthesis.auctioned` event. Pure handler takes emit callback for testability. New typed VendorSynthesisAuctioned event. 3 vitest cases. |
| `1acb5e0` | `feat(p0): T3.5 dashboard whats-next card` — sequenceLifecycleRepo.findLatestForCreator (joins sequences_claimed → sequence_lifecycle via encode hash hex). GET /api/lifecycle/whats-next. WhatsNextCard client component, exhaustive switch on 19 lifecycle states + null + never-fallback, Swiss Clinical brand. Wired between dashboard header + payouts. |
| `d7ad3a5` | `feat(p0): T3.6 eval harness daily cron + 50 golden briefs` — packages/db/src/eval/daily-metrics.ts collects 5 metrics (registry_count, lifecycle_count, waitlist_delta_24h, brand_tokens_present_ratio, brands_total). Inngest cron `0 8 * * *` writes to evals/results/YYYY-MM-DD.jsonl. New @drip/db/eval export. 50 golden briefs (10 categories × 5) via evals/scripts/gen-golden-briefs.ts. evals/results/* gitignored except .gitkeep. build_profile validity / L1 P95 / collision FN deferred to Phase 0.5 with rationale. |
| `f3da406` | `feat(p0): T3.4 product science block` — creator-side /app/products/[id]/page.tsx + science-block.tsx with 8 subsections per PATCH §7.3.5. Sections 02/03/05/08 backed by real data; sections 01/04/06/07 render explicit "to be confirmed" placeholders. New GET on /api/products/[id]. Hairline rules + tabular numerals + mono eyebrows. |
| `c227969` | `docs(p0): mark Sprint 3 complete in PLAN.md` — status block above original task list, retains task list for archive context. |

## Prod schema state

Applied 6 migrations 2026-04-26 against `ep-broad-sun-an34ajtl.c-6.us-east-1.aws.neon.tech`:

- 0012_pgvector
- 0013_sequence_registry
- 0014_backfill_registry
- 0015_tier_enum
- 0016_waitlist_source_metadata
- 0017_sequence_lifecycle (Sprint 3)

Final audit: **18/18 applied** (was 12/17 at session start).

## Test posture at session end

- Typecheck across 6 workspaces (api, web, db, payments, sdk, ui): **clean**
- Tests: **70 green** (60 api + 10 db). Was 67 at session start.
- CI workflow on PR #1 first run failed (pnpm version conflict), fixed in `a4ff0c7`, second run **green** across install + typecheck + test×3.

## Working tree at session end

```
 M apps/web/next-env.d.ts          (Next 16 auto-gen, harmless)
 M package.json                    (@google/design.md devDep, deliberately uncommitted)
 M pnpm-lock.yaml                  (matches the devDep above)
?? .env.vercel.prod                (secret, gitignored intent)
?? docs/PENDING.md                 (held back pending secret rotation)
?? packages/db/.env                (gitignored, contains live DATABASE_URL)
```

None of these intentionally committed.

## Inngest registry at session end

`apps/api/src/inngest/handler.ts` registers 4 functions:

1. `runAgentLaunch` — drip/launch.requested
2. `onSequenceLocked` — creator/phase.1.sequence_locked (T3.2)
3. `synthesisAuctionCron` — cron `0 15 * * 1` (T3.3)
4. `evalHarnessDaily` — cron `0 8 * * *` (T3.6)

For prod, set `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` on Vercel (per docs/DEPLOY.md priority #4) so the cron + event consumers actually fire.

## Architectural notes worth keeping

1. **Lifecycle SM keyed by sequence_hash, not creator.** One live row per sequence regardless of which lane locked it. Per-creator joins go through `sequences_claimed` (creator_id → sequence_hash hex → decode → sequence_lifecycle PK).
2. **Pure handlers separated from Inngest wrappers.** `handleSequenceLocked`, `runSynthesisAuction`, `collectDailyMetrics` are all plain async functions. The `inngestFunctions.createFunction` wrapper just calls into them. Lets unit tests bypass Inngest infra entirely.
3. **`@drip/db/eval` exists because apps don't carry direct drizzle-orm.** Eval metric SQL lives on the db package side; api just imports `collectDailyMetrics`. Same pattern would apply to any future cross-package SQL.
4. **`transitionAll(from, to, actor)` is generic.** Future cron jobs (validation auction, prediction market settlement) reuse the same repo method.

## What did NOT happen this session

- **Secret rotation** for MoonPay + Helio (still blocks PENDING.md commit)
- **Wyoming LLC + Cayman Foundation** filings
- **Social handle locks**, DNS to Vercel, GitHub repo rename `drip-protocol` → `drip`
- **Matteo's 7 PR #1 questions** — still silent. Sprint 3 unblocked itself by being Phase 0 finish, not Phase B.

## Next session priorities

1. **Push the 12 unpushed commits** (442ae35..c227969) to origin. PR #1 will pick up automatically. _[update: pushed by end of session]_
2. **Rotate MoonPay + Helio webhook secrets** — Rohan's job, still required before PENDING.md commit.
3. **Phase 0.5 work** — Layer 2/3 novelty (motif similarity + HNSW cosine), expiry SM, literature ingest, build_profile API. Source: DRIP_NOVELTY_GATEWAY.md §5-7.
4. **Phase B prep** — when Matteo's silent on the 7 PR #1 questions breaks, fan out researcher lane work (Auth0 + ORCID, Python SDK, pod embedding endpoint).
5. **Inngest production deploy** — set `INNGEST_EVENT_KEY` + `INNGEST_SIGNING_KEY` on Vercel (currently graceful-degrade fallback runs the lock handler synchronously, but cron jobs need real Inngest to fire on schedule).

## Source-of-truth pointers

- Plan: `~/drip/.planning/phase_000_novelty_gateway_v0/PLAN.md` (Sprint 3 status block now reflects "complete")
- Schema audit: `pnpm --filter @drip/db exec tsx scripts/audit-prod-schema.ts`
- Eval results: `~/drip/evals/results/YYYY-MM-DD.jsonl` (gitignored, populated daily)
- Golden briefs: `~/drip/evals/fixtures/golden_briefs.json` (50 entries, regenerable via `tsx evals/scripts/gen-golden-briefs.ts > ...`)
