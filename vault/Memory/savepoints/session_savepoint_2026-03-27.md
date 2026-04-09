---
name: Session Savepoint 2026-03-27
description: TallyAI production hardening — security audit (15 fixes), Upstash Redis, code review (8.5/10), 345 tests, Vercel deploy
type: project
---

## TallyAI Production Hardening Session

### What Was Done
- **Security hardening**: 15 findings from full security audit → all resolved
  - SSRF prevention, XML injection, HMAC-SHA256 webhook signatures, CSP headers
  - Auth guard on SKIP_AUTH, error sanitization, private IP blocking
- **Upstash Redis**: Provisioned via Vercel Marketplace, rate limiter upgraded from in-memory
- **Tally Bridge committed**: 9 files (bridge, parser, data-service, API routes, settings, badge)
- **AI Gateway OIDC**: Token refreshed, all AI routes use gateway
- **Code review**: Score 7.5→8.5/10, all CRIT/HIGH/MED items resolved
  - Reconciliation engine O(n*m)→O(n*k) with Map indexing
  - Dead onDataLoad prop removed, unused const cleaned
  - Dashboard route: rate limiting + error sanitization added
- **Test suite**: 278→345 tests (67 new — recon, query engine, dashboard widgets)
- **Production deploy**: https://tallyai-tau.vercel.app (8 commits this session)

### Commits (8 total)
32fbe08 → e7c50bd → f930e90 → 8bf8187 → 1f700b3 → 1fcb855 → e0a0f81 → 6ef20c8

### Services Status
- OpenClaw: Running (PID 28896, Telegram ON, OpenAI Codex auth valid)
- Paperclip: Running on :3100
- TallyAI: Deployed to Vercel production

### Remaining
- WhatsApp: Code done, needs Meta Business App credentials
- Custom domain: needs tallyai.in purchase
- Real Tally data: needs client CA export
