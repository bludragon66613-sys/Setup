# DIRECTOR-BRIEF.md — fill-in brief schema

Leave any line blank → decide it yourself, note choice + one-line reason in brief.md.

```
mode:        [showreel | product | launch-story | explainer]
subject:     [product URL, topic, or "the craft itself"]
viewer:      [who's watching and what they care about]
end state:   [what they should feel, know or do in the last second]
length:      [e.g. 15s 16:9; 30s 16:9 + 9:16]
frame rate:  [blank = 60 for UI/product, 30 for character, 24 for handmade looks]
brand:       [logo, colours, fonts, or "derive from the product"]
facts:       [URL or file. The ONLY source for any claim on screen or in voice.]
assets:      [files, or "capture from the live product"]
style:       [direction or reference videos, or blank]
sound:       [music + sfx | voice + music + sfx | silent]
autonomy:    [unattended: never stop | gated: stop at each ◆]
toolchain:   [Remotion | HTML + GSAP renderer | kit repo | blank]
sign-off:    [end mark and call to action]
```

## Modes

- **showreel** — craft is the subject. One idea that keeps transforming, not an effects sampler. Show range: type, shape, UI, 3D/simulation, an organic moment, one transition worth rewinding. New composition every 1–2.5s with one or two held breaths. No fake clients, logos, metrics.
- **product** — product is hero. Real logo, real UI rebuilt as live components, every action with visible result, end on name + URL. New composition every 1.4–3.5s.
- **launch-story** — characters carry the release. Write 2–3 treatments, pick one. Characters act: readable poses, holds on faces, funny timing. One or two facts max, woven into the world.
- **explainer** — one cause and effect. Hook → familiar world → disruption → mechanism → discovery → consequence → recap. Narration 125–145 wpm; labels never repeat the narration.

## Workflow (8 steps; ◆ = gate when autonomy: gated)

1. Lock facts: `facts.json` — every claim, its exact source sentence, its URL. Collect real assets.
2. Study references + (public work) how this audience talks about the subject now.
3. Concept: 2–3 directions, pick one, name three signature moments WITHOUT effect names.
4. Storyboard table: time, on screen, purpose, audio cue, exit, what carries over. Must read with sound off. ◆
5. Style bible (≤6 colours, local fonts, textures, motion vocabulary) + three style frames rendered in code; character sheets + key poses if needed. ◆
6. Audio and timing map. Play the audio-only mix. ◆
7. Build, assemble, run the critic loop until quality bar passes.
8. Deliver. ◆ If asked, save the pipeline as a reusable skill.
```
