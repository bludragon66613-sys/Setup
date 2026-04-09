---
name: project_dexfolioexp
description: DexFolioExp — real-time Solana DEX analytics platform, Rust backend + React frontend, forked from GPoet/dexfolio
type: project
---

DexFolioExp is a real-time Solana DEX analytics platform at ~/DexFolioExp.

**Why:** Build a DexScreener competitor with developer-first API + trader intelligence (smart money, PnL, alerts). DexScreener makes $1M+/week but has no API, no wallet tracking, no PnL.

**How to apply:**
- Repo: bludragon66613-sys/DexFolioExp (forked from GPoet/dexfolio)
- Backend: Rust 2021, Axum 0.7, TimescaleDB, gRPC (tonic/prost), 10 DEX protocol parsers, 170+ unit tests
- Frontend: Vite 6 + React 19 + TypeScript + TradingView Lightweight Charts v5 + shadcn/ui + Tailwind v4
- State: Zustand (client) + TanStack Query (server) + native WebSocket
- Brand: Warm minimalism from dexfol.io (sage green #6b8f64, dusty rose #d4c5b5, Inter + JetBrains Mono)
- Dashboard uses dark mode; marketing/landing uses light mode
- API: 9 REST endpoints + WebSocket on :8080, frontend on :5173 (Vite proxy)
- DB: TimescaleDB with 6 OHLCV continuous aggregates (1m-1d), 30-day trade retention
- Monetization: B2B API tiers ($99-$999/mo), token listing marketplace, freemium dashboard (Free/Pro $29/Power $79)
- Docs at ~/DexFolioExp/docs/ (PROJECT_BRIEF, ARCHITECTURE, BRAND_GUIDELINES, ROADMAP, MONETIZATION, DEVELOPMENT_SOP)
- Build: cargo build (compiles protos), needs protoc + OpenSSL (Windows: vcpkg paths in .cargo/config.toml)
- External deps: Shyft (gRPC + RPC), Hyperliquid (SOL/USD WebSocket), Pyth (fallback), Railway (PostgreSQL)
