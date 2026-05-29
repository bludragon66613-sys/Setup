---
name: Active project stack
description: Live projects user works on, their roles and entrypoints
type: project
originSessionId: a0253b8a-0fdf-43a1-8a43-6fdcd070c60f
---
- **NERV_02 / Aeon** (`~/aeon`) — autonomous agent on GitHub Actions, 47 skills (intel/crypto/github/build/system). Repo `bludragon66613-sys/NERV_02`. Stack: Next.js 16, Tailwind, Anthropic SDK.
- **nerv-dashboard** — standalone Vercel dashboard. Code at `~/aeon/dashboard/`, repo `bludragon66613-sys/nerv-dashboard`. Localhost :5555 in webpack mode.
- **n8n** — local workflow automation on :5678, sqlite at `~/.n8n/`. 1,396 nodes, 2,646 templates.
- **Paperclip** (`~/paperclip`) — agent orchestration platform on :3100 via PM2. Upstream `paperclipai/paperclip`, no push access. ~38.5k symbols (15× Aeon).
- **OpenClaw** — local AI gateway on :18789 powering @kaneda6bot Telegram. Default model `qwen3.6-plus:free`. Auth profile expires ~Apr 14.
- **claudecodemem + Setup** — backup repos for agents/memory/hooks/rules.

**Why:** Multiple long-lived services run concurrently. Bootstrap order matters (`bash ~/startup-services.sh`).

**How to apply:** Before recommending changes, check which project context the user is in (cwd, git remote). Cross-cutting infra changes affect multiple — flag explicitly.
