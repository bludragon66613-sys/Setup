---
name: n8n Workflow Automation
description: n8n local instance on :5678 + n8n-mcp server for Claude Code workflow automation, installed 2026-04-10
type: project
originSessionId: 2adfc388-7506-404c-8f66-1cd1ed4d7653
---
## n8n Setup (Installed 2026-04-10)

**Version:** 2.15.0
**Port:** 5678
**Binary:** `node "$HOME/AppData/Roaming/npm/node_modules/n8n/bin/n8n" start`
**Data:** `~/.n8n/` (SQLite database)
**Logs:** `/tmp/n8n.log`

## n8n-mcp (MCP Server)

Configured in `~/.claude/.mcp.json` as `n8n-mcp` (stdio mode via npx).
Provides Claude Code with:
- `search_nodes` — FTS5 search across 1,396 nodes
- `get_node` — detailed node docs with examples
- `validate_node` — configuration validation
- `search_templates` / `get_template` — 2,646 workflow templates
- `n8n_create_workflow` / `n8n_update_full_workflow` — CRUD operations
- `n8n_executions` — run and monitor workflows
- `n8n_manage_credentials` — credential management
- `n8n_deploy_template` — one-click template deployment

**Why:** Complements OpenClaw (Telegram gateway) and Paperclip (agent platform) as the workflow automation layer. n8n connects 400+ services visually while Claude builds/manages workflows via MCP.

**How to apply:** Use n8n for multi-service integrations (GitHub→Slack, email pipelines, crypto alerts, NERV skill triggers). OpenClaw stays as AI gateway; n8n handles the workflow glue.

## First-Time Setup Required

1. Open http://localhost:5678 in browser
2. Create owner account (email + password)
3. Go to Settings → API → Enable API
4. Copy API key → paste into `~/.claude/.mcp.json` N8N_API_KEY field
5. Restart Claude Code to reload MCP server

## Startup

Added to `~/startup-services.sh` as service [2/5]. Starts automatically with `bash ~/startup-services.sh`.

## High-Value Use Cases

**Immediate:**
- GitHub PR → Telegram/Slack notification pipeline
- Email/Gmail filtering and AI summarization
- Crypto alert workflows (Hyperliquid → Telegram/Discord)
- NERV skill webhooks as alternative to GH Actions cron
- RSS → summarize → post to channels

**Future:**
- Visual orchestrator for Paperclip agents
- SIGNAL consultancy demo workflows for SME clients
- TallyAI/Munshi data pipelines (Tally → n8n → WhatsApp)
- Self-healing infrastructure monitoring
