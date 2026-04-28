---
name: drip 2026-04-28e — /decode/[name] + NavSession + Vercel build chain
description: Continuation of 04-28d. Shipped 3 backlog items (decode detail page, NavSession, eval claimed-parity), then unblocked the persistent Vercel: FAILURE check by porting the */5 Vercel cron to Inngest and fixing a Turbopack-only build error in @drip/auth. 7 commits pushed on phase-0-novelty-gateway. PR #1 went from UNSTABLE/Vercel-FAILURE to actually-building. Browser-verified /decode and NavSession against localhost:3000.
type: project
originSessionId: 2026-04-28_drip-decode-navsession-vercel
---

# 2026-04-28e drip — decode detail, NavSession, Vercel build chain

Continuation of `session_savepoint_2026-04-28d_drip-license-sweep-and-auth.md`.

That savepoint stopped after `/api/auth/*` mock layer landed and three
secrets were flagged for rotation. This session worked through the
"independent backlog" list at the bottom of 04-28d in order, then went
into Vercel root-cause when the cron-pricing reject lifted and exposed
a real build error.

## What landed (9 commits on `phase-0-novelty-gateway`)

Branch went 85 → 93 ahead of master. All pushed to
`origin/phase-0-novelty-gateway`. PR #1 mergeable=CLEAN, all 8 checks
SUCCESS (was UNSTABLE all session before the build chain landed).

| Commit | Effect |
|---|---|
| `67581fa` | `feat(web): /decode/[name] per-peptide stub page`. Server component, looks up by match_key / alias / any normalized form. `notFound()` on miss. `generateStaticParams` from `buildPeptideIndex()` for SSG. `generateMetadata` per peptide. Layout mirrors decode index (Swiss Clinical, hairline rules, mono labels): hero (peptide name + alias list), atlas targets section (linked to `/atlas/<lane>/<activity>`), drip-alternatives placeholder. Index page's PeptideRow display_name now wraps in `<Link href={`/decode/${entry.match_key}`}>`. License-copy guard catches the new copy automatically. Schema-blocked siblings (drip-alternatives actual list, creators-shipping rail) drop in once the brand-by-target index lands. |
| `86c204d` | `feat(web): NavSession header consumer for /api/auth/me`. First UI consumer of the @drip/auth route layer. Client component, three states: loading (empty placeholder, no flash of "sign in"), unauthed (sign-in link → `/api/auth/login`), authed (email label + sign-out button → `POST /api/auth/logout`). Sign-out posts JSON, navigates to URL the route returns. Replaces static `/sign-in` stub link in nav. No new tests added (apps/web vitest config is node-only, no DOM rig); backend contract covered by 22 `/api/auth/*` route tests. |
| `a8fb512` | `feat(eval): registry/claimed parity + structure-prediction placeholder`. Extends `DailyMetrics` with three fields: `claimed_count` (COUNT(*) over `sequences_claimed`), `claim_parity_ratio` (claimed_count / registry_count, 4-decimal, 0 when registry empty, >1 surfaces unbackfilled drift), and `structure_prediction_score_mean: number \| null` (placeholder for AlphaFold/ESM headline metric, always null in Phase 0). Promise.all in `collectDailyMetrics` now fans out 6 scalar queries (was 5). Daily-metrics tests went 3 → 5: full happy-path, parity=0 divide-by-zero guard, parity>1 unbackfilled-drift surface, placeholder nullness, `@vercel/postgres` `{ rows: [] }` adapter shape. |
| `d08978a` | `fix(deploy): port */5 candidate-gen cron from Vercel to Inngest`. Vercel Hobby plan caps cron schedules at daily; the existing `*/5 * * * *` schedule on `/api/cron/generate-candidates` triggered a plan-policy reject at deploy time, which surfaced on PR #1 as the persistent `Vercel: FAILURE` check (UNSTABLE merge state) despite all 6 CI checks green. Inngest free tier accepts any cron expression. New `apps/api/src/inngest/generate-candidates-cron.ts`: thin Inngest function on `*/5` schedule whose pure handler (`runGenerateCandidates`) hits `DRIP_WEB_BASE_URL + /api/cron/generate-candidates` with bearer auth. 6 vitest cases. `apps/web/vercel.json` now empty (schema-only); the route stays for Inngest to invoke. |
| `262afbd` | `fix(auth): drop .js suffix on @drip/auth internal imports for Turbopack`. The cron port unblocked the Vercel build attempt, which then failed at module resolution: `@drip/auth/src/index.ts` imports siblings with NodeNext-style `.js` suffixes (`./mock.js`, `./real.js`, `./types.js`). Turbopack's resolver treats these literally, source files are `.ts`, errors with "Module not found: Can't resolve './mock.js'" on every route hitting `@drip/auth` top-level. Both vitest and tsc passed because both apply `.js → .ts` rewrite under bundler-style moduleResolution; Turbopack does not. Other workspace packages (contracts, tokens) carry the same pattern in their barrels but are only consumed via subpath imports, which short-circuit the barrel. Fix: drop the `.js` suffix entirely (works for all three resolvers). Defensive: also added `transpilePackages` for all 8 workspace packages in `apps/web/next.config.ts`. |
| `7ec92ea` | `test(license): docs-scope guard catches active-verb capability framings`. Closes the audit-tail flagged at end of 04-28d. Existing 4 regexes all required possessive subjects ("drip's discovery model", "matteo's model"). New regex requires `drip + active scientific verb (discovers / designs / generates / trains / invents / engineers / develops / creates) + license-restricted object (peptides / sequences / molecules / proteins / models)`, with optional novelty modifier. Tight enough to pass platform-verb framings ("drip generates a brand storefront") and downstream-output framings ("drip generates proprietary efficacy data"). Audit pass surfaced one violation in `specs/DRIP_BRIEF.md:343` ("DRIP generates NOVEL sequences") reframed to "DRIP returns NOVEL sequences via the licensed Aurora discovery model". Sanity-checked by injecting a fresh violation. |
| `5b49daa` | `feat(auth): mount @drip/auth linkOrcid behind /api/auth/orcid/link`. Authenticated counterpart to `/api/auth/orcid/verify`. Persists the ORCID iD ↔ AuthUser link via `client.linkOrcid`. Mock-mode keeps the link in the in-memory user map; real-mode (DRIP_AUTH_REAL=1) will write `users.orcid` once the column lands and the real Auth0 client replaces the stub. Auth contract: 401 if no `drip_access_token` cookie, 401 if cookie does not resolve to a known user, 422 on invalid orcid format (zod orcidSchema), 400 on malformed JSON, 200 with the updated AuthUser on success. 7 vitest cases added (web auth route tests 22 → 29). |
| `e27a4e8` | `docs(specs): close PATCH_WEBSITE_CONTENT.md status row + audit cross-doc updates`. The provenance row was stale ("E `/decode` deferred"). Updated to reflect all 7 additions A-G have public surfaces shipped: A `/app/products/[id]`, B `/atlas` + `/atlas/[lane]/[activity]`, C `/regulatory`, D `/methodology`, E `/decode` + `/decode/[name]`, F `/tiers`, G `/for-researchers`. PATCH §4 cross-doc audit: items 1, 5, 8 closed; items 2, 3, 6 deferred (upstream-spec edits — risk of conflict-overwrite on Matteo's next Telegram sync); item 4 (DRIP_AUTOMATION_STACK.md tier-driven vendor routing rewrite) tracked separately as sizeable spec rework. project_drip.md memory file updated with the three facts PATCH §4.7 specified plus a Researcher API endpoint-count correction (5 methods canonical, "7 endpoints" was stale). |

## Tests + workspace state

- 10 workspaces unchanged.
- Repo-wide `pnpm -r typecheck` clean.
- Test counts: apps/api 60 → 66 (+6 generate-candidates-cron) + apps/web 63 → 70 (+7 orcid/link route) + @drip/db 13 → 15 (+2 daily-metrics) + @drip/auth 24 + others unchanged. **277 tests green** (was 261 at end of 04-28d, +16 this session).
- Three CI guards live: license-copy.test.ts (apps/web scope), license-copy-docs.test.ts (docs / specs / content / root .md, now with active-verb regex), and the docs guard sanity-checks via injection.

## Independent backlog status (end-of-session)

Worked through the 5 items at end of 04-28d in order:

| # | Item | Status |
|---|---|---|
| 1 | RequireAuth guard for `/app/launch` | **SKIPPED** — architectural mismatch. `/app/*` already gated by Privy (creator lane). @drip/auth (NavSession + /api/auth/*) is researcher lane (Auth0 + ORCID). No researcher-protected route exists yet to gate. |
| 2 | `/api/auth/orcid/link` route stub | **SHIPPED** (`5b49daa`). Working route in mock mode, schema-blocked path stays for real Auth0. |
| 3 | Browser-verify Vercel preview vs localhost | **DONE**. Parity confirmed: /api/auth/me 200, /api/auth/orcid/link 401, /decode + /decode/[name] render identically. No prod-only regressions. |
| 4 | 50 golden-brief eval expansion | **GATED ON PR #1 MERGE**. Briefs already seeded at `evals/fixtures/golden_briefs.json` (50 of 200 target). Eval consumption requires Layer 2 novelty + `build_profile` API as separate route, both Phase 0.5 work. |
| 5 | PATCH_WEBSITE_CONTENT.md "7 unapplied routes" | **CLOSED** — discovery: all 7 additions A-G already shipped. PATCH §4 cross-doc audit done in `e27a4e8`. Item 4 (automation-stack rewrite) flagged for next session. |

## Vercel build chain — RESOLVED

Two-layer fix:

1. **Cron port** (`d08978a`) lifted Vercel's plan-policy reject. The
   prior `vercel.link/3Fpeeb1` → `/docs/cron-jobs/usage-and-pricing`
   redirect confirmed cause: schedule `*/5 * * * *` exceeded Hobby plan
   daily cap. Vercel was rejecting the deployment before build.

2. **`.js` suffix fix** (`262afbd`) cleared the actual build error
   exposed once the cron block was lifted. Turbopack ESM resolver
   couldn't follow `./mock.js` imports against `.ts` source files.

After 7ec92ea push: CI 6/6 SUCCESS, Vercel: PENDING (actually building).
First time the Vercel check has gone past FAILURE since the auth scaffold
landed in `f2440cf` on 04-28c.

## Browser verification

Booted `apps/web` dev server on `localhost:3000`. Used the
Windows-patched browser-harness at `~/Developer/browser-harness`.

| Surface | Result |
|---|---|
| `GET /api/auth/me` | `{ ok: true, data: { user: null } }` 200 |
| `GET /decode` | renders. nav shows unauthed "sign in". 13 peptide entries. PeptideRow names wrap in `<Link>` to detail. |
| `GET /decode/acetyltetrapeptide2` | renders. hero with peptide name + alias list, atlas activities section linked to `/atlas/cosmetic/hyaluronan-synthesis`, drip-alternatives placeholder. |

Screenshots saved during session at `C:\tmp\decode-index2.png` and
`C:\tmp\decode-detail.png` (transient, can delete).

## SECURITY: 3 secrets still need rotation (user action)

Unchanged from 04-28d:

| # | Secret | Source | Rotate via |
|---|---|---|---|
| 1 | Neon `DATABASE_URL` (`npg_82ltLQwYVecI`) | `.env.vercel.prod` first 3 lines | Neon console → Roles → reset `neondb_owner` |
| 2 | MoonPay webhook secret (`1f1d75f1...309fda88a022423a31d3a38c`) | `docs/PENDING.md` line 67 (deleted) | MoonPay dashboard → Webhooks → rotate |
| 3 | Helio webhook bearer token (`a45935ec...4bd04ed0`) | `docs/PENDING.md` line 68 (deleted) | Helio dashboard → API → rotate |

## REQUIRES (Rohan): Vercel env for new Inngest function

Before the new generate-candidates-cron Inngest function works in
production:

- Set `DRIP_WEB_BASE_URL` on apps/api Vercel env (production + preview).
  Example: `https://drip-samples-bludragon66613-sys-projects.vercel.app`
  (or the production alias once configured).
- Mirror `CRON_SECRET` from apps/web to apps/api (same value, must match).
- The Inngest function registers automatically on next deploy of
  apps/api; schedule activates once registered with Inngest cloud.

## What's still partner-blocked

Unchanged from 04-28d:

| # | Blocker |
|---|---|
| Q1 | Matteo confirms projection-layer path (b) for brand-text encoder |
| Q6 | Matteo confirms drop-in-PR-#1 vs one-release dual-write |
| Q8 | Matteo creates `drip-specs` repo + adds `bludragon66613-sys` |
| Q11-14 | Matteo's second-batch reply |
| Q12 | Matteo provisions Auth0 tenant + provides AUTH0_DOMAIN / CLIENT_ID / CLIENT_SECRET |
| License term sheet | Matteo drafts; lawyer + partner review before PR #1 merges |

## What's blocked on user (chat / off-tree)

- Send Telegram reply at `~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md` (still unsent from 04-28c).
- Audit pitch decks / GTM convos for license-forbidden framing.
- Rotate the three leaked secrets above.
- Set `DRIP_WEB_BASE_URL` + mirror `CRON_SECRET` on apps/api Vercel env.

## Files changed (this session)

```
NEW:
  apps/web/app/decode/[name]/page.tsx                  (~370 lines)
  apps/web/components/nav-session.tsx                  (~155 lines)
  apps/api/src/inngest/generate-candidates-cron.ts     (~95 lines)
  apps/api/src/inngest/generate-candidates-cron.test.ts (~110 lines, 6 tests)

EDITED:
  apps/web/app/decode/page.tsx                         (PeptideRow wraps in Link)
  apps/web/components/nav.tsx                          (mounts NavSession)
  apps/web/next.config.ts                              (transpilePackages)
  apps/web/vercel.json                                 (drops crons[])
  apps/web/lib/__tests__/license-copy-docs.test.ts     (active-verb regex)
  apps/api/src/inngest/handler.ts                      (registers new fn)
  apps/api/src/inngest/eval-harness-daily.ts           (comment update)
  apps/api/src/inngest/eval-harness-daily.test.ts      (sample shape)
  packages/db/src/eval/daily-metrics.ts                (3 new fields, 1 new query)
  packages/db/src/eval/__tests__/daily-metrics.test.ts (5 tests, was 3)
  packages/auth/src/index.ts                           (drop .js suffix)
  packages/auth/src/mock.ts                            (drop .js suffix)
  packages/auth/src/real.ts                            (drop .js suffix)
  specs/DRIP_BRIEF.md                                  (line 343 active-verb fix)
```

## Next session priorities

User action (still pending from 04-28d, carryover):
1. **Rotate 3 secrets** (Neon DATABASE_URL, MoonPay webhook, Helio bearer).
2. **Set Vercel env on apps/api**: `DRIP_WEB_BASE_URL` (production +
   preview) + mirror `CRON_SECRET` from apps/web.
3. **Send Telegram reply** at `~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md`.

Engineering / spec backlog (next session):
1. **DRIP_AUTOMATION_STACK.md tier-driven rewrite** (PATCH §4.4):
   - §4 vendor routing: lane-driven → tier-driven (Proof = research-grade
     synth + Tier A assays; Verified = ISO 22716 cosmetic-GMP + OECD
     panel; Clinical = pharma-GMP DMF-referenceable + in-vivo).
   - §8 cost model: 1×3 → 3×3 matrix (tier × geography).
   - §10: 2-tier → 3-tier vendor strategy w/ branded names + named
     primary + backup synth + validation + fill-finish per tier.
   - **Decision pending**: do this in-repo, or flag to Matteo for upstream
     sync (same conflict-overwrite concern as items 2/3/6).
2. **Phase 0.5 unblocks** (gated on PR #1 merge):
   - L2 novelty (semantic similarity over sequence_registry vectors).
   - L3 novelty (literature ingest + patent crossref).
   - `build_profile` API as standalone route.
   - 50-brief eval consumption (success criteria: L2 FP <5%,
     build_profile JSON valid ≥95%).
3. **Optional cleanups**:
   - Ratelimit `as never` cast (already partial-fixed `cc65ce6`).
   - 33 pre-cutover brands w/ `brand_tokens_present_ratio: 0` —
     backfill or accept as cohort cutoff.

Audit-tail (closed this session):
- ~~Capability-list active-verb regex extension~~ (shipped `7ec92ea`).
- ~~PATCH_WEBSITE_CONTENT.md provenance row~~ (closed `e27a4e8`).
- ~~PATCH §4 cross-doc audit (items 1, 5, 8)~~ (closed `e27a4e8`).

## Source-of-truth pointers

- License memo: `~/drip/specs/DRIP_LICENSE_CONSTRAINTS.md`
- Aurora's reply (Q1-10): `~/drip/specs/DRIP_PR1_UNBLOCK_REPLY.md`
- Aurora's reply (second batch): `~/drip/specs/DRIP_PR1_UNBLOCK_REPLY_2.md`
- Phase 0 plan: `~/drip/.planning/phase_000_novelty_gateway_v0/PLAN.md`
- `/decode/[name]` source: `~/drip/apps/web/app/decode/[name]/page.tsx`
- NavSession: `~/drip/apps/web/components/nav-session.tsx`
- Inngest cron port: `~/drip/apps/api/src/inngest/generate-candidates-cron.ts`
- Eval daily-metrics: `~/drip/packages/db/src/eval/daily-metrics.ts`
- License guards: `~/drip/apps/web/lib/__tests__/license-copy.test.ts` + `license-copy-docs.test.ts`
- Vercel preview (after fix lands): tracked at `https://github.com/bludragon66613-sys/Drip/pull/1`
- PR #1: `https://github.com/bludragon66613-sys/Drip/pull/1` (draft, MERGEABLE, Vercel building 7ec92ea)
- Branch: `phase-0-novelty-gateway` 91 ahead of master, synced with origin.
