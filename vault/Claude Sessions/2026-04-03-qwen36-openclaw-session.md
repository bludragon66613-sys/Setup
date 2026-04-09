# Session: 2026-04-03

**Started:** ~3:45am IST
**Last Updated:** 4:00am IST
**Project:** OpenClaw (Telegram AI Gateway)
**Topic:** Researching Qwen 3.6 Plus and integrating it into OpenClaw fallback chain

---

## What We Are Building

Integration of Alibaba's newly released Qwen 3.6 Plus model into the OpenClaw Telegram bot fallback chain. The goal is to add a strong free-tier coding model as the first fallback when Claude Sonnet 4.6 hits rate limits or goes down, before falling through to GPT-5.4-mini and Gemini Flash.

---

## What WORKED (with evidence)

- **OpenRouter API key added to auth-profiles.json** — confirmed by: `openclaw models list` shows `openrouter/qwen/qwen3.6-plus:free` with `Auth: yes`
- **Qwen 3.6 Plus added as fallback #1** — confirmed by: `openclaw models fallbacks list` shows it at position 1
- **Gateway restart** — confirmed by: `openclaw gateway restart` returned "Restarted Windows login item: OpenClaw Gateway"
- **Model appears in configured models** — confirmed by: `openclaw models list` shows 6 models total with Qwen in the chain

---

## What Did NOT Work (and why)

- **`openclaw models scan --provider qwen`** — failed because: requires `OPENROUTER_API_KEY` env var set globally, not just in auth-profiles. Scan is for discovery, not required for manual config.
- **`openclaw models auth paste-token` interactive mode** — failed because: piped stdin caused the interactive TUI prompt to hang on character-by-character input. Workaround: edited auth-profiles.json directly.

---

## What Has NOT Been Tried Yet

- Sending an actual Telegram message to test Qwen 3.6 Plus response quality
- Force-testing Qwen as primary (`openclaw models set openrouter/qwen/qwen3.6-plus:free`) to verify tool calling works
- Setting `OPENROUTER_API_KEY` env var globally for future `openclaw models scan` usage
- Adding paid OpenRouter tier if/when free preview ends
- Testing whether Qwen handles OpenClaw's tool calls (web search, image gen) correctly

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/.openclaw/openclaw.json` | ✅ Complete | Added `openrouter:manual` auth profile, Qwen model in fallbacks and models |
| `~/.openclaw/agents/main/agent/auth-profiles.json` | ✅ Complete | Added `openrouter:manual` token profile with API key |
| `~/.claude/projects/C--Users-Rohan/memory/project_openclaw.md` | ✅ Complete | Updated auth state, fallback chain, and Qwen notes |

---

## Decisions Made

- **Qwen 3.6 Plus as fallback #1, not primary** — reason: free tier sends data to Alibaba for training (privacy concern for Telegram messages), tool calling unverified, model just launched yesterday (April 2, 2026) so stability unknown
- **Used `:free` variant, not paid** — reason: no cost during preview, sufficient for fallback usage
- **Direct config edit over CLI** — reason: `paste-token` interactive mode doesn't work well with piped input in Claude Code's bash environment

---

## Blockers & Open Questions

- Does Qwen 3.6 Plus support OpenClaw's tool calling format? The scan couldn't probe this without the env var set. If tools don't work, web search and image features will break when Qwen handles a request.
- OpenRouter reports 195k context (not 1M) and text-only (no image input) for the free tier — is this a temporary limitation?
- When the free preview ends, will OpenRouter charge for it? Estimated ~$0.29/M input, $1.65/M output based on Alibaba Cloud pricing.

---

## Exact Next Step

Test the integration by either:
1. Temporarily setting Qwen as primary (`openclaw models set openrouter/qwen/qwen3.6-plus:free`), sending a message via Telegram, checking the response, then switching back (`openclaw models set anthropic/claude-sonnet-4-6`)
2. Or waiting for Claude to naturally rate-limit and observing the fallback behavior

---

## Research Summary: Qwen 3.6 Plus

- **Released:** April 2, 2026
- **Architecture:** Hybrid linear attention + sparse MoE (proprietary, closed-source)
- **Context:** 1M native (195k on OpenRouter free tier)
- **Benchmarks:** Terminal-Bench 2.0: 61.6 (beats Claude Opus 4.5's 59.3, below Opus 4.6's 65.4), SWE-bench Verified: 78.8
- **API:** OpenAI-compatible (`/v1/chat/completions`)
- **Providers:** Alibaba Cloud (~$0.29/$1.65 per M tokens), OpenRouter (free preview, data collected)
- **Unique feature:** `preserve_thinking` parameter for multi-turn agent reasoning

## Environment & Setup Notes

- OpenClaw gateway runs as Windows login item on port 18789
- Health check: `bash ~/openclaw-healthcheck.sh`
- Current fallback chain: `anthropic/claude-sonnet-4-6` -> `openrouter/qwen/qwen3.6-plus:free` -> `openai-codex/gpt-5.4-mini` -> `google/gemini-2.5-flash` -> `google/gemini-2.5-flash-lite`
