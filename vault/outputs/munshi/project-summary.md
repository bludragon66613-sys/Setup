# Munshi (TallyAI) — Project Summary

> Last synced: 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_tallyai.md`

---

## Overview

AI layer that works WITH Tally (not a replacement). Ingests Tally XML exports + bank statements, provides reconciliation, error detection, and natural language queries.

**Why:** Tally dominates Indian SME accounting (~7M businesses). Building a replacement is 2+ years. Building an AI copilot on top is 4 weeks.

**How to apply:** Product build, not infrastructure. Ship fast, validate with CAs first.

## Location & Stack

- **Code:** `~/tallyai/`
- **Stack:** Next.js 16.2.1, TypeScript, Tailwind, shadcn/ui (dark theme), Drizzle ORM, Neon Postgres, AI SDK v6 + AI Gateway
- **Dev:** `npx next dev --port 3200`
- **Test data:** `~/tallyai/test-data/sample-tally.xml` (Sharma Enterprises, 10 ledgers, 4 vouchers, 3 stock items)

## Architecture

| File | Purpose |
|------|---------|
| `src/lib/tally-parser.ts` | Parses Tally XML (ENVELOPE > BODY > IMPORTDATA). Handles ledgers, vouchers, stock items, GST entries |
| `src/lib/bank-parser.ts` | Parses bank CSV (auto-detects HDFC, SBI, ICICI, Axis, generic) |
| `src/lib/reconciliation-engine.ts` | Fuzzy matches bank txns ↔ vouchers (amount ±₹1, date ±3 days, party name overlap) |
| `src/lib/query-engine.ts` | NL query engine: intent classification via AI → DB query → formatted answer. Supports Hindi/English |
| `src/lib/import-service.ts` | Persists parsed Tally data to Neon Postgres via Drizzle |
| `src/db/schema.ts` | Drizzle schema: companies, ledgers, ledger_groups, vouchers, stock_items, bank_transactions, reconciliation_results, query_history |
| `src/app/api/import/route.ts` | POST endpoint, accepts XML file upload, returns parsed data |
| `src/components/upload-zone.tsx` | Drag-and-drop Tally XML uploader with status states |
| `src/components/data-preview.tsx` | Preview cards for ledgers, vouchers, stock items |

## Paperclip Company

- **Company ID:** `7cf2c89a-a57a-48c0-a41f-07191d2bb8a0`
- **Issue prefix:** TAL
- **10 agents:** CTO, Frontend Lead, Backend Lead, AI Engineer, Database Architect, Tally Domain Expert, WhatsApp Bot Engineer, QA Engineer, DevOps Engineer, Product Manager

## Brand Identity — Munshi Neo v2.0

- **Brand Guide:** `~/tallyai/brand/BRAND_MASTER_GUIDE.md`
- **Design System:** `~/tallyai/docs/design-system-v2.md`
- **Positioning:** `~/tallyai/brand/BRAND_POSITIONING.md`
- **Primary Tagline:** "Hisaab samajhta hai."
- **Colors:** Neelam green #1B6B4A (primary), Kesar gold #E8A317 (secondary), Neel blue #3B6FC2 (tertiary), cool off-white #F7F8FA (background)
- **Fonts:** Inter (UI body), DM Sans (display headings), IBM Plex Mono (financial data), Noto Sans Devanagari (Hindi)

## Build Status — TallyAI v2 Full Platform

All 6 build phases complete as of 2026-04-04. Pushed to GitHub.

| Phase | Status | Description |
|-------|--------|-------------|
| Superpowers (0–3) | DONE | 12 tables, Clerk auth, RBAC, GST engines, WhatsApp/Telegram/Web SDK, Munshi AI Agent |
| v2 Phase 1: Foundation | DONE | Sidebar, ⌘K command bar, 5-level role hierarchy, company wizard, chart of accounts |
| v2 Phase 2: Core Accounting | DONE | 8 transaction types (CRUD), voucher line items, ledger CRUD, approval workflow engine |
| v2 Phase 3: Compliance | DONE | GST validation dashboard, GSTR-2B/3B reconciliation, e-invoice/e-way bill UI, compliance calendar |
| v2 Phase 4: Governance | DONE | Review meetings, attendance, leave management, salary advances, real payroll engine |
| v2 Phase 5: Company Secretary | DONE | Directors, share register, board resolutions, ROC filings (16-function engine) |
| v2 Phase 6: Polish | DONE | Print-ready Tax Invoice PDF, enhanced ⌘K, floating Munshi panel, mobile bottom navigation |

## Launch TODO

- [ ] Deploy to Vercel production
- [ ] Set CRON_SECRET env var for autopilot endpoint
- [ ] WhatsApp Business API verification (Meta approval pending)
- [ ] Production IRP/NIC API credentials (sandbox only currently)
- [ ] Replace placeholder URLs in GTM materials
- [ ] Register domain (munshi.ai or tallyai.in) and build landing page
- [ ] Replace placeholder testimonials with real beta user quotes
- [ ] Start CA outreach — founding partner cohort (first 50 CAs)
- [ ] Run Launch Checklist P0 gate (`~/tallyai/gtm/LAUNCH_CHECKLIST.md` Section 6)

## GTM Strategy

- **Full doc:** `~/tallyai/gtm/GTM_STRATEGY.md`
- **Beachhead:** Digitally-aware CAs in Tier-1/2 cities managing 10-30 Tally clients
- **3 phases:** Seed (M1-2), CA-Led Growth (M3-6), Scale (M7-12)
- **North Star:** Weekly Active Companies (WAC)
- **Y1 target:** 1,000 paying companies, ₹60L ARR
- **CA Plan bet:** 1 CA = 15-40 SME businesses

## Pricing

| Tier | Price | Limits |
|------|-------|--------|
| Free | ₹0 | 1 company, 500 vouchers/month, 10 queries/day |
| Pro | ₹999/mo | 3 companies, unlimited |
| CA Plan | ₹4,999/mo | 25 clients, bulk import, API access |

## Target Users

- **Primary:** Small business owners (₹10L–₹5Cr revenue) with part-time accountant on Tally
- **Secondary:** CAs managing 20-50 clients on Tally
