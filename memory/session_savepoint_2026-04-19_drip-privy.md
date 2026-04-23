---
name: session savepoint 2026-04-19 drip privy migration
description: drip funnel shipped end-to-end + Clerk→Privy swap complete on master; next session picks up after user provisions Privy app + sets env vars
type: project
originSessionId: 9d4a58b3-dae9-4831-a640-ccc3945b3c87
---
# drip session 2026-04-19 — pipeline funnel + Privy migration

## What shipped this session (8 commits on master, f966e4d → a9286ef)

### Funnel backend + UI
- `packages/db/src/migrations/0000_baseline.sql` — fresh-DB baseline
- `packages/db/src/migrations/0008_funnel_events.sql` — generation_batches, candidates, gate_events, lockin_events
- `packages/db/src/repositories/funnel.ts` — full repo (startBatch, bulkInsertCandidates, recordGateEvents, eliminateCandidates, rankSurvivors, completeBatch, recordLockin, setBroadcast, getLockinByMoleculeId, getCandidateWithGates, recentBatchesForCreator, latestCompletedBatchForCreator, unclaimedLockins, candidatesForBatch)
- `apps/web/lib/funnel/generator.ts` — deterministic mulberry32 7-gate scorer (60/20/50/30/40/25 kill rates per /pipeline spec)
- `apps/web/lib/funnel/run-batch.ts` — shared batch runner used by cron + reroll
- `apps/web/lib/funnel/redact.ts`, `events.ts` — redact last 3 residues, SSE event union
- `apps/web/app/api/cron/generate-candidates` — house batch every 5 min (vercel.json cron)
- `apps/web/app/api/cron/payout-sweep` — stub 95/5 split, no on-chain yet
- `apps/web/app/api/pipeline/feed` — nodejs SSE firehose, DB warm-start (recent 3 broadcast batches), synthetic fallback
- `apps/web/app/api/funnel/claim` — POST mints molecule_id, records lockin, flips candidate status
- `apps/web/app/api/funnel/reroll` — POST kicks a creator-scoped private batch
- `apps/web/app/api/funnel/broadcast` — POST flips is_broadcast
- `apps/web/app/pipeline/page.tsx` + `funnel-view.tsx` — rewrote log-tail feed as selection-pressure spectacle (generation burst, Sankey gauntlet, final-5 ceremonial, recent lockins, live totals)
- `apps/web/app/molecules/[id]/page.tsx` — SEO provenance page w/ dynamic og metadata
- `apps/web/app/app/dashboard/funnel/` — creator cockpit (page + cockpit.tsx client, reroll button, per-batch broadcast toggle, claim)

### Neon DB live
- Project: `neon-drip-markets` on Vercel drip-samples
- 19 tables applied via custom runner `packages/db/src/apply-sql-migrations.ts`
- `_sql_migrations` tracker seeded so 0001-0008 register as applied
- drizzle-kit push blocked by BigInt serialization bug; runner is the path forward for future migrations

### Clerk → Privy migration (cca2c52 + a9286ef)
- Removed `@clerk/nextjs`, `@clerk/themes`
- Added `@privy-io/react-auth@2.25`, `@privy-io/server-auth@1.18`
- `apps/web/lib/privy.ts` — server client, cookie verify (`privy-id-token`, `privy-token`)
- `apps/web/lib/auth.ts` — same shape, now reads Privy cookie. 1 user = 1 creator. creator_id = Privy DID.
- `apps/web/lib/use-creator.ts` — client hook fetches /api/creator/me, replaces useOrganization()
- `apps/web/components/providers.tsx` — PrivyProvider wrapper (email + google + wallet; embedded-wallet auto-create)
- `apps/web/middleware.ts` — clerkMiddleware removed; subdomain rewrite + soft /app/* → /app/onboard redirect
- `/api/creator/create` — POST, upserts user + creates creator row keyed to DID
- `/api/creator/me` — GET, creator snapshot for client hooks
- `/api/webhooks/privy` — handles user.created / user.linked_account (svix verify optional)
- `/app/onboard` — Privy sign-in button + path picker
- `/app/creator/setup` — display_name + slug form (replaces Clerk CreateOrganization)
- `/app/dashboard`, `/app/products` — ported to useCreator()
- 4 Stripe Connect routes now read stripe_connect_id from creators row
- Deleted `/sign-in`, `/sign-up`, `/api/webhooks/clerk`

## Blocker to resume

Pages won't auth until Privy is provisioned.

### User action next session (10 min)
1. Create Privy app at https://dashboard.privy.io
2. Enable login methods: **Email + Google + Wallet (Solana)**
3. Enable embedded wallets: "create on login for users without wallets"
4. Enable **cookies** (Authentication settings) — required for `privy-id-token` cookie
5. Grab App ID + App Secret
6. Set on Vercel:
   - `NEXT_PUBLIC_PRIVY_APP_ID`
   - `PRIVY_APP_SECRET`
   - `DRIP_ADMIN_DIDS` (after first sign-up, admin whitelist)
   - `PRIVY_WEBHOOK_SIGNING_KEY` (optional, only if adding a Privy webhook)
7. Redeploy. Sign up → /app/creator/setup → /app/dashboard/funnel

## Infra state
- Vercel cron `/api/cron/generate-candidates` firing every 5 min
- Neon connected
- 15 tables + funnel tables + _sql_migrations tracker live
- Stripe webhook secrets set (HELIO_WEBHOOK_TOKEN, MOONPAY_WEBHOOK_SECRET, DRIP_AGENT_API_KEY, STRIPE_SECRET_KEY)
- Missing: DRIP_TREASURY_WALLET, MOONPAY_*, HELIO_* checkout vars, NEXT_PUBLIC_APP_URL, CRON_SECRET, www CNAME

## Next PR scope (when Privy is live)
- Reweight gate sliders (needs `creator_gate_weights` table)
- Pin candidate action (needs `candidate_pins` table or column)
- Rejected candidates CSV export from cockpit
- Real `payouts` table + Solana USDC transfer via Privy embedded wallet
- Rename `creatorsRepo.createFromClerk` → `createFromAuth` (cosmetic)

## Session context
- drip.markets is live, pipeline spectacle ships on synthetic stream + DB warm-start
- `/molecules/<id>` SEO pages compile once cron seeds real lockins
- Creator cockpit is full-featured (reroll + broadcast + claim) pending Privy auth
- Repo: github.com/bludragon66613-sys/Drip on master
- Local worktree: ~/drip (no branches, straight on master per project style)
