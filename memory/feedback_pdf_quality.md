---
name: PDF generation quality bar
description: PDF brand bibles and design documents need presentation-grade quality — current HTML-to-PDF pipeline produces alignment issues
type: feedback
originSessionId: 9e86436b-59af-4f1a-9783-e891df90ed72
---
CSS page-break hacking via Puppeteer produces inconsistent, sloppy results for design documents. Current approach of converting desktop/responsive HTML to mobile PDF is fundamentally wrong.

**Why:** User needs presentation-grade PDFs to share with partners and get opinions. Alignment issues, page cuts, dead space are unacceptable for a brand bible.

**How to apply:** For future PDF brand documents:
1. Build a purpose-made PDF layout from scratch (not repurposed web HTML)
2. Use a proper PDF generation library (pdf-lib, pdfkit, or React-PDF) instead of Puppeteer HTML-to-PDF
3. Always visually review every page before delivering
4. Build/use a PDF review skill that can screenshot and inspect each page
5. The user also requested a reusable PDF review skill be built
