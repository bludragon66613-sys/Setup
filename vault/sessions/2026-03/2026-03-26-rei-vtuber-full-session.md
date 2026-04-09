# Session: 2026-03-26

**Started:** ~8:20pm IST (Mar 25)
**Last Updated:** 2:15am IST (Mar 26)
**Project:** ~/companion/ (Rei VTuber)
**Topic:** Built Rei — AI VTuber + Solana token launcher + multistream engine, from naming through deployment

---

## What We Are Building

Rei is an autonomous AI VTuber that livestreams on multiple platforms (Twitch, YouTube, Kick, pump.fun) and launches meme tokens on Solana launchpads. Built on top of Project AIRI (moeru-ai/airi fork at github.com/bludragon66613-sys/companion), a Vue 3 + Electron + Vite monorepo with Turborepo, pnpm, UnoCSS, Three.js, and Live2D.

The session covered 4 phases + deployment: (1) Rebrand from AIRI to Rei across 9 locales, (2) Core services — solana-launcher and multistream, (3) Security audit + pump.fun SDK + dashboard + event types, (4) IPFS metadata upload + WebSocket wiring + brain connection + devnet scripts, then production deployment to Vercel.

Rei has a fully autonomous personality — she decides when to launch tokens based on chat hype, narrates launches on stream, and manages her own wallet with safety guardrails (spend caps, cooldowns, kill switch, launch mutex).

---

## What WORKED (with evidence)

- **Rebrand to Rei** — confirmed by: `pnpm run build:packages` (24/24), `pnpm run build:web` passes, character name "Rei" in all 9 locale files
- **solana-launcher service (49 tests)** — confirmed by: `pnpm -F @proj-airi/solana-launcher exec vitest run` — 49 passed, 6 test files
- **multistream service (8 tests)** — confirmed by: `pnpm -F @proj-airi/multistream exec vitest run` — 8 passed, 2 test files
- **Security fixes (C-01→C-04, H-01→H-04)** — confirmed by: all 42 tests still pass post-fix
- **pump.fun SDK integration** — confirmed by: `@pump-fun/pump-sdk` v1.32.0 installed, test confirms SDK reaches RPC layer
- **IPFS metadata upload via Pinata** — confirmed by: 7 new tests pass (mock fetch)
- **Dashboard Vue pages** — confirmed by: `/solana` and `/stream` pages created, typecheck passes
- **Brain → Launcher module** — confirmed by: `token-launcher.ts` Pinia module committed, follows existing module pattern
- **Vercel deployment** — confirmed by: `vercel --prod` succeeded, live at https://companion-indol.vercel.app
- **Git push** — confirmed by: all 18 commits pushed to github.com/bludragon66613-sys/companion

---

## What Did NOT Work (and why)

- **Subagent rate limits** — 3 subagents hit API rate limits during Phase 2 Task 2/3/4 dispatch (~11:30pm IST). Resolved by batching multiple modules into single larger agent dispatches.
- **@solana/web3.js v2 API differences** — v2 dropped `Keypair`, `Connection` classes entirely. Uses async `CryptoKeyPair` and `createSolanaRpc()`. The pump-fun SDK needs v1 `Keypair`, so a compatibility layer (`solana-web3-v1` alias) was added.
- **Root vitest config** — doesn't include solana-launcher or multistream as projects. Each service needs its own `vitest.config.ts`. Tests must run via `pnpm -F <package> exec vitest run`.
- **Declaration merging for event types** — `tsdown` bundles `declare module './events'` but the relative path doesn't resolve from consuming packages. Workaround: `as any` casts with NOTICE comments.
- **Vercel deploy attempt 1** — failed with "File size limit exceeded (100 MB)" because `.turbo/cache/` had large tar.zst files. Fixed with `.vercelignore`.
- **Vercel deploy attempt 2** — failed with `Could not resolve "../services/speech/pipeline-runtime"` because `.vercelignore` had `services` (no leading slash) which matched `packages/stage-ui/src/services/` too. Fixed by prefixing all ignore paths with `/` to scope to root only.

---

## What Has NOT Been Tried Yet

- Running `pnpm devnet:setup` to generate and fund a devnet wallet
- Real token launch on devnet (needs funded wallet + PINATA_JWT)
- Running the multistream RTMP relay with OBS + ffmpeg
- Raydium and Bonk launchpad integrations
- AI image generation for token art (could use AI Gateway with Gemini)
- Telegram bot integration with Rei's personality (personality-rei.velin.md exists but not wired)
- Stream-aware launch timing (only launch when Rei is live)
- Wiring `token-launcher.ts` `ingestMessage()` into the chat orchestrator (documented but not done in a page/layout)
- Token performance analytics in dashboard

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `services/solana-launcher/` (entire service) | Complete | wallet, autonomy engine, pump-fun SDK, adapter, metadata upload, position tracker, launchpad selector, token generator, devnet scripts. 49 tests. |
| `services/multistream/` (entire service) | Complete | RTMP relay, chat aggregator, Twitch/YouTube/Kick/pump-fun platforms, adapter. 8 tests. |
| `packages/server-shared/src/types/websocket/solana-events.ts` | Complete | 13 solana event types via declaration merging |
| `packages/server-shared/src/types/websocket/stream-events.ts` | Complete | 9 stream event types via declaration merging |
| `apps/stage-web/src/pages/solana.vue` | Complete | Dashboard: wallet, autonomy controls, launches, positions. WebSocket wired. |
| `apps/stage-web/src/pages/stream.vue` | Complete | Stream control, platform cards, chat feed, stats. WebSocket wired. |
| `apps/stage-web/src/composables/use-solana-events.ts` | Complete | Reactive composable on useModsServerChannelStore |
| `apps/stage-web/src/composables/use-stream-events.ts` | Complete | Reactive composable on useModsServerChannelStore |
| `packages/stage-ui/src/stores/modules/token-launcher.ts` | Complete | Brain-to-launcher module with hype+keyword scoring |
| `packages/i18n/src/locales/*/base.yaml` | Complete | Rei personality across 9 locales |
| `packages/i18n/src/locales/*/stage.yaml` | Complete | Character name "Rei" across 9 locales |
| `packages/i18n/src/locales/en/settings.yaml` | Complete | "UwU" to "Rei" in 13 places |
| `apps/stage-web/index.html` | Complete | Title, meta, OG tags all Rei |
| `services/telegram-bot/src/prompts/personality-rei.velin.md` | Complete | Full Rei personality (crypto VTuber, cyberpunk, Solana degen) |
| `docs/superpowers/specs/2026-03-25-rei-phase2-solana-streaming-design.md` | Complete | Architecture spec |
| `docs/superpowers/plans/2026-03-25-rei-phase2-solana-streaming.md` | Complete | Implementation plan (13 tasks) |
| `.vercelignore` | Complete | Scoped to root-level paths to avoid breaking nested services/ dirs |

---

## Decisions Made

- **Name: Rei** — fits NERV/Evangelion family (NERV_02, Aeon, Kaneda), means "zero" in Japanese
- **Option A: Monorepo services** — follows existing AIRI pattern, each service is an independent process connecting via WebSocket to server runtime
- **Fully autonomous launches** — Rei decides when to launch, with guardrails (not human-triggered)
- **pump.fun as primary launchpad** — official SDK `@pump-fun/pump-sdk` v1.32.0, highest volume
- **Pinata for IPFS** — most popular for Solana token metadata, simple JWT auth
- **Launch mutex (C-01 fix)** — prevents race condition that could bypass all spend guardrails
- **Optimistic spend recording (H-01 fix)** — record spend BEFORE on-chain call (safer for real funds)
- **Default to devnet** — config defaults to `api.devnet.solana.com` to prevent accidental mainnet spend
- **v1/v2 Solana compat layer** — pump-sdk needs v1 Keypair, wallet uses v2 CryptoKeyPair, bridge via `solana-web3-v1`
- **UnoCSS class arrays** — per AGENTS.md conventions, not Tailwind
- **Dark cyberpunk dashboard theme** — zinc-950 backgrounds, cyan for Solana, purple for stream
- **WebSocket composables on existing store** — built on `useModsServerChannelStore` (single shared connection), not duplicate sockets

---

## Blockers & Open Questions

- **Pinata JWT needed** — must create a Pinata account and generate JWT before real token launches work
- **pump.fun devnet support** — SDK has `@devnet` tag but unclear if pump.fun program is actually deployed on devnet; may need mainnet testing with tiny amounts
- **Declaration merging limitation** — `tsdown` bundler doesn't propagate module augmentation to consuming packages; event types need `as any` casts
- **Token-launcher module activation** — `ingestMessage()` must be called from the chat orchestrator; wiring documented but not connected in a page/layout yet
- **Dashboard pages show placeholder data** — need the server runtime running + services connected for real data

---

## Exact Next Step

Run the devnet setup to generate a wallet and test the full pipeline:
```bash
cd ~/companion/services/solana-launcher
pnpm devnet:setup
```
Then create a Pinata account at https://pinata.cloud, generate a JWT, add it to `.env` as `PINATA_JWT`, and run `pnpm devnet:test` to attempt a devnet token launch.

---

## Environment & Setup Notes

```bash
# Project location
cd ~/companion

# Install deps
pnpm install

# Run tests
pnpm -F @proj-airi/solana-launcher exec vitest run   # 49 tests
pnpm -F @proj-airi/multistream exec vitest run        # 8 tests

# Build
pnpm run build:packages   # 24/24 tasks
pnpm run build:web         # stage-web Vite build

# Dev server
pnpm dev

# Devnet wallet setup
cd services/solana-launcher && pnpm devnet:setup

# Devnet smoke test
cd services/solana-launcher && pnpm devnet:test

# Deploy to Vercel
vercel --prod

# Production URL
https://companion-indol.vercel.app
# Dashboard pages: /solana, /stream

# Required env vars for real launches:
# SOLANA_PRIVATE_KEY — base58 secret key
# SOLANA_RPC_URL — Helius or similar (defaults to devnet)
# PINATA_JWT — from pinata.cloud for metadata upload
# TWITCH_STREAM_KEY, YOUTUBE_STREAM_KEY, etc. — for multistreaming
```

## Commit History (18 commits this session)

```
679fd2a9 fix: scope .vercelignore paths to root-level only
6d3993bc feat(stage-ui): add token-launcher module connecting brain to Solana launcher
587464ee feat(stage-web): wire WebSocket events into Solana and Stream dashboards
838d01a2 feat(solana-launcher): add devnet setup and smoke test scripts
32f5ddc5 feat(solana-launcher): add IPFS metadata upload via Pinata
88e8904b feat(solana-launcher): integrate pump.fun SDK for token launches
19a2a569 security(solana-launcher): fix critical and high vulnerabilities
c7c1bbda feat(stage-web): add Solana and Stream dashboard pages
45427041 feat(server-shared): add Solana and stream event type definitions
ab2bb825 feat: complete solana-launcher and multistream service modules
590cce17 feat(solana-launcher): add wallet, autonomy engine, and pump.fun modules
b6a18ab0 feat(multistream): add RTMP relay, chat aggregator, and platform modules
8de07c5b feat(solana-launcher): scaffold service with config and entry point
a1cd2121 feat(multistream): scaffold service with config and entry point
abc6aede docs: add Phase 2 implementation plan (13 tasks)
3b8db194 docs: add Rei Phase 2 architecture spec (Solana + Streaming)
(+ rebrand commits for personality, locales, settings, index.html)
```
