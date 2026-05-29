---
name: Infra ports
description: Local service ports + startup commands
type: reference
originSessionId: a0253b8a-0fdf-43a1-8a43-6fdcd070c60f
---
| Service | Port | Notes |
|---------|------|-------|
| OpenClaw | :18789 | AI gateway, must be running. Healthcheck: `bash ~/openclaw-healthcheck.sh` |
| n8n | :5678 | Workflow automation, sqlite at `~/.n8n/` |
| Paperclip | :3100 | Agent orchestration, managed via `pm2 restart paperclip` |
| nerv-dashboard | :5555 | Webpack dev mode, code at `~/aeon/dashboard/` |

Boot all: `bash ~/startup-services.sh` (also handles Obsidian sync, auth expiry check).
