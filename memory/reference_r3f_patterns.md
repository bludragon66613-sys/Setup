---
name: reference_r3f_patterns
description: r3f-patterns skill at ~/.claude/skills/r3f-patterns/SKILL.md — wired into super-designer + ui-ux-architect + design-mastery for any React Three Fiber / WebGL / 3D surface
type: reference
originSessionId: 1cedc7e5-9e87-4f28-8eea-14c6820819dc
---
`r3f-patterns` skill at `~/.claude/skills/r3f-patterns/SKILL.md`.

**Coverage:** R3F core (Canvas props verbatim from r3f.docs.pmnd.rs/api/canvas, useFrame/useThree/useLoader, JSX three primitives) + drei (cameras, controls, ScrollControls, Environment, Float, Bounds, ContactShadows, Instances, Text, View, Detailed, PerformanceMonitor, AdaptiveDpr, Bvh) + postprocessing (EffectComposer, Bloom, DoF, Noise, Vignette, ordering rule) + gltfjsx CLI (`--transform --types --shadows --instanceall`, all flags) + perf rules (frameloop="demand"+invalidate, dpr clamp, instancing, LOD, regress, Suspense+Preload, prefers-reduced-motion) + Next.js SSR gotcha + accessibility fallback + 10 anti-patterns + self-critique checklist + ecosystem (rapier, xr, uikit, csg, flex, offscreen, a11y, gpu-pathtracer, react-spring, framer-motion-3d, leva, maath).

**Wired into:** `super-designer.md` (frontmatter skills + 3D section + skill invocation guide line, "mandatory for any R3F surface"), `ui-ux-architect.md` (frontmatter skills + audit dimension for 3D/WebGL surfaces + skill invocation guide), `design-mastery.md` (frontmatter skills).

**Sources:** pmndrs/react-three-fiber README (gh CLI), r3f.docs.pmnd.rs Canvas API + scaling-performance, pmndrs/drei README, pmndrs/react-postprocessing README, pmndrs/gltfjsx README. All verbatim where possible — no fabricated APIs.

**Use when:** any project depends on `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, contains `.glb`/`.gltf` assets, or user asks for 3D / WebGL / scroll-driven scene. Mothership apps/web is current consumer.
