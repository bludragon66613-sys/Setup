---
name: Mothership website build workflow
description: Reusable patterns for building cinematic Three.js marketing sites — Saul's reference-driven iteration, building blocks, debug moves
type: reference
originSessionId: 96c55c90-bf8c-450c-9ba4-f9f21b0a8ed2
---
Workflow distilled from 2 Claude.ai shares (Saul/Mothership build sessions, 2026-04-29 ingest). Full notes at `C:\Users\Rohan\mothership\docs\website-build-workflow.md`.

## Saul's prompting pattern
- Reference-first. "Make it like this URL" + 2-3 clarifying Q/A options pre-build.
- Single self-contained HTML deliverables, importmap'd Three.js, CDN fonts.
- After each build: "push further or pull back?" → user answers → next iteration.
- **Aesthetic flips trigger full rebuilds, not patches.** Conv 1 cycled 4 times: white minimal → amber CRT → Rogo enterprise → infinite 3D canvas → plexus-as-navigation.
- Self-critique trigger: when user calls out fabricated copy, Claude admits + strips immediately. Don't fight the call-out.

## Reusable Three.js building blocks
- `EffectComposer + RenderPass + UnrealBloomPass + custom radial chromatic aberration ShaderPass + OutputPass` — postprocessing chain.
- Hull-sampling functions (sampleFuselage / sampleWing / sampleTail / sampleEngine) — procedural silhouette from primitives.
- `pos = base + sin(t * freq + phase) * amp` — local drift around an anchor preserves silhouette while animating.
- HTML overlay labels via `vec.project(camera)` each frame, snap-to-cursor when within radius.
- Postprocessing strength linked to user state (warp warpE → bloom + chroma + lurch all coupled).

## How to apply
- For a new cinematic site: gather 3-5 visual references → present 2-3 aesthetic options with tradeoffs → build single HTML deliverable → iterate per "push further" cycles.
- Reuse plexus + warp scaffolding from `C:\Users\Rohan\mothership\apps\web\src\components\HeroPlexusClient.tsx`.
- Don't patch a fundamentally-wrong aesthetic. Rebuild.
- Match user's call-outs immediately. No fighting.
