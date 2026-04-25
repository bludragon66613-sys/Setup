---
name: drip Sprint 2 cleanup + 0007 migration tracked
description: Resume-then-cleanup session. Tracked the orphan 0007_orders_multi_rail.sql, swept hard-rule glyph violations (em-dashes + §) from Sprint 2 pages, fixed comparison-table label-column overflow, ran an incidental cross-repo sweep, synced memory backup. Branch 21 commits ahead, all pushed.
type: project
originSessionId: c3d684ef-41d9-46c6-b93f-25e2e24680f9
---
# 2026-04-26 — drip Phase 0 cleanup pass

## Branch state at session end
- `phase-0-novelty-gateway` — **21 commits ahead** of `origin/master` (was 17 at start; +4 commits this session, all pushed)
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

## Setup repo (memory backup)
- One commit `4fd2f95 chore(memory): sync drip Sprint 2 + personal-jarvis parked` pushed to `bludragon66613-sys/Setup` main. Adds `session_savepoint_2026-04-25_drip-sprint2.md`, `todo_personal_jarvis.md`, updated `MEMORY.md` + `project_drip.md` + `todo_drip_phase0.md`. Agents already in sync (none changed since last backup).

## Misdiagnosis to remember
At first, `/tiers` table overflow was filed as a "sticky-header overlap" bug. Wrong. The nav (`position: sticky; z-index: 50; bg: white`) was working correctly. Real cause was the *label column* having `whiteSpace: nowrap` on a 180px cell with text ~250px wide unwrapped — the long label rendered on top of the adjacent data cell, giving the visual impression of header-on-content. Lesson: when two pieces of text appear stacked in a screenshot, identify the rendering tree of *each* before blaming the topmost element.

## Audit findings held back (need design call before sweeping)
Sweep candidate but not done — these patterns may be intentional and would change visual rhythm of legal docs / wizard flow:
- `apps/web/app/creator-agreement/page.tsx`: ~35 prose `—` instances. List items use `"label — body"` pattern as a deliberate design separator. One `§05` reference.
- `apps/web/app/content-safety/page.tsx`: ~14 prose `—`. Same list pattern. Two `§02`/`§03` cross-references.
- `apps/web/app/app/launch/step-{1..6}/*`: 7 instances. Wizard eyebrow pattern `"01 — describe · 2 min"` repeated across all six wizard steps. Replacing this changes brand cadence.

Ask design-mastery to rule on these three categories before doing a second sweep.

## Tabular `—` sentinels (left intact, design call needed if changing)
Functional no-data markers, not prose:
- `/methodology` priorSota cells (4)
- `/for-researchers` capability matrix priorSota (2)
- `/pipeline` funnel-view stats fallback (4 lines)
- `/molecules/[id]` final_rank fallback (1)
- `/thanks` cents-formatter fallback (1)

Per `feedback_copy_style.md` strict reading these violate the rule. But every replacement (period, comma, colon) breaks the no-data semantic. The mid-dot `·` is allowed and could work — flagged but not changed.

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

## Open queue (requires Rohan / external)
1. **Rotate MoonPay + Helio webhook secrets** (above), then redact + commit PENDING.md
2. **Apply migrations to prod DB** (operator): 0001-0006, 0007 (new this session), 0008-0016 — assumes Postgres still linked
3. **Design-mastery decision** on legal/wizard em-dash patterns
4. **Decide tabular sentinel strategy** — keep `—`, swap to `·`, or live with the policy edge case

## Visual verify summary (Vercel preview)
- `/tiers`: em-dash count 0, § count 0, table layout clean
- `/methodology`: em-dash count 4 (all priorSota sentinels), § count 0
- `/for-researchers`: em-dash count 2 (capability matrix sentinels), § count 0
- Brand rules pass on all three: single red bar/viewport ✓, hairline tables ✓, tabular numerals ✓, no stray buttons ✓, TierBadges render ✓
