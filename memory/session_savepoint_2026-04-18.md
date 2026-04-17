---
name: session_savepoint_2026-04-18
description: Morning Light Energy (née Singularity) — ops gap closure, Telegram chatbot, monorepo integration, navigation unification, Vercel deploy fix
type: session_savepoint
originSessionId: dc49e45e-5446-4e89-8d47-cf291d782703
---
# 2026-04-18 — Morning Light Energy marathon

## What shipped

### 1. Ops gap closure (7 new docs)
Written directly into the project, all cross-linked in `docs.html`:
- `ops/empanelment-kit.md` — PM Surya Ghar + 5 DISCOM, 17-doc bundle, 8-week timeline
- `ops/empanelment-tracker.md` — 6-portal live pipeline tracker + risk register
- `ops/per-install-pnl-tracker.md` — per-install GM + monthly KPIs + cash-flow overlay
- `gov/tier1-briefing-packet.md` — Secretary-level leave-behind for TG+AP Energy Secretaries
- `gov/tier1-deck-outline.md` — 10-slide deck outline
- `marketing/price-sheet.md` — Premier-tier pricing, 6 size tiers, add-ons, discount rules
- `marketing/case-studies/case-study-01-hyderabad-3kw.md` — first-install case-study template

### 2. Customer Telegram chatbot (monorepo `bot/`)
Built from scratch on top of the existing Next.js scaffold:
- `bot/lib/tg.ts` · `bot/app/api/tg/webhook/route.ts` · dual-channel session keyed `tg:hist:<chat_id>` / `wa:hist:<phone>`
- `bot/scripts/set-telegram-webhook.sh` — registers customer bot with secret-token auth
- 7 WhatsApp templates in `bot/wa-templates/` (deferred channel, all Morning Light-branded)
- CRM synthetic key `tg:<chat_id>` until real phone captured via `book_site_survey`
- `morning-light-chatbot@0.2.0` · typecheck green

### 3. Nav shell + docs hub
Super-designer agent dispatched twice:
- `assets/brand.css` — shared nav + footer shell tuned to Morning Light tokens (amber `#C8982F`, lowercase `morning light.` wordmark + sun SVG, Playfair + DM Sans + IBM Plex Mono)
- `docs.html` — document library hub listing 22 docs across 7 sections, interactive-tools strip
- Nav wired into `savings-calculator.html`, `deck/intro-deck.html`, `deck/financial-model.html`, `ops/quote-template.html` (later A4 pages removed), `docs.html`
- `design-audit.md` — per-page findings + Deferred list

### 4. Rebrand Singularity → Morning Light
All user-facing text converted across:
- morning-light-energy/ (README, LAUNCH-CHECKLIST)
- bot/ (README, wa-templates/README, system-prompt, package.json, .env.example, both webhook routes)
- `SE-` document-ID prefix → `ML-`
- `daily-singularity-briefing` skill → `daily-morning-light-briefing`
- `singularity-chatbot` package name → `morning-light-chatbot`

### 5. Bug fixes
- **A4 overlap:** `deck/one-pager.html` and `ops/quote-template.html` had absolute footers overlapping content. Fixed by bumping `.page` padding-bottom (14→26/28 mm), adjusting footer offset, adding flex truncation hints, dropping phone from quote footer
- **Shared nav on print pages:** removed entirely from A4 pages so no sticky overlay remains
- **`.vercelignore` was excluding `deck/ ops/ gov/ strategy/ outreach/ hr/ marketing/` wholesale** — root cause of the 404s on subpath pages. Rewritten to exclude only build artefacts + `bot/`

## Commits on `morning-light-energy` master

```
fbeaded feat: integrate Telegram/WhatsApp chatbot scaffold into monorepo at bot/ + fix .vercelignore 404s
0621352 fix(a4): prevent footer overlap on quote + one-pager, rename SE→ML quote id
ab495be feat: port operational docs, nav shell, docs hub + fix one-pager overlap
```

All pushed to `github.com/bludragon66613-sys/morning-light-energy`.

Also made one local-only commit on archived `singularity-energy` repo (`3acf690`) — superseded by the Morning Light port; can be ignored.

## Production deploy

- Latest prod URL: `https://morning-light-energy-94loyqau2-bludragon66613-sys-projects.vercel.app`
- User-verified 2026-04-18: all 7 pages (index, docs, calc, intro-deck, one-pager, financial-model, quote-template) render correctly in their logged-in Chrome. No overlap on A4 pages.
- `vercel.json` has `cleanUrls: true` + `/calc → /savings-calculator` rewrite

## Outside-my-scope follow-ups

1. **Vercel Deployment Protection** still ON — curl returns 401. Disable via dashboard (Project → Settings → Deployment Protection) to make URLs publicly accessible without Vercel SSO
2. **Domain `morninglight.energy`** not yet registered in the Vercel team (only neotokyo.studio, shueb.io, goyscreener.com). Once purchased: `vercel domains add morninglight.energy` + DNS + `vercel alias`
3. **Bot as a separate Vercel project** — `bot/` is in-monorepo but not yet deployed. Create a second Vercel project rooted at `bot/` with all `.env.example` vars filled, run `scripts/set-telegram-webhook.sh` post-deploy

## Gotchas learned

- `~/singularity-energy/` remote is **archived** on GitHub — rejects pushes. Always use `~/morning-light-energy/`.
- Brand amber is `#C8982F` (Morning Light), not `#D98310` (old Singularity).
- `index.html` is a premium hand-crafted Tailwind landing — do not scaffold-overwrite it.
- A4 pages (`deck/one-pager.html`, `ops/quote-template.html`) must never carry a sticky nav/footer — breaks print and overlays content.
- `.vercelignore` gotcha: excluding a directory silently prunes the entire subtree from the deployment, even if Git tracks it. Symptom is 404 on subpath pages that exist locally. Always test a fresh deploy URL with curl, not just local.
