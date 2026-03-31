---
name: TallyAI Project
description: AI-powered accounting intelligence for Indian SMEs — Tally XML parser, bank reconciliation, NL queries, WhatsApp bot
type: project
---

AI layer that works WITH Tally (not a replacement). Ingests Tally XML exports + bank statements, provides reconciliation, error detection, and natural language queries.

**Why:** Tally dominates Indian SME accounting (~7M businesses). Building a replacement is 2+ years. Building an AI copilot on top is 4 weeks.

**How to apply:** This is a product build, not infrastructure. Ship fast, validate with CAs first.

## Location
- Code: `~/tallyai/`
- Stack: Next.js 16.2.1, TypeScript, Tailwind, shadcn/ui (dark theme), Drizzle ORM, Neon Postgres, AI SDK v6 + AI Gateway
- Dev: `npx next dev --port 3200` (use 3200 to avoid conflicts)
- Test data: `~/tallyai/test-data/sample-tally.xml` (Sharma Enterprises, 10 ledgers, 4 vouchers, 3 stock items)

## Architecture
- `src/lib/tally-parser.ts` — Parses Tally XML (ENVELOPE > BODY > IMPORTDATA structure). Handles ledgers, vouchers, stock items, GST entries
- `src/lib/bank-parser.ts` — Parses bank CSV (auto-detects HDFC, SBI, ICICI, Axis, generic)
- `src/lib/reconciliation-engine.ts` — Fuzzy matches bank txns ↔ vouchers (amount ±₹1, date ±3 days, party name overlap)
- `src/lib/query-engine.ts` — NL query engine: intent classification via AI → DB query → formatted answer. Supports Hindi/English
- `src/lib/import-service.ts` — Persists parsed Tally data to Neon Postgres via Drizzle
- `src/db/schema.ts` — Drizzle schema: companies, ledgers, ledger_groups, vouchers, stock_items, bank_transactions, reconciliation_results, query_history
- `src/app/api/import/route.ts` — POST endpoint, accepts XML file upload, returns parsed data
- `src/components/upload-zone.tsx` — Drag-and-drop Tally XML uploader with status states
- `src/components/data-preview.tsx` — Preview cards for ledgers, vouchers, stock items

## Paperclip Company
- Company ID: `7cf2c89a-a57a-48c0-a41f-07191d2bb8a0`
- Issue prefix: TAL
- 10 agents: CTO, Frontend Lead, Backend Lead, AI Engineer, Database Architect, Tally Domain Expert, WhatsApp Bot Engineer, QA Engineer, DevOps Engineer, Product Manager

## Brand Identity (Munshi Neo v2.0) — Updated 2026-03-27
- **Brand Guide:** `~/tallyai/brand/BRAND_MASTER_GUIDE.md` (single source of truth)
- **Design System:** `~/tallyai/docs/design-system-v2.md` (technical spec with CSS tokens)
- **Positioning:** `~/tallyai/brand/BRAND_POSITIONING.md` (messaging, taglines, elevator pitches)
- **Image Prompts:** `~/tallyai/brand/IMAGE_PROMPTS.md` (8 AI generation prompts for brand assets)
- **Primary Tagline:** "Hisaab samajhta hai." (replaces "Hisaab. Automated." as brand tagline; old tagline kept for UI)
- **Colors:** Neelam green #1B6B4A (primary), Kesar gold #E8A317 (secondary), Neel blue #3B6FC2 (tertiary), cool off-white #F7F8FA (background)
- **Fonts:** Inter (UI body, replaces DM Sans), DM Sans (display headings only), IBM Plex Mono (financial data), Noto Sans Devanagari (Hindi)
- **Key decisions:** Drop Fraunces serif, drop paper texture/ruled lines, drop warm cream background, evolve stamps to flat badges, add gradient accent line + AI sparkle indicator
- **Competitor research:** doola.com (warm gold, casual voice) and QuickBooks (protected green, "Backing You") analyzed for positioning

## Build Status (Phase 1 — Week 1)
- [x] Next.js 16 scaffolded with TypeScript + Tailwind
- [x] shadcn/ui components (button, card) + dark theme
- [x] Tally XML parser (tested with sample data)
- [x] Database schema (Drizzle ORM, 8 tables)
- [x] Neon Postgres via Vercel Marketplace (neon-gray-mountain)
- [x] Import API + DB persistence
- [x] Bank statement CSV parser (HDFC, SBI, ICICI, generic)
- [x] Reconciliation engine (fuzzy matching, confidence scoring)
- [x] Natural language query engine (9 intents, Hindi/English)
- [x] Full dashboard: tabbed UI (Import, Bank, Reconcile, Ask)
- [x] Company selector (multi-company support)
- [x] E2E tested: import → bank → reconcile → query all working
- [x] Vercel project linked (bludragon66613-sys-projects/tallyai)
- [x] Brand Master Guide v2.0 (Munshi Neo) — positioning, visual identity, image prompts
- [ ] WhatsApp bot integration (Phase 2)
- [ ] AI Gateway for NL queries (needs vercel env pull for OIDC)
- [ ] Deploy to Vercel production
- [ ] Implement Munshi Neo design system (CSS migration from v1 to v2)

## Pricing Model
- Free: 1 company, 500 vouchers/month, 10 queries/day
- Pro: ₹999/mo — 3 companies, unlimited
- CA Plan: ₹4,999/mo — 25 clients, bulk import, API access

## Target Users
- Primary: Small business owners (₹10L–₹5Cr revenue) with part-time accountant on Tally
- Secondary: CAs managing 20-50 clients on Tally
