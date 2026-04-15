---
title: "PDF Quality Standards — Brand Foundation"
type: bf-standard
created: 2026-04-15
updated: 2026-04-15
---

# PDF Quality Standards

Brand bibles, decks, client deliverables, and any PDF shared externally must hit presentation-grade quality. The current HTML-to-PDF pipeline does not.

## Hard rules

1. **Do not use Puppeteer HTML-to-PDF for brand documents.** CSS page-break hacking produces inconsistent, sloppy output. Alignment issues, page cuts, and dead space are unacceptable.
2. **Do not repurpose desktop/responsive HTML as a mobile PDF source.** Fundamentally wrong pipeline.
3. **Every page must be visually reviewed** before delivery. Use the `pdf-review` skill.
4. **Use proper PDF libraries.** Options, in order of preference:
   - `pdf-lib` (JS, full control)
   - `pdfkit` (JS, imperative)
   - `React-PDF` / `@react-pdf/renderer` (component-based)
   - `reportlab` (Python, best for programmatic generation)

## Workflow for new PDF brand docs

1. **Build a purpose-made PDF layout from scratch.** Not a web page. Dimensions, margins, and flow are designed for print first.
2. **Use brand-foundation tokens.** Pull from the relevant `brand-foundation/brands/*.md` file. Never improvise spacing or color.
3. **Generate with a proper library** (see list above).
4. **Visually review every page** via `pdf-review` skill or manual inspection. Screenshot each page at high-DPI, check alignment, overflow, orphans/widows.
5. **Fix issues at the source**, not by adding `page-break` hacks.
6. **Deliver only after visual review passes.**

## Review checklist

- [ ] No content cut at page boundaries
- [ ] No dead space at bottom of pages (unless intentional)
- [ ] Typography scale consistent across pages
- [ ] Margins identical across pages
- [ ] Images aligned to grid
- [ ] Footer/header correctly placed on every page
- [ ] Colors match brand tokens (check print preview)
- [ ] Fonts embedded (no system-font fallbacks on recipient's machine)
- [ ] File size reasonable (<10 MB for most deliverables)

## Known past failures

- Munshi brand bible PDF had alignment issues and page cuts because it was generated from responsive HTML via Puppeteer
- User called a prior output "absolute garbage" when it ignored the brand bible tokens — never improvise from "approximate" styles

## Do not

- Ship a PDF without page-by-page visual review
- Repurpose web HTML when a proper PDF layout is needed
- Improvise tokens when the brand bible exists
- Use Puppeteer for anything a partner or client will see
