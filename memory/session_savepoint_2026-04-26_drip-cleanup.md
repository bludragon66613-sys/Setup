---
name: drip Sprint 2 cleanup + 0007 migration tracked + design-mastery verdicts applied
description: Resume-then-cleanup session. Tracked orphan 0007 migration, swept hard-rule glyph violations across Sprint 2 + legal + incidental pages, fixed /tiers comparison-table overflow, applied design-mastery verdict on label-body separators / wizard eyebrow exception / tabular sentinel a11y treatment, synced memory backup. Branch 24 commits ahead, all pushed. Migrations + CI guard halted on hard blockers.
type: project
originSessionId: c3d684ef-41d9-46c6-b93f-25e2e24680f9
---
# 2026-04-26 — drip Phase 0 cleanup pass

## Branch state at session end
- `phase-0-novelty-gateway` — **24 commits ahead** of `origin/master` (was 17 at start; +7 commits this session, all pushed)
- PR #1: OPEN draft, Vercel preview Ready, 0 human comments (Matteo still silent → Sprint 3 still blocked)
- All checks green
- Working tree dirty intentionally: `package.json` + `pnpm-lock.yaml` (local-only `@google/design.md` devDep), `next-env.d.ts` (Next 16 auto-gen). Three untracked: `.env.vercel.prod` (secret), `docs/PENDING.md` (held back, see below), and `apps/web/next-env.d.ts` artifact.

## Commits added this session (drip)

| SHA | Effect |
|---|---|
| `09cdab2` | `feat(db): add 0007 orders multi-rail migration` — closes the orphan migration that paired with the already-tracked 0006_payment_events.sql. Drizzle `_journal.json` is stale (only knows 0001/0002); migrations are applied via raw push, not drizzle-kit, so journal lag isn't an issue here. |
| `43cee2e` | `copy(p0): replace prose em-dashes + section marks on Sprint 2 pages` — 18 prose `—` + 1 `§` swept across `/tiers`, `/methodology`, `/for-researchers`, the capability matrix, and the waitlist form. Tabular `—` sentinels in priorSota cells left as-is (no-data markers, not prose). Code/JSX comments retain dashes (don't render). |
| `2c3bc52` | `fix(p0/tiers): allow comparison-table label column to wrap` — removed `whiteSpace: nowrap` from the 180px label column so "BREAK-EVEN (AT $48 CREATOR MARGIN)" wraps to 2 lines instead of overflowing into the proof-tier "~120 units" cell. Visual confirm on Vercel preview. |
| `19b40e8` | `copy: sweep 5 incidental prose em-dashes outside Sprint 2 pages` — `/policies/refund` §06, `/discoveries/[id]` metadata description, `/pipeline` funnel narration ("seven gates: ... rank. narrow"), `api/stripe/connect/login-link` + `refresh` error strings. Five files. |
| `7b5fc46` | `copy(legal): sweep prose em-dashes to colons, section marks to words` — applies design-mastery verdict #1: ~52 swaps across `creator-agreement` (~37 dashes + 1 §) and `content-safety` (~14 dashes + 2 §). Em-dash here was acting as a typographic colon; colon is the only replacement that preserves label-body hierarchy. One mid-clause aside (`"rails — depends on"`) became parens instead. |
| `93a17f4` | `docs(brand): document eyebrow-step exception in DESIGN.md` — applies design-mastery verdict #2: declares the wizard step header pattern `"NN — verb · duration"` as a documented exception to the no-em-dash rule. The two-weight glyph hierarchy (em-dash strong, mid-dot weak) is what gives the eyebrow scanability at small sizes. Files in scope: `apps/web/app/app/launch/step-{1..6}/*` + `apps/web/app/app/creator/setup/page.tsx`. |
| `39a0299` | `a11y(p0): replace tabular "—" sentinels with sr-only "not available"` — applies design-mastery verdict #3 on the two true-tabular-n/a cases: `methodology` priorSota (4 cells) + `for-researchers` capability matrix `drip` column (2 cells). Type widened from `string` to `string \| null`; render uses `?? <span className="sr-only">not available</span>` (Tailwind v4 sr-only utility, no extra CSS needed). Mid-dot rejected because it collides with the design system's separator vocabulary. |

## Setup repo (memory backup)
- One commit `4fd2f95 chore(memory): sync drip Sprint 2 + personal-jarvis parked` pushed to `bludragon66613-sys/Setup` main. Adds `session_savepoint_2026-04-25_drip-sprint2.md`, `todo_personal_jarvis.md`, updated `MEMORY.md` + `project_drip.md` + `todo_drip_phase0.md`. Agents already in sync (none changed since last backup).

## Misdiagnosis to remember
At first, `/tiers` table overflow was filed as a "sticky-header overlap" bug. Wrong. The nav (`position: sticky; z-index: 50; bg: white`) was working correctly. Real cause was the *label column* having `whiteSpace: nowrap` on a 180px cell with text ~250px wide unwrapped — the long label rendered on top of the adjacent data cell, giving the visual impression of header-on-content. Lesson: when two pieces of text appear stacked in a screenshot, identify the rendering tree of *each* before blaming the topmost element.

## Audit findings — design-mastery verdicts applied (closed)
Three deferred decisions resolved by design-mastery this session:

1. **Legal label-body separators** — verdict: SWEEP TO COLON. Applied in commit `7b5fc46`. Both files now 0 em-dash, 0 §.
2. **Wizard step eyebrow** (`"NN — verb · duration"`) — verdict: KEEP, document as exception. Applied in commit `93a17f4`. `brand/DESIGN.md` now has an `eyebrow-step` component-token entry that explicitly carves this out of the no-em-dash rule.
3. **Tabular sentinel cells** — verdict: empty visible cell + sr-only "not available" span. Mid-dot rejected (collides with separator vocabulary). Applied in commit `39a0299` to the two true-tabular-n/a cases (methodology priorSota, for-researchers `drip` column).

## Sentinel call sites still open (loading / value semantic, not n/a)
Three call sites match the `"—"` pattern but are NOT tabular-no-data sentinels — they are loading placeholders or value fallbacks. Held back because they need different treatment (skeleton, "loading...", or stay as-is depending on UX intent):
- `apps/web/app/pipeline/funnel-view.tsx`: 4 stat-card fallbacks (`state.stats ? formatNum(...) : "—"`) — loading state, will populate from live SSE.
- `apps/web/app/molecules/[id]/page.tsx`: 1 final_rank fallback (`candidate.final_rank ?? "—"`) — could be either "rank not yet computed" or "no rank applicable".
- `apps/web/app/thanks/page.tsx`: 1 cents-formatter return (`if (cents == null) return "—";`) — null means "no charge" / free / not-applicable.

Pull these into a separate "loading + nullable value rendering" decision when convenient.

## Migration apply task — HALTED on prod-state-unknown
- Postgres IS linked to drip-samples (16 PG env vars in production). PENDING.md §1.1 (Postgres not linked) is RESOLVED.
- BUT: there is **no migration tracking table on prod**. `packages/db/MIGRATIONS.md` says migrations apply manually via `psql $DATABASE_URL -f <file>`, and the "Applied" checklist inside that doc only lists 0001-0003 of 17 migrations — stale. `_journal.json` only knows 0001/0002 because `drizzle-kit generate` is broken (BigInt bug, see `MIGRATIONS.md:14`).
- Result: prod schema state cannot be inferred from any local artifact. Cannot safely apply 0007 + any other unapplied migrations without first auditing the live schema against each file.
- Pulled `packages/db/.env` for read access (gitignored, won't commit, contains live DATABASE_URL).
- **Next step before any apply:** spawn one Sonnet agent to write a read-only `scripts/audit-prod-schema.ts` that connects, queries `pg_catalog`, and outputs which migrations look applied vs missing. ~15 min job. Do not blind-apply.

## CI guard task (T3.7) — HALTED, plan was wrong
- PLAN.md T3.7 says "extend `.github/workflows/ci.yml`". Neither `.github/workflows/` nor `scripts/` exist in this repo. **No CI pipeline at all.**
- T3.7 is therefore not a 30-min lint extension — it's "first GitHub Actions setup for the monorepo" (pnpm install + cache, 7-workspace typecheck, vitest matrix, optional Vercel build verify) THEN bolt on the tier-nomenclature grep.
- Update PLAN.md when you next touch Sprint 3: split T3.7 into `T3.7a — bootstrap monorepo CI` and `T3.7b — tier-nomenclature grep guard`.

## PENDING.md secret leak (open)
Reading `docs/PENDING.md` early in session piped two live webhook secrets into the session jsonl per `feedback_secret_handling.md`:
- MoonPay webhook secret (32-byte hex)
- Helio webhook bearer token (32-byte hex)

Required before any PENDING.md commit lands:
1. Rotate both via provider dashboards (MoonPay → Developer; Helio → API)
2. Update Vercel prod env vars `MOONPAY_WEBHOOK_SECRET`, `HELIO_WEBHOOK_TOKEN`
3. Update provider webhook configs with new values
4. Then redact PENDING.md tokens to `<rotated 2026-04-26>` and commit

Until rotation completes, leave PENDING.md untracked.

## Sprint 3 status
Still blocked on Matteo's 7 PR #1 questions for Phase B parts. Tasks T3.1–T3.7 unchanged from 2026-04-25 savepoint.

## Open queue (requires Rohan / external / next session)
1. **Rotate MoonPay + Helio webhook secrets** (above), then redact + commit PENDING.md
2. **Audit prod schema** before any migration apply (see HALTED block above). After audit: apply whatever's missing, then update `MIGRATIONS.md` checklist.
3. **Bootstrap monorepo CI** — prerequisite for T3.7b tier-nomenclature grep guard. Probably one of the first non-Matteo-blocked Sprint 3 tasks.
4. **Loading-state vs value-semantic `"—"` cells** — the 3 call sites left out of the sentinel sweep need their own decision (skeleton, sr-only "loading", value-aware UX).
5. **Sprint 3** — still blocked on Matteo's 7 PR #1 questions for Phase B (T3.1-T3.6). Only the CI bootstrap above is independent.

## Visual verify summary (Vercel preview)
- `/tiers`: em-dash count 0, § count 0, table layout clean
- `/methodology`: em-dash count 4 (all priorSota sentinels), § count 0
- `/for-researchers`: em-dash count 2 (capability matrix sentinels), § count 0
- Brand rules pass on all three: single red bar/viewport ✓, hairline tables ✓, tabular numerals ✓, no stray buttons ✓, TierBadges render ✓
