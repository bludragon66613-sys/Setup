---
name: Wiki automation — deferred
description: 3-layer automation plan for vault wiki-ingest/wiki-lint/wiki-digest using n8n + Claude Code SessionEnd hook + OpenClaw
type: project
status: deferred
created: 2026-04-15
originSessionId: ed1d2c08-3817-466d-a522-81a707f328e6
---
# Wiki automation (deferred)

Planned but not yet implemented. Picks up from the 2026-04-15 session where we installed karpathy-guidelines, built brand-foundation/, and wired /wiki-ingest /wiki-query /wiki-lint /wiki-explore slash commands.

**Why:** Slash commands are manual-only. To get compounding knowledge layer value, ingestion and lint need to run on a schedule without human trigger.

**Why deferred:** Requires n8n workflow authoring + new Claude Code hook + test cycle. ~1-2 hours. Not blocking anything. No Web Clipper pipeline yet, so backlog is small.

## Architecture (layered)

```
Layer 1 — n8n workflows (primary, scheduled, runs when PC is on)
  wiki-ingest   cron "0 3 * * *"   nightly 3am local
  wiki-lint     cron "0 4 * * 0"   Sunday 4am
  wiki-digest   cron "0 8 * * 1"   Monday 8am → Telegram via kaneda6bot
  Each: Cron → Read raw/*.md → OpenClaw LLM (localhost:18789) → Write wiki/*.md → Append log.md → Notify

Layer 2 — Claude Code SessionEnd hook (opportunistic)
  ~/.claude/hooks/wiki-auto-ingest.js
  Same shape as memory-obsidian-sync.js. Scans raw/ for files modified in
  last 24h with no matching wiki entry. Ingests via OpenClaw. Catches
  mid-day drops + "PC was off last night" first session of day.

Layer 3 — /wiki-ingest slash command (manual fallback, already shipped)
```

## Why n8n not GitHub Actions

- Vault at ~/OneDrive/Documents/Agentic knowledge/ can't move from Windows
- Pushing wiki edits from GH Actions through Setup repo races OneDrive sync
- n8n already running on :5678, has cron + filesystem + AI nodes, uses OpenClaw free
- OpenClaw local gateway means zero LLM API cost, uses existing fallback chain

## Implementation steps when revisited

1. **Three n8n workflows** (JSON files, import via UI or `n8n import:workflow`):
   - wiki-ingest-nightly.json
   - wiki-lint-weekly.json
   - wiki-digest-weekly.json
   - Each uses: Cron trigger → Read Binary Files (raw/) → HTTP Request to http://localhost:18789/v1/chat/completions → Write Binary File (wiki/) → Append to log.md → Telegram node on error or digest
2. **~/.claude/hooks/wiki-auto-ingest.js** — reuses memory-obsidian-sync.js shape. Add to settings.json hooks.SessionEnd array.
3. **Test run:** drop a throwaway markdown into raw/, verify layer 2 processes it on next session end. Wait one night for layer 1 confirmation.
4. **Commit to Setup + push.**

## Known failure mode

PC off for multi-day stretches = no runs. Cheap mitigation: Cloudflare Worker heartbeat checks a public gist for `last-ingest-at` every 12h, nudges via Telegram if >48h stale. Only add if Rohan notices missed windows.

**How to apply:** When Rohan says "let's automate the wiki" or "pick up the wiki automation," read this file + the 2026-04-15 session context and proceed from step 1.
