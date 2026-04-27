---
name: NTS Website Design Audit
description: Neo Tokyo Studios Next.js 16 website — stack, design system, known issues, and audit findings from April 2026 session
type: project
---

AI anime production studio website. Next.js 16 + Tailwind 4 + Framer Motion + React Three Fiber/Drei.

**Stack:** Next.js 16.2.3, React 19, Tailwind 4, Framer Motion 12, @react-three/fiber 9, @react-three/drei 10, Three.js 0.183, TypeScript 5. Windows dev environment.

**Brand colors:** #FF0066 (NTS Magenta), #00FFFF (Signal Cyan), #F0F0F0 (Near White), #050505 (Void Black), #444444 (Smoke), #111111 (Charcoal), #0A0A0A (Deep Surface).

**Typography:** Inter (800/700/500/400), JetBrains Mono (400/500), Noto Sans JP (400/700). All loaded via next/font/google.

**Pages:** / (home), /about, /series (index), /series/[slug], /press

**Key components:** NTSMark (full logo with chromatic aberration), CompactMark (N/T nav logo), SeriesCard (h-full flex-col), HeroSection (WebGL ParticleField + Framer Motion entrance), ParticleField (Three.js canvas: 1200 particles + ScanPlane + GridLines), MagneticCard (3D tilt on hover), SectionHeader, ScrollReveal/StaggerContainer, GlitchText/TypeReveal, GlitchDivider, PageFrame (animated magenta border corners), NoiseOverlay, ScanLines, DotGrid.

**Series data:** 3 series — Chakra (dark fantasy, #FF0066), Tiny Emperor (comedy, #FFD600), Tales from the Signal (folklore, #C5A55A). Short descriptions vary in length causing card height misalignment in fixed-height grid.

**Deployed URL:** https://nts-ashen.vercel.app — NOTE: this URL currently serves the brand bible HTML, not the Next.js app. The Next.js site has a separate Vercel project (projectId: prj_VPCT4ASm7Zu0LtbqFumnhJDXReJG, projectName: "website").

**Critical known issues from audit:**
1. SeriesCard uses h-full on motion wrapper but grid doesn't enforce equal heights — cards misalign when descriptions differ
2. The grid uses gap-4 (16px) which is tight for premium feel — Linear/Stripe use gap-6 to gap-8
3. ManifestoSection text contrast is dangerously low: #666666 on #050505 fails WCAG AA at body size
4. Footer is severely underdeveloped — only "/ end transmission" + copyright, no nav links, no social, no series links
5. Mobile hero is full viewport height but WebGL canvas pointer-events:auto blocks scrolling on touch
6. About page has mismatched ScrollReveal delays (0.3, 0.5, 0.6, then 0.1 — resets inconsistently)
7. useMemo misused for side effects (window event listener) in ParticleField — should be useEffect
8. No mobile hamburger menu — nav links collapse at small viewport but remain visible as tiny text
9. The Manifesto section uses two different text colors (#666666 and #444444) for two paragraphs with no clear hierarchy reason
10. Press page "Download Press Kit" disabled button looks identical to an active button with slightly lower opacity — no clear disabled state pattern
11. No 404 page — 404 state is undesigned
12. No loading states or page transition between routes
13. Series index and homepage show identical card grids — wasted opportunity for visual differentiation
14. No scroll-based ambient effects connecting sections — the page feels like stacked sections, not a continuous experience

**Why:** Brand is locked. Design is in implementation phase. User wants the site to feel premium (Vercel/Linear/Stripe bar). No AI mentioned publicly.

**How to apply:** All design token changes must reference globals.css @theme block. The slash "/" is always clean — no aberration. Genre colors apply only to slash and underline, not to letterforms.
