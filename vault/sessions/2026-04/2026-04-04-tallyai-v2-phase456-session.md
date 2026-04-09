# Session: 2026-04-04

**Started:** ~9:30pm IST
**Last Updated:** 12:30am IST (2026-04-05)
**Project:** TallyAI (~/tallyai)
**Topic:** Built Phases 4–6 of TallyAI v2, code review fixes, dashboard migration, route fixes

---

## What We Are Building

TallyAI v2 is a full-featured accounting platform for Indian SMEs and CA firms, built on Next.js 16, Drizzle ORM, Neon Postgres, and AI SDK v6. The v2 spec defines 6 build phases transforming it from a read-only Tally intelligence layer into a standalone accounting app.

This session completed Phases 4 (Governance), 5 (Company Secretary), and 6 (Polish), then addressed code review findings, migrated all pages off the old MVP Dashboard component, created missing report pages, and fixed API response destructuring issues.

---

## What WORKED (with evidence)

- **Phase 4: Governance** — 9 tables, 6 engines, 6 API route groups, 2 UI pages. Build passes. Commits dd444b9 through d237be1.
- **Phase 5: Company Secretary** — 5 tables, 16-function engine, 5 API routes, 1 UI page with 5 tabs. Build passes. Commits c6560b4 and 3c34d84.
- **Phase 6: Polish** — Invoice PDF, smart ⌘K, Munshi assist, mobile nav. Build passes. Commit 46af4c3.
- **Code review fixes** — 1 CRITICAL, 15 HIGH, 12 MEDIUM issues fixed. Build passes. Commit 31243ff.
- **All API endpoints return 200** — confirmed by curl: /api/companies, /api/reviews, /api/roc/directors, /api/attendance, /api/salary-advances all responding correctly.
- **Date validation rejects bad input** — confirmed: `curl /api/attendance?date=INVALID` returns 400 with "Invalid date format".
- **Report pages render** — confirmed: all 5 report routes return 200 (trial-balance, profit-loss, balance-sheet, aging, stock).
- **ROC/Payroll response destructuring fixed** — confirmed: `.data.items` and `.data.advances` patterns applied. Commit 7bfb1f2.
- **Schema pushed to Neon** — confirmed: `drizzle-kit push` completed successfully for both Phase 4/5 tables and the leaveBalances integer→numeric migration.

---

## What Did NOT Work (and why)

- **Old Dashboard component on /dashboard** — showed the MVP import/marketing page with its own tab bar instead of v2 widget dashboard. Fixed by creating a new standalone dashboard page using `useCompany()` + widget grid.
- **Report routes 404** — `/reports/trial-balance` etc. had no page files. The sidebar linked to them but they were never created. Fixed by creating 5 standalone report pages.
- **Modules redirect loop** — `/modules/ledgers` was redirecting to `/dashboard` via the old redirect map. Fixed by pointing to `/ledgers` and the new report routes.
- **`directors.map is not a function`** — ROC API returns `{items: [], count: 0}` but UI called `.map()` on `data.data` directly. Fixed by reading `.data.items` etc.
- **leaveBalances integer→numeric type mismatch** — Changing schema column from integer to numeric changed Drizzle return types from `number` to `string`. Fixed by updating the `LeaveBalance` interface and adding `parseFloat()` wrappers.
- **Dev server kept dying** — Background `npx next dev` tasks would complete/fail. Workaround: use `run_in_background: true` and check output. The `EADDRINUSE` errors were from duplicate start attempts.

---

## What Has NOT Been Tried Yet

- Deploy to Vercel production
- Landing page for munshi.ai domain
- Real Clerk auth integration (currently using MVP bypass)
- Actual data entry testing (creating vouchers, ledgers via the UI)
- E2E tests with Playwright
- WhatsApp/Telegram bot live testing

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `src/db/schema.ts` | ✅ Complete | 14 new tables, 17 new enums total (governance + company secretary) |
| `src/lib/governance/review-meetings.ts` | ✅ Complete | 7 functions, atomic transaction for createMeeting |
| `src/lib/governance/attendance.ts` | ✅ Complete | 8 functions for attendance CRUD |
| `src/lib/governance/leave-management.ts` | ✅ Complete | 6 functions, numeric columns for half-days |
| `src/lib/governance/salary-advances.ts` | ✅ Complete | 8 functions, rounded decimal math |
| `src/lib/governance/payroll.ts` | ✅ Complete | PF/ESI/PT deductions, parallel month computation |
| `src/lib/governance/company-secretary.ts` | ✅ Complete | 16 functions, empty update guards |
| `src/lib/reports/templates/invoice.tsx` | ✅ Complete | Indian GST tax invoice PDF template |
| `src/app/(app)/dashboard/page.tsx` | ✅ Complete | v2 widget dashboard replacing old import page |
| `src/app/(app)/reviews/page.tsx` | ✅ Complete | Meeting management with error states |
| `src/app/(app)/payroll/page.tsx` | ✅ Complete | 4-tab page, response destructuring fixed |
| `src/app/(app)/roc/page.tsx` | ✅ Complete | 5-tab page, response destructuring fixed |
| `src/app/(app)/reports/*/page.tsx` | ✅ Complete | 5 report pages (TB, P&L, BS, aging, stock) |
| `src/app/(app)/bank/page.tsx` | ✅ Complete | Standalone, uses useCompany() |
| `src/app/(app)/reconcile/page.tsx` | ✅ Complete | Standalone, uses useCompany() |
| `src/app/(app)/query/page.tsx` | ✅ Complete | Standalone, uses useCompany() |
| `src/app/(app)/analytics/page.tsx` | ✅ Complete | Standalone widget grid |
| `src/app/(app)/layout.tsx` | ✅ Complete | Error state, MobileNav, MunshiAssist, CommandBar with companyId |
| `src/components/layout/command-bar.tsx` | ✅ Complete | Dynamic search, recent items, Munshi detection, localStorage validation |
| `src/components/layout/mobile-nav.tsx` | ✅ Complete | 5-tab bottom nav + More sheet |
| `src/components/munshi-assist.tsx` | ✅ Complete | Floating chat, AbortController, context-aware prompts |
| `src/components/invoice-preview.tsx` | ✅ Complete | Download + print invoice buttons |
| `src/lib/auth.ts` | ✅ Complete | MVP bypass gated on ENABLE_MVP_BYPASS + non-production |
| All 14 API route files | ✅ Complete | IDOR fixes, auth ordering, date validation |

---

## Decisions Made

- **MVP auth bypass requires explicit env var** — reason: missing Clerk key should not mean zero auth on any deploy
- **leaveBalances uses numeric(5,1) not integer** — reason: half-day leave support (0.5 days)
- **Financial math uses Math.round not parseFloat** — reason: avoid IEEE-754 float accumulation errors
- **Old Dashboard component preserved** — reason: still imported by some legacy paths; pages migrated to standalone components using useCompany()
- **Modules routes redirect to v2 pages** — reason: cleaner than maintaining the old pill-selector UI
- **Report pages are thin wrappers** — reason: the view components (TrialBalanceView etc.) already exist, pages just provide useCompany() + heading

---

## Blockers & Open Questions

- Payroll API returns "Company not found or has no organization" for test company — the MVP test data has companies without org associations. Need to either create org associations or adjust the payroll engine fallback.
- The old `Dashboard` component (~450 lines) is dead code now — all routes have been migrated. Can be deleted in a cleanup pass.
- Phantom wallet Chrome extension throws `Cannot redefine property: ethereum` — not our bug, just noisy in dev console.

---

## Exact Next Step

Test the app in Chrome at localhost:3200. Navigate all sidebar links and verify no more 404s or runtime errors. If clean, deploy to Vercel production with `vercel deploy --prod` (need to set ENABLE_MVP_BYPASS and CRON_SECRET env vars).

---

## Environment & Setup Notes

- Dev server: `cd ~/tallyai && npx next dev --port 3200`
- DB: Neon Postgres, schema pushed via `export $(grep -v '^#' .env.local | xargs) && npx drizzle-kit push`
- `.env.local` now includes `ENABLE_MVP_BYPASS=true` for local dev
- Git: 14 commits this session, all on `master`, pushed to github.com/bludragon66613-sys/tallyai
- Total: 48 files changed, 12,601 insertions, 125 deletions
