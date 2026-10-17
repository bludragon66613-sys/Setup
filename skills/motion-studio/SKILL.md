---
name: motion-studio
description: Run a solo motion-design studio pipeline end to end — brief → storyboard → visual system → motion → sound → assembly → export. Frame-numbered Remotion briefs, still-frame review gates, scoped corrections, sound cues on event frames, and a sellable Launch Clip package. Use when building a launch video, product demo clip, or any paid/portfolio motion piece, or when the user says "motion studio", "launch clip", or wants to turn product screens into a short film. For style/taste rules defer to design-taste-frontend; for render internals defer to motion-render-pipeline.
---

# Motion Studio

Operating manual for producing short launch videos (10–30s) with Remotion + Claude Code + FFmpeg, run like a studio: every frame reproducible, every review gated, every correction scoped.

Adapted from beamnxw's "Motion Engineering with Opus 5.5" workflow (x.com/beamnxw/article/2108616740846420354) + the 10-repo studio stack.

## The pipeline (one tool per step)

| Step | Tool | Job |
|------|------|-----|
| Storyboard | Excalidraw | hook, scene order, transitions |
| Style frames | Penpot / imagegen-frontend-web skill | layout, colors, components |
| Type | Fontsource | fonts + hierarchy per scene |
| Icons | Lucide | consistent icon set |
| Assets | SVGO | clean SVGs, preserve animatable nodes |
| Motion | GSAP (web) / Remotion interpolate+spring (video) | easing, timing |
| 3D | Three.js / r3f-patterns skill | camera, lighting, depth |
| Sound | Audacity + sound-effects skill | mix, cues |
| Assembly | Remotion | scenes + audio → one composition |
| Export | FFmpeg | encode + inspect streams |

## Companion skills (already installed — route, don't duplicate)

- `motion-launch-video` — one-shape morph launch films
- `explainer-default` / `explainer-engaging` / `explainer-high-energy` — explainer formats
- `motion-render-pipeline` — deterministic seek(t), frame capture, QA, mastering
- `sound-effects` — measured sound pass
- `animate` / `apple-design` — motion decision order, springs
- `taste-skill` (design-taste-frontend) — anti-slop art direction for any web frontend
- `remotion-*` (12 official skills, installed globally) — `remotion-create` (scaffold), `remotion-best-practices`, `remotion-render`, `remotion-multimedia` (audio/video embedding), `remotion-captions`, `remotion-interactivity`, `remotion-studio`, `remotion-docs`, etc. Prefer these over `npx remotion skills add` per project.

## Core discipline: frames are the contract

Everything is addressed by **global, inclusive frame numbers** at a declared fps. Write timing in seconds first, convert at the chosen fps (0.6s entrance = 18 frames @ 30fps). Keep reference timestamps labeled with the reference's own fps.

Every scene event gets a frame: reveal, entrance end, reading hold start/end, cursor press, result reveal, cut. Each is separately editable.

## Workflow

### 1. Project setup

```bash
npx create-video --yes --blank <name>
cd <name>
npx remotion skills add    # select Claude Code → installs Remotion guidance skill
npm run dev
```

Layout: assets in `public/`, reference video at `reference.mp4`, brief at `BRIEF.md`, extracted frames in `frames/`, exports in `out/`.

Toolchain (this Mac): ffmpeg 7.1.1 + ffprobe (npm ffprobe-static, symlinked ~/.local/bin) + svgo, all global.

### 2. Reference analysis (give the reference ONE job)

Pick a reference for one thing: a card entrance, a transition, a cursor action. Extract overview at 2fps:

```bash
ffmpeg -i reference.mp4 -vf "fps=2,scale=960:-2" frames/ref-%04d.jpg
```

Then run the reference-analysis prompt in `templates/PROMPTS.md` → produces `REFERENCE.md` with measured timestamps, bounding boxes, movement params, appearance order, reading holds. Label measured vs estimated vs proposed values separately. Verify positions against extracted frames — vision estimates are approximate.

### 3. Brief (five decisions, one file)

Use `templates/BRIEF.md`. Sections: GOAL, DELIVERY AND ASSETS, LAYOUT, per-scene frame ranges, IMPLEMENTATION AND REVIEW. A shot is an **event**: starting state → cursor on action → press registers → result reveals → readable hold. Check the longest headline variant before any motion work — 3-line wrap = stop, fix copy/layout first.

### 4. Staged build with review gates

Never build everything at once. Stage 1 = opening only. Render check stills + a moving preview, inspect, approve, then continue.

```bash
npx remotion still Launch out/opening.png --frame=60
npx remotion render Launch out/transition.mp4 --frames=90-149 --codec=h264
```

Three-image direction check: one opening frame, one product-result frame, one closing frame. Ask: main text readable? result visible? anything cropped/overlapping? closing has space?

Implementation rules: all animated values from `useCurrentFrame()`; no independent CSS transitions (flicker); fixed seeds for variation; expose timing + layout constants together so one revision touches one value block.

### 5. Corrections (four fields, scoped)

Every correction prompt: **location (frame), observed defect, the one change, what must stay fixed** + stills/preview to render for proof. See correction template in `templates/PROMPTS.md`. Fix order: missing info/unreadable text → timing → visual detail. For independent critique, open a second session with brief + frames; cap at 5 frame-specific corrections per round.

### 6. Sound on event frames

Cue list beside visual events:

```
BUTTON PRESS    frame 195    click transient
RESULT REVEAL   frame 210    reveal accent
CLOSING HOLD    frame 438    music settles
```

Locate the audible hit in the waveform (lead-in silence shifts it), offset the clip to land on the visual frame. Separate tracks for SFX and music. Check loudest event + quietest cue on headphones AND phone speaker. Full pass: `sound-effects` skill.

### 7. Export + verify

```bash
npx remotion render Launch out/launch.mp4 --codec=h264
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,avg_frame_rate,duration -of json out/launch.mp4
```

Watch at normal speed. Archive approved render WITH its brief, timing table, cue list.

## Longer films

Each scene declares incoming + outgoing state (position, scale, highlighted field carries across cuts). Shared settings for fonts/palette/spacing; deliberate exceptions recorded. After local edits, inspect both neighboring boundaries. Save approved entrance/cursor/text components for reuse next launch.

## The sellable package (Launch Clip)

- One feature, one approved script
- One 20s video, 1080×1080, 30fps (600 frames)
- One cover image from an approved frame
- One revision round (timing, copy, sound), feedback tied to frame numbers
- Pilot price ~$150; extra formats/scenes/source quoted separately
- Build one complete sample with own assets before offering; time the full job
- Agree script, assets, deadline, payment, revision scope BEFORE starting; record usage + portfolio rights
- Delivery rhythm: 3 stills for direction approval → moving preview → final export

## Reading-hold math

Count from legibility, not appearance. 8 frames @ 30fps ≈ 0.27s — too short for anything. Read copy aloud at normal playback; extend holds that end before you finish. Check UI labels at phone size.
