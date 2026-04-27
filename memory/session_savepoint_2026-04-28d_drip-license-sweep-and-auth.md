---
name: drip 2026-04-28d — license sweep close + /api/auth/* mock layer
description: Continuation of 04-28c (license followups + Auth0/ORCID scaffold). 8 more commits on phase-0-novelty-gateway pushed to origin. Closed the license-conformance audit-tail (PIPELINE preface, V2/V_CLARITY/BRIEF/CHECKPOINT reframes, IP-NFT clarification, docs-scope CI guard). Mounted @drip/auth on /api/auth/* (5 routes, 22 tests). Hardened .gitignore for env files. Three secrets flagged for rotation. Branch 75 → 85 ahead. PR #1 CI re-running on push, mergeable. Pre-PC-restart save.
type: project
originSessionId: 2026-04-28_drip-license-sweep-and-auth
---

# 2026-04-28d drip — license sweep close + /api/auth/* mock layer

Continuation of `session_savepoint_2026-04-28c_drip-license-followups.md`.
That savepoint stopped after the @drip/auth scaffold landed plus the
first license-memo absorption pass. This one drove the license sweep
to completion across all spec / docs / content surfaces, mounted
@drip/auth as a working route layer on apps/web, and pushed.

## What landed (8 more commits on `phase-0-novelty-gateway`)

Branch went 75 → 85 ahead of master. Pushed to
`origin/phase-0-novelty-gateway`. PR #1 still draft, CI re-running on
the push, MERGEABLE.

| Commit | Effect |
|---|---|
| `61f438a` | `refactor(web): consolidate orcid validation into @drip/auth`. Researchers waitlist route stopped carrying its own inline ORCID regex literal; switched to `import { orcidSchema } from "@drip/auth"`. Added `@drip/auth` as a workspace dep on apps/web (first consumer outside the package itself). Behavior unchanged, same regex, same error message. apps/web 40/40 + apps/api 60/60 green. |
| `702c08c` | `docs(pipeline): aurora license preface plus model attribution fix`. PIPELINE.md got the same Aurora license preface that BUILDERS.md picked up in 861f282 (output-only, non-sublicensable, field-restricted). Line 49 reframed from "RunPod Serverless endpoint running Matteo's discovery model" to "RunPod Serverless endpoint running the licensed Aurora discovery model. The endpoint is operated by Aurora on RunPod infrastructure; drip consumes its output through this API." Pre-existing line-66 em-dash also scrubbed per `feedback_copy_style.md`. Calls out that ESM-2 + RFdiffusion3 + ProteinMPNN are commodity public tools, not Aurora's stack. |
| `59afdd7` | `docs(license): close 3 adjacent matteo/drip-as-model attribution gaps`. DRIP-V2.md:411 risk-register row + specs/patches/PATCH_WEBSITE_CONTENT.md:84 + content/x-cadence.md:109 reframed. V2 risk row "Matteo's discovery model" → "the Aurora discovery model"; PATCH /atlas seed copy "every activity DRIP's discovery model can target" → "every activity the licensed Aurora discovery model can target"; X cadence draft "matteo's discovery model is cooking" → "aurora's discovery model is cooking" (lowercase house style preserved). |
| `2281ebc` | `docs(license): drip-as-model-owner reframe across 3 spec docs`. Bigger sweep — DRIP_BRIEF.md got 10 line touches across §1, §3, §8, §19 (reframed as "licensed Aurora peptide foundation model" / "exclusive licensed access" everywhere); DRIP_VS_CLARITY.md got 4 line touches (line 70 narrative-simplicity, line 77 engine-asymmetry, line 85 scope-leverage, line 88 benchmark-validation); PATCH_WEBSITE_CONTENT.md:336 Private Calibration bullet "DRIP's model never leaves ours" → "The Aurora model never leaves licensed infrastructure". Editorial line 80 (moat bullet) explicitly deferred to next commit. |
| `7921fcd` | `test(license): docs-scope license-copy guard plus 3 fixes`. Three things: (1) DRIP_VS_CLARITY.md:80 moat-structure bullet finally reframed from "Proprietary discovery model (not replicable by a fast-follower; years of R&D inside)" to "Exclusive Aurora license (field-restricted, output-only; structurally non-replicable by a fast-follower without parallel licensing)" — moat survives, attribution shifts to license-relationship-as-moat. (2) DRIP-V2.md:118 discovery-engine table row reframed; CHECKPOINT.md:93 reframed. (3) NEW test file `apps/web/lib/__tests__/license-copy-docs.test.ts` scans markdown across `docs/`, `specs/`, `content/`, plus repo-root `.md` files. Four forbidden-phrase regexes, all requiring an explicit drip / matteo / first-person subject so legitimate "builder brings their own discovery model" framings pass. Whole-file allowlist exempts the license memo, Aurora's replies, the specs index, and DRIP-MARKETS-V1.md (HISTORICAL ARTIFACT). Sanity-checked by injecting a fresh violation and confirming the test surfaces it before reverting. |
| `5dae22e` | `docs(license): clarify DESCI_IPNFT covers sequence (output) only`. DRIP_BRIEF.md:258 was license-conformant in substance — sequence transfer is output transfer, drip is permitted to do that — but the prior phrasing left "downstream commercial deployment" without an explicit "of the sequence" anchor. Reframed so the audit eye sees the boundary: NFT represents the sequence (output) only, never any rights to the underlying licensed Aurora model. |
| `c788d30` | `chore(security): block .env.* and require .env.example exception`. `.gitignore` got a `.env.*` glob plus `!.env.example` exception. Driven by an in-session leak: `.env.vercel.prod` first 3 lines (Neon DATABASE_URL with creds) read into transcript when checking branch state, and `docs/PENDING.md` carried two live webhook secrets (MoonPay + Helio) for the same reason. Both classes of file are now covered. Verified with `git check-ignore -v .env.vercel.prod`. PENDING.md was deleted from disk. |
| `bfea3d8` | `feat(auth): mount @drip/auth mock client behind /api/auth/* routes`. Five routes scaffolded under `apps/web/app/api/auth/`: `GET /login` (startLogin → 307 + state cookie + returnTo cookie), `GET /callback` (verify state → exchange code → access-token cookie → 307 to returnTo), `GET /me` (read cookie → AuthUser or null, always 200), `POST /logout` (clear cookie, return Auth0 logout URL for client redirect), `POST /orcid/verify` (validate format + return synthetic profile, no auth required). Three cookies: `drip_oauth_state` (10min), `drip_oauth_return_to` (10min), `drip_access_token` (1hr). All HTTP-only, SameSite=Lax, secure in prod. Open-redirect guards at /login (zod refine) AND /callback (literal string check pre-redirect, defense-in-depth). 22 vitest cases in a single consolidated file at `apps/web/app/api/auth/__tests__/auth.test.ts`. Mocks `next/headers` cookies() with a stateful in-memory map so the /login → /callback state handoff exercises the real cookie round-trip. Resets the @drip/auth singleton via `__resetAuthClient` before each test. |

## Tests + workspace state

- 10 workspaces unchanged (9 packages + 1 Python client at `clients/python-researcher/`).
- Repo-wide `pnpm -r typecheck` clean.
- Test counts: apps/api 60 + apps/web 63 (was 39, +1 license-copy guard, +1 docs guard, +22 auth routes) + @drip/db 33 + @drip/tokens 16 + @drip/contracts 19 + @drip/vendors 31 + @drip/auth 24 + drip-researcher 15 = **261 tests green** (up from 238 at end of 04-28c).
- Two CI guards live: `license-copy.test.ts` (apps/web scope) + `license-copy-docs.test.ts` (docs / specs / content / root .md).

## License-conformance state — COMPLETE

All known drip-as-model and matteo-as-model framings across the
repo are reframed. Future regressions caught at PR time, not
post-ship. Future-expansion candidates surfaced inside `7921fcd`
commit message (capability-list active-verb framings, "our
proprietary [X]" without "model" — different regex shape).

The audit found and fixed 19 distinct surface violations across:
- 1 code surface (apps/web waitlist route)
- 6 spec docs (DRIP_BRIEF.md, DRIP_VS_CLARITY.md, DRIP_LICENSE_CONSTRAINTS.md citations, PATCH_WEBSITE_CONTENT.md, DRIP-V2.md, README.md)
- 3 platform docs (PIPELINE.md, BUILDERS.md mirror confirmations, BUILDER_ECOSYSTEM_SOURCE.md)
- 2 transient docs (CHECKPOINT.md, content/x-cadence.md)

Editorial decisions taken:
- Moat-bullet reframe: tech-moat survives, attribution shifts to "license-relationship-as-moat" (DRIP_VS_CLARITY:80 Option A).
- IP-NFT line: substance compliant, phrasing clarified for audit eye.

## /api/auth/* surface — LIVE in mock mode

| Route | Method | Purpose | Auth required |
|---|---|---|---|
| `/api/auth/login` | GET | Initiate Auth0 hosted login | No |
| `/api/auth/callback` | GET | Complete Auth0 redirect | No (state cookie) |
| `/api/auth/me` | GET | Current AuthUser or null | No (returns null) |
| `/api/auth/logout` | POST | Build logout URL + clear cookie | No |
| `/api/auth/orcid/verify` | POST | Validate ORCID + fetch profile | No |

`DRIP_AUTH_REAL=1` swaps the underlying client to `real.ts` (currently a stub-throwing AuthConfigError if AUTH0_DOMAIN/CLIENT_ID/CLIENT_SECRET missing); routes stay stable across the swap.

Real Auth0 wiring still gated on Q12 from `specs/DRIP_PR1_UNBLOCK_REPLY.md` (Auth0 tenant ownership). When Matteo confirms tenant + creates the app, switch `real.ts` from stub to working implementation; no route-level changes needed.

## SECURITY: three secrets need rotation (user action)

In-session reads echoed three live secrets into the transcript jsonl:

| # | Secret | Source | Rotate via |
|---|---|---|---|
| 1 | Neon `DATABASE_URL` (`npg_82ltLQwYVecI`) | `.env.vercel.prod` first 3 lines | Neon console → Roles → reset `neondb_owner` |
| 2 | MoonPay webhook secret (`1f1d75f1...309fda88a022423a31d3a38c`) | `docs/PENDING.md` line 67 (now deleted) | MoonPay dashboard → Webhooks → rotate |
| 3 | Helio webhook bearer token (`a45935ec...4bd04ed0`) | `docs/PENDING.md` line 68 (now deleted) | Helio dashboard → API → rotate |

After rotation:
```bash
vercel env pull apps/web/.env.local --environment=production --yes
# Update MoonPay + Helio dashboards with new webhook values
```

The `.env.*` gitignore guard (commit `c788d30`) prevents future accidental staging of `.env.vercel.prod`. The `docs/PENDING.md`-class problem (transient docs carrying secrets) is not yet covered; consider a `.gitignore` guard on `PENDING.md` / `TODO.md` / similar transient names if more turn up.

## What's still partner-blocked

Unchanged from 04-28c:

| # | Blocker |
|---|---|
| Q1 | Matteo confirms projection-layer path (b) for brand-text encoder |
| Q5 | DONE this session via b2aa6c6 — `0018_intent_enum.sql` shipped |
| Q6 | Matteo confirms drop-in-PR-#1 vs one-release dual-write (recommended dual-write) |
| Q8 | Matteo creates `drip-specs` repo + adds `bludragon66613-sys` |
| Q11-14 | Matteo's second-batch reply |
| Q12 | Matteo provisions Auth0 tenant + provides AUTH0_DOMAIN / CLIENT_ID / CLIENT_SECRET |
| License term sheet | Matteo drafts; lawyer + partner review before PR #1 merges |

## What's blocked on user (chat / off-tree)

- Send Telegram reply at `~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md` (still unsent from 04-28c).
- Audit pitch decks / GTM convos for license-forbidden framing (open questions 1, 3, 4 in the license memo).
- Rotate the three leaked secrets above.

## Files changed (this session)

```
NEW:
  apps/web/app/api/auth/login/route.ts            (38 lines)
  apps/web/app/api/auth/callback/route.ts         (87 lines)
  apps/web/app/api/auth/me/route.ts               (24 lines)
  apps/web/app/api/auth/logout/route.ts           (51 lines)
  apps/web/app/api/auth/orcid/verify/route.ts     (50 lines)
  apps/web/app/api/auth/__tests__/auth.test.ts    (270+ lines, 22 tests)
  apps/web/lib/__tests__/license-copy-docs.test.ts (171 lines, 1 test, 4 regexes)

EDITED:
  .gitignore                                       (.env.* glob + .env.example exception)
  apps/web/app/api/waitlist/researchers/route.ts   (orcidSchema import)
  apps/web/package.json                            (@drip/auth workspace dep)
  pnpm-lock.yaml                                   (workspace symlink)
  docs/PIPELINE.md                                 (license preface + line 49 + line 66 em-dash)
  DRIP-V2.md                                       (lines 118, 411)
  DRIP_BRIEF.md                                    (10 line touches: §1, §3, §8, §19)
  DRIP_VS_CLARITY.md                               (4 line touches: 70, 77, 80, 85, 88)
  CHECKPOINT.md                                    (line 93)
  specs/patches/PATCH_WEBSITE_CONTENT.md           (lines 84, 336)
  content/x-cadence.md                             (line 109)

DELETED:
  docs/PENDING.md                                  (untracked, leaking 2 secrets, mostly stale)
```

## Next session priorities

Independent backlog (no Matteo dep, no schema dep):
1. **Rotate 3 secrets** (user action; do this first).
2. **`/decode/[name]` stub page** (~20 min). Schema-blocked on the brand-by-target index that ships post PR #1, but a stub page that 404s gracefully on unknown peptides + renders a placeholder for known ones is shippable now. Atlas page already wires the link target.
3. **Surface `/api/auth/me` consumer in nav/header.** No UI currently consumes the session state. Add a small `<NavSession>` component that calls `/api/auth/me` and shows either a sign-in link (→ `/api/auth/login`) or the user's email + sign-out button (→ POST `/api/auth/logout`). ~30 min including tests.
4. **Eval baseline runner extension** (effort TBD, read state first). Apps/api already has `eval-harness-daily.test.ts` with 3 tests; adding registry / claimed parity check + structure-prediction headline metric placeholders is the next layer.

Schema-blocked, deferred until PR #1 schema lands:
- `/api/auth/orcid/link` route (the storage-backed counterpart to verify; needs `users.orcid` column).
- L2 schema integration once Q1 + Q5 + Q6 nail down (Q5 already done, awaiting Q1 + Q6).
- T4.6b profile pipeline persistence.

Audit-tail:
- Builder ecosystem audit follow-up — `BUILDER-GRANT-PROGRAM.md` already swept clean in 7921fcd's verification pass; no further work there.
- Consider extending `license-copy-docs.test.ts` regex set with capability-list active-verb framings ("drip discovers", "drip designs", "drip generates") — different shape than current possessive-only patterns.

## Source-of-truth pointers

- License memo: `~/drip/specs/DRIP_LICENSE_CONSTRAINTS.md`
- Aurora's reply (Q1-10): `~/drip/specs/DRIP_PR1_UNBLOCK_REPLY.md`
- Aurora's reply (second batch): `~/drip/specs/DRIP_PR1_UNBLOCK_REPLY_2.md` (referenced by `b2aa6c6` commit, file may be local-only)
- Partner reply (still unsent): `~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md`
- Phase 0 plan: `~/drip/.planning/phase_000_novelty_gateway_v0/PLAN.md`
- @drip/auth SPEC: `~/drip/packages/auth/SPEC.md`
- /api/auth/* tests: `~/drip/apps/web/app/api/auth/__tests__/auth.test.ts`
- License-copy guards: `~/drip/apps/web/lib/__tests__/license-copy.test.ts` + `license-copy-docs.test.ts`
- Vercel preview: `https://drip-samples-git-phase-0-nov-78a3bb-bludragon66613-sys-projects.vercel.app`
- PR #1: `https://github.com/bludragon66613-sys/Drip/pull/1` (draft, MERGEABLE, CI re-running on push)
- Branch: `phase-0-novelty-gateway` 85 ahead of master, synced with origin.
