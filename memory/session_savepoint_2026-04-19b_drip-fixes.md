---
name: session savepoint 2026-04-19b drip post-crash fixes
description: continuation session after PC crash — 6 commits closing wizard + pending dev TODOs; migrations 0009/0010/0011 applied to prod
type: project
originSessionId: 9447490a-eaba-4aa2-8953-862247a9db57
---
# drip session 2026-04-19b — fixes after crash

Continuation of 2026-04-19 (savepoint `session_savepoint_2026-04-19_drip-privy.md`).
All 5 "next PR" tasks from that savepoint's docs/PENDING.md and the wizard
dead-route fallout are now shipped on master.

## 6 commits landed (f6c60bb → fa60c99, all pushed to origin/master)

| SHA | Title |
|---|---|
| 378a13f | feat(wizard): same-origin brand/generate + storefront/launch + catalog |
| bb8f5a8 | refactor(creators): rename createFromClerk → createFromAuth |
| f6c60bb | feat(funnel): per-creator gate kill-rate overrides |
| 312d4ee | feat(funnel): pin candidate action on cockpit survivors |
| 7ba1582 | feat(payouts): real payouts ledger + idempotent sweep |
| fa60c99 | feat(funnel): rejected-candidates CSV export per batch |

## Migrations applied to prod (2026-04-19)

Ran `pnpm tsx --env-file=../../.env.vercel.prod src/apply-sql-migrations.ts`.
Skipped 0000–0008 (already applied), applied:
- 0009_creator_gate_weights.sql
- 0010_candidate_pins.sql
- 0011_payouts.sql

All 3 runtime features (gate sliders, pin toggle, payout sweep) should
now work against prod without 500s.

## Wizard same-origin routes

Wizard was calling `localhost:8787` (apps/api Hono service, not deployed).
All 4 wizard endpoints now live at same-origin `/api/v1/*` as Privy-authed
Next routes under `apps/web/app/api/v1/`:
- `/api/v1/discover` — 10-candidate mock, persists to sequences_claimed (shipped in prior session fc2079e)
- `/api/v1/brand/generate` — deterministic mock brand, persists a brand row per call so the subsequent launch has a real brand_id
- `/api/v1/storefront/launch` — validates creator + brand + slug, updates creator launch state, returns mock drip.markets URL
- `/api/v1/catalog` — projection of the shared seed-catalog into wizard PeptideCandidate shape

All 4 return `{success, data: ...}` envelope matching what the client's
`apiPost/apiGet` in `lib/api-client.ts` unwraps.

## Funnel features

### Gate weight overrides
- Table `creator_gate_weights` keyed on creator_id with jsonb weights map
- Scorer (`scoreCandidate`, `scoreBatch`) accepts an overrides map
- `runGenerationBatch` pulls weights only when creator-scoped (house batches + broadcast stay fair)
- `GET/PUT /api/funnel/gate-weights`
- Cockpit "selection pressure" section with 6 sliders (0–1 step 0.05), stores only diverging values

### Pin candidates
- Table `candidate_pins` unique on (creator_id, candidate_id) — double-tap is no-op
- `GET/POST/DELETE /api/funnel/pin`
- Cockpit survivor cards grow a diamond toggle (◇ / ◆)
- Pins survive across batches and rerolls; independent of lockin

### Rejected CSV export
- `GET /api/funnel/batches/[batchId]/rejected.csv` — text/csv attachment
- Creator-gated (owning creator only — even for broadcast batches)
- Filters status='eliminated' or killed_by_gate not null
- Columns: rank, sequence, peptide_class, composite_score, status, killed_by_gate, created_at
- Cockpit batch history row grows a `csv ↓` link per batch

## Payouts (deliberately real-capable, mock-by-default)

- Table `payouts` unique on lockin_id → sweep is idempotent
- `apps/web/app/api/cron/payout-sweep/route.ts` rewritten to real state machine:
  pending → sent | failed | no_wallet (no_wallet stays retryable)
- `lib/payouts/resolve-wallet.ts` — `PrivyClient.getUserById(creatorPrivyDid)` → wallet address or null
- `lib/payouts/solana-transfer.ts` — env-gated adapter with base58 destination shape check + typed errors; mock path returns synthetic signature; real path throws until Solana libs installed

### To activate real transfers (follow-up PR)
1. `pnpm add @solana/web3.js @solana/spl-token -F @drip/web`
2. Set on Vercel prod: `DRIP_TREASURY_PRIVATE_KEY` (base58 64-byte keypair), `DRIP_SOLANA_RPC_URL`, `DRIP_USDC_MINT` (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` mainnet)
3. Swap the `throw` in `solana-transfer.ts` with a signed SPL-USDC transfer to the destination's associated token account
4. Schedule the sweep cron in `vercel.json` (still not scheduled because real signer unshipped)

## Known follow-ups (not blocking)

From `docs/PENDING.md` still open:
- `www.drip.markets` CNAME at Namecheap (`cname.vercel-dns.com`)
- Stripe-column eventual removal (migration 0012 to drop `orders.stripe_payment_intent_id`)
- Wire real products replacing `DEMO_SKUS` in `lib/checkout-intent.ts`
- Webhook integration tests (MoonPay signed payload, Helio bearer, 503 on missing env, etc.)
- Missing Vercel env vars for checkout: `DRIP_TREASURY_WALLET`, `MOONPAY_*`, `HELIO_*`, `NEXT_PUBLIC_APP_URL`

## Repo state at session end
- Branch master, 6 commits ahead of remote at start of session, all pushed
- Typecheck clean (web + db)
- No uncommitted changes other than the savepoint-era untracked files
  (`.env.vercel.prod`, `docs/PENDING.md`, `packages/db/src/migrations/0007_orders_multi_rail.sql` which was already applied)
- Local worktree: `~/drip`
