---
name: drip 2026-04-28c — license followups + Auth0/ORCID scaffold
description: Continuation of 04-28b license absorption. 7 more commits while Matteo silent on Q5/Q6 follow-ups: legal/creator-tos.md mirror fix, license-copy CI guard test, /pipeline page reframe, DRIP-V2.md §7.0 IP licensing structure, BUILDERS.md license boundary mirror, DRIP-MARKETS-V1.md supersession banner, waitlist tier values fix, @drip/auth mock-first scaffold (10th workspace). Branch 67 → 75 ahead. PR #1 description updated. CI green throughout.
type: project
originSessionId: 2026-04-28_drip-license-followups
---

# 2026-04-28c drip — license followups + Auth0/ORCID scaffold

Continuation of `session_savepoint_2026-04-28b_drip-license-absorption.md`.
That savepoint stopped after 6 commits absorbing Matteo's reply +
license memo. This one picks up "do whats independent of matteo" and
runs the long autopilot tail through the end of session.

## What landed (7 more commits on `phase-0-novelty-gateway`)

Branch went 67 → 75 ahead of master. PR #1 still draft. CI re-runs
on each push, all green.

| Commit | Effect |
|---|---|
| `2c94060` | `fix(legal): creator-tos.md § 5.2 + § 6 license-conformance`. Markdown source of the creator TOS now mirrors the page.tsx fix from `ff3fe53`. § 5.2 platform-retains bullet rewritten to exclude fine-tuning of the Aurora stack. § 6 IP bullet split into drip-owned (orchestration code, public API, storefront) + new § 6.3 Aurora-owned (licensed to drip) — names the field-restricted, non-sublicensable, output-only license shape inside the contract so creators see the boundary on day one. § 6.3 (Licensed to you) renumbered to § 6.4. |
| `909d485` | `test(license): copy guard against drip-as-model framing reintroduction`. New vitest assertion at `apps/web/lib/__tests__/license-copy.test.ts`. Scans all `.ts` and `.tsx` files under `apps/web/{app,lib,components}` for forbidden phrases ('drip's discovery model', 'drip's discovery engine', 'drip's (proprietary) peptide (foundation) model', 'trained models, underlying ip'). Skips single-line `//` and `*` / `/*` comment lines so JSDoc rules can name the forbidden phrase verbatim. Fails CI with file:line + offending text + fix-rationale if anyone reintroduces the language. ~40ms test cost. Web suite went 39 → 40 tests. |
| `1a6dbb4` | `fix(pipeline): hero copy reframe — discovery pipeline + Aurora attribution`. /pipeline hero subhead 'every minute the model proposes thousands of novel peptide candidates' (frames model as drip-owned) → 'every minute the discovery pipeline proposes thousands of novel peptide candidates via licensed Aurora technology'. Caught by the wider audit pass after creator-tos. |
| `9308b49` | `docs(v2): add §7.0 IP licensing structure (Aurora ↔ drip)`. DRIP-V2.md (investor-facing consolidated platform plan) gets a new § 7.0 before § 7.1 Entity structure. Names Aurora as IP holder + drip as operating company + the field-restricted / non-sublicensable / output-only license shape. Explains why the structure IS the moat (trade-secret protection, clean reversion on relationship change, sublicensing as unrecoverable failure mode). Cross-references `specs/DRIP_LICENSE_CONSTRAINTS.md`. § 10.1 (competitive moat) phrasing also tightened: 'drip's engine runs near-zero marginal cost' → 'drip's discovery pipeline runs near-zero marginal cost on the licensed Aurora peptide stack'. |
| `66f029d` | `fix(docs): BUILDERS.md license-boundary mirror`. Public-facing builders doc gets the same license-boundary preface + Section 6 (vertical extensions) split into within-license verticals (haircare / oral care / pet wellness peptides — within Aurora's existing field) vs outside-license verticals (nootropics / fragrances / industrial — Aurora renegotiation OR builder brings own model). Mirror of the source-doc fix in `861f282`. |
| `275437b` | `docs(v1): mark DRIP-MARKETS-V1.md as superseded by V2 + license note`. V1 platform spec gets a HISTORICAL ARTIFACT banner at the top with explicit supersession reference to DRIP-V2.md, plus a note that the Aurora ↔ drip license posture (V2 § 7.0) postdates this doc entirely. Status field flipped from 'Strategy locked' to 'HISTORICAL'. Body content unchanged — historical record stays intact, but readers grepping for strategy now see the supersession before they internalize stale framing. |
| `37162b2` | `fix(researchers): waitlist tier values match run-based pricing`. Three call sites still carried legacy seat-based tier values after `795ffd3` (the pricing swap): the form's TIER_OPTIONS dropdown (academic / smb / team / payg / private_calibration), the route's TIER_INTEREST Zod-enum tuple (would have rejected new-form submissions with 422), and Section 05 + the success-state copy ('academic-tier first'). All updated to the run-based shape (open_research / lab / biotech / enterprise / desci). Header comment in route.ts documents the legacy values for anyone querying historical waitlist_entries metadata. |
| `f2440cf` | `feat(auth): mock-first @drip/auth workspace — Auth0 + ORCID scaffold`. New 10th workspace at `packages/auth/`. Mock-first AuthClient with `startLogin`, `handleCallback`, `getUser`, `verifyOrcid`, `linkOrcid`, `buildLogoutUrl`. Drives Q12 from Matteo's reply (Auth0 tenant ownership). Mock determinism: same code → same user/sub/tokens across instances; same ORCID iD → same synthetic profile across instances. Real implementation is a stub that throws AuthConfigError if AUTH0_DOMAIN/CLIENT_ID/CLIENT_SECRET are missing — public entrypoint catches the throw and falls back to mock with console warning so `DRIP_AUTH_REAL=1` set unintentionally does not break dev. 24 vitest cases pass. ResearcherTier union locked to match `/for-researchers` run-based tiers (`open_research | lab | biotech | enterprise | desci`). Open-redirect guard on returnTo. SHA-256-derived synthetic data. |

## Workspace + tests state

- 10 workspaces (9 packages + 1 Python client at `clients/python-researcher/`).
- Repo-wide `pnpm -r typecheck` clean.
- Test counts: apps/api 60 + apps/web 40 (was 39, +1 license-copy guard) + @drip/db 33 + @drip/tokens 16 + @drip/contracts 19 + @drip/vendors 31 + @drip/auth 24 (NEW) + drip-researcher 15 = **238 tests green** (up from 213 at end of prior session).

## PR #1 description state

Updated to reflect:

- 8 commits since last update absorbing Matteo's reply + license memo.
- Q1-10 status table (5 shipped, 3 partner-confirmed-awaiting-Matteo, 1 BLOCKED on schema name collision, 1 confirmed).
- Q11-14 deferred to second batch.
- License-memo absorption shape with the 11 commits enumerated.
- Open partner-side audit items (current customer conversations,
  white-label / OEM framing in pitch decks, term sheet review).

## Telegram reply state

`~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md`
ready to send. Carries:

- Q1: brand-text encoder confirmed 512-d → preference for projection-layer path (b).
- Q5: schema name collision (NEW BLOCKER) — recommended `intent` enum name.
- Q6: `sequences_claimed` consumers enumerated → ask Matteo path (drop in PR #1 vs dual-write).
- Q8: GitHub username `bludragon66613-sys`.
- Q9 + Q10 + Q7: explicit approvals.
- Six-commit license-sweep recap (now 11-commit recap is more accurate but the file pre-dates these later commits).
- Partner-side reads on Q11-14.

User-side action: send this file via Telegram.

## What's still partner-blocked

| # | Blocker |
|---|---|
| Q1 | Matteo confirms projection-layer path (b) |
| Q5 | Matteo confirms enum naming (recommended `intent`) |
| Q6 | Matteo confirms drop-in-PR-#1 vs one-release dual-write (recommended dual-write) |
| Q8 | Matteo creates `drip-specs` repo + adds `bludragon66613-sys` |
| Q11-14 | Matteo's second-batch reply |
| License term sheet | Matteo drafts; lawyer + partner review before PR #1 merges |

## What's blocked on user (chat / off-tree)

- Send Telegram reply.
- Audit pitch decks / GTM convos for license-forbidden framing (open
  questions 1, 3, 4 in the license memo).

## Files changed (new + edited, this session continuation)

```
NEW:
  apps/web/lib/__tests__/license-copy.test.ts      (CI guard, 126 lines)
  packages/auth/                                    (10 files, 10th workspace)
  ~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md
                                                    (Telegram reply, ready)

EDITED:
  legal/creator-tos.md                              (license-conformance mirror)
  apps/web/app/pipeline/page.tsx                    (hero copy reframe)
  DRIP-V2.md                                        (§7.0 IP licensing + §10.1 phrasing)
  docs/BUILDERS.md                                  (license preface + § 6 split)
  DRIP-MARKETS-V1.md                                (supersession banner)
  apps/web/app/for-researchers/page.tsx             (Section 05 copy fix)
  apps/web/app/for-researchers/_components/waitlist-form.tsx
                                                    (TIER_OPTIONS swap + success-state copy)
  apps/web/app/api/waitlist/researchers/route.ts    (TIER_INTEREST Zod tuple swap)
  pnpm-lock.yaml                                    (new @drip/auth workspace)
```

## Next session priorities

1. **Send Telegram reply** — user-side, carries Q5 conflict + all confirmations + Q11-14 partner-side reads.
2. **Once Matteo replies:**
   - Q5 migration `0018_intent_enum.sql` (~30 min).
   - Q6 dual-write writer + tests (~1-2 hr).
   - L2 schema integration once Q1 + Q5 + Q6 nail down.
   - T4.6b profile pipeline persistence.
3. **Partner-side audit (user)** — pitch decks / GTM / customer convos for license-forbidden framing.
4. **License term sheet review** — when Matteo's draft lands.
5. **Independent backlog (no Matteo dependency):**
   - Migrate the duplicated ORCID regex out of apps/web/app/api/waitlist/researchers/route.ts and waitlist-form.tsx HTML pattern attr into `@drip/auth` `ORCID_PATTERN` (single source of truth).
   - Wire `@drip/auth` into `/api/auth/*` routes (mock-mode, real wiring deferred to Q12).
   - `/decode/[name]` per-peptide detail page (schema-blocked on PR #1 brand-by-target index, but stub is shippable).
   - Eval baseline runner extension (registry / claimed parity check, structure-prediction headline metric placeholders).
6. **Builder ecosystem audit follow-up** — `docs/BUILDER-GRANT-PROGRAM.md` + `docs/PIPELINE.md` + `docs/TOKEN.md` haven't been swept; fast-pass them next session in case of license issues.

## Source-of-truth pointers

- License memo: `~/drip/specs/DRIP_LICENSE_CONSTRAINTS.md`
- Matteo's reply: `~/drip/specs/DRIP_PR1_UNBLOCK_REPLY.md`
- Partner reply (ready to send): `~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md`
- Phase 0 plan: `~/drip/.planning/phase_000_novelty_gateway_v0/PLAN.md`
- New @drip/auth SPEC: `~/drip/packages/auth/SPEC.md`
- Vercel preview: `https://drip-samples-git-phase-0-nov-78a3bb-bludragon66613-sys-projects.vercel.app`
- PR #1: https://github.com/bludragon66613-sys/Drip/pull/1 (draft, description updated to reflect 04-28 batch)
