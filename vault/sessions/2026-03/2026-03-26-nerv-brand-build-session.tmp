# Session: 2026-03-26

**Started:** ~6:35am IST
**Last Updated:** ~8:30am IST
**Project:** NERV Brand Identity (~/nerv-brand/)
**Topic:** Complete brand identity build for NERV — from spec to deployed website

---

## What We Are Building

A complete brand identity system for NERV, Rohan's umbrella agentic AI company. NERV deploys "Custom Agentic Organisations" — 15 autonomous AI companies with 400+ agents operating 24/7 through the Paperclip orchestration platform. The brand is inspired by Neon Genesis Evangelion's NERV organisation, with a "distilled DNA" approach: insiders recognize the EVA reference, outsiders see a credible company.

The deliverables span: brand spec document, logo system (Signal mark — broken concentric arcs), color palette, typography (Space Grotesk / IBM Plex Sans / Space Mono), voice guidelines, brand narrative (three voices: institutional, operator, signal), pitch deck, Three.js immersive website, SVG assets, favicon, and dashboard theme integration.

Paperclip companies were involved: Agency Agents (AGE) for creative direction (Brand Guardian, Narratologist, Visual Storyteller), TACHES Creative for strategy, and references to Fullstack Forge, RedOak Review, and MiniMax Studio for implementation and QA.

---

## What WORKED (with evidence)

- **Brand spec document** — confirmed by: written to ~/nerv-brand/NERV-BRAND-SPEC.md, all 10 sections complete, user approved each section individually
- **Logo system (Signal mark)** — confirmed by: 6 logo options rendered in browser (logo-options.html), user chose Option F (broken concentric arcs), SVG assets created in assets/ folder
- **Three.js website** — confirmed by: deployed to Vercel at https://nerv-website-rho.vercel.app, 7 sections with particle system, scroll-driven animations, responsive
- **Pitch deck** — confirmed by: pitch-deck.html built with 8 slides, EVA-named companies, updated advantage narrative
- **Dashboard theme update** — confirmed by: ~/aeon/dashboard/lib/theme.ts updated with new color tokens, icon.svg replaced with Signal mark
- **SVG assets (10 files)** — confirmed by: all files created in ~/nerv-brand/assets/, verified as valid SVG
- **EVA-lore company renaming** — confirmed by: all 15 companies renamed in both website and pitch deck (Gehirn, Pribnow, Dogma Systems, Dirac, MAGI, Ramiel, Israfel, Terminal, Longinus, Ireul, Casper, Umbilical, Kaji, LCL, S2 Engine)
- **Vercel deployment** — confirmed by: 6 successful deploys, final production URL https://nerv-website-rho.vercel.app serving correctly

---

## What Did NOT Work (and why)

- **Unsplash source URLs (source.unsplash.com)** — failed because: returns 567-byte error pages instead of images. Fixed by using direct photo ID URLs (images.unsplash.com/photo-XXXXX)
- **Freepik API** — failed because: API key in ~/aasara-pipeline/.env.local was a placeholder "..." (3 chars). Used Unsplash direct URLs instead
- **First Three.js website build** — user requested redo, felt it wasn't clean enough. Rebuilt from scratch with deck-inspired design
- **Logo duplication** — Signal logo SVG was appearing too many times (hero + closing + redundant copies). Fixed by removing extras, keeping one in hero (180px) and one in closing (120px)
- **Double percent sign (85%%)** — count-up JS was appending "%" AND there was a separate `<div class="metric-suffix">%</div>`. Fixed by removing the suffix divs
- **Competitor comparison (ChatGPT/Copilot/Devin)** — user rejected this narrative. Replaced with convenience/optimisation/topline growth pillars
- **"Services" terminology** — user corrected to "Custom Agentic Organisations" (not platforms, not services). Updated everywhere.

---

## What Has NOT Been Tried Yet

- Custom domain setup for nerv-website-rho.vercel.app
- Converting pitch deck to PDF for distribution
- Deploying pitch deck to Vercel as separate project
- Updating Paperclip company names in the actual database (only updated in website/deck HTML, not in Paperclip API)
- Building the logo as a proper animated React/SVG component for the NERV dashboard
- Backing up nerv-brand/ to claudecodemem repo

---

## Current State of Files

| File | Status | Notes |
| --- | --- | --- |
| `~/nerv-brand/NERV-BRAND-SPEC.md` | ✅ Complete | Full brand bible — story, logo, colors, type, voice, applications |
| `~/nerv-brand/website/index.html` | ✅ Complete | Three.js website, deployed to Vercel. Signal logo on hero + closing, EVA company names, convenience/optimisation/topline narrative |
| `~/nerv-brand/pitch-deck.html` | ✅ Complete | 8-slide pitch deck with EVA company names, updated advantage section |
| `~/nerv-brand/brand-deck.html` | ✅ Complete | 11-slide brand identity presentation with images |
| `~/nerv-brand/logo-preview.html` | ✅ Complete | First logo concept showcase |
| `~/nerv-brand/logo-options.html` | ✅ Complete | 6 logo explorations with color states |
| `~/nerv-brand/assets/nerv-signal-default.svg` | ✅ Complete | Signal mark in #EAEAF0 |
| `~/nerv-brand/assets/nerv-signal-orange.svg` | ✅ Complete | Signal mark in #E8650D |
| `~/nerv-brand/assets/nerv-signal-dark.svg` | ✅ Complete | Signal mark in #0A0A12 |
| `~/nerv-brand/assets/nerv-wordmark-default.svg` | ✅ Complete | NERV wordmark path outlines |
| `~/nerv-brand/assets/nerv-wordmark-orange.svg` | ✅ Complete | NERV wordmark in orange |
| `~/nerv-brand/assets/nerv-lockup-horizontal.svg` | ✅ Complete | Mark + wordmark side by side |
| `~/nerv-brand/assets/nerv-lockup-stacked.svg` | ✅ Complete | Mark above wordmark |
| `~/nerv-brand/assets/nerv-favicon-32.svg` | ✅ Complete | Outer ring + dot for 32px |
| `~/nerv-brand/assets/nerv-favicon-16.svg` | ✅ Complete | Single arc + dot for 16px |
| `~/nerv-brand/assets/nerv-icon.svg` | ✅ Complete | Dashboard icon replacement |
| `~/nerv-brand/images/01-08*.jpg` | ✅ Complete | 8 brand photography images (1400x900) |
| `~/aeon/dashboard/lib/theme.ts` | ✅ Complete | Updated with new brand color tokens |
| `~/aeon/dashboard/app/icon.svg` | ✅ Complete | Replaced triangle with Signal mark |
| `~/aeon/NERV_BRAND_APPROACHES.md` | ✅ Complete | Three brand approaches from Brand Guardian agent |

---

## Decisions Made

- **Brand position: "Cold institutional shell, existential human core"** — the tension between machine precision and self-awareness IS the differentiator
- **Logo: Option F "Signal" (broken concentric arcs)** — chosen over Consensus (triangles), Containment (circle+veins), Spine, Shield, and Triad options. Best represents AT Field / radar aesthetic
- **Typography: Space Grotesk / IBM Plex Sans / Space Mono** — two-voice system: system voice (mono) vs human voice (sans-serif)
- **Monolithic brand architecture** — all sub-entities (Aeon, Paperclip, OpenClaw) are internal codenames, not public brands
- **"Custom Agentic Organisations" positioning** — not "services" or "platforms"
- **EVA-lore company names** — 15 companies renamed from generic names to EVA-inspired (Gehirn, Ramiel, MAGI, etc.)
- **No competitor comparison** — removed ChatGPT/Copilot/Devin comparison, replaced with convenience/optimisation/topline growth narrative
- **No images on website** — pure CSS/SVG/Three.js only. Images used only in brand-deck.html
- **Approach B "Controlled Tension"** — all three specialist agents (Brand Guardian, Narratologist, Visual Storyteller) independently converged on this as the strongest direction
- **Three narrative voices** — Institution (public), Operator (about page), Signal (dashboard splash)
- **Tagline: "One operator. No ceiling."** — Motto: "The signal persists. The noise is temporary."

---

## Blockers & Open Questions

- Paperclip company names only updated in HTML files, not in the actual Paperclip database. Need to decide if the EVA names should replace the real company names in Paperclip or remain website-only.
- The brand-deck.html and pitch-deck.html still reference old company names in some places — need verification pass.
- Dashboard at ~/aeon/dashboard/ has updated theme tokens but hasn't been rebuilt/tested with the new colors.
- No custom domain configured for the Vercel deployment.

---

## Exact Next Step

Verify the deployed website at https://nerv-website-rho.vercel.app looks correct on mobile and desktop. Then decide whether to update the Paperclip database with the EVA company names, or keep them as website-only branding. After that, back up ~/nerv-brand/ to the claudecodemem repo.

---

## Environment & Setup Notes

- Vercel CLI installed globally, authenticated as bludragon66613-sys
- Website deployed as static site to Vercel project "nerv-website"
- Production URL: https://nerv-website-rho.vercel.app
- Three.js loaded from CDN: https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.min.js
- Google Fonts: Space Grotesk, IBM Plex Sans, Space Mono
- All files in ~/nerv-brand/ — single directory, no build step needed
- Freepik API key is a placeholder — not functional
