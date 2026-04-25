---
name: drip
description: Shopify for AI-designed peptide brands at drip.markets. Creator describes product → discovery engine generates novel molecule → brand + storefront auto-generated → live in 60 minutes. Platform takes 20/15/10% tiered. $DRIP on Base engineered for $20-28M/mo on-chain velocity. Agent-native day one. V2 consolidated 2026-04-17 from Rohan V1 + Matteo business plan.
type: project
originSessionId: 75c493c7-8421-47f0-8061-63c5bdfba481
---
# drip

**Brand name:** drip (lowercase, no "protocol" suffix)
**Platform:** drip.markets (domain secured 2026-04-17)
**Token:** $DRIP
**Repo:** github.com/bludragon66613-sys/drip-protocol (private, renaming to `drip`)
**Local:** `~/drip/`
**Spec:** `~/drip/DRIP-V2.md` (V2, consolidated single-source-of-truth) supersedes `~/drip/DRIP-MARKETS-V1.md` (V1 platform draft) + `~/drip/DRIP-PROTOCOL-V2.md` (legacy single-brand DTC) + Matteo's `DRIP_BUSINESS_PLAN.md` from Telegram 2026-04-17
**Domains:** drip.markets (secured). dripprotocol.ai NOT pursued (decision 2026-04-17 — user: "we're not getting drip protocol")
**Legal (V2):** Cayman/BVI Foundation for $DRIP + Wyoming LLC for vendor agreements ($10-20K Y1 total). Delaware C-corp explicitly dropped.
**Founders:** Rohan (Tetsuo420, platform/build/brand/GTM) + Matteo (cybergenesis621, discovery model + token contracts)
**Team:** Stalino + Anna assist per Matteo 2026-04-16

## One-liner (V2)

Shopify for the AI-peptide era. Creator describes a product → discovery engine generates novel exclusive molecule → AI generates brand → live storefront in 60 min. Platform takes 20% tiered down to 10% at $1M. $DRIP on Base engineered for velocity not scarcity: $20-28M/mo utility on-chain volume at 1K creators before speculation. Agent-native day one.

## Pivot history

- **V1 → V2 (single-brand → platform, 2026-04-16):** Matteo flipped "we sell DRIP hair serum" to "platform for creators to launch their own." Zero inventory risk, scale without per-product lift.
- **V1 platform draft → V2 consolidated (2026-04-17):** Rohan V1 platform spec + Matteo business plan reconciled into single DRIP-V2.md. Major deltas: Stripe Atlas Delaware→Cayman+Wyoming, 4-mechanic token→12-mechanic velocity, 503A Rx→cosmetic+research only, 21-day sprint→90-day vertical slice, creator-native→creator+agent-native day one, shared-catalog-primary→novel-molecule-primary with catalog fallback.
- **Chain decision locked 2026-04-17 (later that day):** Solana, NOT Base. Reverted briefly-considered Base pivot. Rationale: cheapest fees for micro-tx velocity thesis (agents hammer thousands of micro-tx/day), Meteora DLMM best drop-window UX, Light Protocol compressed accounts = dirt-cheap agent wallet provisioning, Jupiter for double-swap, Matteo's V2 Solana scripts already exist so port-forward not rewrite.

## Regulatory window

RFK Jr. announced 2026-02-27: 14 of 19 banned peptides moving off FDA restricted list → legal again via 503A compounding pharmacies with Rx. FDA advisory meeting scheduled July 2026. Formal rule not yet published (as of 2026-04-17). Category 1 candidates: BPC-157, TB-500, Ipamorelin, CJC-1295, Sermorelin, Tesamorelin, PT-141, Selank, Semax, Epithalon, GHK-Cu, KPV, Thymosin Alpha-1, DSIP. Launch-before-July window.

## Competitive map (validated 2026-04-17)

- **Medixa.ai** — closest competitor. AI peptide dispensary SaaS for practitioners. HIPAA, branded storefront in 2 days, 503B sourcing, $114-186K/yr per practitioner projected. No creator layer, no discovery, no token, practitioner-only. Biggest threat to execute-against.
- **Dr. Peptide (peptideprotocols.ai)** — B2B AI protocol agent for clinicians. No dispensary.
- **GetPeptideHelp** — consumer AI quiz $29-79, referral to practitioner.
- **PeptideProtocols.io** — reference library $19-299/mo, no AI.
- **Maximus** — single-brand DTC, $199/mo, 50K+ Discord, 50-state compounding pharmacy network, 146-marker labs.
- **VRIL Labs / vrilpeptides.shop** — AI bloodwork → protocol → shop funnel, mythology brand, 22 research peptides $27-136, 3-vial MOQ, SOL/USDC/card.
- **Ascension Peptides** — 32 peptides, multi-format, Wolverine Stack, USA-only, launched Jul 2024.
- **Peptide Partners** — research chem vendor, GLP-2 Tirz $297-3090, high-ticket.
- **pump.science** — DeSci token speculation without discovery.

Only drip hits: AI novel-molecule discovery + creator economy + agent-native + velocity-engineered token + cosmetic-first speedrun legal. No competitor >2 of these.

## Architecture (V2)

- Frontend: Next.js 16 on Vercel (reuse V2 dashboard shell)
- Auth: Clerk multi-tenant (consumer / creator / admin / agent identity)
- DB: Vercel Postgres + Blob
- Payments: Stripe Connect (creator payouts) + Jupiter aggregator for USD↔$DRIP↔USDC double-swap + Helio for direct SOL/USDC checkout
- Pipeline: Python + RunPod Serverless (zero idle, ESM-2 pre-cached FlashBoot)
- Content: Claude + Flux via Replicate + Seedance direct (NO Higgsfield — confirmed scam)
- Ads: Meta + TikTok + YouTube Marketing APIs via dev accounts (no ban risk)
- CMO: 3-5 contract manufacturers for formulation + fill-finish, aggregate MOQ across creators
- 3PL: ShipBob / ShipMonk / 3PL Central — pick one for v0.1
- Token: $DRIP on **Solana** (locked 2026-04-17) — SPL Token-2022, Meteora DLMM with Fee Scheduler, Streamflow LP locks + vesting, Jupiter for swap aggregation
- Agent-native: Dual-lane API (human UI + `api.drip.markets/v1`), MCP server, scoped API keys, agent smart-contract wallets, reputation registry, sandbox tier

## Regulatory path (V2 — simplified)

**DROPPED from V1:** 503A Rx tier, MD telehealth partner, compounding pharmacy partnerships.
**KEPT:** Cosmetic topicals (self-certified, no FDA, no therapeutic claims — content safety layer blocks) + Research-chemical tier (MSDS, research-use-only).

## $DRIP tokenomics (V2 — velocity-engineered)

**12 mechanics across 5 tiers** targeting $20-28M/mo on-chain volume at 1,000 creators before speculation:
- **Tier 1 continuous:** double-swap payout rails ($12M/mo floor), metered inference gas, daily ad auctions
- **Tier 2 spikes:** synthesis slot auctions (weekly), sequence claim competition, drop windows (24hr, $DRIP-only)
- **Tier 3 expiring credits:** ephemeral rewards (90-day expiry, biggest anti-hoard lever), loyalty cashback
- **Tier 4 market:** prediction markets on wet-lab outcomes (Polymarket integration v0.3), creator backing markets, cross-creator collab routing
- **Tier 5 liquidity:** protocol-owned Uniswap v4 LP with dynamic fee hooks, MM incentive program

**NO** governance, NO native-token staking yield, NO cliff walls, NO forced-token consumer UX.

## Legal posture (V2 — speedrun)

- Entity: Cayman/BVI Foundation (issues $DRIP, owns contracts, $8-15K, 4-6 wks) + Wyoming LLC (vendor agreements, $200-500, 1-3 days). NO Delaware C-corp.
- Platform is rails, not seller-of-record (Shopify posture)
- AI-drafted ToS/privacy/creator-agreement (Claude)
- Smart contracts audited in-house (Claude + Slither + Mythril + fuzzing), spot external audit $500-2K if contract handles real TVL
- Pay-as-you-go counsel only (RPC, Gordon Law, Telegram-accessible)
- **Y1 legal total: $10-20K**

## Rev share (V2 — flat tiered, no token required)

- 20% of gross revenue → 15% at $100K creator lifetime → 10% at $1M
- Alt tier: $99/mo flat + 8% rev share
- No upfront, no setup, no token required for best terms

## Business math (V2)

| Year | Creators (human/agent) | GMV | Platform rev | $DRIP vol |
|---|---|---|---|---|
| 1 | 100 (70/30) | $7.2M | $1.4M | $2-4M/mo floor |
| 2 | 1,000 (60/40) | $72M | $14M | $20-28M/mo + agent × |
| 3 | 5,000 (40/60) | $360M | $65M | $100-200M/mo, 70% tx from agents |

## MVP roadmap (V2 — 90-day vertical slice)

- **v0.1 (Days 1-90):** one creator + one product + one CMO + one channel. Shared catalog fallback OK. Agent surface (OpenAPI + MCP + sandbox) day one.
- **v0.2 (Days 91-150):** auto-spend ads, multi-channel, Flux imagery, 3 carriers, subscriptions, EU shipping, A2A marketplace.
- **v0.3 (Days 151-240):** in-silico safety screen, MOQ aggregation, regulatory wizard, autonomous ad loops, prediction markets, protocol-owned Uniswap v4 LP on Base.
- **v1.0 (Days 241-420):** multi-region mfg, 5+ CMOs, creator backing markets, collab routing, full agent CX, CEX listings with MM program.

## Visual direction (locked 2026-04-18b)

**Direction:** Swiss Clinical. Vignelli × Wim Crouwel × Müller-Brockmann × MIT Media Lab × Lars Müller Publishers. Picked from a 10-tab `/samples` comparison against pharma brutalism, japanese pharmacy, luxury black card, hi-vis industrial, plus the prior 5 clinical-report variants.

**Pillar weighting:** Vignelli/Crouwel/Müller-Brockmann 60% (platform surfaces), MIT Media Lab/Lars Müller 25% (`/manifesto`, `/creators`, `/pipeline`, `/agents`, long-form), Function Health/Levels 15% (live status overlays only — not a whole-surface aesthetic anymore).

**Posture rules (BRAND-V0.1 §14.1):**
- White ground (`#FFFFFF`), ink only (`#0A0A0A`), single red accent (`#E2231A`).
- **Single-red budget per viewport: max 2 occurrences.** Used for live-status `.bar-live`, primary CTA underline, active item in a list. Never decorative.
- 12-col asymmetric grid. Crouwel's logic: alignment over symmetry.
- Numerals are the architecture — 96/120/144px tabular numerals carry sections; headlines support them.
- **No buttons except form submits.** All other CTAs are text + 2px red underline (`.cta-primary`) or text + 1px stone underline (`.cta-secondary`).
- No gradients, no shadows, no glassmorphism, no rounded boxes (inputs at 2px excepted).
- Lowercase voice retained (predates the visual system).

**Quarantined surfaces:**
- `/drip` token basement stays dark (`--color-ink` bg, `--color-bone` fg, `--color-saline` accent). Explicit `colorScheme: "dark"` override on `<main>`.
- Creator storefronts at `/_creator/[slug]` opt out — own palette per BRAND.md §8.

**Frozen reference:** `apps/web/app/samples/_variants/swiss.tsx` + `apps/web/app/samples/page.tsx`. The 10-tab comparison was retired.

**Token bindings (apps/web/app/globals.css):**
- New: `--color-paper #FFFFFF`, `--color-rule #0A0A0A`, `--color-red-accent #E2231A`, `--text-mega-1/2/3 96/120/144px`, `--font-serif-basement` (Instrument Serif quarantined to /drip).
- New utility classes: `.cta-primary`, `.cta-secondary`, `.rule-data`, `.rule-meta`, `.bar-live`, `.tabular-nums`. `.display` defaults to Geist Bold.

**Parseable token contract (added 2026-04-25):** `~/drip/brand/DESIGN.md` — google-labs-code/design.md spec, 12 colors + 15 typography + 2 rounded + 6 spacing + 18 component contracts. Lints 0/0/1. Read this FIRST before any drip frontend design work, run lint as the design-mastery pre-build gate. `BRAND.md` stays as voice/lore/copy bible. `apps/web/app/globals.css` stays as runtime Tailwind v4 `@theme`. Drift between contract names (`primary`, `tertiary`) and runtime names (`paper`, `red-accent`) is documented in `~/drip/brand/DESIGN.drift.md`. Linter is local-only at `~/drip/node_modules/@google/design.md/dist/index.js` — devDep deliberately NOT committed (Vercel build bloat + auto-revert bot stripped it once on 2026-04-25 19:48). Fallback: `pnpm dlx @google/design.md@0.1.1 lint brand/DESIGN.md`.

## Status (2026-04-17, end of builder-layer session)

- drip.markets domain secured (user)
- Brand bible, content, legal templates all written
- Monorepo scaffolded: apps/{web,api,pipeline,agents}, packages/{ui,db,contracts,tokens,sdk}
- Landing page (Next.js 16) live with 8 sections + waitlist API + subdomain middleware
- Clerk multi-tenant auth scaffolded (4 user types)
- Stripe Connect Express onboarding + platform fee tiers (20/15/10) + webhooks + creator dashboard
- Agent API (Hono) at apps/api: discover, brand, storefront, catalog, agent-launch, agents, health, **public** — scoped keys + ratelimit + OpenAPI + Zod
- MCP server at apps/agents/mcp-server exposing 7 tools
- packages/db: Drizzle schema (11 tables) + 7 repositories + seed, Vercel Postgres ready
- **packages/sdk: `@drip/sdk` TypeScript client scaffolded** (public + authed methods, fetch-only, Node20+/browser)
- Creator describe-to-launch 6-step wizard at `/app/launch` — full UI + API client
- **docs/BUILDERS.md + docs/BUILDER-GRANT-PROGRAM.md + DRIP-V2.md §19 Ecosystem layer** — builder-facing spec
- V2 spec: `~/drip/DRIP-V2.md` | Checkpoint: `~/drip/CHECKPOINT.md` | Source: `~/drip/docs/BUILDER_ECOSYSTEM_SOURCE.md` (Matteo 10-category ecosystem doc)
- **DB TODO wiring shipped** — Clerk webhook, Stripe webhook, agent-registry, waitlist API, Stripe onboarding route all persist via @drip/db (agent-registry uses relative import, not alias)
- **Builder ecosystem Tier-S trio locked:** specialist-agent marketplace (Cat 2), wet-lab validation network (Cat 5), meta-marketplace (Cat 3 — explicit "we won't build" commitment)

## Commits this session (2026-04-17 builder layer + platform hardening)

Batch 1 (builder layer):
- `182260e` feat(db): wire webhook and agent-registry persistence
- `07ba488` feat(api): add public read-only routes under /v1/public
- `917d963` feat(sdk): scaffold @drip/sdk TypeScript client
- `0afc7b6` docs(builders): add ecosystem + grant-program docs and DRIP-V2.md §19

Batch 2 (typecheck + storefront + safety):
- `dd9179b` fix(db): resolve typecheck errors across schemas and repositories
- `2f7cbce` feat(web): add creator subdomain storefront renderer at /_creator/[slug]
- `88585bf` feat(api): add content safety layer gating brand and marketing generation

Storefront renderer: app/_creator/[slug]/page.tsx + components/storefront/{hero, product-grid, product-card, product-detail, footer}, 404 on unfound/pending tier, brand CSS vars, generateMetadata SEO. Checkout stub returns 501.

Content safety: apps/api/src/lib/content-safety.ts two-layer (deterministic + Claude Sonnet). 12 vitest cases green. Wired into brand.ts + agent-launch.ts → 422 on block. Graceful degrade when ANTHROPIC_API_KEY missing.

Batch 3 (reconcile + typecheck green + real brand pipeline):
- `704acf5` chore: reconcile kickoff platform scaffolding and docs into tracked tree (89 files + .gitignore additions for .omc/, tsbuildinfo, .egg-info)
- `5680df8` fix: resolve full-repo typecheck across api, web, packages (rootDir fix, agent-registry scopes, stripe apiVersion, clerk webhook drizzle-orm dep)
- `448f836` feat(api): replace brand-gen mock with real Claude Sonnet tool-use pipeline

Real brand-gen: Anthropic tool-use `emit_brand` with catalog grounding + BRAND.md system prompt. Full response shape (wordmark, palette, typography, voice, manifesto, productLine, storefrontHero, meta). Content-safety gate + DB persist. 5 error paths (missing key → 503, upstream → 502, malformed → 502, zod → 502, unsafe → 422). 6 vitest cases. Total test count: 18/18 green. `pnpm typecheck` from root: clean.

Batch 4 (real pipelines + redis ratelimit, all env-driven graceful degrade):
- `ea5b9f9` feat(api): wire /v1/discover to RunPod Serverless with mock fallback
- `9a5692e` feat(api): wire /v1/storefront/launch to Vercel domain provisioning with mock fallback
- `8e1d3e8` feat(api): upgrade ratelimit to Upstash Redis with in-memory fallback

Batch 5 (migrations + async launch + checkout):
- `d0a714a` chore(db): generate creators launch-state migration
- `c5a2796` feat(api): async agent-launch composite via Inngest with sync fallback
- `1e71a82` feat(web): implement Stripe Connect checkout on creator storefronts

Agent-launch composite: `runLaunchPipeline` composes discover → brand-gen → storefront launch. When Inngest configured (`INNGEST_EVENT_KEY`+`INNGEST_SIGNING_KEY`), returns 202+jobId; else runs inline and returns 200 with full result. `launch_jobs` table tracks status. `GET /v1/agent-launch/status/:jobId` + webhook-on-complete. SDK exposes `agentLaunch` + `agentLaunchStatus`. Migration `0002_launch_jobs.sql` written manually (drizzle-kit 0.21.4 BigInt bug).

Stripe checkout: `POST /api/checkout/create` creates Stripe Checkout Session with destination charges to creator's Connect account. Platform fee via existing `calculatePlatformFeeBps` (tiered 20/15/10). PaymentIntent metadata carries brand_id/creator_id/product_id so the existing `payment_intent.succeeded` webhook can now record sales. Buy button on storefront product-detail redirects to Stripe. Vitest added to apps/web. 6 checkout tests.

Final: 49 tests (43 api + 6 web). `pnpm typecheck` clean. 13 commits total this session.

Discover pipeline: `discover-client.ts` wraps RunPod runsync (`RUNPOD_API_KEY`+`RUNPOD_DISCOVER_ENDPOINT_ID`). Mock returns 3 plausible candidates when env unset. Route persists via `sequencesRepo.claim`. Timeouts 90s → 504. Upstream errors → 502.

Storefront launch: `deploy-client.ts` hits Vercel `POST /v10/projects/{id}/domains` to provision `<slug>.drip.markets`, pulls latest deployment via `/v6/deployments`. Env `VERCEL_TOKEN`+`VERCEL_PROJECT_ID`+`VERCEL_TEAM_ID?`. Mock URL when unset. Slug collision → 409. **Schema change: `creators` table gained `subdomain`, `launched_at`, `vercel_deployment_id` (nullable) — migration generated but NOT applied.**

Ratelimit: unified `agentRateLimit` (100/min by API key) + `publicRatelimit` (60/min by IP) on Upstash sliding window. `UPSTASH_REDIS_REST_URL`+`UPSTASH_REDIS_REST_TOKEN`. In-memory fallback when unset. 429 with Retry-After on exceed. `publicRatelimit` old file now re-exports from unified module.

Final: 34/34 tests green. `pnpm typecheck` clean. 10 commits since kickoff resume.

## Commits this session (2026-04-18b Swiss Clinical re-skin — 6 commits)

Direction picked, every public + app surface flipped from dark Function-Health
Clinical Report to white Vignelli/Crouwel Swiss Clinical. /drip stays dark.

- `28f9812` brand: re-anchor BRAND-V0.1.md §14 + §14.1 posture rules + BRAND.md §3 token reorg
- `24acf16` feat(tokens): flip globals.css defaults to paper/ink/red-accent + add Swiss utility primitives (.cta-primary, .cta-secondary, .rule-data, .bar-live, mega scale)
- `e790a19` feat(homepage): re-skin nav + footer + 9 marketing sections; helix removed from hero per anti-decoration posture; kit primitives intentionally untouched (rebuild/retire decision deferred)
- `138f2c3` feat(public): re-skin /manifesto (left-margin section numerals) + /creators (hairline-grid card layout); /drip explicit dark override
- `50c8172` feat(app): Swiss re-skin all 13 /app/* surfaces (dashboard, products, onboard, launch wizard chrome + 6 step pages + brand-live success page) — delegated to executor with reference-pattern brief; verified 0 quarantined-token references
- `863537a` chore(samples): delete 9 losing variants + samples/layout.tsx; rewrite samples/page.tsx as single-variant frozen reference

All 6 pushed to origin/master. Working tree clean. `pnpm typecheck` green at every phase. drip-samples.vercel.app verified: /, /samples, /manifesto, /creators, /drip all return 200.

Incident: accidentally `pnpm uninstall --filter web @tailwindcss/postcss` while exploring; reinstalled at the same version (`^4.2.2`) immediately. Lesson captured in feedback_secret_handling.md companion: uninstall is destructive, never use it as a probe.

## Commits this session (2026-04-18 full checkpoint close + post-checkpoint features)

Checkpoint closure (5 commits):
- `da6f10b` feat(web): wire payment_intent.succeeded + checkout.session.completed to recordSale
- `6a03d87` feat(db): backfill sequence.brand_id after brandsRepo.create
- `5482358` feat(web): add Stripe Express dashboard login link on creator dashboard
- `92b53ad` feat(db): real productCount on listPublic via left-join aggregate
- `36b5a53` chore(docs): readiness route + deploy runbook + migrations + solana specs

Post-checkpoint shipping (6 commits):
- `dcbe230` feat(web): add /thanks post-checkout success page
- `135c2e6` feat(web): recent sales feed on creator dashboard
- `a7ef212` feat(web): live brand overview card on creator dashboard
- `e290ae7` fix(api): persist generated product line during brand-gen (**critical bug — storefronts rendered empty, checkout couldn't resolve productId**)
- `70d2062` feat(web): stripe connect recovery flow — resolve requirements + resume incomplete onboarding
- `8f924a9` feat(web): creator product edit page with inline name/price/description/status

All 9 pushed to origin/master. Tests: 51 api + 16 web = 67 green (+18 this session). `pnpm -r typecheck` clean.

Dashboard is now a real creator surface: payouts + Stripe login link + tier + launch wizard + live brand card (with storefront deep-link) + last 5 sales (customer email, date, payout, fee). Checkout → /thanks confirmation page end-to-end. Full wizard → brand + products + storefront pipeline now actually persists products (was silently no-op).

`36b5a53` closes out the checkpoint without shipping half-finished code:
- `GET /v1/health/ready` reports 7-integration readiness ratio, `production`/`degraded-fallback` mode flag
- `docs/DEPLOY.md` — Vercel runbook, env-var matrix with fallbacks, Inngest first-deploy checklist (priority #4), migration order, smoke tests
- `packages/db/MIGRATIONS.md` — formal manual-SQL convention (priority #5, drizzle upgrade deferred — 0.30→0.45 blast radius too big)
- `packages/tokens/SPEC.md` — $DRIP SPL-2022 + Meteora DLMM + Streamflow + Jupiter double-swap interface sketch (priority #7)
- `packages/contracts/SPEC.md` — Squads policy engine + Light Protocol compressed agent wallets + on-chain reputation registry (priority #6)

productCount fix: `creatorsRepo.listPublic` now left-joins brands + products (status=active) with COUNT(DISTINCT), returns `CreatorPublicListItem[] = { creator, productCount }`. `public.ts` route reads `r.creator.*` + `r.productCount`. Added `public.test.ts` covering productCount wiring, pagination, invalid-page, volume, catalog (5 cases).

Webhook: `checkout.session.completed` is now primary sale path (customer_details.email reliable), `payment_intent.succeeded` redundant fallback. Checkout embeds platform_fee_cents/quantity/unit_price_cents in PI + session metadata. `recordSaleIdempotent` helper: guards zero-uuid placeholders, catches unique-violations as "duplicate", increments creator lifetime_gross_cents on first write only. creator_payout_cents = subtotal - fee (was hardcoded to full amount).

Sequences: schema change — `brand_id` now nullable. `sequencesRepo.backfillBrandId(db, creatorId, brandId)` bulk-attaches. `/v1/discover` persists with null brand_id; `/v1/brand/generate` backfills post-create in try/catch (non-fatal). Migration `0003_sequences_brand_nullable.sql` written manually.

Dashboard: `POST /api/stripe/connect/login-link` thin passthrough to `stripe.accounts.createLoginLink`. Dashboard gains outline "open stripe dashboard ↗" button inside the onboarded branch of the payouts card (opens in new tab). NOTE: memory-stated "charges_enabled display is stubbed" was outdated — that wiring already exists in `dashboard/page.tsx`.

Tests: 45 api + 16 web = 61 green (+12 from webhook & backfill commits, login-link is thin passthrough, no new tests). `pnpm -r typecheck` clean. Git tree clean minus next.js auto-regen of apps/web/tsconfig.json + apps/web/next-env.d.ts (harmless).

Origin: master 19 commits ahead of origin at end of session.

## Phase 0 Novelty Gateway started (2026-04-24)

**PR:** https://github.com/bludragon66613-sys/Drip/pull/1 (draft, awaiting Matteo)
**Branch:** `phase-0-novelty-gateway` (8 commits ahead of master)
**Plan:** `~/drip/.planning/phase_000_novelty_gateway_v0/{RESEARCH.md,PLAN.md}`
**Resume file:** `~/.claude/projects/C--Users-Rohan/memory/todo_drip_phase0.md`

**Sprint 1 shipped (8 atomic commits):**
- T1.1 `f12645d` pgvector extension
- T1.2 `756fe92` sequence_registry table + 3 enums (registry_status, lock_state, lane) + vector(512) + HNSW index
- T1.3 `155d5c6` backfill from sequences_claimed
- T1.4 `ac16981` novelty L1 module at @drip/db/novelty (canonicalize + SHA-256 + batch + atomic lock)
- T1.5 `2d33ae0` wire L1 into /api/v1/discover (env-gated NOVELTY_L1_ENABLED)
- T1.6 `69f2e6f` POST /api/v1/lock + Inngest event emit
- T1.7 `5dde72d` typed Inngest events at @drip/db/events (creator/phase.1.sequence_locked etc.)
- T1.8 `0784c6c` 7 unit tests green + perf+race suite (skips without DATABASE_URL)

**Decisions locked 2026-04-24:**
- Domain: drip.markets (not drip.xyz from patch doc)
- Postgres: Neon (pgvector native, confirmed supported)
- Event bus: Inngest-only, no NATS (maps dot-separated spec names to slash-separated Inngest)
- Researcher pod: Matteo owns
- Researcher alpha auth: Auth0 + ORCID social connector
- Tier rename: global hard rename code+DB, enum `proof | verified | clinical`

**7 open questions for Matteo on PR #1** (blocks Sprint 2 start): embedding dim 512 confirmation, `/methodology` benchmark source, model card DOI, pod embedding endpoint availability, ontology split timing, sequences_claimed+registry coexistence model, Inngest-only confirmation.

**Sprint 2 SHIPPED 2026-04-25** (5 atomic commits, all pushed to PR #1):
- `6b1c743` T2.1 tier enum + `validation_tier` nullable column on brands/products/launch_jobs (Option A — column named `validation_tier` not `tier` to avoid collision with 3 existing tier columns). Migration 0015. PLAN+RESEARCH.md tracked for the first time.
- `daf69a6` T2.6 TierBadge component — new `@drip/ui` workspace package, stacked-rule glyphs (1/2/3), inline SVG (no SVGR loader needed)
- `cda6198` T2.3 /tiers explainer — 7-section page with comparison table, decision tree, scaling flow, regulatory mapping, FAQ. ~800 LOC.
- `958a6f3` T2.4 /methodology — 6-row benchmarks table (locked AUROC numbers from PepBenchmark 2026), `.tsx` not `.mdx` (no MDX runtime wired)
- `3def6de` T2.5 /for-researchers — capability matrix (7 endpoints), Python snippet, 5-tier pricing, alpha waitlist form (client component) + new `/api/waitlist/researchers` route. Migration 0016 adds `source` + `metadata jsonb` columns to existing waitlist_entries table.
- T2.2 was no-op: 0 matches for "tier [abc]" in apps/packages/content/brand at sweep time. Builder-ecosystem Tier A/B/C in docs/ is a separate namespace, intentionally out of scope. Documented in PLAN.md.

**Sprint 2 cumulative state:** 13 commits ahead of master. Typecheck green across 6 workspaces (api, web, db, payments, sdk, ui). 67 tests pass (51 api + 16 web). Migrations 0015 + 0016 staged not applied. Visual verification pending Vercel preview rebuild.

**Sprint 3 queued** (lifecycle SM + Science block + eval): T3.1 sequence_lifecycle → T3.2 LOCKED handler → T3.3 Monday auction stub → T3.4 product Science block → T3.5 dashboard What's next card → T3.6 eval harness cron → T3.7 CI guard for tier A/B/C. Target week of 2026-05-08.

**Specs ingested + canonical:**
- `~/Downloads/Telegram Desktop/DRIP MASTER PIPELINE/specs/` — Master Pipeline, Discovery, Novelty Gateway (canonical), Researcher (older), Automation
- Telegram root: DRIP_BRIEF.md, DRIP_VS_CLARITY.md, DRIP_NOVELTY_GATEWAY.md (near-dup), DRIP_RESEARCHER_STACK.md (**newer canonical, uses `representation: default|coarse|fine`**), PATCH_WEBSITE_CONTENT (2).md (unapplied, 7 new routes)
- Duplicate action: delete Telegram-root novelty-gateway.md (near-dup), replace specs/researcher-stack.md with Telegram-root newer version

**Key spec updates vs earlier summary:**
- Tier names: `Proof / Verified / Clinical` (public global rename)
- Pipeline: 9 phases (not 10)
- Researcher API: 7 endpoints (`generate/predict/fold/simulate/score/embed/calibrate`), Private Calibration is standalone product
- Automation re-keyed lane-driven → tier-driven 3×3 matrix
- Vendors: email+Haiku parser, no REST APIs exist; China fiat USD T/T required; WuXi AppTec blocked (BIOSECURE)
- FDA PCAC dates: July 23-24 2026 + Feb 2027
- Benchmarks locked: hemolysis 0.9957, solubility 1.0000, anticancer 0.9484, antibacterial 0.9548, Veltri AMP 0.9667, ACP740 0.9435

## Known issues remaining

- ~~`creatorsRepo.listPublic` productCount stub~~ — CLOSED `92b53ad`
- **UNAPPLIED migrations 0001 + 0002 + 0003** — `creators` launch-state columns, `launch_jobs` table, `sequences_claimed.brand_id` nullable. Apply before prod via `psql $DATABASE_URL -f packages/db/src/migrations/{0001,0002,0003}*.sql` or equivalent
- Checkout flow `POST /api/checkout/create` works end-to-end; `/thanks` success page not yet styled
- Ratelimit: `as never` cast on Upstash Redis constructor — NodeNext dual-resolution mismatch, runtime behavior correct
- Next.js 16 auto-regenerates `apps/web/tsconfig.json` (`jsx: preserve` → `jsx: react-jsx`) — cosmetic, not committed

## Next session priorities (post-2026-04-18)

1. ✅ ~~Wire payment_intent.succeeded~~ — CLOSED `da6f10b`
2. ✅ ~~Link discover → brand → sequences~~ — CLOSED `6a03d87`
3. ✅ ~~Creator dashboard payout status UI~~ — CLOSED `5482358`
4. ✅ ~~Inngest production deploy~~ — docs-closed `36b5a53` (runbook in docs/DEPLOY.md; actual deploy blocked on user providing INNGEST_EVENT_KEY + INNGEST_SIGNING_KEY on Vercel)
5. ✅ ~~drizzle-kit BigInt workaround~~ — docs-closed `36b5a53` (packages/db/MIGRATIONS.md formal convention; upgrade deferred, blast radius too big)
6. ✅ ~~Agent wallet (Squads + Light Protocol)~~ — spec-closed `36b5a53` (packages/contracts/SPEC.md; build is multi-day, picks up from spec)
7. ✅ ~~Solana tokenomics scaffold~~ — spec-closed `36b5a53` (packages/tokens/SPEC.md; legacy docs/TOKEN.md noted as superseded by V2 §7 12-mechanic model)
8. **User actions (deferred):** Wyoming LLC + Cayman Foundation filings, lock social handles, DNS to Vercel, rename GitHub repo, apply migrations 0001+0002+0003 to prod DB
9. **NEXT BUILD PHASE** — execute against `packages/tokens/SPEC.md` + `packages/contracts/SPEC.md`. Start with mock-first clients matching the interface sketches, wire real SDKs behind env-var flags.

## Platform health at batch-5 close

- `pnpm typecheck` from root: green
- Tests: 49 total (43 api + 6 web)
- Git tree clean
- All external integrations wired with graceful degrade: Anthropic (brand-gen + safety), RunPod (discover), Vercel (storefront launch), Upstash (ratelimit), Inngest (async launch), Stripe Connect (checkout)
- Platform runs end-to-end in `pnpm dev` with zero external services — every route returns working mocks
- **Complete demo funnel:** landing → onboard → describe-to-launch wizard → discover (mock or RunPod) → brand-gen (mock or Claude) → content-safety gate → storefront launch (mock or Vercel) → `<slug>.drip.markets` renders → buy button → Stripe checkout → sales webhook recorded
- Agent-native dual-lane: MCP server + API + SDK + async agent-launch composite
- Migrations 0001 (creators launch-state) + 0002 (launch_jobs) staged, not yet applied

## Env vars required for full production

```
ANTHROPIC_API_KEY          # brand-gen + content safety
RUNPOD_API_KEY             # discover
RUNPOD_DISCOVER_ENDPOINT_ID
VERCEL_TOKEN               # storefront launch
VERCEL_PROJECT_ID
VERCEL_TEAM_ID             # optional
UPSTASH_REDIS_REST_URL     # ratelimit
UPSTASH_REDIS_REST_TOKEN
CLERK_SECRET_KEY           # auth (already wired)
CLERK_PUBLISHABLE_KEY
STRIPE_SECRET_KEY          # payments (webhook done, checkout pending)
STRIPE_WEBHOOK_SECRET
DATABASE_URL               # Vercel Postgres
```

## Key preferences + decisions (V2)

- Velocity-engineered token, not scarcity (Matteo's business plan)
- "fund everything with fees alone" — $10-20K Y1 legal, no upfront burn (Matteo)
- "lets take our time and build it out proper" — 90-day MVP not 21-day sprint (Rohan)
- No n8n in critical path (keep optional)
- Seedance direct, Flux via Replicate, Claude Sonnet for content — NO Higgsfield (scam)
- Meta/TikTok/YT dev accounts for ads (no ban risk)
- Creator is seller-of-record, platform is rails (Shopify posture)
- Agent-native day one — 12-24 month window before DTC incumbents retrofit
- **Solana, not Base** (locked 2026-04-17) — cheapest micro-tx, Meteora DLMM drop-window UX, Light Protocol compressed-account agent wallets, Matteo V2 scripts already Solana-native
- **Cayman/BVI Foundation + Wyoming LLC, not Delaware** (isolate token layer, minimize ops entity)
- **Drop 503A Rx tier entirely** — cosmetic topical + research-chemical only for speedrun
- Novel molecule per creator = moat; shared catalog = fallback UX only
- AI-drafted ToS/privacy/contracts, in-house smart contract audit (Slither + Mythril + fuzzing)
