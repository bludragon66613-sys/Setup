# Session: 2026-04-02

**Started:** ~7:30 AM IST
**Last Updated:** 8:50 AM IST
**Project:** TallyAI (~/tallyai/)
**Topic:** Post-crash recovery, dashboard bug fixes, responsive design, dark mode

---

## What We Are Building

TallyAI is an AI-powered accounting intelligence layer for Indian SMEs that works on top of Tally ERP. This session was a recovery session after a PC crash — picked up from where the previous session left off (Superpowers Phases 0-3 complete), deployed security fixes, and then fixed a cascade of dashboard bugs, added full mobile responsiveness, and implemented dark mode.

---

## What WORKED (with evidence)

- **MVP auth bypass in `src/lib/auth.ts`** — confirmed by: dashboard tabs reappeared on production after deploy, company selector populates correctly. When `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is unset, `requireAuth()` returns placeholder MVP user with owner role, `getAccessibleCompanyIds()` returns all companies, `requireCompanyAccess()` skips checks.
- **GST view rewrite (`src/components/modules/gst-view.tsx`)** — confirmed by: navigated to GST module on production, renders correctly with Output Tax, Input Tax, Net Payable, CGST/SGST/IGST breakdown. No more crash.
- **Table column padding across all 8 hand-rolled views + DataTable** — confirmed by: screenshots show proper spacing between Amount/Narration columns on All Vouchers, Cash Vouchers, Payment views.
- **Summary row alignment** — confirmed by: ₹1,80,300 total aligns with Amount column header on production.
- **₹NaN fix** — confirmed by: voucher summary shows ₹1,80,300 instead of ₹NaN. `formatCurrency` now guards against NaN, `sumParsedAmounts` skips NaN values, `voucher-list.tsx` uses correct field names (`total`/`count` instead of `totalAmount`/`totalCount`).
- **Pricing card button alignment** — confirmed by: screenshot shows Start Free, Get Pro, Contact Sales all at same vertical level regardless of feature count. Used `flex flex-col` + `flex-1` on feature list + `mt-auto` on button.
- **Mobile responsive dashboard** — confirmed by: Chrome DevTools mobile emulation (375x812) shows scrollable tabs, full-width company selector, 2-col feature grid, stacked summary cards. Tablet (768x1024) also verified.
- **Dark mode** — confirmed by: clicking moon icon switches to dark theme, all cards/badges/text/borders render correctly in dark. `localStorage.getItem('tallyai-theme')` persists choice. FOUC prevention script in `<head>` works.
- **Code review findings fixed** — confirmed by: `POST /api/tally/sync` now has `withAuth()`, `sumParsedAmounts` guards NaN, ledger-recon padding fixed.

---

## What Did NOT Work (and why)

- **Initial `px-2` table padding** — failed because: 0.5rem padding wasn't visually sufficient on narrow columns. Bumped to `px-3` (0.75rem) which provided adequate spacing.
- **Vercel deployment URL direct access** — failed because: deployment-specific URLs (e.g. `tallyai-4b4af32xn-...vercel.app`) redirect to Vercel SSO login. Must use the production alias `tallyai-tau.vercel.app` for testing.

---

## What Has NOT Been Tried Yet

- WhatsApp Business API verification (needs Meta credentials)
- Custom domain (`tallyai.in` not purchased)
- Real Tally data testing (needs client CA export) — deferred to separate session per user request
- Marketing page dark mode (landing page uses `(marketing)` layout which doesn't have ThemeToggle yet)
- H4 from code review: migrate tally routes to use `successResponse`/`errorResponse` helpers (low priority)

---

## Current State of Files

| File | Status | Notes |
| --- | --- | --- |
| `src/lib/auth.ts` | ✅ Complete | MVP mode bypass when Clerk unconfigured, documented single-tenant assumption |
| `src/lib/utils.ts` | ✅ Complete | `formatCurrency` NaN guard, `sumParsedAmounts` NaN skip |
| `src/components/dashboard.tsx` | ✅ Complete | Full mobile responsive — scrollable tabs, responsive grids, adjusted padding |
| `src/components/theme-toggle.tsx` | ✅ Complete | Moon/Sun toggle, localStorage persistence, hydration-safe |
| `src/components/data-table.tsx` | ✅ Complete | `px-3` cell padding, `border-separate` |
| `src/components/modules/gst-view.tsx` | ✅ Complete | Rewritten to match API response shape (TaxBreakdown objects) |
| `src/components/modules/voucher-list.tsx` | ✅ Complete | Fixed field names, summary row padding |
| `src/components/modules/cash-voucher-view.tsx` | ✅ Complete | Table padding + responsive grid |
| `src/components/modules/payment-voucher-view.tsx` | ✅ Complete | Table + summary row padding |
| `src/components/modules/receipt-voucher-view.tsx` | ✅ Complete | Table + summary row padding |
| `src/components/modules/contra-voucher-view.tsx` | ✅ Complete | Table + summary row padding |
| `src/components/modules/sales-view.tsx` | ✅ Complete | Table + summary row padding + responsive grid |
| `src/components/modules/purchase-view.tsx` | ✅ Complete | Table + summary row padding + responsive grid |
| `src/components/modules/ledger-view.tsx` | ✅ Complete | Table padding |
| `src/components/modules/ledger-reconciliation-view.tsx` | ✅ Complete | Table padding + UnmatchedTable amount cell fix |
| `src/components/modules/trial-balance-view.tsx` | ✅ Complete | Summary row padding |
| `src/components/modules/tds-view.tsx` | ✅ Complete | Responsive grid |
| `src/components/modules/payroll-view.tsx` | ✅ Complete | Responsive grid |
| `src/components/modules/sales-order-view.tsx` | ✅ Complete | Responsive grid |
| `src/components/modules/purchase-order-view.tsx` | ✅ Complete | Responsive grid |
| `src/app/(app)/layout.tsx` | ✅ Complete | Responsive header + ThemeToggle wired in |
| `src/app/(app)/settings/page.tsx` | ✅ Complete | Back link fixed to /dashboard |
| `src/app/(marketing)/page.tsx` | ✅ Complete | Pricing cards flex alignment |
| `src/app/globals.css` | ✅ Complete | Dark mode variables, badge overrides, scrollbar-hide utility, Tailwind v4 @custom-variant |
| `src/app/layout.tsx` | ✅ Complete | FOUC prevention script, suppressHydrationWarning |
| `src/app/api/tally/sync/route.ts` | ✅ Complete | Added withAuth() for write protection |

---

## Decisions Made

- **MVP auth bypass over removing auth** — reason: keeps the auth infrastructure intact so when Clerk keys are added, real multi-tenant auth activates automatically. No code changes needed.
- **Class-based dark mode over media query** — reason: allows user toggle independent of system preference, persists choice in localStorage
- **FOUC prevention via inline script** — reason: server doesn't know theme preference, so an inline `<script>` in `<head>` reads localStorage before first paint to set `.dark` class
- **Horizontal scroll for tabs on mobile over hamburger menu** — reason: all tabs visible with a swipe, no hidden navigation. Same pattern for module pills.
- **`px-3` over `px-2` for table cells** — reason: `px-2` (8px) wasn't visually sufficient for column separation. `px-3` (12px) gives clear gaps.
- **Defensive formatCurrency** — reason: prevents ₹NaN from appearing anywhere in the UI regardless of API response issues

---

## Blockers & Open Questions

- No active blockers.
- The `CRON_SECRET` env var is set in Vercel Production (verified via `vercel env ls`), but the autopilot cron endpoint hasn't been tested end-to-end.
- Marketing landing page doesn't have the ThemeToggle yet (separate layout from app layout).

---

## Exact Next Step

If continuing TallyAI work: test with real Tally XML data from a client CA export. The user specifically said "we'll test real tally data in another session."

If doing other work: all TallyAI tasks from this session are complete and deployed.

---

## Environment & Setup Notes

- **Dev server:** `npx next dev --port 3200` (avoids conflict with other projects)
- **Production:** https://tallyai-tau.vercel.app
- **Vercel project:** `bludragon66613-sys-projects/tallyai`
- **Git:** `master` branch, up to date with origin
- **Latest commit:** `06ced5f` — dark mode toggle
- **Total commits this session:** 8 (5afa3ea through 06ced5f)
- **Clerk:** NOT configured (no env vars in Vercel) — app runs in MVP single-tenant mode
- **CRON_SECRET:** Configured in Vercel Production
