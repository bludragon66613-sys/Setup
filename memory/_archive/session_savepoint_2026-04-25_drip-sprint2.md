---
name: drip Sprint 2 ship + deploy unblock
description: Phase 0 Sprint 2 fully shipped (T2.1, T2.3, T2.4, T2.5, T2.6 — T2.2 absorbed as no-op). 3 cleanup commits unblocked Vercel preview. Branch 16 commits ahead, preview Ready.
type: project
originSessionId: 49099a32-45df-40aa-bd35-7b27a456e315
---
# 2026-04-25 — drip Phase 0 Sprint 2

## Branch state
- `phase-0-novelty-gateway` — **16 commits ahead** of master
- PR #1 (https://github.com/bludragon66613-sys/Drip/pull/1) — draft, picks up the new commits
- Vercel preview: **Ready** at https://drip-samples-git-phase-0-nov-78a3bb-bludragon66613-sys-projects.vercel.app
- All 6 workspaces typecheck green; 67 tests pass (51 api + 16 web)

## Sprint 2 commits (5 features + 3 fixes, all pushed)

| Commit | Task | Notes |
|---|---|---|
| `6b1c743` | T2.1 | `tier` enum + `validation_tier` nullable column on brands/products/launch_jobs. Migration 0015. **Option A** column-name decision (validation_tier, not tier) to avoid collision with 3 existing tier columns. PLAN+RESEARCH.md tracked for the first time. |
| `daf69a6` | T2.6 | TierBadge in new `@drip/ui` workspace package. Stacked-rule glyphs (1/2/3 lines), inline SVG (no SVGR loader). |
| `cda6198` | T2.3 | `/tiers` explainer (~800 LOC, 7 sections). Hero with all 3 TierBadges, comparison table, decision tree, scaling flow, regulatory mapping, FAQ, CTA. |
| `958a6f3` | T2.4 | `/methodology` benchmarks (6-row AUROC table — locked numbers). `.tsx` not `.mdx` (no MDX runtime wired). |
| `3def6de` | T2.5 | `/for-researchers` + `/api/waitlist/researchers` + migration 0016 (waitlist `source` + `metadata jsonb`). 7-endpoint capability matrix, Python snippet, 5-tier pricing, alpha form (client component). |
| `6350eb6` | fix | Lazy Stripe via Proxy — env check deferred from module-eval to first call. Caller code unchanged. |
| `9ce579a` | fix | inngest 3.22 → 3.54 (Vercel was rejecting deploys with vuln warning on 3.52.7). |
| `5a9b6f8` | chore | Remove unused `@google/design.md` from root devDeps — was the actual deploy blocker (lockfile/HEAD mismatch on root package.json). |

## T2.2 — absorbed, no-op
0 matches for `tier [abc]` in apps/packages/content/brand at sweep time. Builder-ecosystem `Tier A/B/C` in docs/ is a separate namespace and out of scope. Documented in PLAN.md.

## Slip: brand artifacts in `5a9b6f8`
The cleanup commit unintentionally included `brand/DESIGN.{md,drift.md,tailwind.json}` — auto-staged by something during commit. Turns out they're legitimate Swiss Clinical token contracts (paired with BRAND.md). Benign accident; left as-is. Investigate hook source if it recurs.

## Plan amendments (logged in `.planning/.../PLAN.md`)
1. **T2.1 column name**: `validation_tier` not `tier` (Option A, 2026-04-25)
2. **T2.2 status**: already-clean, real enforcement is T3.7 CI guard
3. **T2.4 format**: `.tsx` not `.mdx` (no MDX runtime)
4. **T2.6 SVG layout**: 3 glyphs inlined into `tier-badge.tsx` instead of separate asset files

## Untracked at session end (kept on disk, not committed)
- `.env.vercel.prod` — secret, leave forever
- `docs/PENDING.md` — unknown intent, triage tomorrow
- `packages/db/src/migrations/0007_orders_multi_rail.sql` — real Solana Pay/MoonPay/Helio migration written in a prior session, never committed. Triage tomorrow (does it land separately or get folded into a Phase A commit?)
- `.claude/memory/best-designs-index.md` + `design-memory.md` — modified by design-mastery automation during session, leave to memory subsystem

## Resume tomorrow

```bash
cd ~/drip && git checkout phase-0-novelty-gateway && git pull
gh pr view 1                                # check Matteo replies
open https://drip-samples-git-phase-0-nov-78a3bb-bludragon66613-sys-projects.vercel.app
```

**Visual verification queued** — walk `/tiers`, `/methodology`, `/for-researchers` on the preview URL. Brand-rules check: single red bar per viewport, hairlines on tables, no buttons except form submits, tabular numerals on AUROC + tier metrics.

**Triage queue:**
1. `docs/PENDING.md` — read, decide
2. `0007_orders_multi_rail.sql` — does it ship separately?
3. Apply migrations 0001/0002/0003/0015/0016 to prod DB (operator action)
4. Push memory + agents to Setup repo (CLAUDE.md preference, not done this session)

**Sprint 3 queued** (was unblocked by Sprint 2; now blocked by Matteo's 7 PR #1 questions for Phase B parts):
- T3.1 sequence_lifecycle SM table
- T3.2 Inngest LOCKED handler
- T3.3 Monday auction cron stub
- T3.4 product Science block (uses TierBadge)
- T3.5 dashboard "What's next?" card
- T3.6 daily eval harness cron
- T3.7 CI guard against `Tier A/B/C` strings

## Decision rules logged this session
- `validation_tier` not `tier` for synthesis-validation column (Option A) — coexistence over wide rename
- Inline SVG over separate asset files when target consumer is Next.js without SVGR
- `.tsx` over `.mdx` when no MDX runtime is already wired
- Lazy Proxy for env-eager singletons that fail Vercel's "Collect page data" build phase
- `pnpm remove -w` (lowercase) is the correct flag, not `-DW`
