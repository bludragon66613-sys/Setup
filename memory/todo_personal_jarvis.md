---
name: Personal Jarvis (ops) build
description: Parked spec for personal ops Jarvis — build-efficiency + systems-in-check overlay on Agentic knowledge vault. Not content Jarvis.
type: project
originSessionId: b015ae74-0fce-4600-a0d1-fdb080a18356
---
# Personal Jarvis (ops) — parked 2026-04-24

**Source:** CyrilXBT article "How to Build a JARVIS Inside Obsidian With Claude Code" (x.com/cyrilXBT/status/2047246104421388461) — structure adapted, content pipeline dropped.

**Intent:** single entrypoint that helps ship projects faster + keeps systems healthy. NOT content production.

**Why parked:** too many active projects already (drip, NERV_02, Morning Light, Munshi, Paperclip, OpenClaw). Build when focus narrows.

**Trigger to un-park:** when active project count drops to ≤3, OR when a specific pain surfaces ("I keep forgetting X", "systems keep breaking without me noticing").

## Path B (overlay on existing vault)

Vault root: `~/OneDrive/Documents/Agentic knowledge/`

```
JARVIS/
├── 00-INBOX/
├── 01-CAPTURES/
│   ├── todos/
│   ├── blockers/
│   ├── decisions/
│   ├── learnings/
│   ├── incidents/
│   └── ideas/
├── 02-PROJECTS/            one file per active project
├── 03-STATUS/              auto rollups (daily, weekly, systems)
├── 04-GOALS/               milestones, trigger conditions
└── 05-CLAUDE/
    ├── CLAUDE.md
    ├── skills/
    │   ├── process-inbox.md
    │   ├── system-check.md
    │   ├── project-status.md
    │   ├── next-action.md
    │   ├── blocker-triage.md
    │   ├── decision-log.md
    │   └── daily-standup.md
    └── context/
        ├── services.md
        ├── priorities.md
        └── working-agreements.md
```

## Reuses existing infra

- Aeon skills: `morning-brief`, `weekly-review`, `goal-tracker`, `heartbeat`, `reflect`, `self-review` (call, don't duplicate)
- `startup-services.sh`, `openclaw-healthcheck.sh` — wire into `system-check`
- claude-mem + qmd MCP — captures auto-indexed
- n8n — cron scheduler for standup/system-check
- Dashboard NERV terminal — `DISPATCH:{skill}` entrypoint
- Telegram @kaneda6bot — voice/text capture

## Open questions (answer before build)

1. Which of 14 tracked projects stay in Jarvis scope vs get archived
2. Current quarter #1 priority (drives next-action ranking)
3. Daily ritual surface: Telegram push / dashboard widget / CLI / all
4. Auto-action authority: can Jarvis auto-restart services, or only report + ask

## Build steps (when un-parked)

1. Scaffold 6 folders in vault
2. Write `05-CLAUDE/CLAUDE.md` (vault-scoped, layered over global)
3. Write 7 skills in `05-CLAUDE/skills/`
4. Write 3 context files in `05-CLAUDE/context/`
5. Wire n8n crons (standup 8am, system-check every 4h, weekly-review Sun)
6. Register skills in dashboard NERV terminal dispatch
7. Add Telegram capture → 00-INBOX path
8. Smoke test: capture sample → process-inbox → verify routing
9. Sync to Setup repo
