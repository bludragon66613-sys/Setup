---
title: "Design Anti-Patterns — Brand Foundation"
type: bf-standard
created: 2026-04-15
updated: 2026-04-15
source: "x.com/yuwen_lu_/status/2041187936738447565 (Apr 6, 2026) — Signs of vibe coded UI"
---

# Design Anti-Patterns

Catalog of vibe-coded UI slop. **Never generate any of these patterns** for Rohan's projects. If asked to, refuse and propose the fix instead.

> Meta-principle: **Unnecessary detail is the root of all AI design slop.** Every effect, animation, gradient, shadow, border, and icon must justify its existence. Clear messages beat noise. Intention beats carelessness.

## Color

### 1. Homogenous goo
**Symptom:** Mushing similar hues together. Cyan icon in a sky-blue box inside a blue card with a minty border.
**Fix:** Follow 70/20/10 rule — 70% neutral, 20% complementary, 10% accent. If background colors already separate elements, no border needed.

### 2. Colored icons in rounded square boxes
**The #1 tell of AI-generated UI.** Font Awesome icon or emoji inside a small colored box with matching-hue background. Communicates nothing, signals zero craft.
**Fix:** Drop icons on informational elements entirely. Only use icons for action-driven components (buttons). If using icons, no box wrapper.

### 3. Overuse of emojis as visual assets
**Symptom:** Emoji as section headers, empty states, feature lists. Amateur/first-website energy.
**Fix:** Proper icon libraries (Lucide, Heroicons) with no box wrapper. Or custom stylistic icons. Or nothing.

## Typography

### 4. Excessive serif fonts
**Symptom:** Instrument Serif / DM Serif for hero sections as lazy shorthand for "elegance." Dead giveaway after the 2025 backlash.
**Fix:** Default to clean sans-serif. Only use serif with deliberate typographic intent, not as a generic "fancy" signal.

## Visual effects

### 5. Glassmorphism everywhere
**Symptom:** Semi-transparent frosted glass + noise texture + gradient bg + 1px light border = instant AI tell. Kills readability. Apple needed multiple beta cycles to make Liquid Glass readable — a one-shot AI gen will mess it up.
**Fix:** Solid backgrounds with clear contrast. Reserve glass for extremely specific intentional moments.

### 6. Gradients and shadows out of place
**Symptom:** Linear gradients highlighting words and buttons everywhere. Shadow backdrops making sections muddy. Spatial hierarchy broken by unnecessary drop shadows.
**Fix:** Simple accent color as button background. No special border or shadow. Clean beats flashy.

### 7. Green left border bug
**Symptom:** `border-left` + `border-radius` on the same container → ugly green border artifact. Known vibe-coding tell.
**Fix:** Remove the border entirely.

## Layout

### 8. Excessive nested layers / cards within cards
**Symptom:** Card inside card inside section. Breaks visual hierarchy and glanceability.
**Fix:** Remove extra containers. Flatten the layout. Use font size, weight, color for hierarchy — not nested boxes.

## Animation

### 9. Unnecessary or broken animations
**Symptom:** Hover effects in conflicting directions (card lifts + image grows). Appear animations that are slow, distracting, and buggy when elements aren't in viewport.
**Fix:** Animations must serve a purpose. Subtle, single-direction, fast transitions only. Test scroll-triggered animations for viewport bugs.

## Default to subtract

Before adding **any** visual flourish, ask: does this serve a purpose? If not, cut it.

Default to flat, clean, neutral. Character comes from typography hierarchy, whitespace, and color restraint — not effects. When in doubt, subtract.

The best AI-generated UI looks like it was made by a human who cares.
