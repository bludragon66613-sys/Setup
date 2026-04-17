---
name: project_morning_light
description: Morning Light Energy — AI-powered rooftop solar EPC in TG+AP (PM Surya Ghar → district aggregator → C&I → installer platform SaaS → 10MW utility), Premier-partnered, Hyderabad-based; superseded working name "Singularity Energy" on 2026-04-17
type: project
originSessionId: dc49e45e-5446-4e89-8d47-cf291d782703
---
# Morning Light Energy

**Brand:** Morning Light Energy Pvt Ltd · Tagline "Where Sunlight Becomes Certainty"
**Repo:** `~/morning-light-energy/` — remote `github.com/bludragon66613-sys/morning-light-energy` (default branch `master`, non-archived)
**Domain:** morninglight.energy · Email `hello@morninglight.energy`
**Brand tokens:** amber `#C8982F`, lowercase "morning light." wordmark with sun SVG, Tailwind-based landing, Playfair-esque serif for headlines
**Deprecated alias:** "Singularity Energy" — old repo `~/singularity-energy/` is archived on GitHub; do not push there

## Thesis
Residential rooftop EPC in TG+AP under formal Premier Energies partnership → PM Surya Ghar district implementer → C&I open access → Premier channel tooling SaaS → utility-scale (Phase 5, the 10 MW pptx vision)

## 5 phases (see strategy/01-pivot-memo-2026-04-17.md)
| Phase | Months | Revenue | Capex |
|---|---|---|---|
| 1 Residential EPC TG+AP | 1-4 | ₹30-60L / 30-50 installs | ₹50K-1L |
| 2 PM Surya Ghar district aggregator | 5-9 | ₹1-2 Cr/yr per district | Working capital |
| 3 C&I 100kW-1MW | 7-12 | 3-5 deals, ₹3-15 Cr each | Project finance |
| 4 Premier Installer Platform SaaS | 10+ | ₹10-50K/installer × 50-500 | Pure software |
| 5 Utility-scale 10MW+ | 18+ | Co-dev | Equity / syndicate |

## Priority districts
- TG: Ranga Reddy, Medchal-Malkajgiri, Siddipet, Karimnagar
- AP: Krishna (Vijayawada), Visakhapatnam, Guntur, Anantapur

## Key docs (all in `~/morning-light-energy/`)

**Strategy**
- `strategy/01-pivot-memo-2026-04-17.md` — full 5-phase strategic plan
- `strategy/premier-partnership-ask.md` — 6-ask MOU discussion prep
- `strategy/bridge-pitch.md` — close-network ₹5–10 L bridge
- `strategy/financial-model.md` — 18-month baseline, unit economics
- `strategy/bsp-evaluation.md` — WhatsApp BSP decision

**Government**
- `gov/tgap-engagement.md` — TSREDCO/NREDCAP/DISCOM engagement ladder, 8-week sequence
- `gov/tier1-briefing-packet.md` — Secretary-level leave-behind (added 2026-04-18)
- `gov/tier1-deck-outline.md` — 10-slide Tier-1 meeting deck outline (added 2026-04-18)
- `gov/district-bid-dossier.md` — district-implementer bid template

**Operations**
- `ops/phase-1-playbook.md` — 9-stage 21-day install loop
- `ops/site-survey-checklist.md` — field + commissioning QA
- `ops/premier-product-matrix.md` — standardised BOM per segment
- `ops/quote-template.html` — customer-facing PDF-ready quote
- `ops/entity-registration-checklist.md` — Hyderabad CA filing checklist
- `ops/empanelment-kit.md` — PM Surya Ghar + 5 DISCOM empanelment, 17-doc bundle, 8-week timeline (added 2026-04-18)
- `ops/empanelment-tracker.md` — live 6-portal pipeline tracker (added 2026-04-18)
- `ops/per-install-pnl-tracker.md` — per-install GM + monthly KPIs + cash-flow overlay (added 2026-04-18)

**Marketing**
- `marketing/price-sheet.md` — Premier-tier internal pricing, 6 size tiers, add-ons (added 2026-04-18)
- `marketing/case-studies/case-study-01-hyderabad-3kw.md` — first-install case study template (added 2026-04-18)

**HR**
- `hr/hiring-plan-phase-1.md` — Phase-1 headcount plan
- `hr/board/first-board-meeting-pack.md` — board resolutions + minutes pack

**Outreach**
- `outreach/installer-recon-script.md` — 28-Q competitor intel interview
- `outreach/installer-universe.md` — 265 TG+AP PM Surya Ghar empanelled vendors
- `outreach/templates.md` — 5 outreach templates

**Web**
- `index.html` — premium Tailwind landing (DO NOT overwrite)
- `savings-calculator.html` — PM Surya Ghar customer calc
- `deck/intro-deck.html` · `deck/one-pager.html` · `deck/financial-model.html`
- `docs.html` — document library hub (added 2026-04-18)
- `assets/brand.css` — shared nav/footer shell, Morning Light tokens (added 2026-04-18)
- `design-audit.md` — per-page UI audit + deferred items (added 2026-04-18)

**Assets**
- `Morning_Light_10MW_Solar.pptx` — Phase 5 vision teaser

## Aeon skills in service
- `solar-market-monitor` — daily pulse (built 2026-04-17)
- `green-energy-brief` — weekly newsletter / top-of-funnel (built 2026-04-17)
- `memory/feeds.yml` `solar_india` section (10 feeds) + `carbon_india` (2 feeds)
- **TODO:** pm-surya-ghar-navigator bot skill, dpr-draft, discom-tracker, tender-watch, daily-morning-light-briefing

## Customer chatbot (`bot/` inside morning-light-energy monorepo)
- **Integrated into monorepo 2026-04-18** (moved from `~/solar-saas/chatbot-scaffold/`)
- **Primary channel:** Telegram — route `/api/tg/webhook`, `lib/tg.ts`, session dual-channel (`wa:hist:` / `tg:hist:`), CRM synthetic key `tg:<chat_id>` until phone captured
- **Deferred:** WhatsApp Business Cloud API — code wired, 7 Meta templates in `bot/wa-templates/` (all Morning Light-branded), waiting on Meta Business verification post-incorporation
- **Stack:** Next.js 16 + Anthropic Claude + Upstash Redis + Vercel Postgres + Resend
- **Typecheck:** green (one pre-existing `as any` cast in `bot/lib/claude.ts` line 117)
- **Package name:** `morning-light-chatbot` (was `singularity-chatbot`)
- **Webhook setup:** `bot/scripts/set-telegram-webhook.sh` registers bot with secret-token auth
- **Deploys as a separate Vercel project** pointing at `bot/`; static site `.vercelignore` excludes `bot/` so the root project stays static-only

## Advisory bench
200 MW-scale farm operators — advisory only, no equity capex expected. Used for: DPR QA, site selection, DISCOM wheeling playbook, utility-scale sourcing (Phase 5).

## Gov relationships
TG + AP energy departments via existing personal contacts. Tier-1 (Secretary+), Tier-2 (TSREDCO/NREDCAP MD), Tier-3 (DISCOM), Tier-4 (District collector).

## This week's 5 moves
1. Premier MOU conversation (Hyderabad)
2. TG + AP gov Tier-1 outreach
3. First India Green Energy Brief edition published
4. PM Surya Ghar empanelment paperwork (TG + AP)
5. Morning Light Energy entity registration (Hyderabad CA)

## Capital posture
Bootstrapped + close network. No VC. Phase-5 utility capex may take project-finance / advisor co-invest, deferred until Phase 1-3 prove ≥₹5 Cr/yr profitable ops.

## Gotchas learned
- Always use the `morning-light-energy` repo; `singularity-energy` is an archived remote and will reject pushes
- Brand amber is `#C8982F` (Morning Light), NOT `#D98310` (old Singularity accent)
- `index.html` is a premium hand-crafted Tailwind landing — do not scaffold-overwrite it
- A4 print pages (`deck/one-pager.html`, `ops/quote-template.html`) must NOT carry the sticky nav/footer — they break the print layout (see `design-audit.md`)
