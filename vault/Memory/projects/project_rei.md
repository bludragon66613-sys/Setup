---
name: project_rei
description: Rei — AI VTuber + Solana token launcher project, forked from Project AIRI (moeru-ai)
type: project
---

## Rei (~/companion/)

AI VTuber companion that livestreams and launches tokens on Solana.

**Why:** Rohan wants an autonomous AI virtual character that streams across Twitch/YouTube/pump.fun, interacts with chat, and deploys meme tokens on Solana launchpads.

**How to apply:** This is a major project. Vue + Electron + Vite monorepo (forked from moeru-ai/airi). When working in ~/companion/, follow AGENTS.md conventions (UnoCSS not Tailwind, Eventa for IPC, injeca for DI, Valibot for schemas).

### Key Facts
- **Repo:** github.com/bludragon66613-sys/companion
- **Stack:** Vue 3, Vite, Electron, Turborepo, pnpm, UnoCSS, Three.js, Live2D
- **Package namespace:** `@proj-airi` (DO NOT rename — breaks monorepo)
- **Character name:** Rei (rebranded from AIRI → UwU → Ray → Rei on 2026-03-25)
- **Personality:** Crypto-savvy VTuber, cyberpunk aesthetic, streams + launches tokens
- **Personality file:** services/telegram-bot/src/prompts/personality-rei.velin.md
- **Web build:** Vercel (apps/stage-web)
- **Desktop:** Electron (apps/stage-tamagotchi)
- **Mobile:** Capacitor (apps/stage-pocket)

### What's Done (Phase 1 - Rebrand)
- Character name → Rei across all 9 locales
- UI/project name → Rei (index.html, settings, card defaults)
- New personality config written (personality-rei.velin.md)
- Build verified: packages (24/24) + web app both pass

### What's Done (Phase 2 - Solana + Streaming, 2026-03-26)
- **solana-launcher service** (services/solana-launcher/): wallet, autonomy engine (guardrails), pump.fun platform skeleton, launchpad selector, position tracker, token generator, server-sdk adapter — 42 tests passing
- **multistream service** (services/multistream/): RTMP relay (ffmpeg per platform), chat aggregator, Twitch/YouTube/Kick/pump.fun platform modules, server-sdk adapter — 8 tests passing
- Spec: docs/superpowers/specs/2026-03-25-rei-phase2-solana-streaming-design.md
- Plan: docs/superpowers/plans/2026-03-25-rei-phase2-solana-streaming.md
- @solana/web3.js v2 (async CryptoKeyPair API, not v1 Keypair)
- All 50 tests green, 24/24 package builds pass

### What's Done (Phase 3 - SDK + Security + Dashboard, 2026-03-26)
- **Security audit** completed: 4 critical, 4 high, 5 medium fixed
  - Launch mutex (race condition), private key clearing, input validation, config redaction
  - Optimistic spend recording, stale record pruning, resume handler, float safety margin
- **pump.fun SDK** integrated (`@pump-fun/pump-sdk` v1.32.0 official)
  - Uses `createV2AndBuyInstructions` (Token-2022), v1 Keypair compat layer
  - Metadata upload (`buildMetadataUri`) is a TODO — blocks actual launches
- **Shared event types** added to server-shared (solana:* + stream:* via declaration merging)
- **Dashboard pages** (Vue): /solana (wallet, autonomy, launches, positions) + /stream (go live, platform cards, chat feed)
- Default RPC changed to devnet for safety

### What's Done (Phase 4 - Full Integration, 2026-03-26)
- **IPFS metadata upload** via Pinata (`metadata-uploader.ts`) — 7 new tests
- **Dashboard wired to WebSocket** — composables `use-solana-events.ts` + `use-stream-events.ts` built on `useModsServerChannelStore`, pages now reactive
- **Brain → Launcher** connection — `token-launcher.ts` Pinia module, hype+keyword scoring, `ingestMessage()` API
- **Devnet scripts** — `devnet-setup.ts` (keygen + airdrop) + `devnet-test-launch.ts` (smoke test)
- 49 tests passing, all pushed

### What's Next (Phase 5)
- Raydium + Bonk launchpad integrations
- AI image generation for token art
- OBS/ffmpeg streaming pipeline E2E test
- Stream-aware launch timing (only launch when live)
- Token performance analytics in dashboard
- Telegram bot integration for Rei's personality
