# Session: 2026-04-04

**Started:** ~12:40pm IST
**Last Updated:** 1:25pm IST
**Project:** ~/autoagent + ~/aeon (cross-project)
**Topic:** Implemented kevinrgu/autoagent and midudev/autoskills for autonomous agent/skill improvement

---

## What We Are Building

Two complementary systems for autonomous improvement of Rohan's AI agent ecosystem:

1. **AutoAgent** (from kevinrgu/autoagent) — An autonomous improvement loop that iterates on Claude Code agents (`~/.claude/agents/*.md`) and Aeon skills (`~/aeon/skills/*/SKILL.md`). A meta-agent reads `program-local.md`, selects the weakest target, applies one surgical change, benchmarks it, and keeps/discards based on score delta. Designed to run overnight.

2. **autoskills** (from midudev/autoskills) — Auto-detects project tech stacks from package.json/configs and installs matching AI skills from the skills.sh ecosystem into project-local `.claude/skills/` directories. Wrapped with a multi-project scanner for Rohan's environment.

These work together: autoskills ensures optimal skill coverage per-project, while autoagent continuously improves agent and skill quality through score-driven hill climbing.

---

## What WORKED (with evidence)

- **AutoAgent cloned and adapted** — confirmed by: `~/autoagent/` exists with all files, `program-local.md` written with Rohan-specific directives
- **Benchmark tasks created** — confirmed by: `agent-benchmarks.json` has 11 tasks across 5 agents, `skill-benchmarks.json` has 8 skills with failure modes
- **evolve-loop.sh and evolve-once.sh runners created** — confirmed by: files exist, chmod +x applied, help text works
- **Aeon autoagent skill created** — confirmed by: `~/aeon/skills/autoagent/SKILL.md` exists (46 Aeon skills total, up from 41)
- **Aeon autoskills skill created** — confirmed by: `~/aeon/skills/autoskills/SKILL.md` exists
- **skill-evolve enhanced** — confirmed by: file updated with failure analysis, overfitting guard, results.tsv tracking, `--loop` continuous mode
- **autoskills dry-run on TallyAI** — confirmed by: detected 11 technologies (React, Next.js, Tailwind, shadcn, TypeScript, Neon, AI SDK, Vercel, Node.js, Vitest, Drizzle), 3 combos, 19 skills
- **autoskills dry-run on NERV** — confirmed by: detected 6 technologies, 13 skills
- **autoskills install on TallyAI** — confirmed by: 19 skills in `~/tallyai/.claude/skills/` (drizzle-orm, neon-postgres, ai-sdk, shadcn, vitest, etc.)
- **autoskills install on NERV** — confirmed by: 13 skills in `~/aeon/dashboard/.claude/skills/` (react-best-practices, next-cache-components, etc.)
- **Multi-project scanner created** — confirmed by: `~/autoagent/autoskills-scan.sh` exists with --list, --install, --project flags
- **Memory saved** — confirmed by: `project_autoagent.md` updated, MEMORY.md index updated

---

## What Did NOT Work (and why)

- No failed approaches this session — implementation was straightforward.

---

## What Has NOT Been Tried Yet

- **Actually running an evolution iteration** — `bash ~/autoagent/evolve-once.sh` has not been tested live. The script invokes `claude --print` which needs to be verified on Windows.
- **Overnight loop** — `evolve-loop.sh --overnight` not tested. Rate limits and cost implications unknown.
- **skill-eval baseline scoring** — No skills have been scored yet via skill-eval. Need to run `skill-eval` on at least 3 core skills to populate `skill-scores.json` before autoagent can select targets.
- **Dispatching autoagent/autoskills from NERV** — Skills created but not tested via GitHub Actions dispatch.
- **autoskills on Paperclip** — `~/paperclip/` was not scanned/installed (has package.json, would detect Node.js/TypeScript).
- **Agent benchmarks live execution** — The agent benchmark tasks in `agent-benchmarks.json` are designed for manual evaluation, not automated scoring. Could build an automated scorer.
- **Backing up to claudecodemem** — New Aeon skills (autoagent, autoskills) not yet pushed.

---

## Current State of Files

| File | Status | Notes |
| --- | --- | --- |
| `~/autoagent/program-local.md` | ✅ Complete | Meta-agent directives for agents + skills, includes autoskills integration |
| `~/autoagent/program.md` | ✅ Complete | Original from kevinrgu/autoagent (reference) |
| `~/autoagent/agent.py` | ✅ Complete | Original OpenAI variant (reference) |
| `~/autoagent/agent-claude.py` | ✅ Complete | Original Claude SDK variant (reference) |
| `~/autoagent/evolve-loop.sh` | ✅ Complete | Overnight runner with --rounds, --overnight, --target, --type flags |
| `~/autoagent/evolve-once.sh` | ✅ Complete | Single iteration runner |
| `~/autoagent/autoskills-scan.sh` | ✅ Complete | Multi-project scanner with --install, --list, --project flags |
| `~/autoagent/benchmarks/agent-benchmarks.json` | ✅ Complete | 11 benchmark tasks for 5 agents |
| `~/autoagent/benchmarks/skill-benchmarks.json` | ✅ Complete | 8 skill tests + failure modes |
| `~/autoagent/results/results.tsv` | ✅ Complete | Initialized with headers, no data yet |
| `~/aeon/skills/autoagent/SKILL.md` | ✅ Complete | 8-step evolution loop dispatchable from NERV |
| `~/aeon/skills/autoskills/SKILL.md` | ✅ Complete | Tech-stack scanner dispatchable from NERV |
| `~/aeon/skills/skill-evolve/SKILL.md` | ✅ Complete | Enhanced with autoagent patterns |
| `~/tallyai/.claude/skills/` | ✅ Complete | 19 project-local skills installed |
| `~/aeon/dashboard/.claude/skills/` | ✅ Complete | 13 project-local skills installed |
| `~/.claude/projects/C--Users-Rohan/memory/project_autoagent.md` | ✅ Complete | Full project memory with both systems documented |

---

## Decisions Made

- **No Docker/Harbor dependency** — reason: AutoAgent's Docker+Harbor benchmarking is overkill for Rohan's setup. Adapted to use Claude Code CLI (`claude --print`) and skill-eval rubric instead.
- **Project-local skills (not global)** — reason: autoskills installs to `.claude/skills/` per-project, keeping global skills clean and project-specific skills scoped correctly.
- **Two separate Aeon skills (autoagent + autoskills)** — reason: Different concerns — autoagent improves quality, autoskills ensures coverage. Can be dispatched independently.
- **Enhanced skill-evolve rather than replacing** — reason: skill-evolve already works. Added autoagent patterns (failure analysis, overfitting guard, results.tsv) as enhancements.
- **Unified results.tsv** — reason: Both autoagent and skill-evolve write to the same results file, enabling cross-system tracking and trend analysis.

---

## Blockers & Open Questions

- **`claude --print` on Windows** — The evolve scripts use `claude --print --dangerously-skip-permissions` which needs to be verified. May need `claude.cmd` on Windows.
- **Cost of overnight runs** — Each evolution iteration invokes a full Claude Code session. Running 10+ rounds overnight could be expensive. Consider using `--model haiku` for cheaper iterations.
- **skill-scores.json bootstrap** — No baseline scores exist yet. Need to run `skill-eval` on core skills before autoagent can auto-select targets.
- **Paperclip not scanned** — Should run `npx autoskills` on `~/paperclip/` to install matching skills.

---

## Exact Next Step

Run `skill-eval` on 3 core Aeon skills (morning-brief, self-review, skill-health) to populate `~/aeon/memory/topics/skill-scores.json` with baseline scores. This unblocks autoagent's auto-selection logic. Then test one live iteration: `bash ~/autoagent/evolve-once.sh`.

---

## Environment & Setup Notes

- Node.js v24.14.0 (exceeds autoskills' v22 requirement)
- `npx autoskills` is the primary install command (no global install needed)
- AutoAgent repo cloned to `~/autoagent/` (not a git submodule)
- Aeon skills directory: `~/aeon/skills/` (46 total now)
- Project-local skills: `<project>/.claude/skills/` (installed by autoskills)
- Global skills: `~/.claude/skills/` (284 total, unchanged this session)
