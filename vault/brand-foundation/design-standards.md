---
title: "Design Standards — Brand Foundation"
type: bf-standard
created: 2026-04-15
updated: 2026-04-15
---

# Design Standards

Cross-cutting design rules that apply to every Rohan project unless a specific brand file overrides them.

## Philosophy

**Japanese minimalism. Billion-dollar product quality.** Not template-tier, not generic SaaS.

Three Japanese aesthetic principles are load-bearing:

| Principle | Meaning | Practical effect |
|-----------|---------|-----------------|
| **Ma** (間) | Negative space, the interval between things | Generous whitespace. Let elements breathe. |
| **Kanso** (簡素) | Simplicity, elimination of clutter | Every element must justify its existence. |
| **Shibui** (渋い) | Understated elegance | No flashy effects. Restraint beats ornament. |

## Reference brands

When in doubt, look at how these brands handle the problem:

- **Stripe** — surgical precision, financial seriousness, neelam-blue shadows
- **Linear** — ruthless clarity, dark mode done right, interaction nuance
- **Vercel** — mono-accent restraint, perfect typography scale
- **Notion** — flat information hierarchy, generous margins
- **Apple** — craft, intentional motion, materials discipline
- **Cursor** — product-forward, no decoration

## Hard rules

1. **Every effect must justify its existence.** Gradients, shadows, borders, animations, icons — if you can't state why it's there, remove it.
2. **Typography before decoration.** Hierarchy comes from font size, weight, color, spacing. Not from boxes and backgrounds.
3. **Color restraint.** 70% neutral, 20% complementary, 10% accent. Never "homogenous goo."
4. **Shadows must be tinted.** Default grey drop-shadows signal AI slop. Use brand-tinted shadows (Munshi: Neelam blue. SSquare: none or obsidian).
5. **Default to flat and clean.** Add character through typography and whitespace — never through effects.
6. **Subtract when in doubt.** "You can add X" never means you should.

## Quality bar

The output must look like it was made by a human who cares. If a senior designer would flag it as template-tier, rewrite it.

Specifically avoid "generated, not designed" tells. See [[design-antipatterns]] for the full catalog.

## Motion

- Subtle, single-direction, fast transitions only
- 0.15s ease default
- Never scroll-triggered animations without viewport testing
- No competing directions (card lifts AND image grows = broken)
- No hover effects that aren't functional

## What "billion-dollar quality" means operationally

- Pixel-perfect alignment, consistent spacing grid
- Typography scale is mathematical, not improvised
- Every color has a named token, no hex strings in markup
- Shadow depth follows a documented scale
- Component states (default, hover, active, disabled, focus) are all defined
- Responsive behavior is tested, not assumed
- Copy is tight and confident
- No placeholder text, no lorem ipsum
- No "Insert image here"

## Do not

- Start design work without reading the relevant brand file
- Use generic SaaS styling when a brand bible exists
- Apply design trends (glassmorphism, gradients, serif heroes) as a default
- Ship design work without visual review — see [[pdf-quality]] for PDFs
