---
name: session_savepoint_2026-04-18b_drip-swiss
description: drip Swiss Clinical re-skin — direction picked from 10-tab samples, 6 commits flipping every public + app surface from dark Function-Health Clinical Report to white Vignelli/Crouwel/Müller-Brockmann Swiss Clinical. /drip stays dark per BRAND §9.
type: project
originSessionId: 884a7ffe-53d7-41dd-a704-eeb458ccd3b7
---
# Session savepoint · 2026-04-18b · drip Swiss re-skin

## Context

Continuation of 2026-04-18a (the "drip marathon" — 13 commits closing the
2026-04-17 checkpoint and standing up the public surface redesign). That
session's parking lot included "dashboard + /app/products inline-style mess
needs BRAND.md treatment." This session resolved that — and rewrote the
brand contract underneath it first.

## Sequence of events

1. Continued the prior /samples preview project. Founder pushback that the
   five existing variants (clinical / apothecary / terminal / editorial /
   hybrid) were all clinical-report tonal variants, not real diversity.
2. Researched and proposed five genuinely distinct aesthetic worlds:
   pharma brutalism (Humanrace × Off-White), japanese pharmacy (Muji × Kinto),
   luxury black card (Amex Centurion × Telfar), hi-vis industrial
   (Patagonia × Stüssy Lab), swiss clinical (Vignelli × Wim Crouwel).
3. Built all five as tabs alongside the existing five — `/samples` became
   a 10-tab comparison page. Loaded Bebas Neue, Cormorant Garamond, Playfair
   Display, Archivo Narrow via `next/font/google` in a scoped
   `samples/layout.tsx` so production bundle was unaffected.
4. Committed `6e35fa9` and deployed to drip-samples.vercel.app.
5. **Founder picked Swiss Clinical.** Lowercase voice retained over
   Vignelli sentence-case convention. Execution mode: end-to-end autonomous.
6. Five-phase re-skin executed.

## The 6 Swiss commits (in order, on master, all pushed)

1. `28f9812` brand: re-anchor to Swiss Clinical (Vignelli/Crouwel/Mueller-Brockmann)
   - `brand/BRAND-V0.1.md §14` rewritten with new pillar weighting:
     Vignelli/Crouwel/Müller-Brockmann 60% / MIT Media Lab + Lars Müller 25% /
     Function Health 15% (status overlays only).
   - `brand/BRAND-V0.1.md §14.1` added: Swiss posture rules. White ground,
     ink only, single signal red `#E2231A` (max 2 occurrences per viewport),
     12-col asymmetric grid, oversized numerals as primary visual mass,
     no buttons (text + 2px red underline), no decoration, no rounded
     boxes, no gradients, no shadows.
   - `brand/BRAND.md §3` color rules reorganized: `--paper`, `--rule`,
     `--red-accent`, explicit `--stone-500 #7A7A7A` as the only permitted
     grey; quarantines `--saline`, `--bone`, `--gold`, `--mint`, `--amber`,
     `--stone-800` to specific surfaces.

2. `24acf16` feat(tokens): flip default tokens to Swiss Clinical
   - `apps/web/app/globals.css` adds `--color-paper`, `--color-rule`,
     `--color-red-accent`, mega scale (`--text-mega-1/2/3` 96/120/144).
   - Body bg flips ink → paper. `color-scheme: dark` → `light`.
     `:focus-visible` outline saline → red-accent. `::selection` red on paper.
   - New utility primitives: `.cta-primary` (text + 2px red underline),
     `.cta-secondary` (text + 1px stone underline), `.rule-data`, `.rule-meta`,
     `.bar-live` (4×32 red bar replacing the dot/badge "live" pattern),
     `.tabular-nums`. `.display` defaults to Geist Bold (Instrument Serif
     quarantined to /drip).

3. `e790a19` feat(homepage): re-skin nav + footer + 9 marketing sections
   - `components/nav.tsx` — sticky paper bar, `.cta-primary` on launch CTA.
   - `components/footer.tsx` — paper bg, 12-col link columns.
   - All 9 `components/marketing/*.tsx` rewritten by hand to inline Swiss
     vocabulary (kit primitives StatusGrid/EventFeed/MetricStat etc.
     intentionally NOT touched — they were authored for the dark direction
     and a follow-up phase decides whether to retire or rebuild them).
   - Helix removed from hero per Swiss anti-decoration posture.

4. `138f2c3` feat(public): re-skin /manifesto and /creators; quarantine /drip dark
   - `/manifesto`: 12-col grid, 32×4 red bar under H1, H2 sections with
     left-margin 02/03/04 numerals, body in cols 3/11.
   - `/creators`: 01 marker + red bar in left col, hairline-grid card
     layout, empty state with `.bar-live` + "status / day zero" caption.
   - `/drip` token basement intentionally NOT re-skinned; explicit
     `background: var(--color-ink); colorScheme: "dark"` added to `<main>`
     so it overrides the new paper default per BRAND-V0.1 §14.

5. `50c8172` feat(app): Swiss re-skin all /app/* authenticated surfaces
   - Delegated to executor agent with extremely tight brief + reference
     files (the just-written hero/nav/footer/marketing patterns).
   - 13 files: dashboard, products, onboard, launch wizard layout +
     progress-rail + step-shell + 6 step pages + brand-live success page.
   - Verified: 0 quarantined token references in `/app/*`, typecheck green.

6. `863537a` chore(samples): keep only swiss; delete 9 losing variants
   - Deleted `samples/layout.tsx` + 9 variant files.
   - Rewrote `samples/page.tsx` as a single-variant frozen reference
     (chosen-direction header strip + footer pointing to BRAND-V0.1 §14).

## Verification

- `pnpm typecheck` from `apps/web`: green at every phase.
- 0 quarantined-token references in `/app/*` (`saline`, `bone`, `stone-800`,
  `gold`).
- All public surfaces return 200 on drip-samples.vercel.app:
  `/`, `/samples`, `/manifesto`, `/creators`, `/drip`.
- Production deploy triggered to drip-samples (this account's only
  Vercel project for drip — drip.markets prod is on Matteo's account
  and picks up via GitHub integration on push).
- Origin master in sync at `863537a`. Working tree clean.

## Incidents during cleanup

- Accidentally ran `pnpm uninstall --filter web @tailwindcss/postcss` while
  exploring (intended as a check, not an action). Reinstalled at the same
  version (`@tailwindcss/postcss ^4.2.2`) immediately. Build pipeline
  unchanged. Worth remembering: uninstall is destructive — never use it as
  a probe.

## What is now Swiss vs what stays as it was

**Swiss (white paper + ink + red-accent):**
- `/`, `/manifesto`, `/creators`, `/samples` (frozen reference)
- `/sign-in`, `/sign-up` (inherit Clerk theming on white body)
- `/app/dashboard`, `/app/products`, `/app/onboard`
- `/app/launch/{1,2,3,4,5,6}` + `/app/launch/live/[brand_slug]`

**Stays dark by design:**
- `/drip` (token basement) — explicit dark surface override
- Creator storefronts at `/_creator/[slug]` — opt out per BRAND.md §8,
  own palette per creator

## Open follow-ups (not blocking)

1. **Kit primitives** (`components/kit/{StatusGrid, EventFeed, MetricStat,
   SectionHeader, LiveBadge, DataRow, SparkRow, InlineCTA}`) are still
   present but unused by the marketing surfaces. Decision deferred:
   retire entirely or rebuild for Swiss.
2. **Helix** (`components/helix/*`) is also unreferenced now — the hero
   used to render it. May reappear in a dedicated "the molecule" section
   deeper in the homepage if the founder asks for it.
3. **drip.markets** prod deploy. Matteo's Vercel account owns the domain;
   GitHub push should trigger auto-deploy if integration is connected.
   Verify on next session.
4. **Brand assets** that weren't touched: OG images in `apps/web/public/`
   (still dark Function Health style) — should be re-rendered for Swiss
   when an OG generator is set up.

## Key decisions captured (for future memory)

- **Visual direction is now locked.** `/samples` is a frozen reference,
  not a comparison apparatus. Future direction changes go through a new
  brand spec rev, not a tab swap.
- **Lowercase voice survives Swiss tradition.** drip's existing voice
  predates the visual system. §14.1 makes this explicit so future
  designers don't sentence-case the copy.
- **Single-red budget per viewport: max 2.** This is the most-violated rule
  for any AI re-implementation; codified in §14.1.
- **No buttons except form submits.** Every other CTA is a text link with
  `.cta-primary` or `.cta-secondary` underline.
