---
name: kaneda-workspace
description: Kaneda (Telegram bot @kaneda6bot) OpenClaw workspace at ~/.openclaw/workspace. Self-improvement loop ported from Spike on 2026-05-10. PROGRAM/ROADMAP/clawchief/evals/KB structure.
type: project
originSessionId: 4dcf48ca-4488-4410-b9c3-ca95d4abd0f0
---
# Kaneda Workspace

Kaneda lives in `~/.openclaw/workspace`. Git repo `bludragon66613-sys/Kaneda` (private), branch `main`.

Mcgruber is the principal (Telegram DM 7491413516, America/Los_Angeles).
Primary model: `openrouter/moonshotai/kimi-k2.6`. Codex auth dead.

## Structure (post-Spike-port, 2026-05-10, commit ffa1f81)

- `MEMORY.md` curated long-term memory (not just an index)
- `PROGRAM.md` meta-rules: evidence sources, freeze rules, optimization targets, regression constraints, weekly failure loop, KB Karpathy pattern
- `ROADMAP.md` 3-phase: structural reliability -> interaction quality -> affective state
- `HEARTBEAT.md` 11-section orchestrator (Claude Code sync, model health, vault sync, git, project watch, memory maintenance, KB lint, eval runner, weekly review, external health, phase tracking)
- `clawchief/{priority-map,auto-resolver,tasks,meeting-notes}.md` chief-of-staff routing
- `knowledge-base/{index,log}.md` Karpathy KB scaffold
- `evals/{suite.json,eval-runner.js,meta-agent.js}` regression suite + failure clustering
- `memory/{failures,session-quality}.jsonl, phase1-progress.json, meeting-notes-state.json` runtime state
- `feedback/`, `projects/`, `skills/` (existing) untouched in scope

## Phase 1 exit criteria

`memory/phase1-progress.json` tracks consecutive clean days. Phase 1 exits at 14 consecutive clean eval days.

## Vault round-trip

Hook `~/.claude/hooks/memory-obsidian-sync.js` (`syncKanedaWorkspace()`) mirrors workspace into `~/Downloads/Vault/Memory/agents/` on Claude Code SessionStart and Stop. Includes top-level files, feedback/, projects/, clawchief/, knowledge-base/, evals/. Excludes `.git`, `.openclaw`, `tmp`, `node_modules`. Also writes `KANEDA_MEMORY.md` alongside legacy `SPIKE_MEMORY.md`.

## Commands

```bash
# Run eval suite (HEARTBEAT.md section 8)
cd ~/.openclaw/workspace && node evals/eval-runner.js

# Weekly failure clustering (HEARTBEAT.md section 9)
node evals/meta-agent.js
node evals/meta-agent.js --since 2026-05-10

# Force vault sync mirror
node ~/.claude/hooks/memory-obsidian-sync.js
```

## Spike legacy artifacts

Spike's earlier loop lives in `~/Downloads/Vault/Memory/agents/` as `SPIKE_MEMORY.md`, plus original `auto-resolver.md`, `priority-map.md`, `PROGRAM.md`, `ROADMAP.md`, `HEARTBEAT.md`, `TOOLS.md`, `user_profile.md`, `phase1-progress.json`. Reference only: kaneda re-derived these for current Mcgruber/kimi-k2.6 reality. Spike artifacts now coexist alongside kaneda artifacts in the same vault dir.

## Blockers (carry-over)

- `gog` Google OAuth: needs Desktop OAuth client JSON from Mcgruber
- OpenAI Codex re-auth: Mcgruber must redo, Codex auth dead
- Telegram group topic isolation: by design

## Known eval edge case

`no_em_dash_in_feedback` check strips fenced code, inline backticks, double-quoted segments, and skips lines containing "em dash" or "em-dash" before flagging. Pedagogical mentions don't trigger. Real prose violations do.
