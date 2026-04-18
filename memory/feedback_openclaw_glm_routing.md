---
name: OpenClaw GLM routing constraints
description: Free-tier OpenRouter caps per-request max_tokens below OpenClaw's 32k default, and config overlay cannot lower it
type: feedback
originSessionId: 782da605-29ab-4251-8411-159fa86aafc2
---
OpenClaw embedded-agent runtime sends ~32000 max_tokens per request. OpenRouter free-tier keys cap per-request max_tokens to the current credit-affordable budget (seen: ~14.5k). Result: paid GLM models (z-ai/glm-4.7, z-ai/glm-4.5) 402-fail on free keys and silently fall back to Gemini Flash — visible only with `--local` transport logs.

**Why:** `models.providers.*.models[].maxTokens` overlay cannot clamp downward — schema says merge takes the *higher* of explicit/implicit values. `agents.defaults.models.<id>.params.max_tokens` is passthrough-only and does not override the agent runtime's output budget.

**How to apply:**
- Free GLM on OpenRouter = only `z-ai/glm-4.5-air:free` works without credits. Use it as the practical "free GLM default."
- For GLM 4.6/4.7/5, require paid OR credits (≥$5) — not a config workaround.
- Ollama Cloud models (glm-5.1:cloud, qwen3.5:397b-cloud) require paid Ollama subscription (403) despite signed-in CLI.
- When routing mysteriously lands on a fallback, run `openclaw capability model run --model <id> --local --json` to see the billing/failover logs that gateway mode hides.
