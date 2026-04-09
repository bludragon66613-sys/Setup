# Session: 2026-03-25

**Started:** ~11:55am
**Last Updated:** 12:03pm
**Project:** `~/aasara-pipeline` (Next.js 16 app)
**Topic:** AASARA marketing pipeline — DB init, full page verification, API key checklist

---

## What We Are Building

AASARA is a Hyderabad-based elder care service. This pipeline is a Next.js 16 marketing
automation dashboard with 6 modules:

1. **Content Studio** — AI-generated Instagram / Facebook / Reddit posts with optional Freepik images
2. **Content Calendar** — Review, schedule, and manually publish generated posts
3. **Contacts CRM** — Patient family contacts with WhatsApp numbers and religion tags
4. **Broadcast Manager** — AI-drafted WhatsApp festival greeting messages per contact religion
5. **Festive Engine** — 15 Indian festivals, lunar date config, auto-triggers 3 days before each
6. **Dashboard** — Overview stats: total contacts, published, scheduled, pending WhatsApp

Backend: Neon Postgres (pooler endpoint, Singapore region). Cron jobs wired in `vercel.json`.
AI: Anthropic Claude via `ANTHROPIC_API_KEY`. Social: Meta Graph API + Reddit API.

---

## What WORKED (with evidence)

- **Build passes clean** — confirmed by: `npm run build` output, 18 routes (○ static + ƒ dynamic), 0 errors
- **Dev server running** — confirmed by: `http://localhost:3000` responding, already running as PID 480268
- **DB schema initialized** — confirmed by: `POST /api/init` with `x-init-secret: your-init-secret` returned `{"ok":true}`
- **Dashboard page** — confirmed by: screenshot, 4 stat cards showing 0 (DB empty, no error)
- **Contacts page** — confirmed by: screenshot, "+ Add Contact" button present, empty state correct
- **Content Studio** — confirmed by: screenshot, Instagram/Facebook/Reddit tabs, topic suggestions, schedule field, Freepik toggle
- **Content Calendar** — confirmed by: screenshot, Draft/Scheduled/Published/Failed tabs, "No draft posts" state
- **Broadcast Manager** — confirmed by: screenshot, festival selector, Pending/Sent tabs
- **Festivals page** — confirmed by: screenshot, 15 festivals grid with religion badges, "Set Lunar Festival Dates for 2026" form
- **Lazy DB init** — confirmed by: build succeeds without `DATABASE_URL` at build time; connection only on first query
- **Neon Postgres connected** — confirmed by: dashboard stats query returns without error (catches gracefully if tables missing pre-init)

---

## What Did NOT Work (and why)

- **Second dev server on port 3001** — failed because: port 3000 was already occupied by an existing `next dev` process (PID 480268). Not a bug — just a duplicate launch. The existing server on 3000 was used.

---

## What Has NOT Been Tried Yet

- Actually generating content (needs `ANTHROPIC_API_KEY` filled in)
- Publishing to Instagram/Facebook (needs Meta Graph API long-lived Page token)
- Publishing to Reddit (needs Reddit script app credentials)
- Generating images via Freepik (needs `FREEPIK_API_KEY`)
- Adding a contact via the CRM UI
- Deploying to Vercel (no Vercel project linked yet)
- Setting `FESTIVAL_DATES_JSON` with 2026 lunar dates
- Setting a real `CRON_SECRET` (currently `your-secret-here`)
- Testing cron endpoints (`/api/cron/publish`, `/api/cron/festivals`)

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `app/page.tsx` | ✅ Complete | Dashboard with 4 stat cards + recent posts |
| `app/contacts/page.tsx` | ✅ Complete | Contact CRM with add/edit/delete |
| `app/content/page.tsx` | ✅ Complete | Content Studio, AI generation form |
| `app/calendar/page.tsx` | ✅ Complete | Post review + publish calendar |
| `app/broadcast/page.tsx` | ✅ Complete | WhatsApp broadcast manager |
| `app/festivals/page.tsx` | ✅ Complete | Festive engine + lunar date setter |
| `app/api/init/route.ts` | ✅ Complete | Creates all DB tables |
| `app/api/contacts/route.ts` | ✅ Complete | GET (list) + POST (create) |
| `app/api/contacts/[id]/route.ts` | ✅ Complete | GET + PUT + DELETE |
| `app/api/content/generate/route.ts` | ✅ Complete | AI post generation (needs ANTHROPIC_API_KEY) |
| `app/api/posts/route.ts` | ✅ Complete | List + delete posts |
| `app/api/publish/route.ts` | ✅ Complete | Publish to Meta/Reddit |
| `app/api/broadcast/route.ts` | ✅ Complete | List + manage broadcast messages |
| `app/api/broadcast/generate/route.ts` | ✅ Complete | AI broadcast message generation |
| `app/api/cron/publish/route.ts` | ✅ Complete | Scheduled post publisher (cron) |
| `app/api/cron/festivals/route.ts` | ✅ Complete | Festival message auto-generator (cron) |
| `lib/db.ts` | ✅ Complete | Lazy Neon Postgres init |
| `lib/claude.ts` | ✅ Complete | Anthropic AI helper |
| `lib/meta.ts` | ✅ Complete | Instagram + Facebook Graph API |
| `lib/reddit.ts` | ✅ Complete | Reddit API posting |
| `lib/freepik.ts` | ✅ Complete | Freepik image generation |
| `lib/festivals.ts` | ✅ Complete | Festival date logic |
| `.env.local` | 🔄 In Progress | DB connected; API keys all need real values |
| `vercel.json` | ✅ Complete | Cron schedule configured |

---

## Decisions Made

- **Lazy DB init** — reason: Next.js build evaluates all API routes; eager init with missing `DATABASE_URL` causes build failure
- **Pooler endpoint for Neon** — reason: serverless functions can exhaust connection limits; pooler reuses connections
- **Religion-filtered broadcast** — reason: AASARA serves Hindu, Muslim, and Christian families; festival messages should only go to relevant contacts

---

## Blockers & Open Questions

- **`ANTHROPIC_API_KEY`** — needed to test AI generation. Get from console.anthropic.com
- **Meta tokens** — `META_ACCESS_TOKEN` + `META_IG_USER_ID` + `META_PAGE_ID` needed for publishing. Long-lived token via developers.facebook.com → Graph API Explorer → generate token → exchange for 60-day token
- **Reddit credentials** — `REDDIT_CLIENT_ID/SECRET/USERNAME/PASSWORD` needed. Create "script" app at reddit.com/prefs/apps
- **`FREEPIK_API_KEY`** — for image generation. freepik.com/api (free tier available)
- **`FESTIVAL_DATES_JSON`** — 2026 lunar dates; can be set via the Festivals UI or pasted as JSON in `.env.local`
- **`CRON_SECRET`** — replace `your-secret-here` with a real random string before Vercel deploy

---

## Exact Next Step

Fill in `ANTHROPIC_API_KEY` in `.env.local` with a real key from console.anthropic.com.
Then test AI generation: go to Content Studio at http://localhost:3000/content, pick a
topic suggestion (e.g. "Benefits of in-home elder care vs. nursing homes"), select
Instagram, click "Generate Instagram Post" — should stream back a caption with hashtags.

After that: wire up Meta tokens and test publishing to Facebook/Instagram.

---

## Environment & Setup Notes

- Dev server already running: `http://localhost:3000` (PID 480268)
- DB schema: initialized via `POST /api/init` with header `x-init-secret: your-init-secret`
- DB: Neon Postgres at `ep-still-shape-a1zk7guj-pooler.ap-southeast-1.aws.neon.tech`
- Build: `cd ~/aasara-pipeline && npm run build` — passes clean
- To kill existing dev server if needed: `taskkill /PID 480268 /F`
