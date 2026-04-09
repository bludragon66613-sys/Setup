---
name: AASARA Pipeline Session Savepoint (2026-03-25j)
description: State of AASARA marketing pipeline after DB init and full page verification
type: project
---

# AASARA Marketing Pipeline — Savepoint 2026-03-25j

**Project path:** `C:/Users/Rohan/aasara-pipeline`
**Session file:** `~/.claude/sessions/2026-03-25-aasara-pipeline-session.tmp`

## What is AASARA Pipeline

Next.js 16 marketing automation dashboard for AASARA elder care (Hyderabad).
6 modules: Content Studio, Content Calendar, Contacts CRM, Broadcast Manager, Festive Engine, Dashboard.
DB: Neon Postgres (initialized). Stack: Next.js 16 + shadcn/ui + Anthropic + Meta Graph API + Reddit API + Freepik.

## Current State

**Build:** Clean (18 routes, 0 errors)
**Dev server:** `http://localhost:3000` (PID 480268 — may differ on resume)
**DB schema:** Initialized via `POST /api/init` with header `x-init-secret: your-init-secret`
**All 6 pages:** Verified working in browser

## .env.local Status

| Variable | Status |
|----------|--------|
| `DATABASE_URL` | ✅ Configured (Neon Postgres, Singapore) |
| `ANTHROPIC_API_KEY` | ❌ Placeholder — needs real key |
| `META_ACCESS_TOKEN` / `META_IG_USER_ID` / `META_PAGE_ID` | ❌ Placeholder |
| `REDDIT_CLIENT_ID/SECRET/USERNAME/PASSWORD` | ❌ Placeholder |
| `FREEPIK_API_KEY` | ❌ Placeholder |
| `FESTIVAL_DATES_JSON` | ❌ Empty `{}` — set via Festivals UI or paste JSON |
| `CRON_SECRET` | ❌ `your-secret-here` — change before Vercel deploy |
| `INIT_SECRET` | ⚠️ `your-init-secret` (default, fine for local) |

## Next Step

Fill `ANTHROPIC_API_KEY` in `.env.local` → test Content Studio at `http://localhost:3000/content`.

**Why:** Needed for all AI generation

After that: Meta tokens → Reddit credentials → Freepik key → Vercel deploy.
