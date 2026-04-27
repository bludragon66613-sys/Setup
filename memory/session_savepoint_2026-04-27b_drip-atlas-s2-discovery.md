---
name: drip 2026-04-27 session 2 — atlas bodies + footer + nav + launch consumer + PR #2 + PATCH §7 E/G scoping
description: Continuation of 2026-04-27 atlas session. 5 commits on phase-0-novelty-gateway (10 atlas bodies live + em-dash sweep + footer linkage + nav linkage + /app/launch?activity= consumer). PR #2 opened draft on phase-0-5-layer23 gated on PR #1 merge. Smoke A + B done on Vercel preview. PATCH §7 additions E + G scoped and blocked on Matteo input + PR #1 schema.
type: project
originSessionId: 2026-04-27b_drip-atlas-s2
---
# 2026-04-27 session 2 — drip atlas Session 2 + nav/footer + launch consumer

Continuation session. Built directly on the priorities listed in
`session_savepoint_2026-04-27_drip-p05-atlas.md` "Next session priorities".

## What landed on `phase-0-novelty-gateway`

Branch went 44 ahead of master at session start to 49 ahead at session end.

| Commit | Effect |
|---|---|
| `d3b436e` | Atlas Session 2. Filled `whatItIs` + `knownPeptides` for the 10 stub activities in `apps/web/lib/atlas-ontology.ts`. Status flipped editorial_review to live. 13/13 cosmetic activities now render full body. Voice: lowercase brand voice, no em-dashes per `feedback_copy_style.md`, all paragraphs close on the drip discovery-model framing. Strict commodity-peptide policy — 5/10 ship populated knownPeptides, 5/10 ship empty arrays where commodity reference fuzzy. |
| `fda73d1` | Em-dash sweep on collagen-synthesis matrikine clause. The only body-scope em-dash that survived earlier sweeps. File header + JSDoc em-dashes left untouched (code-comment scope, not user-facing copy). |
| `daf7a11` | Footer linkage. `apps/web/components/footer.tsx`: `product` column adds atlas / methodology / tiers; `company` column adds for-researchers / regulatory. All 5 routes verified present. |
| `f0dd4ec` | `/app/launch?activity=<slug>` consumer. Two files: `apps/web/app/app/launch/page.tsx` (root async, awaits searchParams, forwards `?activity=<slug>` through redirect to step-1); `apps/web/app/app/launch/step-1-describe/page.tsx` (split into Suspense wrapper + Step1Body, useSearchParams, getActivity lookup, computes Partial<Brief> seed). Seed is description "product targeting <name>. addresses <concerns>." plus niche heuristic (hair / recovery / skin-antiaging based on concerns). Returning users with state.brief override the seed. |
| `4a8324f` | Top nav linkage. `apps/web/components/nav.tsx`: NAV_LINKS adds atlas (between discoveries and agents) and tiers (between pipeline and manifesto). 5 → 7 inline links. Methodology/regulatory/for-researchers stay footer-only by design — adding all 5 to nav overflows the 1280px maxWidth and erodes Swiss minimalist aesthetic. Verified visually at 1280 + 1024 viewports. |

## What landed on `phase-0-5-layer23`

| Action | Effect |
|---|---|
| PR #2 opened draft | https://github.com/bludragon66613-sys/Drip/pull/2 — base master, head phase-0-5-layer23, gated on PR #1 merge in description. T4.6b persistence + L2 schema integration land post-merge. |

No commits added to this branch this session.

## Smoke results on Vercel preview

Preview URL: `drip-samples-git-phase-0-nov-78a3bb-bludragon66613-sys-projects.vercel.app`.

**Smoke A (atlas + footer):**
- Atlas index renders all 13 cosmetic activities with summaries.
- `/atlas/cosmetic/anti-inflammatory` body page renders 3-paragraph prose + commodity peptides (GHK-Cu, Palmitoyl Tetrapeptide-7 / Rigin) + section 04 stub + section 06 CTA.
- `/atlas/cosmetic/wnt-pathway` primary CTA URL = `/app/launch?activity=wnt-pathway` (exact spec).
- Footer rendered all 5 added entries in correct columns.
- `/app/launch?activity=wnt-pathway` bounced to `/app/onboard?activity=wnt-pathway` (auth wall preserves param at system level — confirms the param survives bounce, but cannot auth-test the page.tsx redirect or seed pre-fill without creator login).

**Smoke B (top nav):**
- Snapshot showed all 7 nav links in correct order: drip / creators / discoveries / atlas / agents / pipeline / tiers / manifesto / sign in / launch a brand →
- Visual screenshots at 1280 + 1024 viewports confirm no overflow, no cramp.

## PATCH §7 additions E + G — scoped and blocked

Inspected `~/Downloads/Telegram Desktop/PATCH_WEBSITE_CONTENT (2).md` per the
prior savepoint pointer.

**Addition E (Ingredient Decoded `/decode` tool):**
- Needs commodity-peptide-name lookup index, creator-by-activity index (atlas section 04 stub), DRIP-alternatives query.
- Brand-by-target index almost certainly PR #1 schema dependent.
- DEFER until brand-by-target ships post-PR-#1 merge.

**Addition G.1 (researcher-lane pricing recalibration):**
- Target spec files (`specs/DRIP_RESEARCHER_STACK.md`, `specs/DRIP_MASTER_PIPELINE.md`) NOT in `~/drip` repo.
- Live in Matteo's planning folder (Telegram Desktop), not version-controlled in this repo.
- BLOCKED on "where do these specs live + who owns the edits". Surface to Matteo.

**Addition G.2 (/for-researchers page rewrite):**
- Page exists at `apps/web/app/for-researchers/page.tsx`. 6 sections shipped (hero / capabilities via CapabilityMatrix component / python example / pricing / alpha access / legal).
- Current pricing: 5 tiers, Team = $4,800/mo. G.1 proposes: 6 tiers, Team = $1,499/mo (5 seats) / $2,499/mo (10 seats).
- **Business decision** — pricing change on a public surface needs Matteo sign-off.
- Capability matrix shape change (7-endpoint list → 4-axis competitor comparison vs Cradle/BioLM/Chroma/ESM3/RFdiffusion/Tamarind/Menten) is a positioning decision. Also needs Matteo sign-off.
- BLOCKED on Matteo + pricing call.

**Addition G.3 (cross-linking):**
- Already done. Atlas activity CTA → `/for-researchers`. Footer link → `/for-researchers`.

## Files added this session

```
# new
(none — only edits)

# edited
apps/web/lib/atlas-ontology.ts             (10 bodies + status + em-dash sweep)
apps/web/components/footer.tsx             (5 link rows)
apps/web/components/nav.tsx                (2 link rows)
apps/web/app/app/launch/page.tsx           (rewrite to async + searchParams forward)
apps/web/app/app/launch/step-1-describe/page.tsx  (Suspense split + activity seed)
```

## Working tree at session end

Same dirt as session start. No new untracked files this session.

```
M apps/web/next-env.d.ts          (Next 16 auto-gen, harmless)
M package.json                    (@google/design.md devDep, deliberately uncommitted)
M pnpm-lock.yaml                  (matches the devDep above)
?? .env.vercel.prod               (secret, gitignored intent)
?? docs/PENDING.md                (held back pending secret rotation)
```

Currently checked out: `phase-0-novelty-gateway`.

## Test posture at session end

| Workspace | Tests | Delta |
|---|---|---|
| apps/api | 58 | unchanged this session (was +7 in session 1) |
| apps/web | 16 | unchanged |
| @drip/db | 33 (on phase-0-5-layer23) / 10 (on phase-0-novelty-gateway) | unchanged |

`pnpm -r typecheck` clean across 6 workspaces on both branches at every commit checkpoint.

## Architectural notes

1. **Auth wall blocks deep-link UI verification.** `/app/launch` layout calls
   `requireCreator()` server-side. Without a creator session, browser-based
   smoke can verify URL shape and the auth-bounce-preserves-param behavior,
   but cannot exercise the page.tsx redirect or the BriefForm seed pre-fill.
   Future verification needs either a logged-in creator session or an e2e
   test that mocks the auth.

2. **Strict commodity-peptide policy held.** 5 activities ship populated
   `knownPeptides` arrays (mmp / anti-inflammatory / microcirculation /
   follicle-stimulation / angiogenesis), 5 ship empty arrays
   (elastin-synthesis / aquaporin-upregulation / antimicrobial-c-acnes /
   sebum-regulation / wnt-pathway) where commodity reference is fuzzy.
   Honors no-fabrication policy.

3. **Nav design discipline.** All 5 missing surfaces would have overflowed
   the 1280px maxWidth and broken the Swiss minimalist aesthetic. Picked 2
   highest-traffic surfaces (atlas, tiers) for nav and let the other 3 stay
   footer-only. Footer is the discoverability backstop, nav is the curated
   primary scan.

4. **Em-dash sweep scope discipline.** Only swept user-facing prose
   (collagen-synthesis matrikine clause). File header + JSDoc em-dashes
   left in place — they're code-comment scope, not copy. Followed the
   surgical-changes principle.

5. **PR #2 architectural decision verbatim from session 1 plan.** Branch
   cut from origin/master to keep schema-independent. Phase 0.5 prep ships
   without colliding with Phase 0 migrations 0012-0017. T4.6b wires
   profile-pipeline persistence after merge.

## What did NOT happen this session

- **Matteo Telegram ping** — chat-side action, not tool-doable. The 7
  PR-#1 questions in the body of PR #1 still unanswered. Matteo silent.
- **Phase 0 PR #1 merge** — still draft. Hard blocker for L2 schema
  integration + T4.6b + brand-by-target index + Addition E.
- **Secret rotation** for MoonPay + Helio. Still chat-side, blocks
  PENDING.md commit.
- **Addition E (`/decode` tool)** — deferred until brand-by-target index
  schema ships.
- **Addition G.1 (spec doc updates)** — blocked on spec-file location decision.
- **Addition G.2 (/for-researchers rewrite)** — blocked on pricing +
  positioning sign-off from Matteo.

## Next session priorities

1. **Telegram Matteo** — send the 7-question ping. Same priority as
   session 1's parking lot. Without this, half the work tree stays blocked.
2. **Watch PR #1 CI** — the IN_PROGRESS jobs (typecheck -r, test api) on
   the stale Apr 26 commit should auto-restart on next push and either
   close green or surface a blocker.
3. **Auth-mocked e2e for `/app/launch?activity=<slug>` seed pre-fill** —
   currently no test exercises the new code path. Optional, low-priority,
   but would close the verification gap.
4. **Once PR #1 merges:**
   - L2 schema integration into `/v1/brand` novelty-check call site.
   - T4.6b: profile pipeline persistence to `brands.profile_json`.
   - Brand-by-target index for atlas section 04 (creators-by-activity query).
   - Then Addition E (`/decode` tool) becomes feasible.
5. **Matteo input needed:**
   - Where do `specs/DRIP_*` files live? Are they version-controlled in
     a separate repo?
   - Does Matteo approve G.1 pricing changes (Team $1,499 instead of
     $4,800)?
   - Does Matteo approve G.2 capability-matrix swap (7-endpoint list →
     4-axis competitor comparison)?

## Source-of-truth pointers

- Phase 0 plan: `~/drip/.planning/phase_000_novelty_gateway_v0/PLAN.md`
- Phase 0.5 plan: `~/drip/.planning/phase_005_layer23_v0/PLAN.md`
- Atlas ontology: `~/drip/apps/web/lib/atlas-ontology.ts`
- /for-researchers page: `~/drip/apps/web/app/for-researchers/page.tsx`
- Launch wizard step 1: `~/drip/apps/web/app/app/launch/step-1-describe/page.tsx`
- Patch source: `~/Downloads/Telegram Desktop/PATCH_WEBSITE_CONTENT (2).md`.
  Per its own §6 step 8, delete or archive once applied. Additions
  applied so far: A (per savepoint), B parts 1-3 (session 1), C (session 1),
  D (per savepoint), F (per savepoint). Remaining: E + G — both blocked.
- Vercel preview: `https://drip-samples-git-phase-0-nov-78a3bb-bludragon66613-sys-projects.vercel.app`
- PR #1: https://github.com/bludragon66613-sys/Drip/pull/1 (draft)
- PR #2: https://github.com/bludragon66613-sys/Drip/pull/2 (draft)
