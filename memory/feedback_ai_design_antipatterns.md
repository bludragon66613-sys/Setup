---
name: AI Design Anti-Patterns to Avoid
description: Yuwen Lu's catalog of vibe-coded UI slop — specific patterns Claude must never generate for Rohan's projects
type: feedback
originSessionId: 3f18c1b1-9cc5-408e-b432-e9a95236da60
---
Source: x.com/yuwen_lu_/status/2041187936738447565 (Apr 6, 2026) — "Signs of vibe coded UI"

Rohan explicitly flagged this as "what you shouldn't be doing" and wants more original designs.

## COLOR

1. **Homogenous goo** — Mushing similar hues together (cyan icon in sky blue box in blue card with minty border). Follow 70/20/10 rule: 70% neutral, 20% complementary, 10% accent. No borders needed if background colors already separate elements.

2. **Colored icons in rounded square boxes** — The #1 tell of AI-generated UI. Font Awesome icon or emoji in a small colored box with matching hue background. These communicate nothing and signal zero craft.
   - **Fix:** Drop icons entirely on informational elements. Only use icons for action-driven components (buttons). If using icons, no rounded square box.

3. **Overuse of emojis as visual assets** — Almost always bad. Signals amateur/first-website energy.
   - **Fix:** Use proper icon libraries (Lucide, Heroicons) with no box wrapper. Or generate custom stylistic icons.

## TYPOGRAPHY

4. **Excessive serif fonts** — Claude loves Instrument Serif / DM Serif for hero sections as a lazy shorthand for "elegance." This is a dead giveaway of AI generation, especially after the 2025 backlash.
   - **Fix:** Default to clean sans-serif. Only use serif with deliberate typographic intent, not as a generic "fancy" signal.

## VISUAL EFFECTS

5. **Glassmorphism everywhere** — Semi-transparent frosted glass/noise texture is "the new purple gradient." Paired with gradient background + 1px light border = instant AI tell. Kills readability. Apple needed multiple beta cycles to make Liquid Glass readable — a one-shot AI generation will mess it up.
   - **Fix:** Use solid backgrounds with clear contrast. Reserve glass effects for extremely specific, intentional moments.

6. **Gradients and shadows out of place** — Linear gradients highlighting words and buttons everywhere. Shadow backdrops making sections muddy. Spatial hierarchy broken by unnecessary drop shadows.
   - **Fix:** Simple accent color as button background. No special border or shadow. Clean beats flashy.

7. **Green left border bug** — `border-left` + `border-radius` on the same container creates an ugly green border artifact. Known vibe-coding tell.
   - **Fix:** Remove the border entirely.

## LAYOUT

8. **Excessive nested layers / cards within cards** — AI creates unnecessary containers (card inside card inside section). Breaks visual hierarchy and glanceability.
   - **Fix:** Remove extra containers. Flatten the layout. Use font size, weight, and color for hierarchy, not nested boxes.

## ANIMATION

9. **Unnecessary or broken animations** — Hover effects moving in conflicting directions (card lifts up, image grows). Appear animations that are slow, distracting, and buggy when elements aren't in viewport.
   - **Fix:** Animations must serve a purpose. Subtle, single-direction, fast transitions only. Test scroll-triggered animations for viewport bugs.

## META-PRINCIPLE

**Unnecessary detail is the root of all AI design slop.** "You can add X" doesn't mean you should. Every effect, animation, gradient, shadow, border, and icon must justify its existence. Clear messages beat noise. Intention beats carelessness.

**Why:** Rohan wants billion-dollar quality, not template-tier output. These patterns signal "generated, not designed" and undermine credibility.

**How to apply:**
- Before adding ANY visual flourish, ask: does this serve a purpose? If not, cut it.
- Default to flat, clean, neutral. Add character through typography hierarchy, whitespace, and color restraint — not effects.
- Reference Cursor, Linear, Vercel, Stripe for what good looks like.
- When in doubt, subtract. The best AI-generated UI looks like it was made by a human who cares.
