# Session: 2026-04-03

**Started:** ~11:30pm IST (April 2)
**Last Updated:** ~12:15am IST (April 3)
**Project:** OpenClaw (Telegram AI Gateway)
**Topic:** Gemma 4 research + OpenClaw fallback chain configuration + OpenClaw update to 2026.4.1

---

## What We Are Building

Configuring OpenClaw's model fallback chain to include free Google models as safety nets when Claude or OpenAI credits run out. Triggered by Google's release of Gemma 4 (April 2, 2026) — an open-source multimodal model family under Apache 2.0. Also updated OpenClaw from 2026.3.24 to 2026.4.1.

---

## What WORKED (with evidence)

- **Google API key added to OpenClaw** — confirmed by: `openclaw models status` shows `google:aistudio=token:AIzaSyBt...tU2Hdijo` with `Auth: yes` on both Google models
- **Fallback chain configured (3 fallbacks)** — confirmed by: `openclaw models fallbacks list` shows `openai-codex/gpt-5.4-mini, google/gemini-2.5-flash, google/gemini-2.5-flash-lite`
- **OpenAI Codex OAuth re-login** — confirmed by: `openclaw models status` shows `openai-codex:bludragon66613@gmail.com ok expires in 10d`
- **OpenClaw updated to 2026.4.1** — confirmed by: `openclaw --version` returns `OpenClaw 2026.4.1 (da64a97)`, doctor passed, gateway restarted
- **All 5 models show Auth: yes** — confirmed by: `openclaw models list` output

---

## What Did NOT Work (and why)

- **`openclaw models auth paste-token` via piped stdin** — failed because: interactive TUI prompt (clack-style) doesn't accept piped input cleanly. Workaround: edited `auth-profiles.json` and `openclaw.json` directly.
- **`openclaw models auth login --provider openai-codex` from Claude Code bash** — failed because: requires interactive TTY for OAuth browser flow. Workaround: launched via `cmd.exe /c start cmd /k` to open a separate terminal window.

---

## What Has NOT Been Tried Yet

- **Gemma 4 model in OpenClaw** — not in the catalog yet (released same day). Check periodically with `openclaw models list --all | grep -i gemma-4`. When available: `openclaw models fallbacks add "google/gemma-4-31b-it"`
- **Local Ollama with Gemma 4** — `ollama pull gemma4:26b` (MoE, ~10GB VRAM). Could configure as local fallback via OpenClaw's Ollama provider at `http://localhost:11434`
- **Testing the Google fallback in practice** — haven't actually triggered a fallback scenario to verify the Google models respond correctly through OpenClaw

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/.openclaw/openclaw.json` | ✅ Complete | Added `google:aistudio` auth profile + `openai-codex:bludragon66613@gmail.com`, fallbacks list has 3 entries |
| `~/.openclaw/agents/main/agent/auth-profiles.json` | ✅ Complete | Added `google:aistudio` token profile + new `openai-codex:bludragon66613@gmail.com` OAuth (10d expiry) |
| `~/.claude/projects/C--Users-Rohan/memory/project_openclaw.md` | ✅ Complete | Updated auth state to reflect new fallback chain, expired OpenAI note, Google auth, Gemma 4 pending |

---

## Decisions Made

- **Gemini 2.5 Flash as primary Google fallback** — reason: free, 1024K context, multimodal, tool use support, already in OpenClaw catalog. Better than waiting for Gemma 4 to land.
- **Direct file edit for auth instead of CLI paste-token** — reason: CLI interactive prompt doesn't work from non-TTY environments. Direct edit to JSON is equivalent.
- **Updated OpenClaw to 2026.4.1** — reason: fixes the exact `refresh_token_reused` OAuth bug that was affecting the OpenAI Codex profile, plus many other improvements.

---

## Blockers & Open Questions

- **Gemma 4 catalog availability** — when will `google/gemma-4-31b-it` appear in OpenClaw's model catalog? Check with `openclaw models list --all | grep gemma-4`
- **OpenAI Codex old profile** — `openai-codex:default` still exists with expired OAuth (0m). Could clean up, but harmless since the new `openai-codex:bludragon66613@gmail.com` profile takes precedence.

---

## Exact Next Step

Periodically check if Gemma 4 is in the OpenClaw catalog:
```bash
openclaw models list --all | grep -i gemma-4
```
When it appears, add it to the fallback chain:
```bash
openclaw models fallbacks add "google/gemma-4-31b-it"
```

---

## Environment & Setup Notes

- OpenClaw 2026.4.1 running on Windows 11 as login item on port 18789
- Gateway auth: token-based loopback
- Google AI Studio API key: free tier, no expiry, get new keys at https://aistudio.google.com/apikey
- OpenAI Codex OAuth expires ~April 13, 2026 — re-login via `openclaw models auth login --provider openai-codex` in Windows Terminal
