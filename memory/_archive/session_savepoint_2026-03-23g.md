---
name: Session Savepoint 2026-03-23g
description: Brand differentiation system built for 10 luxury villa brands in branding-pipeline
type: project
---

# Branding Pipeline — Differentiation System Applied

**Location:** `C:\Users\Rohan\branding-pipeline\brand-pipeline\`

## What Was Built

Researched St. Regis, Aman, Bvlgari, Binghatti for design language references, then applied a full 10-brand differentiation system.

### 10-Brand Differentiation Matrix

| Brand | Archetype | New Serif | New Accent | Status |
|-------|-----------|-----------|-----------|--------|
| Āvāsa (Stratum) | The Vault | Bodoni Moda | #8C4B2A cognac | `avasa-stratum-v2.html` (preview) |
| Nidra (Kāla) | The Nocturne | Playfair Display | #7A9AAA moonstone | Updated in-place |
| Śānti (Vela) | The Garden | EB Garamond | #5A8870 sage teal | Updated in-place |
| Prāna (Grove) | The Forest | Cormorant Garamond (only one) | #8A7A3A lichen moss | Updated in-place |
| Ākāśa (Zenith) | The Apex | Montserrat | #2A6AAA cerulean | Updated in-place |
| Ambara (Sōl) | The Golden Hour | Abril Fatface | #C85A28 terracotta | Updated in-place |
| Sthāna (Mark) | The Black Card | DM Serif Display | #A8A8A6 platinum | Unchanged (already distinct) |
| Vihāra (Terra) | The Haveli | Lora | #9A3A28 burnt Deccan red | Updated in-place |
| Mandapa (Arch) | The Blueprint | Raleway | #3A7A9A steel teal | Updated in-place |
| Svara (Resonance) | The Frequency | Josefin Sans | #7848B8 violet | Updated in-place |

## Key Problem Solved
- Before: 7/10 used Cormorant Garamond, 8/10 used warm gold/amber accents
- After: 10 unique typefaces, 10 distinct accent hue families across full color wheel

## Files
- `apply-differentiation.mjs` — batch update script (run with `node apply-differentiation.mjs`)
- `avasa-stratum-v2.html` — Āvāsa preview with new design (compare to `avasa-stratum.html`)
- All 10 `.html` files updated with new fonts + accents

## Visual Companion
- Server: was running on port 55268 (restart with `bash scripts/start-server.sh --project-dir .`)
- Screen dir: `.superpowers/brainstorm/5145-1774255679/`
- Key screens: `accent-collision.html`, `differentiation-system.html`, `avasa-preview.html`

## Next Steps
- Sync `brand-data.json` with new CSS values from all 10 brands
- Regenerate PDFs (open each HTML in Chrome → Print → Save as PDF)
- Fine-tune any specific brand if colors/typefaces need adjustment
- Apply cross-hatch motif (currently only on Āvāsa v2 S03) to other brands' signature slides

**Why:** User wanted 10 luxury villa brands (all in Jubilee Hills, Hyderabad) to stand out from each other visually using reference from St. Regis, Aman, Bvlgari, Binghatti.
