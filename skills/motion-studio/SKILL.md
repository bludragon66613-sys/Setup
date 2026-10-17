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

Count from legibility, not appearance. 8 frames @ 30fps ≈ 0.27s — too short for anything. Read copy aloud at normal playback; extend holds that end before you finish. Check UI labels at phone size. Type budget: ~0.3s per word, 0.7s minimum; never over a busy picture without a plate; if the picture says it, cut the word.

## Director mode (full-film discipline)

For a complete film (not a single shot), use `templates/DIRECTOR-BRIEF.md` — fill-in brief schema with four modes (showreel / product / launch-story / explainer), composition cadence numbers, and the 8-step gated workflow. Blank line = decide yourself, log choice + reason in brief.md. Brief wins over these defaults; named kit wins over brief gaps.

### Facts discipline

`facts.json` before anything: every on-screen or voiced claim → exact source sentence + URL. Nothing invented — no fake testimonials, ratings, prices, results, real people. Generated imagery goes on screen only if brief allows, labelled as concept.

### Audio-first timing

Audio comes first; picture is cut to it.
- Detect beats → write `timing.json`: beats, the drop, voice in/out frames, key actions snapped to beats. ALL animation timing reads from it.
- Music matches energy, sits low. Never name a brand/artist in a music prompt. Trim/offset the track rather than bend the picture.
- SFX only for real on-screen events: one soft whoosh per scene change; clicks/impacts on real actions, each in its own frequency range just above the music.
- Voices: audition two per character, two takes per line. Duck music under dialogue.
- Mix ~−14 LUFS, true peak ≤ −1 dBTP. Export a music-only version.

### Craft rules (judge every shot against these)

1. Frame one is a finished picture that works as a still on a busy feed; hook lands in the first second.
2. One object/shape/word carries the film — lands on the same pixels on both sides of every handoff.
3. Transitions are made of content: the front thing moves to camera, wipes, or unfolds into the next scene. Hard cuts only when size+direction+subject match, and only on a beat.
4. One lead movement with overlapping secondaries. Nothing starts/stops all at once.
5. Speed always changes: arrive slow enough to read, leave fast. No linear easing. Anticipation, follow-through, squash & stretch, springs, arcs.
6. Every action has a visible result.
7. Type is motion, not captions: it enters, masks, reveals.
8. Vary scale and layout: macro, wide, overhead, full-frame type. Never repeat a layout.
9. Holds breathe with micro-motion; nothing freezes. Camera moves motivated; motion blur on fast ones.
10. 3D only where it explains something spatial: product-shoot lighting, camera at 35–55°, real materials, labels as HTML tracked from the scene.
11. Every effect earns its place. No decorative particles, generic gradients, stock glitches.

### Asset rules

- Capture the real product at 2×; take the logo as SVG from source. NEVER redraw a logo.
- Never show a raw screenshot as a static slab — rebuild panels/icons/text as live HTML/SVG so each part can move.
- References are for study: frame-difference pass + dense contact sheets → extract principles. Never copy footage, layouts, or music.

### Build rules

- Everything code on one timeline, pinned local fonts/assets, rendered frame-by-frame, encoded with ffmpeg. API keys in env vars.
- Render a 3–5s test end-to-end BEFORE real work.
- Every value a function of frame number. No timers, no unseeded randomness.
- Shared tokens, eases, handoff positions first; each scene its own component; builders run in parallel.
- Recompose per format rather than crop; keep 9:16 content out of platform UI zones.

### Critic loop (builder never judges own work)

After storyboard, each scene, and each full render: FRESH critic subagent that saw none of the building pulls its own frames (every 0.2s, dense around transitions), measures, returns ranked problems with timestamps, ending "ship" or "one more pass". Every full render also gets:
- **Sound-off read**: critic sees only a silent 2fps contact sheet, retells the story.
- **Sync check**: every hit/line within 1 frame of timing.json.
- **Fact check**: every word traced to facts.json.
- **Director's review**: brutal critique of what feels assembled, slow, or generic.

Fix the biggest problem first, re-render, new critic rechecks every earlier item. Log each round in `ledger.md` with before/after numbers.

### Quality bar (measured, then judged)

Measured: exact duration/size/fps · frame one finished · ≤1s frozen per 30s, no still >0.5s · text contrast ≥4.5:1, no collisions, inside safe margins · brand colours match in render · cuts and hits within 1 frame of beat · ~−14 LUFS, no clipping, effects below music and voice · understood with sound off · every claim in facts.json, generated content labelled.

Judged: a critic would put it beside the references without it looking weaker. A film with no bugs is not finished — finished means it holds up next to the best work in the genre.
