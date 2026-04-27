---
name: drip design audit findings 2026-04-18
description: Design system violations, token gaps, and 3-phase fix plan for the drip peptide creator platform (drip.markets)
type: project
---

Full audit completed 2026-04-18. Report at `C:\Users\Rohan\drip\docs\ui-ux-audit-2026-04-18.md`.

**Why:** Founder called prior pass "AI slop vibe coded." Demanded rigorous compliance with BRAND.md v0 + BRAND-V0.1.md.

**How to apply:** Any future session touching drip UI should begin by reading the audit doc and checking which phase has been implemented.

## Key violations found (highest priority)

1. Nav uses `display` (Instrument Serif) for wordmark — should be Geist Sans Medium (`font-sans font-medium`). File: `apps/web/components/nav.tsx` line 8. Same bug in `app/app/dashboard/page.tsx` line 230.

2. Nav has `backdrop-blur-md` glassmorphism. Banned by BRAND.md §2. Remove it, use `bg-ink/95`.

3. No global `:focus-visible` rule in `globals.css`. BRAND-V0.1.md §21 mandates `outline: 2px solid var(--color-saline); outline-offset: 2px`. Multiple surfaces have `outline-none` stripping focus rings.

4. No `prefers-reduced-motion` guard in `globals.css`. BRAND-V0.1.md §15 requires all motion to become instant under this preference.

5. Motion tokens from BRAND-V0.1.md §15 (`--motion-instant` through `--motion-hero`, four ease curves) not in `globals.css @theme`.

6. Helix SVG (`peptide-glyph.tsx`): decorative glow filter (banned), mint-colored nodes (wrong — should be bone), animated with `dropFall` (wrong motion vocabulary), radius animation (decorative). All must be removed.

7. All public CTA buttons are wrong: `text-base font-medium sans px-6 py-3`. Should be InlineCTA spec: `mono uppercase text-xs tracking-[0.08em] px-5 py-2.5`. Dashboard buttons are already correct — use them as the reference.

8. Currency copy rule violation throughout section-economics: `$60` should be `USD 60` per BRAND-V0.1.md §23 rule 7.

9. section-economics "example mid-case" box has a bordered, backgrounded container — a nested card pattern. Should be flat DataRow dividers per §17.2.

10. No MetricStat primitive (`kit/metric-stat.tsx`) built yet. BRAND-V0.1.md §17.1 requires it for dashboard operational numbers.

## What's correct and should not be changed

- Color tokens in globals.css: all hex values correct (ink, bone, saline, mint, gold, amber, crimson, stone-800/500/200)
- Font stack: Instrument Serif + Geist + JetBrains Mono. Correct.
- Text scale (xs through hero): correct, using major-third 1.25x.
- Section padding rhythm: `py-24 md:py-32`. Correct.
- Max-widths: `max-w-6xl` marketing, `max-w-4xl` dashboard. Correct.
- Eyebrow pattern: mono 12px uppercase tracking-[0.2em] stone-500. Correct on all surfaces.
- DataRow dividers: `divide-stone-800/60 border-stone-800/60`. Correct.
- Token surface gold containment on `/drip` page: correct.
- Background grid overlay on `/drip`: correct (48px, rgba gold 0.015).
- Dashboard button components (PrimaryButton, WarnButton, GhostButton): already InlineCTA-compliant. Use as reference.
- Mint-on-success states (waitlist submitted, etc.): correct.
- Saline selection highlight: correct.

## Verdict
FLAG — foundation is sound, three compounding issues prevent the 9:47pm screenshot test: helix glyph is generic SVG not proof-of-molecule, public CTAs inconsistent with dashboard CTAs, no accessibility baseline (focus-visible + reduced-motion).
