---
name: drip 2026-04-27 — Phase 0.5 schema-independent prep + Atlas + Regulatory
description: Two branches advanced. Cut new branch phase-0-5-layer23 from master with 5 commits (T4.2 novelty L2 module + 23 vitest, T4.6 build_profile route via Claude tool-use + 7 vitest, SDK profile.build method + envelope alignment, OpenAPI entry, novelty README). Extended phase-0-novelty-gateway with 4 commits (PATCH addition C /regulatory page, PATCH addition B Atlas ontology + index + dynamic activity explainer in 3 atomic commits). All schema-independent — Phase 0 still draft awaiting Matteo on 7 PR #1 questions. PR #1 not opened on phase-0-5-layer23 yet.
type: project
originSessionId: 2026-04-27_drip-continue
---
# 2026-04-27 — drip Phase 0.5 prep + PATCH §7 marketing pages

## Branch summary

| Branch | State at start | State at end | Pushed |
|---|---|---|---|
| `phase-0-novelty-gateway` | 40 ahead of master, PR #1 draft | 44 ahead of master, PR #1 draft | yes |
| `phase-0-5-layer23` (new) | n/a | 5 commits ahead of master | yes |

## What landed on `phase-0-5-layer23` (new branch)

Cut from `origin/master` to keep schema-independent — Phase 0 owns the
0012-0017 migrations on its branch and merging this from master means
no migration-numbering collision when Phase 0 lands.

| Commit | Effect |
|---|---|
| `95f4b00` | T4.2 novelty Layer 2 module (`@drip/db/novelty`). Pure TS — kgrams, lshCandidates, levenshtein, similarity, checkLayer2 + types. 23 vitest cases at synthetic edit distances 0/1/2/3/5/10 plus boundary (k≤0, len<k, self-skip, custom threshold, sort order). Adds `./novelty` export + `vitest` devDep + test script to `packages/db`. |
| `93d5fbf` | `packages/db/src/novelty/README.md` — three-layer overview (L1 exact-hash done in Phase 0, L2 here, L3 HNSW cosine deferred), tuning rationale for k=5 + 0.85 threshold, usage snippet. |
| `3cc4d74` | T4.6 build_profile route via Claude tool-use. Pure pipeline + Hono route + 7 vitest (200 happy / 503 missing key / 502 SDK throw / 502 no tool call / 502 schema fail / 422 content-safety / 400 zod). Files: `apps/api/src/lib/profile-pipeline.ts`, `apps/api/src/routes/profile.ts`, schemas added to `apps/api/src/lib/schemas.ts`, mounted at `/v1/profile` in `apps/api/src/index.ts`. NO persistence — `brands.profile_json` column doesn't exist on master and adding it would collide with Phase 0 migrations. Persistence wires in T4.6b after Phase 0 merges. |
| `e13d383` | T4.6 follow-up — SDK client + envelope alignment. Profile route success uses `ok()` envelope (matches /v1/brand). Adds `profile.build()` to `DripClient` symmetric with `brand.generate`. Types: `ProfileBuildInput`, `ProfileBuildResponse`, `ProfileDosingForm`, `ProfileSafetyFlag`, `ProfileReference`. Updates happy-path test to read `json.success` / `json.data`. |
| `64d6f72` | OpenAPI entry for `/v1/profile/build` in `apps/api/src/openapi.ts`. Surfaces request schema + 200/400/422/502/503 response codes via `/.well-known/openapi.json`. |

**Tests on this branch:** 58 api + 23 db = 81 green. All 6 workspaces typecheck clean.

**Why no PR opened yet:** awaiting decision on framing — Phase 0 must merge first per PLAN gate. Could open as draft now to surface CI green.

## What landed on `phase-0-novelty-gateway` (extended)

PATCH_WEBSITE_CONTENT (2).md additions B + C ship on this branch
because the marketing surface is brand-current and ships PR #1
preview alongside Phase 0 work.

| Commit | Effect |
|---|---|
| `c78d045` | PATCH addition C — `/regulatory` intelligence page. Public, monthly-curated tracker. Three seeded entries: 2026-04-15 FDA 503A removal (shipped), 2026-07-23/24 PCAC review of BPC-157+6 (upcoming), 2027-02 PCAC review of GHK-Cu (upcoming). Per-entry: numeral / date+jurisdiction / status pill / lane tag / event prose / italic relevance / source row. **No fabricated source URLs** — entries with unverified .gov links render "pending citation lock" stub. Sections: 01 hero / 02 entries / 03 scope (cosmetic / peptide-adjacent / cross-cutting) / 04 cadence + legal-not-advice disclaimer. Swiss Clinical posture, single red rule at hero only. |
| `0a75e2a` | PATCH addition B part 1 — `apps/web/lib/atlas-ontology.ts`. Typed source-of-truth for 13 cosmetic activities. Maps 1:1 to `targets` enum in DRIP_DISCOVERY_STACK §3 / §5.1 build_profile. URL slug is kebab-case, `enumName` field carries the snake_case for boundary translation. 3 activities ship with full live body (collagen-synthesis, hyaluronan-synthesis, tyrosinase-inhibition). 10 ship `status: editorial_review` with summary + concerns mapped only — pages render stub state. Helpers: `getActivity(lane, slug)`, `activitiesForLane(lane)`. Research lane reserved (no rows yet). |
| `d53c60f` | PATCH addition B part 2 — `/atlas` index. Three sections: hero / cosmetic lane (13 hairline-rule tiles deep-linking to `/atlas/cosmetic/<slug>`) / research lane placeholder pointing at `/for-researchers`. Mono eyebrows, tabular numerals on tile counters. CTA-less surface. |
| `7365941` | PATCH addition B part 3 — `/atlas/<lane>/<activity>` dynamic explainer. 6 sections: 01 hero (eyebrow `drip · atlas · cosmetic`, activity name as headline, summary, addressed-concern list, single red rule) / 02 biology (whatItIs paragraphs OR pending stub) / 03 reference (commodity peptides bullets OR stub) / 04 creators stub / 05 literature stub / 06 CTA strip (primary `/app/launch?activity=<slug>` deep-link with red underline + secondary `/for-researchers` with stone underline). `generateStaticParams` emits 13 SSG slugs. `notFound()` on bad lane or unknown slug. `generateMetadata` per-activity. Red accent budget: 2/viewport (hero rule + primary CTA underline). |

## Files added this session

```
# phase-0-5-layer23
apps/api/src/lib/profile-pipeline.ts
apps/api/src/routes/profile.ts
apps/api/src/routes/profile.test.ts
packages/db/src/novelty/l2.ts
packages/db/src/novelty/index.ts
packages/db/src/novelty/__tests__/l2.test.ts
packages/db/src/novelty/README.md

# phase-0-novelty-gateway
apps/web/app/regulatory/page.tsx
apps/web/lib/atlas-ontology.ts
apps/web/app/atlas/page.tsx
apps/web/app/atlas/[lane]/[activity]/page.tsx
```

## Live atlas activity URLs

- `/atlas` — index
- `/atlas/cosmetic/collagen-synthesis` — full
- `/atlas/cosmetic/hyaluronan-synthesis` — full
- `/atlas/cosmetic/tyrosinase-inhibition` — full
- 10 other `/atlas/cosmetic/*` slugs render with editorial-review stub state

## Working tree at session end

```
M apps/web/next-env.d.ts          (Next 16 auto-gen, harmless)
M package.json                    (@google/design.md devDep, deliberately uncommitted)
M pnpm-lock.yaml                  (matches the devDep above)
?? .env.vercel.prod               (secret, gitignored intent)
?? docs/PENDING.md                (held back pending secret rotation)
```

Same dirt as session start. Stash empty.

Currently checked out: `phase-0-novelty-gateway`.

## Test posture at session end

| Workspace | Tests | Delta |
|---|---|---|
| apps/api | 58 | +7 (profile.test.ts) |
| apps/web | 16 | unchanged |
| @drip/db | 33 | +23 (l2.test.ts on phase-0-5-layer23 only) |

Note: db test count is branch-dependent. `phase-0-5-layer23` has 23 (L2 only). `phase-0-novelty-gateway` has 10 (Phase 0 originals).

`pnpm -r typecheck` clean across 6 workspaces on both branches.

## Architectural notes

1. **Two-branch strategy worked.** Phase 0.5 prep doesn't pollute the
   already-large phase-0-novelty-gateway PR. Marketing surface ships
   on the Phase 0 branch because it's complementary and previews
   alongside the existing Vercel deployment.

2. **No-fabrication policy held under pressure.** /regulatory entries
   render "pending citation lock" stub for unverified .gov URLs.
   /atlas activity pages render "explainer in editorial review" stub
   for the 10 untransferred bodies. Hard Rule 1 honored.

3. **Atlas ontology slug discipline.** URL slug is kebab-case
   (`collagen-synthesis`). `enumName` field carries snake_case
   (`collagen_synthesis`) for boundary translation when a frontend
   form needs to call the build_profile tool. Two namespaces, one
   mapping.

4. **Red accent budget kept.** Per BRAND-V0.1 §14.1 max 2 occurrences
   per viewport. /regulatory uses 1 (hero rule only — CTA-less page).
   /atlas index uses 1 (hero rule only — CTA-less page). /atlas
   activity pages use 2 (hero rule + primary CTA underline). All in
   spec.

## What did NOT happen this session

- **Phase 0 PR #1 merge.** Still draft. Matteo silent on the 7
  questions in the PR body. Distilled Telegram-ready ping drafted
  but not sent (no chat-side action).
- **PR opened from phase-0-5-layer23.** Branch pushed but no PR.
- **Footer / nav linkage** for /regulatory, /atlas, /tiers,
  /methodology, /for-researchers. None of these are linked from
  global nav or footer. Direct-URL accessible only.
- **Brand-by-target index.** `/atlas/<lane>/<activity>` section 04
  (creators targeting this) renders stub. Wires up after a
  by-activity creator query is added.
- **Editorial copy for 10 atlas activities.** Stubs render correctly;
  Claude-gen pass deferred to Session 2.
- **/app/launch query param consumer.** CTA deep-link
  `/app/launch?activity=<slug>` works at link level but the launch
  wizard does not yet parse the param to pre-seed the activity
  selection.
- **Secret rotation** for MoonPay + Helio (still blocks PENDING.md
  commit).

## Next session priorities

1. **Open PR #2** from `phase-0-5-layer23` to master as draft. Caveat
   in description: gates on Phase 0 PR #1 merging first; the persistence
   T4.6b wire and L2 schema integration follow.
2. **Telegram Matteo** — send the 7-question ping (text drafted in this
   session's chat history, not saved to disk).
3. **Atlas Session 2** — Claude-gen + editorial review for the 10
   stub activities. Each gets `whatItIs` paragraphs + `knownPeptides`
   list. Update `apps/web/lib/atlas-ontology.ts` rows in place,
   flip status from `editorial_review` to `live`. One commit per
   activity OR one batch commit — preference unset.
4. **Footer linkage hygiene pass** — add `/atlas`, `/regulatory`,
   `/tiers`, `/methodology`, `/for-researchers` to footer "product"
   or "company" column. ~5 commits-worth of churn for a discoverability
   win.
5. **`/app/launch` activity param consumer** — small change to the
   launch wizard step that picks the discovery target. Reads
   `?activity=<slug>`, resolves via `getActivity`, pre-fills.

## Source-of-truth pointers

- Phase 0 plan: `~/drip/.planning/phase_000_novelty_gateway_v0/PLAN.md`
- Phase 0.5 plan: `~/drip/.planning/phase_005_layer23_v0/PLAN.md`
- PR #1 body has the 7 Phase B questions for Matteo.
- Atlas ontology: `~/drip/apps/web/lib/atlas-ontology.ts`
- Discovery stack ontology source: `DRIP_DISCOVERY_STACK.md §3` /
  `§5.1` (Telegram desktop downloads).
- Patch source: `~/Downloads/Telegram Desktop/PATCH_WEBSITE_CONTENT (2).md`.
  Per its own §6 step 8, delete or archive once applied — this
  session lands additions B + C of 7 (A/D/F already shipped earlier;
  E + G remain).
