---
name: Paperclip Agents Activated
description: Bulk-configured all 441 Paperclip agents with claude_local adapter, resolved Windows symlink error, first successful agent heartbeat
type: project
---

## Session: Paperclip Agents Activation (2026-03-26)

### What was done

1. **Explored Paperclip adapter system** — 10 adapter types available (claude_local, openclaw_gateway, codex_local, process, http, etc.). Agents need `adapterType` + `adapterConfig` to execute.

2. **Bulk-configured all 441 agents** across 15 companies with `claude_local` adapter:
   - Model: `claude-sonnet-4-6`
   - Working dir: `C:/Users/Rohan/paperclip`
   - Timeout: 300s, max turns: 50
   - Script created: `~/paperclip/configure-company-agents.sh` (interactive, supports presets)

3. **Resolved Windows symlink EPERM error** — Paperclip creates symlinks for skill sync. Windows blocks symlinks by default.
   - Fix: Enabled **Developer Mode** (Settings → System → For Developers → ON)
   - Also: Paperclip must run from **admin PowerShell** (execution policy: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force`)

4. **First successful heartbeat** — GStack CEO agent ran successfully:
   - Status: succeeded, exit code 0
   - Cost: ~$0.57 (claude-sonnet-4-6, 820k cached input tokens)
   - Session persisted: `e01bea20-cbd4-4bac-944f-59e6f84a1e1f`

### Current State
- **Paperclip:** Running on localhost:3100 (admin PowerShell)
- **All 441 agents:** Configured with claude_local, model set, ready for heartbeats
- **Developer Mode:** Enabled (symlinks work without admin)
- **Cost per heartbeat:** ~$0.50-0.60 per agent invocation

### How to start Paperclip (Windows)
```
# Admin PowerShell required
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
cd C:\Users\Rohan\paperclip
pnpm --filter server dev
```

### Key API endpoints
- `POST /api/agents/{id}/heartbeat/invoke` — trigger agent
- `GET /api/heartbeat-runs/{runId}` — check run status
- `PATCH /api/agents/{id}` — update adapter config
- `GET /api/companies/{id}/heartbeat-runs` — list runs for company

### Next Steps
- Set monthly token budgets per company/agent to control costs
- Assign specific tasks/issues to agents before triggering heartbeats
- Consider using `openclaw_gateway` adapter for agents that should route through OpenClaw
- Create custom company templates for specific workflows
- Explore Paperclip UI at localhost:3100 for org charts, task management, governance
