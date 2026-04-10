---
name: project_kaneda_eye
description: Kaneda Eye — Tauri 2 + React screen-aware AI companion + voice command layer for agent ecosystem
type: project
originSessionId: f57b3da3-5718-407b-a03e-c25f43979546
---
# Kaneda Eye

Screen-aware AI companion + voice command layer. Tauri 2 (Rust) + React desktop app for Windows 11.

**Why:** Ports the farzaa/clicky macOS concept to Windows, integrated with Rohan's agent ecosystem (n8n, Paperclip, NERV).

**How to apply:** When working on Kaneda Eye, the project is at `~/kaneda-eye/`, repo `bludragon66613-sys/kaneda-eye` (private). Build requires `LIBCLANG_PATH="C:/Program Files/LLVM/bin"` and CMake in PATH for whisper-rs.

## Key Details
- **Location:** `~/kaneda-eye/`
- **Repo:** github.com/bludragon66613-sys/kaneda-eye (private)
- **Stack:** Tauri 2.10, React 19, Rust 1.94, whisper-rs 0.16, cpal 0.15, xcap 0.0.13
- **Design spec:** `~/kaneda-eye/docs/DESIGN.md`
- **Config:** `~/.kaneda-eye/config.toml`
- **Whisper model:** auto-downloaded to `~/.kaneda-eye/models/ggml-base.en.bin`

## Architecture
- System tray app (no taskbar), transparent overlay window
- Ctrl+Alt+Space: start recording, Ctrl+Alt+Enter: stop and process
- Audio capture (cpal) → Whisper local STT → Screenshot (xcap) → Claude vision API → Response overlay + Windows SAPI TTS
- Agent commands: Claude embeds `[ACTION:service:endpoint:payload]` tags, router dispatches to n8n (:5678), Paperclip (:3100), NERV (GitHub Actions)
- Direct Anthropic API (no OpenClaw proxy) — `ANTHROPIC_API_KEY` env var

## Build
```bash
export LIBCLANG_PATH="C:/Program Files/LLVM/bin"
export PATH="/c/Program Files/LLVM/bin:/c/Program Files/CMake/bin:$PATH"
cd ~/kaneda-eye/src-tauri && cargo check
cd ~/kaneda-eye && npx tsc --noEmit
```

## Current State (2026-04-10)
- Full scaffold complete, both Rust and TS compile clean
- **MVP implementation plan written:** `docs/superpowers/plans/2026-04-10-kaneda-eye-mvp.md` (10 tasks)
- Next step: runtime testing — run `tauri dev` and work through Tasks 1-10 to verify each component
- Phase 1 MVP: STT (whisper local), TTS (Windows SAPI), Claude vision, agent routing
- Phase 2 planned: cursor pointing, AssemblyAI streaming, ElevenLabs TTS, multi-monitor

## Dependencies installed
- LLVM 22.1.3 (provides libclang.dll for whisper-rs bindgen)
- CMake 4.3.1 (for whisper.cpp build)
