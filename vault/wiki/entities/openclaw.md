---
title: "OpenClaw"
type: entity
kind: platform
created: 2026-04-06
updated: 2026-04-06
---

Local AI gateway bridging Telegram (@kaneda6bot) to multiple AI model providers. Must be running at all times.

## Key Facts

- Primary model: `openai-codex/gpt-5.4`, fallback: `openai-codex/gpt-5.4-mini`
- Anthropic: expired, refresh via `refresh-openclaw-auth.bat`
- Health check: `bash ~/openclaw-healthcheck.sh`
- Gateway port: 18789, proxy port: 5557
- Telegram exec enabled

## Appears In

- [[wiki/articles/openclaw-ai-gateway|OpenClaw AI Gateway]]
- [[wiki/articles/nerv-autonomous-agent|NERV Autonomous Agent]]
- [[wiki/articles/paperclip-agent-platform|Paperclip Agent Platform]]
- [[wiki/articles/signal-consultancy|SIGNAL Consultancy]]
