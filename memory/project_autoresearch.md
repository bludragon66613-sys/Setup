---
name: project-autoresearch
description: Autoresearch skill port from davebcn87/pi-autoresearch — karpathy-style autonomous experiment loop wired into NERV dashboard + Aeon skill-evolve + n8n cron + Obsidian sync
type: project
originSessionId: 010739ed-35ae-4e96-a5a3-34f71543c5bf
---
# Autoresearch

Karpathy-style autonomous experiment loop (try → bench → keep/revert → repeat). Ported from `davebcn87/pi-autoresearch` (originally built for pi.dev CLI) to Claude Code on 2026-04-17.

## Where things live

**Skill:** `~/.claude/skills/autoresearch/`
- `SKILL.md` — entry + loop rules + JSONL schema
- `lib/init_experiment.sh` — writes `.autoresearch-state.json` (session config, segment bump)
- `lib/run_experiment.sh` — executes `autoresearch.sh` via rtk, parses `METRIC name=value` lines, runs `autoresearch.checks.sh` if present. Writes `.autoresearch-pending.json`
- `lib/log_experiment.sh` — finalizes keep/discard/crash/checks_failed. Commits on keep, reverts on discard. Calls `_append_log.js` then `claude_mem_emit.sh` + `obsidian_sync.sh` on keep
- `lib/confidence.js` — MAD-based noise floor + confidence score (`|best_delta| / MAD`, ≥2.0× = real)
- `lib/ccg_judge.sh` — parallel Claude+Codex+Gemini 2-of-3 vote on whether improvement is real
- `lib/claude_mem_emit.sh` — appends kept wins to `memory/autoresearch_wins.md`
- `lib/obsidian_sync.sh` — mtime-gated copy of `autoresearch.md` to vault + `qmd update && qmd embed` in bg, skips shueb.io
- `lib/nightly_iterate.sh` — n8n-invoked orchestrator, scans project dirs, runs one cycle per active session
- `lib/finalize.sh` — copied verbatim from upstream, turns noisy branch into clean reviewable branches

**Session artifacts** (created per project, not in skill dir):
- `autoresearch.md` — goal, metrics, scope, tried/dead-ends (survives context resets)
- `autoresearch.sh` — benchmark script emitting `METRIC name=value`
- `autoresearch.jsonl` — append-only result log (1 JSON line per run)
- Optional: `autoresearch.checks.sh`, `autoresearch.ideas.md`, `autoresearch.config.json`

## JSONL schema

`{ts, run, segment, status, metric, metric_name, direction, unit, duration_ms, secondary, commit, baseline, delta_pct, confidence, checks_status, description, asi }`

## Integrations wired

1. **NERV dashboard** — `~/aeon/dashboard/app/autoresearch/` + `app/autoresearch/detail/` + `app/api/autoresearch/`. Live session viewer polling jsonl every 3s. SVG chart with baseline dashed line. Default scans `~/aeon`, `~/paperclip`, `~/.claude/skills/autoresearch`. Custom paths via `~/autoresearch-sessions.json`. Nav link on `/`.
2. **claude-mem** — every keep appends to `memory/autoresearch_wins.md`
3. **Obsidian vault** — `autoresearch.md` synced on keep to `~/OneDrive/Documents/Agentic knowledge/_autoresearch/<slug>/`, triggers `qmd update && qmd embed`
4. **n8n cron** — `~/.n8n/workflows/autoresearch-nightly.json` fires at 02:00 → `nightly_iterate.sh`. Telegram alerts via OpenClaw when `TELEGRAM_CHAT_ID` set
5. **Aeon skill-evolve** rewritten at `~/aeon/skills/skill-evolve/SKILL.md`: targets named skill, metric = eval_score from `~/aeon/memory/evals/daily-results.jsonl`, 3-gate keep (metric↑ + MAD≥2.0× + ccg 2-of-3 keep)

## Improvements over upstream

- Parallel ccg cross-judge (original was single-agent)
- claude-mem + Obsidian + n8n hooks (original was local-only)
- Aeon skill-evolve driver (skill evolution with eval metric)
- RTK wrapping for 60-90% token savings on verbose benches
- NERV dashboard instead of pi.dev's inline terminal widget

## Quick-start

```bash
cd <project> && git checkout -b autoresearch/<goal>
bash ~/.claude/skills/autoresearch/lib/init_experiment.sh <name> <metric> <unit> <lower|higher>
# write autoresearch.md + autoresearch.sh (templates in ~/.claude/skills/autoresearch/templates/)
bash ~/.claude/skills/autoresearch/lib/run_experiment.sh
bash ~/.claude/skills/autoresearch/lib/log_experiment.sh keep "baseline"
# loop → edit → run → log
# done → /skill autoresearch-finalize
```

Dashboard: http://localhost:5555/autoresearch

## Upstream

`davebcn87/pi-autoresearch` (5.1k stars, MIT). Original is TypeScript extension for pi.dev. Our port is bash + Node helpers so it runs inside Claude Code's existing runtime with zero new deps beyond node.
