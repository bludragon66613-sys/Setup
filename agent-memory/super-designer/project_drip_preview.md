---
name: drip aesthetic preview system
description: 5 hero direction previews at /preview for the founder to pick a visual language for drip.markets
type: project
---

5 self-contained preview pages built at `apps/web/app/preview/<slug>/page.tsx`. Index at `/preview`.

Directions:
1. clinical — currently shipped direction. Ink bg, bone/saline, helix, Instrument Serif headline, mono kit.
2. apothecary — light (bone bg), serif headline, droplet SVG mark, no helix, restrained mono. Aesop posture.
3. terminal — ink bg, JetBrains Mono everything, 1px saline border hero block, fake pipeline.log, bracket CTAs, scanline overlay.
4. editorial — light (bone bg), 672px single column, clamp(64px,10vw,128px) Instrument Serif, inline saline link CTAs, reads like an essay.
5. hybrid — top half Apothecary (bone), transition strip with "consumer face above · operator surface below", bottom half Clinical (ink bg, StatusGrid, mini EventFeed).

**Why:** founder reconsidering Direction A (Clinical Report) locked in BRAND-V0.1.md section 14. Previews are apples-to-apples same content scaffold.

**How to apply:** once founder picks, the chosen direction re-skins `apps/web/components/marketing/hero.tsx` and updates BRAND-V0.1.md section 14.

All 5 pages are self-contained — no new shared components outside app/preview/*. Typecheck: clean (npx tsc --noEmit in apps/web, zero errors).
