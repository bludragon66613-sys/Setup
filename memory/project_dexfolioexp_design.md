---
name: project_dexfolioexp_design
description: DexFolioExp design complete — all 8 mockups approved, brand tokens in production, ready for React implementation
type: project
---

DexFolioExp branding and UI/UX design (Apr 8, 2026) — COMPLETE.

**Why:** Product had code-first frontend with no design work. Built structured brand + UI/UX from scratch.

**How to apply:**
- All mockups deployed: https://dexfolio-brandbible.vercel.app
- Source files: ~/DexFolioExp/design-mockups/ (8 page mockups + brand bible + explorations)
- Frontend tokens already applied: index.css, Layout.tsx monogram, favicon
- Build is clean (zero TS errors, Vite builds successfully)

**Approved Decisions:**
- Monogram: "The Folded Page" — dark rounded square with top-right fold, outline "d" inside
- Colors: Forest #2e7d5b (buy/positive) + Crimson #b84040 (sell/negative)
- Wordmark: DEXFOLIO all-caps Inter, uniform white, letter-spacing 3px
- Visual direction: DexScreener data-density + premium polish

**Approved Mockups (all 8):**
- 10-token-chart.html — Token Chart Page (hero screen)
- 11-dashboard.html — Dashboard / Token Explorer (home page)
- 12-portfolio.html — Portfolio Dashboard (Folio Mode)
- 13-wallet-detail.html — Wallet Detail (trade history, holdings, scores)
- 14-new-tokens.html — New Tokens Feed (live feed, protocol badges)
- 15-pricing.html — Pricing (Dashboard + API tiers, comparison, FAQ)
- 16-api-docs.html — API Documentation Portal (Stripe-style, 4 endpoints)
- 17-landing.html — Marketing Landing Page (light mode, hero, features)

**Production commits:**
- `2f776f0` — Brand tokens (Forest/Crimson) applied to 16 frontend files
- `54ad47b` — All mockups + design spec + implementation plan committed
- `c0a0e7f` — WebSocket hook TS errors fixed

**Next:** Implement approved mockups as real React components in frontend/src/
