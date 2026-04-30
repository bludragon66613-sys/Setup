---
name: r3f-patterns
description: React Three Fiber + drei + postprocessing + gltfjsx — production patterns for declarative 3D on the web. Covers Canvas setup, frameloop modes, useFrame/useThree/useLoader, drei abstractions (Environment, Float, Bounds, ScrollControls, Text, Instances, ContactShadows), postprocessing chain (Bloom, DoF, Vignette, Noise), GLB pipeline (gltfjsx → Draco/KTX2), perf rules, Next.js SSR gotcha, accessibility fallbacks, prefers-reduced-motion.
---

# r3f-patterns

React-Three-Fiber is a React renderer for three.js. JSX `<mesh />` becomes `new THREE.Mesh()` at runtime — zero overhead vs. plain three. Pair: `@react-three/fiber@8 ↔ react@18`, `@react-three/fiber@9 ↔ react@19`.

## When to Activate

- Any 3D scene, hero, product configurator, scroll-driven WebGL surface
- GLB/GLTF model embed (use gltfjsx pipeline, never raw `useLoader`)
- Postprocessing pass on existing R3F scene
- Perf debugging: stuck at 60fps idle / janky scroll / hot GPU
- Accessibility / fallback for users without WebGL or with reduced-motion
- Reviewing R3F PR: spot scope creep, naive `frameloop="always"`, missing Suspense

## Install

```bash
npm install three @types/three @react-three/fiber
npm install @react-three/drei @react-three/postprocessing
# Optional
npm install @react-three/rapier      # physics
npm install @react-three/xr          # WebXR / VR
npm install -D @react-three/gltfjsx  # CLI used via npx
```

## Canvas — Authoritative Prop Reference

| Prop | Default | Notes |
|------|---------|-------|
| `gl` | `{}` | WebGLRenderer props. Sync or async callback |
| `camera` | `{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }` | Or pass own `THREE.Camera` |
| `shadows` | `false` | `true` = PCFsoft, or `'basic' \| 'percentage' \| 'soft' \| 'variance'` |
| `raycaster` | `{}` | Default raycaster props |
| `frameloop` | `'always'` | `'always' \| 'demand' \| 'never'` — see perf rules |
| `dpr` | `[1, 2]` | Pixel ratio. Clamp range, never raw `window.devicePixelRatio` |
| `orthographic` | `false` | Replace default perspective camera |
| `linear` | `false` | Off = sRGB + gamma correction (default). On = raw linear |
| `flat` | `false` | On = `NoToneMapping`. Off = `ACESFilmicToneMapping` |
| `legacy` | `false` | Three r139+ ColorManagement |
| `eventSource` | `gl.domElement.parentNode` | HTMLElement events bind to |
| `eventPrefix` | `'offset'` | Pointer x/y prefix |
| `resize` | `{ scroll: true, debounce: { scroll: 50, resize: 0 } }` | Responsive |
| `onCreated` | `(state) => {}` | Post-mount, pre-commit hook |
| `onPointerMissed` | `(event) => {}` | Click outside any mesh |

## Core Hooks

```jsx
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'

// Subscribe to render loop. delta = seconds since last frame.
useFrame((state, delta, xrFrame) => { ref.current.rotation.x += delta })

// Priority — runs in order. Use for manual render passes.
useFrame((state, delta) => { /* ... */ }, 1)

// Read state. Selector form avoids re-render churn.
const camera = useThree((s) => s.camera)
const invalidate = useThree((s) => s.invalidate)
const size = useThree((s) => s.size)  // { width, height, top, left }

// Load + suspend. Cached automatically. Wrap parent in <Suspense>.
const texture = useLoader(THREE.TextureLoader, '/img.jpg')
const gltf = useLoader(GLTFLoader, '/model.glb')  // prefer useGLTF from drei
```

## Minimal Scene

```jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'

function Box(props) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  useFrame((_, delta) => (ref.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default () => (
  <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 0, 5], fov: 50 }}>
    <ambientLight intensity={Math.PI / 2} />
    <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
    <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
  </Canvas>
)
```

## drei — Helpers Catalog

`@react-three/drei` is the helper layer. Always reach for drei before writing raw three.

**Cameras & Controls** — `PerspectiveCamera`, `OrthographicCamera`, `CubeCamera`, `CameraControls`, `OrbitControls`, `ScrollControls`, `KeyboardControls`, `PresentationControls`

**Asset Loading** — `useGLTF`, `useTexture`, `useFBX`, `useKTX2`, `useProgress`, `<Loader />` (full-page progress bar)

**Staging** — `Environment` (HDRI), `Stage` (one-line studio lighting), `Backdrop`, `Sky`, `Stars`, `Cloud`, `Float` (idle motion), `Center` (auto-center), `Bounds` (fit-to-view), `ContactShadows`, `AccumulativeShadows`

**Materials** — `MeshReflectorMaterial`, `MeshDistortMaterial`, `MeshTransmissionMaterial` (glass), `MeshWobbleMaterial`, `MeshRefractionMaterial`

**Performance** — `<Instances>` / `<Instance>`, `<Merged>`, `<Points>`, `<Segments>`, `<AdaptiveDpr>`, `<PerformanceMonitor>`, `<Bvh>` (faster raycasting), `<Detailed>` (LOD), `<Preload all>`, `<BakeShadows>`

**Effects & Abstractions** — `<Text>` (SDF text), `<Text3D>` (extruded geometry), `<Html>` (DOM overlay in 3D), `<Billboard>`, `<Outlines>`, `<Edges>`, `<Trail>`, `<Decal>`, `<MarchingCubes>`, `<AsciiRenderer>`

**Portals & Multi-View** — `<View>` (multi-viewport — multiple scenes, one Canvas), `<RenderTexture>`, `<Hud>` (overlay layer), `<MeshPortalMaterial>` (portal effect)

### Drei one-liners worth memorizing

```jsx
import { Environment, Float, Bounds, ContactShadows, OrbitControls, useGLTF } from '@react-three/drei'

<Canvas>
  <Environment preset="city" />               {/* Free studio lighting + reflections */}
  <Bounds fit clip observe margin={1.2}>      {/* Auto-fit camera to children */}
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <Model />
    </Float>
  </Bounds>
  <ContactShadows position={[0, -1, 0]} opacity={0.4} blur={2} />
  <OrbitControls makeDefault enableDamping />
</Canvas>
```

## GLB Pipeline (the only correct way)

Never load GLB with raw `useLoader(GLTFLoader, ...)` on a real product. Run gltfjsx — produces a typed JSX component, prunes empty groups, optionally Draco-compresses + WebP-encodes textures.

```bash
npx gltfjsx model.glb --transform --types --shadows
# Produces Model.tsx + model-transformed.glb (Draco + KTX2 + WebP, 70-90% smaller)
```

```tsx
// Generated Model.tsx — drop into scene
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/model-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.body.geometry} material={materials.metal} />
    </group>
  )
}

useGLTF.preload('/model-transformed.glb')  // Preload outside render
```

**gltfjsx flags worth knowing:**

| Flag | Purpose |
|------|---------|
| `--transform`, `-T` | Draco + prune + texture resize (use almost always) |
| `--types`, `-t` | TypeScript output |
| `--shadows`, `-s` | castShadow + receiveShadow on meshes |
| `--instance`, `-i` | Auto-instance re-occurring geometry |
| `--instanceall`, `-I` | Instance every geometry (cheap re-use) |
| `--keepnames`, `-k` | Don't sanitize node names (when designer named them deliberately) |
| `--draco`, `-d` | Path to Draco binary (if non-default) |
| `--resolution`, `-R` | Texture resize ceiling, default 1024 |
| `--simplify`, `-S` | Mesh decimation. Pair with `--ratio` and `--error` |

## Postprocessing

```jsx
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing'

<Canvas>
  <Scene />
  <EffectComposer>
    <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
    <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} intensity={0.4} />
    <Noise opacity={0.02} />
    <Vignette eskil={false} offset={0.1} darkness={1.1} />
  </EffectComposer>
</Canvas>
```

Effects share render passes — order matters (DoF before Bloom before grain). Full catalog at https://docs.pmnd.rs/react-postprocessing — covers ChromaticAberration, ToneMapping, GodRays, SSAO, SSR, Glitch, Pixelation, Outline, SelectiveBloom and more.

**Restraint rule:** ≤ 3 effects on production sites. Bloom + Vignette + grain is plenty for 90% of hero scenes. DoF kills mobile.

## Performance Rules (non-negotiable)

1. **Default to `frameloop="demand"`** on hero/marketing scenes. Static scene = no frames burned. Call `invalidate()` after any prop mutation that should trigger a redraw. Camera controls (drei `OrbitControls`, `CameraControls`) call `invalidate` automatically when paired with `makeDefault`. *invalidate() requests a frame, does not render synchronously.*
2. **Clamp `dpr={[1, 2]}`** — never `window.devicePixelRatio` raw. 4K phones will burn the GPU otherwise.
3. **Reuse geometry + material** across meshes. `useLoader` caches; share a single `boxGeometry` ref instead of `<boxGeometry>` per mesh.
4. **Instance >100 of the same thing** — drei `<Instances>` / `<Instance>` collapses N draw calls to 1.
5. **LOD with `<Detailed>`** — far objects render lower-poly proxies.
6. **`<PerformanceMonitor>` + `regress()`** — drop quality during scroll/orbit, restore on idle. Built-in `<AdaptiveDpr pixelated />` for the dpr knob.
7. **Wrap loads in `<Suspense fallback={<Loader />}>`**. Use drei `<Preload all />` after first interaction to warm caches.
8. **`<Bvh>`** wraps your scene → faster raycasting (pointer events) on dense geometry.
9. **`shadows={false}` by default.** Shadows are ~2x cost. Use drei `<ContactShadows>` (cheap fake) for grounding.
10. **`flat` for stylized / non-realistic.** Skip `ACESFilmicToneMapping` overhead.
11. **`useFrame` priority param** — split render across multiple frames using priority order. Bigger number = later.
12. **React 18 `startTransition`** for expensive scene updates — keeps 60fps.

## Next.js / Vite Gotchas

- **Next.js App Router:** mark the Canvas component `'use client'`. Then `dynamic(() => import('./Scene'), { ssr: false })` if anything inside touches `window`/`document` at module scope. Three SSRs poorly.
- **Vite:** works out of the box. For GLB/HDR/EXR add to `assetsInclude` if importing as URLs.
- **Turbopack/webpack:** GLB and HDR may need explicit `file-loader` or `assetsInclude: ['**/*.glb', '**/*.hdr']`.
- **Hydration:** Canvas content must render client-only OR be deterministic. Random positions = hydration mismatch. Seed the RNG or generate inside `useEffect`.

## Accessibility & Fallback

- Wrap Canvas in container with `role="img"` and a meaningful `aria-label` describing the scene.
- Always render a non-WebGL fallback for the same surface (poster image, video, or static SVG). Detect via the `WEBGL.isWebGLAvailable()` helper from three or fail-safe Suspense boundary.
- **`prefers-reduced-motion: reduce`** — disable `Float`, slow `useFrame` rotations to zero, freeze `OrbitControls.autoRotate`, drop postprocessing animations:

```jsx
const reducedMotion = useReducedMotion()  // framer-motion or own hook
useFrame((_, delta) => {
  if (reducedMotion) return
  ref.current.rotation.y += delta * 0.2
})
```

- `@react-three/a11y` provides actual focusable elements + screen-reader labels for 3D objects when needed (button-in-3D, navigation-in-3D).

## Pmndrs Ecosystem (extended)

- `@react-three/uikit` — WebGL-rendered Tailwind-style UI inside the scene
- `@react-three/rapier` — physics (Rust port, fast)
- `@react-three/cannon` — older physics binding, web worker
- `@react-three/xr` — VR/AR controllers, hand tracking
- `@react-three/csg` — boolean geometry ops
- `@react-three/flex` — flexbox layout in 3D
- `@react-three/offscreen` — render in a worker
- `@react-three/test-renderer` — node-side unit tests
- `@react-three/gpu-pathtracer` — realistic offline-quality path tracing
- `lamina` — layer-based shader materials (no GLSL)
- `react-spring` — spring physics for r3f props (`useSpring`, then animate `<a.mesh>`)
- `framer-motion-3d` — declarative motion API for r3f
- `leva` — GUI dev panel for tuning props live
- `maath` — math helpers (easings, random, vectors)
- `zustand` / `jotai` / `valtio` — state for the scene (avoid prop-drilling refs)

## Anti-Patterns (auto-fail in review)

1. `frameloop="always"` on a static hero scene → cooks the GPU on idle laptops
2. Raw `useLoader(GLTFLoader, ...)` for production GLB → no Draco, no caching pattern, no reuse
3. `dpr={window.devicePixelRatio}` unbounded → 4K screens burn
4. `<EffectComposer>` with 6+ effects "because they look cool" → mobile dies
5. Inline `<boxGeometry>` repeated 1000× → should be `<Instances>`
6. `shadows` on without measurement → silent 2× cost
7. No `<Suspense>` around `useGLTF` → blank screen + error in console
8. Missing fallback / prefers-reduced-motion → fails accessibility audit
9. Canvas inside SSR component without `dynamic({ ssr: false })` on Next → hydration crash
10. Building entire scene in one component (1000+ lines) → use `<group>` + sub-components

## Self-Critique Before Ship

- [ ] `frameloop="demand"` if scene is mostly static
- [ ] `dpr={[1, 2]}` clamped
- [ ] GLB went through `gltfjsx --transform`
- [ ] `<Suspense>` boundary with `<Loader />` fallback
- [ ] postprocessing capped at ≤ 3 effects, ordered DoF → Bloom → grain
- [ ] `prefers-reduced-motion` respected
- [ ] non-WebGL fallback present
- [ ] `aria-label` on Canvas container
- [ ] FPS measured on mid-tier laptop + iPhone SE — passes 60 / 30 respectively
- [ ] Bundle delta < 200KB gzip from r3f-core; full drei tree-shakes per import
- [ ] No `console.warn` from three or r3f at runtime

## Sources

- [pmndrs/react-three-fiber README](https://github.com/pmndrs/react-three-fiber) — install, ecosystem table, peer-version pairing
- [r3f Canvas API](https://r3f.docs.pmnd.rs/api/canvas) — Canvas prop table verbatim
- [r3f Performance Scaling](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — on-demand, instancing, regress, LOD
- [pmndrs/drei](https://github.com/pmndrs/drei) — helper catalog
- [pmndrs/react-postprocessing](https://github.com/pmndrs/react-postprocessing) — EffectComposer pattern
- [pmndrs/gltfjsx](https://github.com/pmndrs/gltfjsx) — CLI flags + workflow
