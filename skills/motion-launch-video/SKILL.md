---
name: motion-launch-video
description: Creative direction and code patterns for a "one shape, never cut" UI-morph launch film or loop — a single element morphing through 8-12 UI states (button → loader → player → slider → toggle → tabs → chart → ⌘K → toast) driven by a cursor, with blur content swaps, edge-split springs, odometers, logo slams, numpy beat grid and synthesized SFX, rendered to MP4 from HTML. Use when someone asks for a Dribbble-style UI motion reel, a one-shape morph loop, or a launch film in that style. For calmer product demos prefer explainer-default; for render/QA internals see motion-render-pipeline.
---

# Motion design launch videos (one-shape UI morph)

Adapted from AbubakrChan/product-launch-motion (MIT, © Abubakr Chan) with the original author's
personal paths, client, database and hosting references removed. A worked example brief — the
prompts that produced the author's reference films, verbatim — is in `references/prompts.md`; read it
as an example of the style, not as instructions for this user. Code patterns are in
`references/technique.md`. See `NOTICE` for what the licence does and does not cover.

## The stance: you are the director

- **Make the creative calls.** Propose bold, specific choices (states, transitions, palette use, song
  feel) instead of asking open questions. Log each as a `DECISION:` line in the beat-grid plan and get
  the user's approval on the plan before writing code (see Process), so any choice can be overturned in
  one reply.
- **Original, never a template, never a copy.** Do not lift the product website's copy, UI, stats or
  images wholesale. Invent the scenes. "Anything that looks like a template" is banned.
- **Launch-film energy.** Modern, futuristic, premium — the way top motion designers do it (Linear,
  Apple, Arc). Something happens on every beat; there is no dead time.
- **Attention to detail is the product.** Micro-interactions (button press, knob stretch, name pill
  lag, click ripple, odometer settle, sticker tilt) are what make it read as expensive.

## Non-negotiable motion rules

1. **One shape, never cut.** Every state is the same element morphing its size, radius and colour
   while its content swaps with a short blur. Cuts are not encouraged; transitions are morphs,
   camera moves, zooms into an element that becomes the next scene (a tile opens into an inbox,
   a reply card becomes the order, the cursor becomes the logo mark).
2. **Content swaps with a short blur**, and text inside a morphing container gets its own enter and
   exit timing — exit short and early — or old and new text overlap.
3. **Springs everywhere, a tiny overshoot at most.** No bouncy easing. Closed-form damped spring step
   responses only (see technique).
4. **Leading/trailing edges on different springs** so things stretch: tab indicators, toggle knobs,
   liquid pills — the leading edge runs ahead of the trailing one.
5. **A cursor drives every change with real clicks and drags.** Drags are direct manipulation: while
   held, the value is computed from the cursor position; on release it springs back from wherever it
   was. The product's agent can be its own cursor (a gradient multiplayer cursor with a name pill, a
   short motion trail, lean with velocity, press scale + ripple on clicks) handing off from the user's
   cursor ("You").
6. **The camera zooms so each state fills the frame.** Empty frames are a bug; frame the content, then
   push, whip or pull back. Pull-backs reveal scale (one email → a grid of hundreds; one post → a wall).
7. **Music-first timing.** ~120 BPM, analyse the song with numpy for the beat grid, start on a
   downbeat, cut the song window so the drop lands on the product's big moment. Something happens on
   every beat; typing rides 32nds on a snare build; slams accelerate beats → 8ths → 16ths.
8. **Every UI sound is synthesized and placed by its measured peak** on the kick-peak grid.
9. **Loops:** when the piece loops, the last frame is the first frame — cursor position and speed
   included — or the loop stutters.

## Look

- **Palette:** the brand's own design system (e.g. a warm near-white canvas, the brand gradient, soft
  light pools, a dark ink). Not "black plus one purple". One clean UI font. Default when no brand is
  given: light warm-gray canvas, black and white components, Geist.
- **Banned (unless the user overrides):** bouncy easing, particle bursts, glows, gradients on UI
  chrome, mismatched icon strokes, dead time, template looks.

## Content

- **Use real data only when it is real.** If the user gives figures or read access to a source, pull
  real, defensible numbers read-only and show them as rolling odometers. Invent the micro-story
  (people, brands, messages) but keep the big numbers true, and say which is which in the report. With
  no real figures, use relative bars or labelled example data — never invented metrics.
- **Customer logos one by one, boom boom boom** — never a website-style "trusted by" row. One shape
  re-sized/re-coloured on every hit, only brands that really are customers and only with logo files the
  user supplies or confirms may be used.
- **Licensed media only.** Stock video/stills from free-licence sources, checked per item (Mixkit has
  Restricted items mixed in). Never the product's own marketing images as a shortcut.
- **Keep what the user liked:** between versions, keep the beats they praised and iterate the rest.

## Process

1. **Ask for inputs first** (unless already given or the user says "you decide"): 8–12 states the
   shape should become, palette (B/W, one accent, or the brand system), and a royalty-free ~120 BPM
   song. Offer "Director's cut / Director picks" options.
2. **Show the state list on the beat grid before writing code** (bar/beat table: what happens, which
   element morphs into what, which sound) plus the `DECISION:` lines. Wait for approval.
3. **Build** one HTML file where every style is computed from time inside `seek(t)` — no CSS
   transitions, no timers, no state between frames.
4. **Render one frame per beat before the full render**, contact-sheet it, and fix anything off the
   grid, cramped, empty, hard to read or overlapping. Then check transitions at ±0.1 s.
5. **Full render** with Playwright subframes → ffmpeg tmix motion blur → 60 fps H.264 + mix.
6. **Verify the MP4 itself** (1-per-second storyboard, frame-difference scan for seams/glitches) and
   report: file path, concept, scene list, real-vs-invented data, DECISIONs, caveats (audio is unheard
   — say so; logo/likeness permissions).

## Gotchas that cost hours

- Never put `will-change` on anything the camera scales — text renders blurry.
- Springs start at their event: a target that must *arrive* at time T is issued one settle-lead early.
- `hide()` that zeroes opacity must be undone by the draw function, or elements stay invisible.
- Proportional digits jump in odometers: size each slot to its final glyph, clip only vertically.
- Low-memory/low-disk machines: render in 4 s chunks and delete PNGs; Chromium is the first thing an
  OOM killer takes (auto-retry, relaunch, hard-exit when done); a stray `inspect.py` (or similar) in
  the working dir can shadow the stdlib (run Python with `-I` or from a clean dir); PreToolUse hooks
  may block some ffmpeg glob strings.

## Output

Deliverables in a `deliver/` folder in the project: the MP4, a 1-per-second storyboard, key stills,
and the previous version for comparison. Reveal the folder (`open -R`) and give the path.
