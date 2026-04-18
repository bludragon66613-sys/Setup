---
name: Copy style — no AI-slop punctuation
description: Drop em-dashes, double-hyphens, and the section mark from all writing; they read as AI slop
type: feedback
originSessionId: 5ea50238-7afe-477b-86bc-dc8b2ed29a24
---

Never use these glyphs in any writing meant for a human reader: landing pages, storefronts, dashboards, brand docs, lore, design bibles, emails, deck slides, PR descriptions, Telegram bot replies, commit messages the user will read.

1. **Em-dash** `—` : overused by LLMs, the #1 tell of AI writing.
2. **Double-hyphen** `--` : same reason, reads as auto-converted em-dash.
3. **Section mark** `§` : academic/legal symbol, in casual docs it reads as "LLM trying to sound formal." Rohan flagged this on drip brand docs 2026-04-18.

**Why:** These three glyphs together are the cleanest signature of LLM-generated prose. Avoiding them forces more natural sentence construction. Every time one shows up, the reader's trust in the document drops.

**How to apply:**
- Replace `—` with period, comma, colon, or `·` (mid-dot) depending on clause role.
- Replace `§ X` cross-references with "section X", "chapter X", "rule X", or the section title. Even in internal brand/design docs, skip the glyph.
- Numbered section references can use `#X` or plain "section 5".
- When redesigning a page or doc, audit existing copy for all three glyphs and rewrite.
- Does NOT apply to code (regex patterns, CLI flags like `--flag`, variable names), raw technical output, or existing product strings that were authored by Rohan himself.
- Pairs with `feedback_ai_design_antipatterns.md` and `feedback_design_process.md`.
