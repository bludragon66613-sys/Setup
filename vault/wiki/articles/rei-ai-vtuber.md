# Rei — AI VTuber + Solana Token Launcher

> Synced from Claude Code memory — 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_rei.md`

---

Rei is an autonomous AI virtual character (VTuber) that livestreams on Twitch/YouTube/pump.fun, interacts with chat, and deploys meme tokens on Solana launchpads.

**Location:** `~/companion/`
**Repo:** `github.com/bludragon66613-sys/companion`

## Technical Foundation

Forked from moeru-ai/airi (Project AIRI). Major monorepo.

- **Stack:** Vue 3, Vite, Electron, Turborepo, pnpm, UnoCSS, Three.js, Live2D
- **Package namespace:** `@proj-airi` — do NOT rename, breaks monorepo
- **Conventions:** UnoCSS (not Tailwind), Eventa for IPC, injeca for DI, Valibot for schemas (see AGENTS.md)
- **Web build:** Vercel (`apps/stage-web`)
- **Desktop:** Electron (`apps/stage-tamagotchi`)
- **Mobile:** Capacitor (`apps/stage-pocket`)

## Character

- **Name:** Rei (rebranded from AIRI → UwU → Ray → Rei on 2026-03-25)
- **Personality:** Crypto-savvy VTuber, cyberpunk aesthetic, streams + launches tokens
- **Personality file:** `services/telegram-bot/src/prompts/personality-rei.velin.md`

## Build Phases

| Phase | Status | Key Deliverables |
|-------|--------|-----------------|
| Phase 1: Rebrand | DONE | Name → Rei across 9 locales, new personality config, build verified |
| Phase 2: Solana + Streaming | DONE | solana-launcher service, multistream service (RTMP relay), 50 tests green |
| Phase 3: SDK + Security + Dashboard | DONE | 8 security fixes, pump.fun SDK integrated, Vue dashboard pages |
| Phase 4: Full Integration | DONE | IPFS via Pinata, WebSocket-wired dashboard, Brain→Launcher connection, devnet scripts |

## Architecture

### solana-launcher service
- Wallet, autonomy engine (with guardrails), pump.fun platform, launchpad selector, position tracker, token generator
- Uses `@pump-fun/pump-sdk` v1.32.0 with `createV2AndBuyInstructions` (Token-2022)
- Default RPC: devnet for safety
- IPFS metadata upload via Pinata (`metadata-uploader.ts`)

### multistream service
- RTMP relay (ffmpeg per platform), chat aggregator
- Platforms: Twitch, YouTube, Kick, pump.fun

### Dashboard (Vue)
- `/solana` page: wallet, autonomy, launches, positions
- `/stream` page: go live, platform cards, chat feed
- Reactive via WebSocket composables

## Security Fixes Applied (Phase 3)
- Launch mutex (race condition fix)
- Private key clearing
- Input validation, config redaction
- Optimistic spend recording, stale record pruning
- Float safety margin

## Phase 5 (Next)
- Raydium + Bonk launchpad integrations
- AI image generation for token art
- OBS/ffmpeg E2E streaming test
- Stream-aware launch timing (only launch when live)
- Token performance analytics
- Telegram bot integration for Rei's personality

## Related

- [[nerv-autonomous-agent]] — Shared infrastructure patterns, same GitHub account
- [[omc-orchestration]] — OMC agents available for Rei development workflow
