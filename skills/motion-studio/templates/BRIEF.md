# BRIEF.md — Launch Clip template

Replace bracketed fields. Coordinates, colors, timing are starting choices — review against real product screens. All frame numbers global, inclusive.

```
GOAL
Demonstrate how [product] [does the one action].
Viewer: [who uses this feature].
Opening copy: [outcome, maximum eight words].
Closing copy: [one next action and destination].

DELIVERY AND ASSETS
Composition: Launch, 1080 by 1080, 30 fps, 600 frames.
All timeline numbers below are global, inclusive frame numbers.
Assets under public/: [logo], [product screen], [result screen], [font], [audio].
Inspect asset dimensions and font loading before implementation.
Request missing screens or illegible crops before proceeding.

LAYOUT
Coordinates use the canvas top-left as origin; units are pixels.
Background [#101318], primary text [#F5F7FA], accent [#8AD8B0].
Keep essential content inside a 64-pixel outer margin.
Headline box: x96, y112, width 888; 64px font, 1.1 line height, max two lines.
Product card: x120, y350, width 840, height 480, corner radius 24.
Fit the supplied screen while keeping the action control readable.
Record button and result anchors from the fitted screen.
Layer order: background, card, product content, cursor, headline.

OPENING: FRAMES 0–119
Headline enters 0–18: vertical offset 24→0, opacity 0→1.
Card enters 18–42: vertical offset 60→0, opacity 0→1.
Cubic ease-out, clamped endpoints, both entrances.
Hold settled layout 42–119.

PRODUCT: FRAMES 120–419
Carry card into frame 120 at exact settled position and scale.
Cursor moves to measured button anchor 150–180 (path clear of text; record waypoints).
Press at 195: cursor scale 1 at 192 → 0.92 at 195 → 1 at 201.
Button response at 195 (supplied asset or approved accent overlay).
Cursor departs to clear resting point 204–222.
Result state appears at 210; reveal finished by 234.
Result readable and stationary through 419.

CLOSING: FRAMES 420–599
Cut to logo and closing copy at 420.
Closing copy fades in 420–438; hold through 599.

IMPLEMENTATION AND REVIEW
Drive animated values from useCurrentFrame; expose timing and layout constants.
Fixed seeds for any variation; camera stationary this pass.
If audio supplied: audible click on 195, reveal hit on 210.
STAGE 1: build opening only. Render frames 0, 18, 42, 60, 119 + moving preview.
Check wrapping, margins, screen readability, settled positions. Wait for approval.
STAGE 2 (after approval): remaining scenes. Inspect frames 120, 195, 234, 419, 420, 540, 599.
```

Timeline reference table (keep next to brief):

```
4.0s   frame 120   Product visible, card settled
5.0s   frame 150   Cursor approaches action
6.0s   frame 180   Cursor reaches button
6.5s   frame 195   Press registers
7.0s   frame 210   Result appears
7.8s   frame 234   Result label fully readable
14.0s  frame 420   Closing shot begins
```
