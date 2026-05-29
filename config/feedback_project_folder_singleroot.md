---
name: Single-root project folders
description: Keep all sub-artifacts (brand, site, design, assets) as subfolders inside the project root, not as sibling directories
type: feedback
---

When working on a named project (joff, fatfk, ssquare, etc.), keep ALL related artifacts as subfolders **inside the project root**, not as new sibling directories at `~/Documents/`.

Wrong: `~/Documents/joff/`, `~/Documents/joff-brand/`, `~/Documents/joff-site/`
Right: `~/Documents/joff/{brand,site,design,assets}/`

**Why:** User on 2026-05-15 pushed back: "i put them in the joff folder why are you making new folders for brand and website put them as sub folders in the joff folder so its easier to find everything under one folder." Sibling dirs scatter project state across the Documents root and break the "all code projects + vault live as siblings under ~/Documents/" rule from CLAUDE.md.

**How to apply:**
- Before creating a new top-level folder, check if the project already has a root at `~/Documents/<name>/`. If yes, nest inside it.
- For JOFF specifically: `~/Documents/joff/brand/`, `~/Documents/joff/site/`, `~/Documents/joff/design/`. Existing `memes/`, `outputs/`, `JOFF.md`, etc. stay at the joff root.
- Existing project-layout memory says new projects go at `~/Documents/<name>/` — this extends that: subfolders nest inside, never beside.
