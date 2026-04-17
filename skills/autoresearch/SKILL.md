---
name: autoresearch
description: Autonomous experiment loop — try idea → benchmark → keep winners → revert regressions → repeat. Use when asked to "run autoresearch", "optimize X in a loop", "evolve this skill", or "start experiments". Ported from davebcn87/pi-autoresearch (karpathy-inspired) with MAD confidence + cross-model judging + claude-mem integration.
---

# Autoresearch

Karpathy-style autonomous experiment loop. Try → benchmark → keep/revert → repeat forever.

## When to invoke

- Perf optimization (test speed, bundle size, build time, Lighthouse)
- LLM tuning (loss, eval score, latency)
- Skill evolution (Aeon skill-evolve metric = skill-eval score)
- Any task with a measurable metric and bounded file scope

## Session artifacts

Three files in project root (or `workingDir` from `autoresearch.config.json`):

| File | Purpose |
|------|---------|
| `autoresearch.md` | Session doc — objective, metrics, scope, what's been tried. Survives context resets. |
| `autoresearch.sh` | Benchmark script. Outputs `METRIC name=value` lines. |
| `autoresearch.jsonl` | Append-only result log — one JSON line per run. |
| `autoresearch.checks.sh` | *(optional)* Correctness gate — tests/types/lint after each passing bench. |
| `autoresearch.ideas.md` | *(optional)* Deferred ideas backlog. |
| `autoresearch.config.json` | *(optional)* `{ workingDir, maxIterations }`. |

## Setup flow

1. **Gather** — ask user (or infer): goal, command, primary metric (+ direction), files in scope, constraints.
2. **Branch** — `git checkout -b autoresearch/<goal-slug>-$(date +%Y%m%d)`
3. **Read source** — understand the workload before writing.
4. **Write `autoresearch.md`** using the template at `templates/autoresearch.md.tpl`. Commit.
5. **Write `autoresearch.sh`** using `templates/autoresearch.sh.tpl`. `set -euo pipefail`. Must emit `METRIC name=value` lines.
6. **Baseline** — `bash lib/init_experiment.sh <name> <metric> <unit> <direction>` then `bash lib/run_experiment.sh` then `bash lib/log_experiment.sh keep "baseline"`.
7. **Loop** — start editing. After each change: `run_experiment` → `log_experiment`.

## JSONL schema (one line per run)

```json
{
  "ts": "2026-04-17T17:30:00Z",
  "run": 12,
  "segment": 1,
  "status": "keep" | "discard" | "crash" | "checks_failed",
  "metric": 15.2,
  "metric_name": "total_time",
  "direction": "lower",
  "unit": "seconds",
  "secondary": { "memory_mb": 420 },
  "commit": "<full hash>",
  "baseline": 17.3,
  "delta_pct": -12.1,
  "confidence": 2.4,
  "description": "switch to forks pool",
  "asi": { "insight": "...", "dead_end": "..." },
  "judge": { "verdict": "keep" | "discard", "votes": { "claude": "keep", "codex": "keep", "gemini": "discard" } }
}
```

## Loop rules

**LOOP FOREVER** unless interrupted or `maxIterations` hit.

- **Primary metric is king.** Better → `keep`. Worse/equal → `discard`. Secondary rarely decides.
- **Confidence gate** — after 3+ runs, compute `|best_delta| / MAD`. ≥2.0× = real, 1.0–2.0× = marginal, <1.0× = noise. Re-run to confirm marginal wins.
- **ccg cross-judge** *(optional)* — run `lib/ccg_judge.sh` on high-confidence wins to catch single-model bias. 2-of-3 agreement gates the final keep.
- **Annotate heavy** — every run gets `asi` with what you learned. Discards are wiped; `asi` is the only memory.
- **Don't thrash** — reverting same idea 3x → try a structurally different approach.
- **Simpler wins ties** — removing code for equal perf = keep.
- **Resume from `autoresearch.md`** on restart.

## Tools (bash libs)

All under `lib/`. See file headers for usage.

| Script | Purpose |
|--------|---------|
| `init_experiment.sh` | Write `.autoresearch-state.json` with session config. Call once per segment. |
| `run_experiment.sh` | Executes `autoresearch.sh` via rtk. Captures stdout, parses METRIC lines, runs `checks.sh` if present. Writes pending result. |
| `log_experiment.sh` | Finalize status (keep/discard/crash/checks_failed). On `keep`: commits changed files. On `discard`: reverts. Appends JSONL. Recomputes confidence. |
| `confidence.js` | MAD-based noise floor + confidence score. Node.js, no deps. |
| `ccg_judge.sh` | Ask Claude+Codex+Gemini if improvement is real. Returns JSON verdict. |
| `claude_mem_emit.sh` | Emit a claude-mem observation on keep so winners surface in future sessions. |

## Finalize into clean branches

When done optimizing:

```
/skill autoresearch-finalize
```

Reads `autoresearch.jsonl`, proposes logical groupings, user approves, then `lib/finalize.sh <groups.json>` creates one branch per changeset from merge-base. No two branches share a file. See `lib/finalize.sh` for details.

## Integration hooks

- **NERV dashboard** (`~/aeon/dashboard/app/autoresearch/`) — live session viewer. Reads `autoresearch.jsonl` via file watcher.
- **claude-mem** — every `keep` emits an observation → cross-session knowledge.
- **Obsidian vault** — `autoresearch.md` synced on every `keep` via `lib/obsidian_sync.sh`. Copies to `~/OneDrive/Documents/Agentic knowledge/_autoresearch/<slug>/autoresearch.md`, skips if destination is newer, then runs `qmd update && qmd embed` in background.
- **n8n cron** — overnight loops scheduled via `~/.n8n/workflows/autoresearch-nightly.json` (02:00 daily). Calls `lib/nightly_iterate.sh` which scans `~/aeon` and `~/paperclip` (configurable via `PROJECT_DIRS` env), runs one experiment cycle per active session, sends Telegram alert via OpenClaw on crash/completion (`TELEGRAM_CHAT_ID` env required).
- **Aeon skill-evolve** — dispatches autoresearch loop on a single Aeon skill, metric = skill-eval score.

## Cost control

- `maxIterations` in `autoresearch.config.json` — hard cap on runs.
- RTK wraps all bench output — 60-90% token savings on verbose benchmarks.
- Background runs + `ScheduleWakeup` for long benches.

## Never stop

User may be away for hours. Keep running. On user message mid-experiment, finish current `run_experiment`+`log_experiment` cycle, then incorporate feedback next iteration.
