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

## Build Status — Superpowers Expansion
All 4 phases of the Superpowers expansion are complete and pushed to GitHub.

### Phase 0: Database Schema Expansion — DONE
- [x] 12 new tables added (users, orgs, compliance, chat, autopilot, reports)

### Phase 1: Auth & Multi-tenancy — DONE
- [x] Clerk auth infrastructure (sign-in/sign-up, webhooks, RBAC)

### Phase 2a: Compliance Engines — DONE
- [x] E-invoice engine (IRP payload generation, sandbox)
- [x] E-way bill engine (NIC format, validity tracking)
- [x] GSTR preparation engine (GSTR-1, GSTR-3B JSON generation)
- [x] Compliance Hub page (/compliance) with 4 tabs

### Phase 2b: Exports & Reports — DONE
- [x] PDF + Excel generation via @react-pdf/renderer and ExcelJS
- [x] 12 report templates (trial-balance, P&L, BS, GST, GSTR-1/3B, HSN, TDS, stock, bank recon, compliance calendar, outstanding)
- [x] ExportButton component wired into all module views

### Phase 2c: Chat SDK — DONE
- [x] WhatsApp, Telegram, Web adapters with unified MessageRouter
- [x] Chat history API

### Phase 3: Munshi AI Agent — DONE (2026-04-02)
- [x] Agent core (`src/lib/agent/munshi.ts`) with AI SDK v6 tool loop
- [x] 6 tools: queryDatabase, generateEInvoice, prepareGSTReturn, generateReport, checkComplianceCalendar, analyzeTrends
- [x] Model selection: Haiku for simple queries, Sonnet for complex/autopilot
- [x] Bilingual personality system (Hindi/English)
- [x] Conversation memory (chat_messages table)
- [x] Autopilot rule engine with schedule/event/threshold triggers
- [x] Default rules: GSTR-1 reminder, monthly report, overdue receivables alert
- [x] Cron: every 6 hours via Vercel
- [x] API routes: /api/agent/chat, /api/agent/autopilot/run, /api/agent/autopilot/rules
- [x] Agent dashboard UI (/agent) with chat, autopilot config, activity log
- [x] Agent link in app header

### Remaining — Launch TODO
- [ ] Deploy to Vercel production
- [ ] Set CRON_SECRET env var for autopilot endpoint
- [ ] WhatsApp Business API verification (Meta approval pending)
- [ ] Production IRP/NIC API credentials (sandbox only currently)
- [ ] Replace placeholder URLs in GTM materials (munshi.ai, wa.me/91XXXXXXXXXX, calendly.com/munshi-ai-ca-demo, ca@munshi.ai, chapters@munshi.ai)
- [ ] Register domain (munshi.ai or tallyai.in) and build landing page
- [ ] Replace placeholder testimonials with real beta user quotes
- [ ] Start CA outreach — founding partner cohort (first 50 CAs)
- [ ] Run Launch Checklist P0 gate (`~/tallyai/gtm/LAUNCH_CHECKLIST.md` Section 6)

## GTM Strategy
- Full GTM document: `~/tallyai/gtm/GTM_STRATEGY.md`
- Beachhead: digitally-aware CAs in Tier-1/2 cities managing 10-30 Tally clients
- 3 phases: Seed (M1-2), CA-Led Growth (M3-6), Scale (M7-12)
- North Star: Weekly Active Companies (WAC)
- Y1 target: 1,000 paying companies, ₹60L ARR
- CA Plan conversion is the critical bet: 1 CA = 15-40 SME businesses

## Pricing Model
- Free: 1 company, 500 vouchers/month, 10 queries/day
- Pro: ₹999/mo — 3 companies, unlimited
- CA Plan: ₹4,999/mo — 25 clients, bulk import, API access

## Target Users
- Primary: Small business owners (₹10L–₹5Cr revenue) with part-time accountant on Tally
- Secondary: CAs managing 20-50 clients on Tally
