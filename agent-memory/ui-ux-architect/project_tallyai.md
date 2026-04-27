---
name: TallyAI Project Context
description: TallyAI (Munshi Neo) design system, file locations, and completed work
type: project
---

TallyAI is an Indian fintech SaaS — AI accounting intelligence on top of Tally ERP. The design system is "Munshi Neo v2.0."

**Why:** Premium visual design overhaul completed 2026-04-03 to match the munshi-neo-premium.html reference.

**How to apply:** When working on TallyAI, all design decisions flow from `brand/BRAND_MASTER_GUIDE.md` and `docs/design-system-v2.md`. The premium HTML reference is at `brand/munshi-neo-premium.html`.

## Key Design Tokens
- Primary (light): #1B6B4A (Neelam green)
- Primary (dark): #34D399
- Secondary: #E8A317 (Kesar gold) / dark: #F5BF42
- Tertiary: #3B6FC2 (Neel blue) / dark: #60A5FA
- Dark bg: #0F1117, Cards dark: rgba(255,255,255,0.015)
- Fonts: Inter (UI), DM Sans (display h1), IBM Plex Mono (financial data)

## CSS Architecture
- `globals.css` — all design tokens + premium utility classes added at bottom
- `.stat-card` — all widget cards (translucent in dark mode, white in light)
- `.btn-primary-gradient` — the green gradient CTA button used throughout
- `.marketing-header` / `.app-header` — frosted glass headers
- `.feat-card` — landing feature cards with hover glow
- `.header-icon-btn` — 34px icon buttons in app header

## Key Patterns
- Icon badges in widgets: 28×28px, 8px radius, 8% tint of semantic color
- Status dots: 5px filled circles (not icons), match text color
- Hairline dividers in dark: `rgba(255,255,255,0.04)` not `var(--border)`
- Gradient accent line: 2px, multi-stop (transparent→green→teal→mint→transparent)
- Gradients for icons always via `style={{ background: "..." }}` not Tailwind JIT

## Files Changed in Premium Overhaul
- `src/app/(marketing)/layout.tsx` — marketing navbar/footer
- `src/app/(marketing)/page.tsx` — landing hero/features/pricing/CTA
- `src/app/(app)/layout.tsx` — app shell header/footer
- All 9 widget files in `src/components/widgets/`
- `src/components/data-table.tsx` — premium table styling
- `src/app/globals.css` — new utility classes + upgraded accent line
