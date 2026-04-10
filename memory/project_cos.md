---
name: Chief of Staff Vault Overlay
description: AI Chief of Staff system layered on Obsidian vault — Home dashboard, Actions, Decisions, Clients, Transcripts, Frameworks, Templates
type: project
originSessionId: 8895e7dd-6db4-48ab-baa2-090616ae7d06
---
Chief of Staff (COS) system scaffolded on 2026-04-11 inside the Obsidian vault at `~/OneDrive/Documents/Agentic knowledge/`.

**Why:** Rohan needs a structured operational layer for tracking commitments, decisions, client relationships, and meeting outputs — beyond the existing wiki/memory/tasks system which focuses on project knowledge and Claude Code session state.

**How to apply:** When processing transcripts, calls, or meetings, route information to COS locations. When checking priorities or commitments, start at `Home.md`.

## Structure

| Directory | File | Purpose |
|-----------|------|---------|
| Root | `Home.md` | COS dashboard — priority table, quick access, automation rules |
| `Actions/` | `Action Tracker.md` | Commitments: Task, Owner, Deadline, Status, Source |
| `Decisions/` | `Decision Log.md` | Append-only decisions with reasoning (DEC-xxx format) |
| `Clients/` | `Client Index.md` | One file per client/stakeholder |
| `cos-sessions/` | `Session Index.md` | Business interaction summaries (separate from Claude Code `sessions/`) |
| `Transcripts/` | `README.md` | Drop zone for raw call/meeting transcripts (read-only) |
| `Frameworks/` | `Framework Index.md` | SOPs: transcript-processing, weekly-review |
| `Templates/` | `Template Index.md` | Reusable formats: client, session, decision, action |

## Relationship to Existing Systems

- `Tasks/current.md` = daily priorities (ClawChief). `Actions/` = commitments from interactions.
- `sessions/` = Claude Code session logs. `cos-sessions/` = business meeting summaries.
- `workflows/` = reusable patterns. `Frameworks/` = COS-specific SOPs (links to workflows/).
- `01-polaris/Top of Mind.md` = strategic north star. `Home.md` = operational dashboard.

## Key Workflows

1. **Transcript processing:** Drop in `Transcripts/` → extract decisions, actions, context → route to correct locations
2. **Weekly review:** Check actions, decisions, clients, priorities → update Home dashboard
3. **New client:** Copy `Templates/client-template.md` → fill in → add to Client Index

## Navigation

- Entry: `Home.md` → all COS sections
- Wired into: `MOC.md` (Chief of Staff section) + `index.md` (COS file listings)
- Decision numbering: DEC-001, DEC-002, etc. (append-only, never edit past entries)
