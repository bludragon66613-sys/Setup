---
name: Design-first workflow for brand/site builds
description: When user asks to rebuild or redesign a website, run brand bible → design previews → approval gates BEFORE writing any code
type: feedback
---

When user asks to "rebuild" or "redesign" a website, brand, app UI, or any meaningful visual product, DO NOT jump straight to code.

Required workflow:
1. **Extract / audit current assets** — pull images, fonts, copy, color palette from live source. Treat existing content as the brand's source of truth unless told otherwise.
2. **Build brand bible from scratch** — synthesize voice, visual canon, palette, typography, motion principles, do/don't, character anchors. Reference existing project docs (JOFF.md, PERSONALITY.md, DIRECTION.md style files) if present.
3. **Approval gate** — present brand bible, wait for explicit user approval.
4. **Design previews via super-designer agent** — only after bible is approved. Generate concrete visual mocks / static HTML previews.
5. **Approval gate** — wait for user approval on direction.
6. **THEN build** — code rebuild only happens after approved direction.

**Why:** User on 2026-05-15 cut off a direct code rebuild of joff site mid-flight. Said "looks like slop from the previews, redesign using super-designer first … build me a joff brand bible from scratch before you move onto the website … once i've approved the direction is when you head into rebuilding." They want approval gates, want existing assets respected (not strayed from), and want super-designer in the loop for visual work.

**How to apply:** Any time the request involves visual rebuilding or brand work, propose this sequenced workflow first. Do not skip the brand bible step. Do not skip the design preview step. Do not write app code until both are signed off. Use super-designer subagent for the visual layer, not direct file writes from main thread.
