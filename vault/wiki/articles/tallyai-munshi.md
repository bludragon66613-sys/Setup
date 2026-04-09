# TallyAI / Munshi

> Synced from Claude Code memory — 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_tallyai.md`

---

AI-powered accounting intelligence for Indian SMEs. Built as a copilot layer on top of Tally, India's dominant SME accounting software (~7M businesses). Branded as **Munshi** ("the one who understands accounts").

## Core Insight

Building a Tally replacement takes 2+ years. Building an AI copilot on top takes 4 weeks. The moat is deep Tally integration, not a new accounting engine.

## What It Does

- Ingests Tally XML exports and bank statements (CSV)
- Reconciles bank transactions against Tally vouchers (fuzzy matching: amount ±₹1, date ±3 days, party name overlap)
- Answers natural language queries in Hindi/English ("What did I spend on transport last month?")
- GST validation, e-invoice generation, GSTR-2B/3B reconciliation
- Full payroll, attendance, leave, and salary advance management
- Company Secretary module (directors, share register, board resolutions, ROC filings)

## Technical Stack

- **Framework:** Next.js 16.2.1, TypeScript, Tailwind, shadcn/ui
- **Database:** Neon Postgres via Drizzle ORM
- **AI:** Anthropic AI SDK v6 + AI Gateway
- **Auth:** Clerk (multi-tenant with RBAC)

## Brand Identity

- **Tagline:** "Hisaab samajhta hai." (Hindi: "Understands accounts")
- **Color:** Neelam green #1B6B4A primary, Kesar gold #E8A317 secondary
- **Fonts:** Inter body, IBM Plex Mono for financial data, Noto Sans Devanagari

## Build Status (as of 2026-04-04)

All 6 v2 phases complete and pushed to GitHub. Platform is feature-complete; launch blockers are operational (Vercel deploy, domain, WhatsApp API approval, CA outreach).

## GTM

- **Beachhead:** CAs in Tier-1/2 cities managing 10-30 Tally clients each
- **CA leverage:** 1 CA brings 15-40 SME businesses
- **Y1 target:** 1,000 paying companies, ₹60L ARR
- **Pricing:** Free / Pro ₹999/mo / CA Plan ₹4,999/mo (25 clients)

## Paperclip Integration

Runs as a 10-agent company on [[paperclip-agent-platform]] (Company ID: `7cf2c89a`). Agents: CTO, Frontend Lead, Backend Lead, AI Engineer, Database Architect, Tally Domain Expert, WhatsApp Bot Engineer, QA, DevOps, PM.

## Related

- [[paperclip-agent-platform]] — Agent orchestration platform hosting Munshi's AI team
- [[signal-consultancy]] — NERV/SIGNAL as potential future distribution channel
- [[nerv-autonomous-agent]] — Infrastructure pattern Munshi's build drew from
