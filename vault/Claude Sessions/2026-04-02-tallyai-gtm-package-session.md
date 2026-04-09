# Session: 2026-04-02

**Started:** ~6:40pm IST
**Last Updated:** 7:25pm IST
**Project:** TallyAI (~/tallyai/)
**Topic:** Built complete GTM strategy, investor pitch deck, and sales toolkit for TallyAI

---

## What We Are Building

TallyAI's go-to-market package — everything needed to take the product from MVP to market. The MVP was already fully built (Tally XML parser, bank reconciliation, NL queries in Hindi/English, GST compliance, AI agent with autopilot, WhatsApp/Telegram chat). This session created the complete investor-facing and sales-facing materials using the finalized Munshi Neo brand identity.

Three parallel workstreams were executed:
1. **GTM Strategy & Plan** — Full go-to-market strategy with market sizing, 3-phase launch plan, CA distribution channel strategy, 90-day calendar, budget allocation, and risk register
2. **Investor Pitch Deck** — 18-slide branded HTML presentation + 17-slide editable PPTX
3. **Sales & Launch Toolkit** — 7 documents: SME one-pager, CA one-pager, competitive battlecards, email sequences, launch checklist, CA partnership playbook, social media kit

All materials were then converted to clean branded PDFs (no browser headers) and a PPTX, delivered to Desktop.

---

## What WORKED (with evidence)

- **3 parallel product-manager agents** — All three completed successfully, producing ~2,800+ lines of GTM content across 8 markdown files
- **HTML one-pager designs** — Both SME and CA one-pagers render correctly with full Munshi Neo branding (verified via Chrome DevTools screenshots)
- **Investor pitch deck HTML** — 18 slides with navigation, dot nav, arrow keys, all branded correctly (verified via screenshot in Chrome)
- **Puppeteer PDF generation** — `puppeteer-core` with `displayHeaderFooter: false` produces clean PDFs without Chrome date/title headers (verified by opening PDF in Chrome — no "4/2/26, 7:02 PM" header)
- **pptxgenjs PPTX generation** — 17-slide editable PowerPoint with brand colors, correct fonts specified, all content from the HTML deck (430KB file created successfully)
- **Node.js markdown-to-HTML converter** — Custom script `_convert.js` converts markdown to branded HTML with tables, code blocks, blockquotes, and TallyAI header bar

---

## What Did NOT Work (and why)

- **Chrome headless `--print-to-pdf-no-header` flag** — Did NOT suppress headers. Chrome still printed "4/2/26, 7:02 PM" and "TallyAI — Investor Pitch Deck" on every page. Had to switch to puppeteer-core with explicit `displayHeaderFooter: false` parameter via CDP.
- **Fetch-based HTML template for markdown** — Attempted `_md_to_pdf.html` with `?file=` query param and `fetch()`, but `file://` protocol blocks fetch requests due to CORS. Switched to Node.js script that embeds content directly into HTML files.

---

## What Has NOT Been Tried Yet

- Vercel production deployment of TallyAI (still on the remaining checklist)
- Setting CRON_SECRET env var for autopilot endpoint
- WhatsApp Business API verification (Meta approval pending)
- Production IRP/NIC API credentials (sandbox only currently)
- Landing page creation (munshi.ai domain)
- Replacing placeholder URLs in sales materials (wa.me/91XXXXXXXXXX, calendly.com/..., munshi.ai)

---

## Current State of Files

### GTM Package (~/tallyai/gtm/)

| File | Status | Notes |
| --- | --- | --- |
| `GTM_STRATEGY.md` | Complete | Full GTM strategy: TAM/SAM/SOM, 3-phase launch, CA distribution, 90-day calendar, risk register |
| `INVESTOR_PITCH_DECK.html` | Complete | 18-slide branded HTML presentation, arrow key navigation |
| `ONE_PAGER_SME.md` | Complete | Business owner handout, bilingual |
| `ONE_PAGER_SME.html` | Complete | Branded A4 HTML for PDF printing |
| `ONE_PAGER_CA.md` | Complete | CA handout with ROI calculator |
| `ONE_PAGER_CA.html` | Complete | Branded A4 HTML for PDF printing |
| `BATTLECARD.md` | Complete | vs QuickBooks, Zoho, Manual CA |
| `EMAIL_SEQUENCES.md` | Complete | 15 emails: CA outreach + SME WhatsApp + onboarding |
| `LAUNCH_CHECKLIST.md` | Complete | Technical, marketing, sales, legal readiness |
| `CA_PARTNERSHIP_PLAYBOOK.md` | Complete | 3-tier CA partner program + ICAI strategy |
| `SOCIAL_MEDIA_KIT.md` | Complete | 10 LinkedIn, 5 Twitter, 3 WhatsApp, 2 Reels scripts |
| `_convert.js` | Complete | Markdown-to-branded-HTML converter script |
| `_print_pdfs.js` | Complete | Puppeteer PDF generator (clean, no headers) |
| `_create_pptx.js` | Complete | pptxgenjs pitch deck generator |
| `_md_to_pdf.html` | Unused | Fetch-based approach didn't work, replaced by _convert.js |

### Desktop Output (~/Desktop/TallyAI GTM Package/)

| File | Size | Status |
| --- | --- | --- |
| `INVESTOR_PITCH_DECK.pdf` | 3.3 MB | Clean, 18 slides |
| `INVESTOR_PITCH_DECK.pptx` | 430 KB | Editable, 17 slides |
| `EMAIL_SEQUENCES.pdf` | 981 KB | Clean |
| `GTM_STRATEGY.pdf` | 681 KB | Clean |
| `SOCIAL_MEDIA_KIT.pdf` | 637 KB | Clean |
| `ONE_PAGER_SME.pdf` | 366 KB | Clean |
| `ONE_PAGER_CA.pdf` | 358 KB | Clean |
| `LAUNCH_CHECKLIST.pdf` | 334 KB | Clean |
| `CA_PARTNERSHIP_PLAYBOOK.pdf` | 328 KB | Clean |
| `BATTLECARD.pdf` | 247 KB | Clean |

---

## Decisions Made

- **CAs are distribution nodes, not just customers** — The entire GTM strategy is built on the insight that 1 CA = 20-50 SME users. This makes the CA channel 10x more capital-efficient than direct SME acquisition.
- **WhatsApp over email for Indian outreach** — Indian CAs read WhatsApp, not cold emails. All outreach templates written for WhatsApp-first.
- **ICAI CPE seminars as free acquisition** — CAs need CPE hours; offering AI accounting seminars counts toward CPD and reaches 50-100 CAs per event for ~₹10K in logistics.
- **Puppeteer over Chrome headless CLI** — Chrome's `--print-to-pdf-no-header` flag is unreliable on Windows. Puppeteer's CDP `displayHeaderFooter: false` is the correct approach.
- **Seed ask: ₹2.5Cr ($300K)** — 18-month runway, use of funds: Hiring 40%, Marketing 30%, Infrastructure 15%, Legal 15%.
- **pptxgenjs for PPTX** — Native Node.js library, no external deps, produces clean editable PowerPoint files.

---

## Blockers & Open Questions

- Placeholder URLs need replacing: `munshi.ai`, `wa.me/91XXXXXXXXXX`, `calendly.com/munshi-ai-ca-demo`, `ca@munshi.ai`, `chapters@munshi.ai`
- Need to decide on actual domain name and register it
- Testimonials in SME one-pager are placeholder — need real quotes from beta users
- PPTX doesn't have exact visual parity with HTML deck (no gradients in pptxgenjs) — acceptable for editable version

---

## Exact Next Step

Replace placeholder URLs across all GTM materials with real contact information, then deploy TallyAI to Vercel production and start the Launch Checklist (Section 6: P0 gate items).

---

## Environment & Setup Notes

- PDF generation requires: `npm install puppeteer-core pptxgenjs` in `~/tallyai/`
- Chrome path: `C:/Program Files/Google/Chrome/Application/chrome.exe`
- Regenerate PDFs: `cd ~/tallyai && node gtm/_print_pdfs.js`
- Regenerate PPTX: `cd ~/tallyai && node gtm/_create_pptx.js`
- Regenerate HTML from markdown: `cd ~/tallyai/gtm && node _convert.js`
