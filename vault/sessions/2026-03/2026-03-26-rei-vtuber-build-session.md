# Session: 2026-03-26

**Started:** ~8:20pm IST (Mar 25)
**Last Updated:** 1:50am IST (Mar 26)
**Project:** ~/companion/ (Rei VTuber)
**Topic:** Building Rei — AI VTuber + Solana token launcher + multistream engine

---

## What We Are Building

Rei is an autonomous AI VTuber that livestreams on multiple platforms (Twitch, YouTube, Kick, pump.fun) and launches meme tokens on Solana launchpads. Built on top of Project AIRI (moeru-ai/airi fork), a Vue 3 + Electron + Vite monorepo. The project was named "Rei" (fits the NERV/Evangelion family theme of Rohan's other projects).

Rei has a fully autonomous personality — she decides when to launch tokens based on chat hype, narrates launches on stream, and manages her own wallet with safety guardrails (spend caps, cooldowns, kill switch). The project spans 4 phases completed in this session: rebrand, core services, security + SDK, and full integration.

---

## What WORKED (with evidence)

- **Phase 1 Rebrand** — confirmed by: `pnpm run build:packages` (24/24 pass), `pnpm run build:web` passes. Character name "Rei" across all 9 locales.
- **solana-launcher service** — confirmed by: 49 vitest tests passing (`pnpm -F @proj-airi/solana-launcher exec vitest run`)
- **multistream service** — confirmed by: 8 vitest tests passing (`pnpm -F @proj-airi/multistream exec vitest run`)
- **Security fixes** — confirmed by: all 42 tests still pass after applying C-01→C-04, H-01→H-04 fixes
- **pump.fun SDK integration** — confirmed by: `@pump-fun/pump-sdk` v1.32.0 installed, `createV2AndBuyInstructions` wired in, test confirms it reaches RPC layer
- **IPFS metadata upload** — confirmed by: 7 new tests for Pinata uploader pass (mock fetch)
- **Dashboard pages** — confirmed by: `/solana` and `/stream` Vue pages created, typecheck passes
- **Brain → Launcher connection** — confirmed by: `token-launcher.ts` Pinia module committed, follows existing module pattern
- **Git push** — confirmed by: all 17 commits pushed to github.com/bludragon66613-sys/companion

---

## What Did NOT Work (and why)

- **Subagent rate limits** — 3 subagents hit rate limits during Phase 2 Task 2/3/4 dispatch (~11:30pm IST). Resolved by implementing directly via single larger agent dispatches that batch multiple modules together.
- **@solana/web3.js v2 API differences** — v2 dropped `Keypair`, `Connection` classes. Uses async `CryptoKeyPair` and `createSolanaRpc()` instead. The wallet module had to be adapted for v2. The pump-fun SDK still needs v1 `Keypair`, so a compatibility layer (`solana-web3-v1` alias) was added.
- **Root vitest config** — doesn't include `services/solana-launcher` or `services/multistream` as projects. Each service has its own local `vitest.config.ts`. Running tests requires `pnpm -F <package> exec vitest run`, not the root `vitest` command.
- **Declaration merging for event types** — `tsdown` bundles the `declare module './events'` augmentation but the relative path doesn't resolve from consuming packages. Workaround: `as any` casts in event handler registrations with NOTICE comments.

---

## What Has NOT Been Tried Yet

- Actually running the devnet setup script (`pnpm -F @proj-airi/solana-launcher devnet:setup`)
- Real token launch on devnet (needs funded wallet + Pinata JWT)
- Running the multistream RTMP relay with OBS
- Deploying stage-web to Vercel
- Raydium and Bonk launchpad integrations
- AI image generation for token art (could use AI Gateway)
- Telegram bot integration with Rei's personality (personality-rei.velin.md exists but not wired to telegram-bot service)
- Stream-aware launch timing (only launch when live)

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `services/solana-launcher/` (entire service) | Done | wallet, autonomy, pump-fun SDK, adapter, metadata upload, position tracker, launchpad selector, token generator, devnet scripts. 49 tests. |
| `services/multistream/` (entire service) | Done | RTMP relay, chat aggregator, Twitch/YouTube/Kick/pump-fun platforms, adapter. 8 tests. |
| `packages/server-shared/src/types/websocket/solana-events.ts` | Done | 13 solana event types via declaration merging |
| `packages/server-shared/src/types/websocket/stream-events.ts` | Done | 9 stream event types via declaration merging |
| `apps/stage-web/src/pages/solana.vue` | Done | Dashboard with wallet, autonomy, launches, positions. WebSocket wired. |
| `apps/stage-web/src/pages/stream.vue` | Done | Stream control, platform cards, chat feed. WebSocket wired. |
| `apps/stage-web/src/composables/use-solana-events.ts` | Done | Reactive composable on `useModsServerChannelStore` |
| `apps/stage-web/src/composables/use-stream-events.ts` | Done | Reactive composable on `useModsServerChannelStore` |
| `packages/stage-ui/src/stores/modules/token-launcher.ts` | Done | Brain→launcher module with hype scoring |
| `packages/i18n/src/locales/*/base.yaml` | Done | Rei personality across 9 locales |
| `packages/i18n/src/locales/*/stage.yaml` | Done | Character name "Rei" across 9 locales |
| `packages/i18n/src/locales/en/settings.yaml` | Done | "UwU" → "Rei" in 13 places |
| `apps/stage-web/index.html` | Done | Title, meta, OG tags → Rei |
| `services/telegram-bot/src/prompts/personality-rei.velin.md` | Done | Full Rei personality (crypto VTuber) |
| `docs/superpowers/specs/2026-03-25-rei-phase2-solana-streaming-design.md` | Done | Architecture spec |
| `docs/superpowers/plans/2026-03-25-rei-phase2-solana-streaming.md` | Done | Implementation plan (13 tasks) |

---

## Decisions Made

- **Name: Rei** — fits NERV/Evangelion family (NERV_02, Aeon, Kaneda), means "zero" in Japanese
- **Option A: Monorepo services** — follows existing AIRI pattern (discord-bot, telegram-bot, etc.), each service is an independent process connecting via WebSocket
- **Fully autonomous launches** — Rei decides when to launch, with guardrails (not human-triggered)
- **pump.fun as primary launchpad** — official SDK available, highest volume, best documented
- **@pump-fun/pump-sdk v1.32.0** — official SDK from pump.fun team, devnet support
- **Pinata for IPFS** — most popular for Solana tokens, simple JWT auth
- **Security: launch mutex** — prevents race condition that could bypass all spend guardrails
- **Security: optimistic spend recording** — record spend BEFORE on-chain call, not after (safer for real funds)
- **Default to devnet** — config defaults to `api.devnet.solana.com` to prevent accidental mainnet spend
- **v1/v2 Solana compat layer** — pump-sdk needs v1 Keypair, our wallet uses v2 CryptoKeyPair, bridge via `solana-web3-v1` alias
- **UnoCSS not Tailwind** — per AGENTS.md, project uses UnoCSS with class arrays
- **Dark cyberpunk theme** — zinc-950 backgrounds, cyan for Solana, purple for stream

---

## Blockers & Open Questions

- **Pinata JWT needed** — must create a Pinata account and generate JWT to unblock real token launches
- **Devnet wallet** — need to run `devnet:setup` script to generate and fund a wallet
- **pump.fun devnet support** — the SDK has a `@devnet` tag but unclear if pump.fun's program is actually deployed on devnet (may need to test on mainnet with tiny amounts)
- **Declaration merging limitation** — `tsdown` bundler doesn't propagate module augmentation correctly to consuming packages; event types need `as any` casts
- **Token-launcher module activation** — the `ingestMessage()` function needs to be called from the chat orchestrator; the wiring is documented but not yet done in a page/layout

---

## Exact Next Step

Run the devnet setup to generate a wallet and test the flow:
```bash
cd ~/companion/services/solana-launcher
pnpm devnet:setup
```
Then set `PINATA_JWT` in `.env` and run `pnpm devnet:test` to attempt a devnet token launch. This will validate the entire pipeline end-to-end.

---

## Environment & Setup Notes

```bash
# Project location
cd ~/companion

# Install deps
pnpm install

# Run solana-launcher tests
pnpm -F @proj-airi/solana-launcher exec vitest run

# Run multistream tests
pnpm -F @proj-airi/multistream exec vitest run

# Build packages
pnpm run build:packages

# Build web app
pnpm run build:web

# Dev server (web)
pnpm dev

# Devnet setup (generate wallet + airdrop)
cd services/solana-launcher && pnpm devnet:setup

# Devnet smoke test
cd services/solana-launcher && pnpm devnet:test

# Required env vars for real launches:
# SOLANA_PRIVATE_KEY — base58 secret key
# SOLANA_RPC_URL — Helius or similar (defaults to devnet)
# PINATA_JWT — from pinata.cloud for metadata upload
# TWITCH_STREAM_KEY, YOUTUBE_STREAM_KEY, etc. — for multistreaming
```

## Commit History (17 commits this session)

```
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
25ca0ffa Rebrand: AIRI→UwU→Ray→Rei across all files
(+ personality + settings commits)
```
