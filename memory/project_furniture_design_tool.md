---
name: Furniture Design Tool (kitchenandwardrobe)
description: Next.js 16 kitchen/wardrobe layout generator — Clerk, Drizzle, Neon, Vitest, Playwright walker. Phases 4b/4c/4d/5/6/4e.1/4e.2/4e.3 shipped. 359 tests. Full loop CAD→room→style→quality-toggle→layouts→depth→fal render→Elevatex PDF quote, with async queue and single-layout retry.
type: project
originSessionId: da806e35-1870-4dcc-a6e1-0d1d52b372a2
---
- **Path:** `C:\Users\Rohan\furniture-design-tool`
- **Repo:** github.com/bludragon66613-sys/kitchenandwardrobe
- **Branch:** master (Phase 4e.3 shipped 2026-04-14)
- **Prod:** elevatex-three.vercel.app (Vercel project `elevatex`, team `bludragon66613-sys-projects`)
- **Stack:** Next.js 16 App Router, Clerk Core 3, Drizzle + Neon, Zod v4, shadcn/ui + Tailwind 4, TypeScript strict, Vitest, Playwright, `@fal-ai/client` 1.9.5, `pngjs` 7

## Hard conventions (NOT stock Next.js — read AGENTS.md first)
- Write paths use `ensureUser()` (from `@/lib/auth/ensure-user`), NOT `requireUser()`. Read-only uses `requireUser()`.
- All route handlers return `Promise<NextResponse>` explicitly.
- PATCH/POST handlers typed `req: Request` (not NextRequest). GET/DELETE may use NextRequest.
- UUID param routes use a local `UUID_RE` guard returning 404 on mismatch.
- Drizzle migrations applied via `npx dotenv-cli -e .env.local -- drizzle-kit migrate`. `drizzle/meta/` is committed.
- Tests: `tests/unit/*.test.ts` (Vitest), `tests/e2e/*.spec.ts` (Playwright). Vitest scoped to `tests/unit/**/*.{test,spec}.ts`.
- Acceptance walker: `scripts/acceptance-walk.ts` — all phase gates run through this. Walker now has **20 steps**. Steps 17 (Phase 4d render), 19 (Phase 6 expensive+ref render), and 20 (Phase 6 cheap fallback) all require live `FAL_KEY`. Step 18 (Phase 5 quote PDF) requires Neon + Clerk only.

## Phase status
- Phase 1 foundation: done
- Phase 2 CAD parsing: done
- Phase 3 room confirmation: done
- Phase 4a style picker + rule engine: done
- Phase 4b heuristic layout generator: done (13 tasks, commit 7c908f7)
- Phase 4c 3D scene + depth maps: done (11 tasks + review fixes, commit d1865ae)
- Phase 4d fal.ai rendering: done (commit 6676e12) — 10 tasks + 4 review fixes, 192/192 tests
- Phase 5 quote PDF export: done (commit 99493ed) — React PDF + Elevatex branding
- **Phase 6 render quality toggle + inspiration refs: done (2026-04-13, commit 70bced8)** — cheap/expensive per-project toggle, up to 3 reference images per project (one per layout variant), FLUX with depth controlnet + IP-adapter dispatch, cheap-mode warning banner. 12 impl commits + docs. 281 tests green, walker 20 steps.
- Phase 4e.1 rate limiting: done (2026-04-13, commit 711c1a5) — Upstash sliding window, 20 cheap + 5 expensive per user per hour, fail-closed on Upstash errors, prod guard for missing env
- **Phase 4e.2 async queue: done (2026-04-13, HEAD 9b79d3f)** — QStash enqueue + worker + polling UI, /generate returns 202, FLUX payload fixes, 343 tests green, 15 commits
- **Phase 4e.3 retry endpoint: done (2026-04-14)** — migration 0008 adds `layouts.render_error` text column; worker now stamps DEPTH_FAILED:/RENDER_FAILED: on catch and terminal-row check counts failed rows as terminal so projects no longer sit in `rendering` forever; `lib/layout/retry.ts` owns ownership + rate-limit + inspiration-ref resolution + dispatch via QStash or inline; `POST /api/projects/[id]/layouts/[layoutId]/retry` returns 202 on success with RetryError→HTTP code mapping (404/429/409/502/500); LayoutList renders a destructive-tone failed card with Retry button and a self-clearing retryAfterSec countdown; walker step 21 stamps a forced failure and verifies recovery. 359 tests across 61 files, 8 commits including one review-pass fix.
- Phase 7: candidates — per-layout SKU swap, multi-variation renders, mood-board collage refs, vision-LLM auto-describe, per-project fal cost telemetry, inspiration ref library (reuse across projects), DWG support via CloudConvert

## Full generate pipeline (as of Phase 4d)
`POST /api/projects/[id]/generate`:
1. Load project + room from Neon
2. Validate: ensureUser, style picked, room confirmed, catalog exists
3. Dispatch kitchen or wardrobe heuristic (Phase 4b) → 3 scored candidates
4. For each top layout, in parallel:
   - Build 3D scene graph (Phase 4c `lib/scene/build.ts`)
   - Rasterize orthographic depth map, encode grayscale PNG, upload to Vercel Blob → `depth_map_url`
   - Call `renderLayoutToBlob` (Phase 4d): build prompt → fal.ai depth-conditioned SDXL → download result → re-upload to our blob → `render_url`
   - Per-layout try/catch → null fallback on any failure
5. Delete-and-insert layouts row with both URLs
6. Update `projects.status = "ready"`
7. Return `{ layouts, catalogId }`

Route `maxDuration = 60` to accommodate 3 parallel fal calls (~6–15s each).

## Phase 4c architecture (`lib/scene/`)
- `types.ts` — `WALL_HEIGHT_MM = 2700`, `WALL_THICKNESS_MM = 100`, `BoxGeometry`, `Scene`, `SceneModule`, Zod schemas
- `build.ts` — `buildLayoutScene({layout, room, catalog})` extrudes room walls into 3D boxes, positions modules using inward-normal math
- `depth.ts` — `rasterizeDepthMap(scene, {size=512, paddingMm=200})` orthographic top-down, OBB projection, max-compositing, grayscale `Uint8Array`
- `png.ts` — hand-rolled 8-bit grayscale PNG encoder (IHDR/IDAT/IEND + zlib deflate + CRC32), uses `node:zlib` not pngjs
- `upload.ts` — idempotent blob key `projects/{id}/layouts/{idx}/depth.png`
- `generate-depth-map.ts` — orchestrator build→raster→png→upload
- `index.ts` — barrel

## Phase 4d architecture (`lib/render/`)
- `types.ts` — `RenderError` class, `RENDER_ERROR_CODES` tuple (FAL_KEY_MISSING, FAL_REQUEST_FAILED, FAL_RESPONSE_MALFORMED, DOWNLOAD_FAILED, UPLOAD_FAILED)
- `prompt.ts` — `buildRenderPrompt({mode, theme, style})` → string. Style phrases for the 4 real style presets: minimalist, contemporary, premium, industrial.
- `fal.ts` — `renderLayoutImage({depthUrl, prompt})`. Uses `@fal-ai/client` singleton. `ensureConfigured()` memoizes `fal.config({credentials})` (one-time init, no per-request mutation race). Endpoint configurable via `FAL_RENDER_ENDPOINT` env var, defaults to `fal-ai/fast-lightning-sdxl/image-to-image`. Response narrowed via `extractImageUrl()` (no `any`).
- `download.ts` — `downloadRenderedImage(url)`. **SSRF guard**: `assertSafeRenderUrl()` requires `https:` + hostname ending with `fal.media`, `fal.run`, or `fal.ai`. Rejects everything else.
- `upload.ts` — idempotent blob key `projects/{id}/layouts/{idx}/render.png`. Wraps `@vercel/blob.put()` in try/catch → `RenderError("UPLOAD_FAILED")`.
- `render-layout.ts` — `renderLayoutToBlob(input)` orchestrator prompt→fal→download→upload
- `index.ts` — barrel

## Phase 4d env vars
- `FAL_KEY` — required at runtime; missing → `RenderError("FAL_KEY_MISSING")` → per-layout catch → `renderUrl: null`. Unit tests mock the fal client; no key needed for `npm test`.
- `FAL_RENDER_ENDPOINT` — optional, defaults to `fal-ai/fast-lightning-sdxl/image-to-image`. Swap via env var to test other depth-conditioned models without code changes.

## Phase 4d review fixes applied (commit 6676e12)
1. SSRF guard — download.ts validates https + fal CDN allowlist
2. fal.config memoized — `ensureConfigured()` flag, one-time init
3. Test style bug — `"modern"` → `"minimalist"` in render-layout.test.ts (invalid Style value was silent because prompt mocked)
4. UPLOAD_FAILED activated — upload.ts now throws `RenderError("UPLOAD_FAILED")` on blob put rejection
- 192 tests green (189 + 2 new SSRF cases + 1 new upload error case)

## Phase 4b/4c/4c-fix/4d/4d-fix/5 commit chain (reference)
Phase 4b: a0bdcff..7c908f7 (10 commits)
Phase 4c: a5811d5..aefd03c (11 commits)
Phase 4c fix: d1865ae (single commit: idempotent depth keys + per-layout fallback + zipped iteration)
Phase 4d: 272cff2..1cb9a97 (10 commits)
Phase 4d fix: 6676e12 (single commit: SSRF + fal memo + test style + upload wrap)
Phase 5: 6ccadd1..99493ed (9 commits: deps → types → aggregator → React PDF doc → orchestrator → GET route → LayoutList download link → walker assert → docs)
Phase 5 asset: 080f157 (elevatex-logo.png)
Phase 6: 94b75dd..4e1c930 (12 commits: schema → quality lib → PATCH ext → inspiration lib → inspiration routes → prompt ext → fal dispatch → render-layout thread → generate wiring → UI components → walker 19-20 → review fixes)
Phase 6 docs: 6d30467..70bced8 (2 commits: mark complete → correct post-ship review narrative)
Phase 4e.1: ..711c1a5 (rate limiting — Upstash sliding window)
Phase 4e.2: 9e4b2ae..9b79d3f (15 commits: schema enum → qstash dep → queue lib → worker → blob fix → FLUX fixes × 3 → worker route → layouts status → generate 202 → LayoutList polling → walker polling → review fixes)
Phase 4e.2 docs: 972ca13 (this commit)

## Phase 5 architecture (`lib/quote/`)
- `types.ts` — quote error codes, `QuoteLine`, `QuoteTotals`
- `aggregate.ts` — builds quote lines from layout + catalog
- `doc.tsx` — React PDF document with Elevatex branding (uses `public/elevatex-logo.png`)
- `render.ts` — `renderQuotePdf()` orchestrator
- Route: `GET /api/projects/[id]/quote` — returns PDF stream
- UI: LayoutList has "Download quote" link per layout
- Walker step 18: asserts PDF download + content-type

## Phase 6 architecture (`lib/quality/` + `lib/inspiration/`)
- **Schema:** `render_quality` pgEnum (`cheap` | `expensive`) on projects, default `cheap`. New `layout_inspirations` table with composite PK `(project_id, variant_index)`. Migration `drizzle/0006_numerous_wiccan.sql`.
- **`lib/quality/`:** types + `getRenderQuality()` reader. `setRenderQuality` was built then deleted in review — PATCH route writes directly via `db.update`.
- **`lib/inspiration/`:** `types.ts` (InspirationError, variant regex schema), `upload.ts` (`uploadInspirationBlob` — idempotent blob key `projects/{id}/inspiration/{variant}.{ext}`, 5MB limit, jpg/png/webp), `repository.ts` (`getInspirationRefs`, `upsertInspiration`, `deleteInspiration`).
- **`lib/render/` extensions:**
  - `prompt.ts` — `buildRenderPrompt({quality, hasReference, ...})` — reference clause (kitchen vs wardrobe specific) only fires when `quality === "expensive" && hasReference === true`
  - `fal.ts` — dispatch matrix:
    - `cheap` → existing Phase 4d `fast-lightning-sdxl/image-to-image` (refs ignored)
    - `expensive` + no ref → `fal-ai/flux-general/image-to-image` with depth controlnet only
    - `expensive` + ref → `flux-general` with depth controlnet + `h94/IP-Adapter` (scale 0.7, env-overridable)
  - Env: `FAL_FLUX_ENDPOINT`, `FAL_DEPTH_CONTROLNET_PATH` (default `Shakker-Labs/FLUX.1-dev-ControlNet-Depth`), `FAL_IP_ADAPTER_SCALE`
  - `render-layout.ts` threads `{quality, referenceUrl?}` through
- **`lib/layout/generate.ts`:** loads `project.renderQuality` once; `getInspirationRefs` only called when `quality === "expensive"`; per-layout try/catch still in place
- **API routes:**
  - `PATCH /api/projects/[id]` — extended `parseProjectUpdateBody` takes `style?` and/or `render_quality?` (snake_case wire, camelCase DB). UPDATE WHERE clause is scoped to `(id, userId)` after review fix.
  - `GET /api/projects/[id]/inspiration` — list refs
  - `POST /api/projects/[id]/inspiration/[variant]` — multipart upload
  - `DELETE /api/projects/[id]/inspiration/[variant]` — remove slot
  - Error mapping: INVALID_MIME→415, FILE_TOO_LARGE→413, UPLOAD_FAILED→502, INVALID_VARIANT→400, NOT_FOUND→404, INTERNAL→500
- **UI components:**
  - `RenderQualityToggle.tsx` — client, segmented `Cheap | Expensive`, optimistic PATCH, `isSaving` guard against double-click race (added in review fix)
  - `InspirationSection.tsx` — async server component, reads refs + renders toggle + 3 slots + yellow banner when `cheap && refCount > 0`
  - `InspirationSlot.tsx` — client per-slot file picker, upload, thumbnail, remove, dimmed when cheap
  - Placed in `app/(authed)/projects/[id]/page.tsx` between StylePicker and Layouts
- **Walker steps 19-20:** step 19 toggles to expensive, uploads `tests/fixtures/sample-inspiration.jpg` (161-byte valid JPEG) into slot 0, regenerates, asserts layout 0 render reachable; step 20 toggles back to cheap, regenerates, asserts render still present (refs ignored)

## Phase 4e.2 architecture (`lib/queue/` + `lib/layout/enqueue.ts` + `lib/layout/worker.ts`)
- **`lib/queue/types.ts`** — `RenderJobPayload { projectId, variantIndex, layoutId, depthDeps }`, `RenderJobError` codes
- **`lib/queue/client.ts`** — lazy-init QStash Client from env, `resolved` flag pattern (NODE_ENV=production gotcha). Returns `Client | null` (null when `QSTASH_TOKEN` absent)
- **`lib/queue/publisher.ts`** — `publishRenderJob(payload)` → sends to QStash at `/api/workers/render-layout`; dev fallback: when client is null AND non-production, invokes worker inline synchronously
- **`lib/queue/verifier.ts`** — `verifyQStashSignature(req, body)` wraps `@upstash/qstash Receiver`; dev fallback: when signing keys absent AND non-production, returns true (logs bypass). Requires BOTH keys absent to bypass — presence of `QSTASH_TOKEN` without signing keys throws (CRITICAL review fix)
- **`lib/queue/index.ts`** — barrel
- **`lib/layout/enqueue.ts`** — `enqueueGenerate(projectId, userId)`: load + validate + score + persist layout rows (null depthMapUrl/renderUrl) + update status → `queued` + publish jobs. Extracted from `generate.ts`; rate limit check runs here
- **`lib/layout/worker.ts`** — `processRenderJob(payload)`: load row + update status → `rendering` + generateDepthMap + renderLayoutToBlob + persist URLs + last-writer-wins → `ready` transition. Per-step try/catch; failures leave null columns
- **`app/api/workers/render-layout/route.ts`** — QStash callback POST: `request.text()` for raw body → `verifyQStashSignature` → Zod parse → `processRenderJob` → 200. `runtime = "nodejs"`, `maxDuration = 120`
- **Dispatch matrix:** dev (no QSTASH_TOKEN) → inline sync fallback in publisher; prod → QStash HTTP publish → worker callback
- **`pollUntilReady(projectId, timeoutMs)`** — walker helper, polls `GET /api/projects/[id]/layouts` every 2s until `status === "ready"`, timeout 120s. Used at walker steps 14, 19, 20
- **LayoutList polling** — client component; polls every 2s while `projectStatus` in `{queued, rendering}` or any layout has null `renderUrl`; shows skeleton per null slot; stops on `ready`
- **FLUX payload fix trail (4 iterations):** `5b3e0dd` blob allowOverwrite for regen idempotency → `53ce200` controlnet_unions array shape + FLUX-native IP adapter path → `f344b75` InstantX controlnet path + image_url array → `1849de0` ip_adapters image_url as plain string (NOT array)

## Phase 4e.2 known gotchas
- FLUX endpoint must be `fal-ai/flux-general` text-to-image, NOT `/image-to-image` variant
- Controlnet path: `InstantX/FLUX.1-dev-Controlnet-Union` with `control_mode: "depth"` inside `controlnet_unions` array
- IP adapter path: `XLabs-AI/flux-ip-adapter`; `image_url` is a **plain string**, NOT an array — despite other fal.ai endpoints using arrays
- Worker auth bypass requires BOTH `QSTASH_TOKEN` absent AND `NODE_ENV !== "production"` — presence of token without signing keys is a hard error (enforced by CRITICAL review fix in `9b79d3f`)
- `next build` evaluates module-level code with `NODE_ENV=production` — queue client and verifier use the `resolved` flag pattern (lazy-first-call) to avoid throwing at build time
- FLUX walker validation (step 19) is INCOMPLETE — manual runner rerun recommended before prod deploy; unit tests cover dispatch matrix + payload shape
- ~~Depth-failed layouts leave project in `rendering` status permanently — no retry mechanism until Phase 4e.3~~ — fixed in Phase 4e.3: terminal-row check now treats `renderError IS NOT NULL` as terminal, so projects settle into `ready` even with partial failures; LayoutList exposes a Retry button per failed variant.

## Phase 6 known gotchas
- `variantIndexSchema` is `z.string().regex(/^[0-2]$/).transform(Number)` — NOT `z.coerce.number()` (empty string would coerce to 0 silently). Next.js dynamic params are always strings so regex-on-string is precise.
- Expensive mode with no reference still uses FLUX (higher cost, higher fidelity) — the toggle is the primary dispatch, refs are additive
- PATCH route handler builds a `Partial<typeof projects.$inferInsert>` and conditionally sets style/renderQuality — at least one field is required (Zod `.refine`)
- Cheap mode SKIPS the `getInspirationRefs` DB round-trip entirely (no point loading refs that will be ignored)

## Phase 4c/4d known patterns
- Per-layout try/catch → null fallback for any async pipeline step (depth, render). Single failure doesn't kill the batch; layout still persists with the failed column as NULL.
- Idempotent blob keys: `projects/{id}/layouts/{idx}/{kind}.png`. Retries overwrite, no orphan blobs.
- Zipped single-pass mapping for insert rows: materialize `layoutsWithAssets` once before delete+insert.
- `vi.resetModules()` + dynamic `import()` pattern for env-dependent module tests.

## Phase 4d deferred (explicitly out of scope → Phase 4e)
- Async queue-based rendering (Vercel Queues / Upstash QStash / Inngest)
- SSE progress / polling UI
- Per-user rate limiting on /generate
- Render retry endpoint (`POST /api/projects/[id]/retry-render`)
- Mood-board reference upload to refine rendering
- Per-layout SKU swap with re-render
- Multiple render variations per layout
- Quote PDF embedding renders (Phase 5)
- Per-project fal endpoint / cost config
- Dry-run mode for fal cost sanity-check

## Useful commands
- `npm test -- --run` — Vitest unit suite (**359 tests as of Phase 4e.3**)
- `npm run build` — green with pre-existing middleware→proxy deprecation warning (ignore)
- `npx dotenv-cli -e .env.local -- drizzle-kit migrate` — apply migrations (through 0008 applied to live Neon as of 2026-04-14)
- `npx playwright test scripts/acceptance-walk.ts` — acceptance walker (21 steps). Steps 17, 19, 20, 21 require `FAL_KEY` in env.

## Plan location
- Active phase plans: `docs/superpowers/plans/`
- Phase 4b plan: `2026-04-13-phase-4b-layout-generator.md`
- Phase 4c plan: `2026-04-13-phase-4c-scene-depth-maps.md`
- Phase 4d plan: `2026-04-13-phase-4d-ai-rendering.md`
- Phase 6 plan: `2026-04-13-phase-6-inspiration-references.md` (status: complete)
- RESUME doc: `docs/superpowers/RESUME.md` (update on phase boundary)
- README Phase checklist: `README.md`
