---
name: Session Savepoint 2026-03-26d
description: TallyAI MVP built, branded with Munshi, deployed to Vercel, skills audited and installed
type: project
---

## TallyAI Day 0 MVP — Complete Build Session

### What Was Built
- **TallyAI** (`~/tallyai/`) — AI-powered accounting intelligence for Indian SMEs
- **Live at**: https://tallyai-tau.vercel.app
- **Stack**: Next.js 16.2.1, TypeScript, Tailwind, Drizzle ORM, Neon Postgres, AI SDK v6
- **Brand**: "The Munshi" — Indian Ledger Modernism (Fraunces serif, DM Sans, IBM Plex Mono, warm paper palette, rubber stamp badges, ruled ledger lines)

### Features Working (E2E Tested)
1. Tally XML import → parses ledgers, vouchers, stock items, GST entries → persists to Neon
2. Bank statement CSV upload (auto-detects HDFC, SBI, ICICI, Axis, generic)
3. Reconciliation engine — fuzzy matches bank txns ↔ vouchers (amount ±₹1, date ±3 days)
4. Natural language query engine — 9 intents, Hindi/English ("Kitna paisa aana baaki hai?")
5. Tabbed dashboard UI with company selector

### Paperclip
- TallyAI company created (ID: 7cf2c89a) with 10 agents
- Paperclip restarted after node kill (stale PG PID file cleaned)

### Skills Installed (8 new)
- `planning-with-files` (OthmanAdi) — SAFE
- `vercel-react-best-practices` + `vercel-composition-patterns` (Vercel Labs) — SAFE
- `excel-automation`, `pdf-creator`, `doc-to-markdown`, `deep-research`, `ui-designer` (Daymade) — SAFE
- PaddleOCR skipped (repo too large to clone)

### Strategy Deliverables Referenced
- `~/strategy/tallyai-brand-explorations.md` — 5 brand directions, Munshi selected
- `~/strategy/tallyai-brand.md` — Full brand identity system
- `~/strategy/tallyai-gtm.md` — Go-to-market strategy with referral system
- `~/strategy/tallyai-pitch.html` — 15-slide Munshi-branded pitch deck

### Services Status
- OpenClaw: Running (claude-sonnet-4-6, 24 sessions, Telegram ON)
- Paperclip: Running (v0.3.1, 16 companies including TallyAI)
- TallyAI: Deployed to Vercel (https://tallyai-tau.vercel.app)

### Next Steps
- WhatsApp bot integration (Phase 2)
- Enable AI Gateway for NL queries (vercel env pull for OIDC)
- Custom domain (tallyai.in)
- Get real Tally data from first client's CA
