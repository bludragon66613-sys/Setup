---
name: pdf-review
description: >
  Visual QA of a rendered PDF, page by page: alignment, typography, color,
  layout, content, and brand fidelity, ending in a severity-ranked
  ship/no-ship report. Use after generating or rebuilding any PDF (brand
  bibles, decks, reports, one-pagers, print exports) and before it goes to a
  stakeholder, or to compare a before/after PDF for visual regressions.
  Triggers: "review this PDF", "is this PDF ready to ship/share", "check the
  PDF for layout/font/page-break issues", "QA the export". Not for text
  extraction, summarizing a PDF's content, form filling, or debugging PDF
  generator code.
---

# PDF Review

PDF pipelines (puppeteer, pdf-lib, React-PDF, Pillow, LaTeX, Word export)
introduce issues that look fine in the source but break in the output: font
substitution, page-break splits, color drift, missing assets. This skill
reviews the rendered output, not the source.

## Step 1: Render pages to PNG

Requires `pip install pymupdf` (pure Python, no poppler/Ghostscript).

```bash
python3 ~/.claude/skills/pdf-review/render-pdf.py /path/to/input.pdf --clean
# options: --out <dir> (default ~/pdf-review-temp/), --zoom 2.0 for fine detail (default 1.5)
```

## Step 2: Read the pages

Open each `page-NNN.png` with the Read tool (it renders images).

- Up to ~15 pages: read every page.
- Longer: always read the cover, TOC (if any), every section divider, the last
  page, and any page the user flagged; sample every Nth page for even
  coverage; read densely around any issue found.

## Step 3: Score each page

Score each dimension `pass / minor / major / critical`:

| Dimension | Look for |
|---|---|
| **Alignment** | Consistent margins, grid alignment, nothing running off the edge or bleeding into other elements |
| **Typography** | No font fallback/substitution, readable line breaks, sensible hyphenation, intact spacing/kerning, clear heading hierarchy |
| **Color** | Accurate brand colors (not desaturated or gamut-shifted), consistent backgrounds, adequate contrast, no unintended bleeds |
| **Layout** | Page breaks not mid-paragraph/card/table, balanced white space, clear hierarchy, cohesive sections |
| **Content** | Readable at viewing size, no pixelated images, captions and footers/page numbers correct, no placeholder text |
| **Brand fidelity** | Logo, color, type, voice match the brand reference; tokens and sign-offs applied correctly |

## Step 4: Report

```markdown
# PDF Review: [filename]

**Reviewed:** YYYY-MM-DD
**Pages:** N (inspected M of N)
**Overall verdict:** PASS / MINOR ISSUES / MAJOR ISSUES / CRITICAL

## Summary
One paragraph: what works, what is broken, whether it is shippable.

## Findings by severity
### CRITICAL (blocks shipping)
- **[Page X, dimension]**: issue, why critical, suggested fix
### MAJOR (fix before sharing)
### MINOR (nice to fix)
### PASS (no issues)

## Per-page notes
| Page | Alignment | Typography | Color | Layout | Content | Brand | Notes |
|---|---|---|---|---|---|---|---|
| 1 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Clean cover |

Legend: ✅ pass · ⚠️ minor · 🟧 major · ❌ critical

## Recommendations
Numbered, actionable fixes ordered by severity.

## Sign-off
PASS or MINOR ISSUES: "Ready to ship."
MAJOR or CRITICAL: "Not ready. Fix [X] then re-review."
```

## Optional: regression compare

Given a before and after PDF: render each to its own `--out` dir, read matching
pages back to back, and add a "## Regressions vs previous version" section.
Record improvements as well as regressions.

## Rules

1. Never call a PDF shippable without reading at least the cover, TOC (if
   any), every section divider, and the last page. A page count is not a review.
2. Trust the rendered pages, not the source. If the PDF looks broken, it is broken.
3. Name the likely root cause when you recognize it, so the user fixes the
   generator instead of patching output (see table below).
4. Keep severity proportional. Critical means "would embarrass the user in
   front of a stakeholder"; minor means perfectionist nitpick.
5. Delete the render dir when done unless the user wants it kept.

## Common failures and causes

| Symptom (dimension) | Likely cause | Fix |
|---|---|---|
| Font fallback (typography) | Webfonts not loaded before render | Await `document.fonts.ready` in puppeteer, or embed fonts |
| Page-break splits (layout) | No print CSS | Add `page-break-inside: avoid` / `break-inside: avoid` |
| Color drift (color) | RGB to CMYK conversion or profile mismatch | Lock the color profile in the generator |
| Missing images (content) | Relative paths break in print context | Absolute paths or data URIs |
| Mobile viewport leakage (alignment) | Generator viewport set to mobile | Match viewport to page size |
| Placeholder text (content) | Unfinished content | Search source for "Lorem", "TODO", "TBD" before regenerating |
