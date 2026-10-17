# PROMPTS.md — paste-ready studio prompts

## 1. Reference analysis → REFERENCE.md

Prereq: `reference.mp4` in project root, `frames/` exists, overview extracted
(`ffmpeg -i reference.mp4 -vf "fps=2,scale=960:-2" frames/ref-%04d.jpg`).

```
Analyze the main product reveal in reference.mp4.
First report its dimensions, frame rate, and duration using available tools.
Extract overview images, then consecutive frames around the entrance and landing.
Inspect the extracted images with image tools.

Save REFERENCE.md with:
Source timestamps and frame numbers for entrance, landing, hold, and cut.
Object bounding boxes at start and landing, in source-image coordinates.
Movement direction, duration, scale change, opacity change, visible overshoot.
The order in which product, headline, and supporting labels appear.
The readable hold and the state carried into the next shot.

Label measured values, visual estimates, and proposed creative choices separately.
For an uncertain value, identify the frames needed to check it.

Use our assets to propose one original shot.
Specify its layout, focal point, entrance, product response, and reading hold.
List missing assets and questions requiring approval.
Return this shot plan before implementation.
```

## 2. Staged build kickoff

Prereq: BRIEF.md saved, assets in `public/`, Remotion skill installed
(`npx remotion skills add`).

```
Read BRIEF.md and the installed Remotion guidance.
Inspect public/ and confirm the required assets are available.
Summarize the opening's layout, event frames, and animation curves.
Flag any conflicting requirements or missing inputs before implementation.
Implement only the first review stage specified in BRIEF.md.
Return the stills, moving preview, changed files, and checks performed.
Wait for approval before continuing.
```

## 3. Scoped correction (four fields: location, defect, change, invariants)

Example — adapt frames and specifics:

```
Revise the Launch composition using BRIEF.md.
Observed defect: the cursor overlaps the result label at global frame 210.

Change only the cursor's post-press path:
Start the departure at 204 and reach its resting point by 210.
Choose the resting point inside the card, 24px clear of the result label.
Use a path that stays clear of the label throughout the move.
Preserve the press at 195, reveal at 210, card geometry, copy, and audio cues.
Hold the cursor at its destination through 419.

Render stills at 195, 210, 222, 240 and a preview of 180–249.
Check intermediate frames for overlap and jumps.
Report the changed path coordinates and output filenames for review.
```

## 4. Independent critique session

Open a FRESH session with BRIEF.md, the three direction stills, and extracted frames:

```
You are reviewing a launch clip against BRIEF.md. Do not propose rewrites of the brief.
Review the attached stills and frames.
Return at most five corrections, each tied to a specific global frame number,
in the four-field format: location, observed defect, one scoped change, invariants.
Order them: missing/unreadable information first, then timing, then visual detail.
```

## Render commands

```bash
# direction check (adjust frames to your timeline)
npx remotion still Launch out/opening.png --frame=60
npx remotion still Launch out/product.png --frame=240
npx remotion still Launch out/closing.png --frame=540

# scene-boundary preview
npx remotion render Launch out/transition.mp4 --frames=90-149 --codec=h264

# final
npx remotion render Launch out/launch.mp4 --codec=h264

# metadata (this Mac has no ffprobe)
ffmpeg -i out/launch.mp4
```

Gotcha: scene-local vs global frames — local frame 30 in a Sequence starting at global 120 = global 150. Always label which one a number is.
