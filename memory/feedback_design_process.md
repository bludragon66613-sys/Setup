---
name: design_process
description: Before touching any visual surface, read the project's brand bible + study existing components — don't ship with inline styles against a generic dark theme
type: feedback
originSessionId: 66ae1938-09c2-4555-a9a9-4c5e183a1f9b
---
Before editing or creating ANY visual surface (marketing page, dashboard,
email template, storefront), do two things first:

1. **Read the project's brand bible end-to-end.** Filenames vary: `BRAND.md`,
   `brand/BRAND.md`, `docs/DESIGN.md`, `DESIGN_SYSTEM.md`. Global CSS
   (`globals.css`, `theme.css`) usually links to it in a comment header —
   follow that link. Note tokens, typography scale, voice rules, visual
   language pillars, and the explicit "do not" list.
2. **Study 1-2 existing sibling components** and match their pattern
   exactly — class conventions, spacing rhythm (`max-w-Xxl px-N py-N`),
   layout (grid vs flex), how accent color is applied (inline style vs
   class vs CSS var).

**Why:** Saved feedback memories `feedback_design_quality` (Japanese
minimalism, billion-dollar quality) and `feedback_ai_design_antipatterns`
(9 banned patterns) enumerate what good and bad look like — but without
the project-specific brand bible they aren't enough. In the drip session
2026-04-18 I shipped `/creators` + `/token` using ad-hoc inline styles
against a generic dark palette, never opened `~/drip/brand/BRAND.md`, and
produced visual output the user correctly called out as "trash." The
redo — gold-dominant `/drip` with terminal-grid overlay, PeptideGlyph
hero on `/creators` matching `components/hero.tsx` — took ~30 min once I
actually read the bible. The first pass took longer AND produced worse
output.

**How to apply:**
- Before any UI commit: confirm the brand bible was read THIS session.
- When shipping a new page, copy the layout skeleton from an existing
  page that got design sign-off (usually a landing section) and replace
  the content — never start from scratch.
- Prefer the project's Tailwind class layer + CSS var tokens. Reach for
  `style={{}}` only for one-off brand-color accents like saline/gold
  highlights.
- Lowercase brand names stay lowercase even at sentence starts if the
  bible says so (it does for drip, will for other modern brands too).
- Token/financial surfaces get different visual language than product
  surfaces — gold-only, mono-heavy, terminal/dashboard reference aesthetic.
- If a landing page uses a signature asset (peptide glyph, hero 3D, etc),
  reuse it on secondary pages — don't leave secondary pages visually
  orphaned.
