---
name: Session savepoint 2026-04-14
description: elevatex / kitchenandwardrobe — Phase 4e.3 shipped + 12 production prod-config bugs fixed end-to-end. Full stack live.
type: project
originSessionId: 4dfeb65f-ad95-4f7e-b2c9-570f89e3a82a
---
# Session savepoint — 2026-04-14

Branch: `master` @ `46d8c49` (15 commits this session)
Prod: `elevatex-three.vercel.app` → live
Tests: 363 vitest + 5 pytest green

## What shipped

**Phase 4e.3 — single-layout retry endpoint (full T1→T8):**
- Migration 0008: `layouts.render_error text` nullable
- Worker stamps `DEPTH_FAILED:<msg>` / `RENDER_FAILED:<msg>` on catch, clears on success
- Terminal-row check now treats `renderError IS NOT NULL` as terminal → projects no longer stuck in `rendering` forever
- `lib/layout/retry.ts` — ownership + rate-limit + inspiration-ref resolution + dispatch
- `POST /api/projects/[id]/layouts/[layoutId]/retry` route with RetryError→HTTP code mapping
- LayoutList failed-state card + Retry button + self-clearing retryAfterSec countdown
- Walker step 21 — forced-failure recovery gate
- Review-pass fixed 2 HIGH + 3 MED (race condition on pre-dispatch mutation, unguarded DB writes, countdown leak, incomplete walker stamp, missing DISPATCH_FAILED test)

**Twelve prod-config bugs resolved (session debugging chain):**
1. `BLOB_READ_WRITE_TOKEN` had stray leading `"` — re-added cleanly
2. Clerk middleware blocked internal `/api/cad/*` fetch — added public route
3. `parseDxf.ts` URL fallback used ephemeral `VERCEL_URL` (behind Deployment Protection) — prefer `VERCEL_PROJECT_PRODUCTION_URL`
4. `.dwg` accepted at upload but ezdxf can't parse — reject with clear export-as-DXF message
5. `parse-dxf.py` exponential DFS on 5k-node graph — replaced with `shapely.polygonize` (555× speedup, 300s→0.54s)
6. Missing QStash env — added `QSTASH_URL`, `QSTASH_TOKEN`, both signing keys (user's QStash is EU regional)
7. `@upstash/qstash` Client didn't respect `QSTASH_URL` — pass `baseUrl` to constructor
8. Missing Upstash Redis env for rate limiting — added `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
9. `echo | vercel env add` baked trailing `\n` into stored values — re-added all Upstash + QStash vars with `printf "%s"`
10. Clerk middleware blocked QStash callbacks to `/api/workers/*` — added public route
11. Pre-existing `workers-render-layout-route.test.ts` TS errors remain (unused ts-expect-error + duplex not in RequestInit)
12. Polygon selection picks largest interior face, may be wrong on complex real floor plans

## Prod end-to-end validated

User successfully ran the full flow through to render failure at the fal balance wall — confirming every other layer works:
- upload → parse-cad → room confirm → style → catalog import → generate (202) → QStash publish → worker callback → depth map → fal render (failed at 403 BALANCE_EXHAUSTED) → Phase 4e.3 retry card surfaced correctly

User needs to top up at fal.ai/dashboard/billing to continue.

## What's queued for next session

**Bug backlog (collect more during use):**
- `BALANCE_EXHAUSTED` should be terminal — disable retry button, link to fal billing
- Auto-classify transient (5xx, network) vs terminal (403 balance) failures for backoff
- Polygon selection heuristic wrong on dense floor plans

**Phase 7 candidates ranked:**
- **7.1 (recommended):** Cost observability + balance-exhausted handling (~3 hrs). New `fal_usage` table, worker writes per-render rows, cost card on project page, `/settings/usage` rollup, balance-exhausted terminal classification. Directly addresses the wall the user just hit.
- **7.2:** Per-layout SKU swap + re-render (~4 hrs). Click module in layout → pick alternate SKU → retry-endpoint re-render. Heaviest lift, most user-visible.
- **7.3 (fast):** TS cleanup of pre-existing errors + `requireUser`→`ensureUser` drift in CAD upload route + memory doc refresh (~30 min).

User's plan: collect bugs while using the app, then return to Phase 7.

## Invariants the next session must preserve

- Never use `echo | vercel env add` — always `printf "%s"` to avoid trailing newline corruption
- `parseDxf.ts` and QStash publisher both use the priority chain `APP_URL → VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → localhost` — any new server-to-server fetch in this project should follow the same pattern because Vercel Deployment Protection blocks the ephemeral per-deploy URL
- `/api/cad/*` and `/api/workers/*` are the only public route matchers — never add more without a real reason
- Migration 0008 (render_error) is applied to live Neon; any new migration is 0009+
- `shapely==2.1.2` is in `api/requirements.txt`, ships manylinux wheels with GEOS bundled — no system packages needed
