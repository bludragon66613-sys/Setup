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

## Build Status — TallyAI v2 Full Accounting Platform
All 6 build phases complete as of 2026-04-04. Pushed to GitHub.

### Superpowers Expansion (Phases 0–3) — DONE
- [x] 12 tables (users, orgs, compliance, chat, autopilot, reports)
- [x] Clerk auth, multi-tenancy, RBAC
- [x] E-invoice, e-way bill, GSTR engines
- [x] 13 report templates (PDF + Excel) including Tax Invoice
- [x] WhatsApp/Telegram/Web chat SDK
- [x] Munshi AI Agent with 6 tools, autopilot rules, bilingual personality

### v2 Phase 1: Foundation — DONE
- [x] Sidebar + ⌘K command bar, 5-level role hierarchy, company wizard, chart of accounts, notifications

### v2 Phase 2: Core Accounting — DONE
- [x] 8 transaction types (CRUD), voucher line items, ledger CRUD, approval workflow engine, numbering config

### v2 Phase 3: Compliance — DONE
- [x] GST validation dashboard, GSTR-2B/3B reconciliation, e-invoice/e-way bill interactive UI, compliance calendar, filing workflow (7 tabs)

### v2 Phase 4: Governance — DONE (2026-04-04)
- [x] 9 new tables + 11 enums (review meetings, attendance, leave, holidays, salary advances)
- [x] Review meetings engine + API (CRUD with attendees, agenda, action items, auto-generated minutes)
- [x] Attendance engine (mark/bulk, daily roster, member history, summary stats)
- [x] Leave management (policies, balances, apply with balance validation)
- [x] Salary advances (request→approve→disburse→EMI repayment)
- [x] Real payroll engine (pro-rated salary, PF/ESI/PT, advance deductions)
- [x] /reviews page (meeting list, detail, actions) and /payroll page (4 tabs: attendance/leave/advances/payroll)

### v2 Phase 5: Company Secretary — DONE (2026-04-04)
- [x] 5 tables + 6 enums (directors, share_register, board_resolutions, meeting_minutes, roc_filings)
- [x] 16-function engine + 5 API routes under /api/roc/
- [x] /roc page with 5 tabs: Directors, Share Register, Resolutions, Minutes, ROC Filings

### v2 Phase 6: Polish — DONE (2026-04-04)
- [x] Print-ready Tax Invoice PDF template (Indian GST format, HSN, amount in words)
- [x] Enhanced ⌘K: dynamic search (ledgers/vouchers), recent items, Munshi AI query detection, keyboard shortcuts
- [x] Floating Munshi assist panel (context-aware quick prompts, chat on any page)
- [x] Mobile bottom navigation (5 tabs + More sheet), replaces hamburger menu

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
