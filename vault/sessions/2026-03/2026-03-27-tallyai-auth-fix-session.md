# Session: 2026-03-27

**Started:** ~1:20am IST
**Last Updated:** 1:40am IST
**Project:** TallyAI (~/tallyai)
**Topic:** Fix TallyAI dashboard tabs not rendering on production — auth was blocking all API calls

---

## What We Are Building

TallyAI is an AI accounting intelligence app for Indian SMEs that integrates with Tally via CSV/XML exports. The dashboard has 6 tabs (Import, Bank Statement, Reconcile, Modules, Analytics, Ask Your Books) with 21 accounting modules, 9 dashboard widgets, and AI insights. Deployed on Vercel at https://tallyai-tau.vercel.app.

User reported being stuck on one page with no tabs visible. Root cause: auth middleware blocked all API calls in production, so `selectedCompanyId` stayed null and tabs never rendered.

---

## What WORKED (with evidence)

- **Auth bypass for MVP demo** — confirmed by: `curl -s https://tallyai-tau.vercel.app/api/companies` returns `{"success":true,"data":[...]}` with 2 companies, no auth required
- **Production deployment** — confirmed by: `npx vercel --prod` succeeded, aliased to https://tallyai-tau.vercel.app
- **Build passes clean** — confirmed by: `npx next build` completes with 0 errors, 34 routes (static + dynamic)
- **Git push** — confirmed by: 2 commits pushed to `origin/master` (`4d207cf` auth fix + brand, `01909a0` image prompts doc)
- **Local dev server** — confirmed by: API on localhost:3200 returns companies correctly

---

## What Did NOT Work (and why)

- **Vercel preview deployments** — failed because: Vercel Deployment Protection (SSO auth) intercepted all API calls including `fetch("/api/companies")`, returning HTML auth page instead of JSON. Dashboard's `res.json()` got garbage, `selectedCompanyId` stayed null, tabs never rendered (line 175: `{selectedCompanyId && (...)}`)
- **TALLYAI_API_KEY on production without login flow** — failed because: the env var was set on Vercel, but no login page existed to set the session cookie. Browsers had no way to authenticate, so every fetch returned 401
- **Login page + auth API route approach** — worked technically (created `/login` page + `/api/auth/login` route with cookie-based session auth) but user decided it's too complex for MVP demo. Removed.
- **Chrome DevTools MCP** — failed because: existing Chrome process held the profile lock. Error: "The browser is already running for chrome-profile". Could not inspect the deployed page via MCP.
- **First `vercel env add` via stdin redirect (`<<<`)** — failed because: may have added trailing whitespace. Login returned 401 "Invalid API key" even with correct key. Fixed by `vercel env rm` + re-adding with `printf` (no trailing newline)

---

## What Has NOT Been Tried Yet

- Proper auth with Clerk (Vercel Marketplace integration) for production launch
- Disabling Vercel Deployment Protection in project settings (alternative to deploying to production)
- Adding error boundary around Dashboard component to prevent blank page on API failures
- Browser verification of all 6 tabs on production deployment

---

## Current State of Files

| File | Status | Notes |
| --- | --- | --- |
| `src/lib/auth.ts` | ✅ Complete | `authenticateRequest()` returns null (auth disabled for MVP). Full auth logic preserved for re-enabling |
| `src/components/dashboard.tsx` | ✅ Complete | Simple fetch without auth redirect. Tab switching via client-side state |
| `src/app/globals.css` | ✅ Complete | Munshi Neo v2.0 brand: Inter font, flat badges, gradient accent, clean SaaS look |
| `src/app/layout.tsx` | ✅ Complete | Updated fonts (Inter replaces Fraunces), new tagline |
| `src/app/page.tsx` | ✅ Complete | Updated header/footer with new brand colors and tagline |
| `src/components/ui/card.tsx` | ✅ Complete | Updated border-radius and transition for v2.0 style |
| `src/app/brand/page.tsx` | ✅ Complete | Brand showcase page |
| `src/app/brand/concepts/page.tsx` | ✅ Complete | Brand concepts comparison page |
| `brand/IMAGE_PROMPTS.md` | ✅ Complete | AI image generation prompts for brand assets |

---

## Decisions Made

- **Disable auth entirely for MVP demo** — reason: user wants the app simple and accessible for demo. Auth was the blocker. Will re-enable with Clerk later.
- **Deploy to production (not preview)** — reason: preview deployments have Vercel Deployment Protection enabled by default
- **Keep auth.ts with disabled logic** — reason: preserves security code for future re-enabling without rewriting

---

## Blockers & Open Questions

- Chrome DevTools MCP can't connect when existing Chrome uses the profile — need isolated profiles for debugging
- `TALLYAI_API_KEY` is set on Vercel production env vars but unused (auth disabled). Remove or keep for when auth is re-enabled?
- Three background agents from previous session (MED-01 reconciliation optimization, MED-04 dead props, MED-05 test coverage) completed — their changes were committed in previous session's `6ef20c8`

---

## Exact Next Step

Open https://tallyai-tau.vercel.app in a browser and verify all 6 tabs work with real data. Then decide on next feature priority.

---

## Environment & Setup Notes

- Dev server on port 3200 (PID 117468)
- Production: https://tallyai-tau.vercel.app
- `TALLYAI_API_KEY=R2Fz_5AQqkKe1QyNQwarkva6_q9eaf5CIbb1iU_2jLI` on Vercel (unused, auth disabled)
- Neon Postgres via `DATABASE_URL` in `.env.local`
- Git: 2 commits pushed — `4d207cf` (auth fix + brand) and `01909a0` (image prompts)
