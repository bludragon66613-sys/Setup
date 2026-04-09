# oh-my-claudecode (OMC) — Multi-Agent Orchestration

> Synced from Claude Code memory — 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_omc.md`

---

oh-my-claudecode (OMC) v4.9.3 is a Claude Code plugin that adds structured multi-agent pipelines, smart model routing, and autonomous execution modes.

**Install:** `npm i -g oh-my-claude-sisyphus@latest`
**Setup:** `omc install && omc setup`
**Restore after PC reset:** `npm i -g oh-my-claude-sisyphus@latest && omc install && omc setup`
**Backup:** `~/.claude/agents-backup-pre-omc/` preserves pre-OMC agent state
**Installed:** 2026-04-02

## Why It Matters

- **Reduces hallucination** through structured agent pipelines
- **Saves 30-50% tokens** via smart model routing (Haiku for search, Sonnet for execution, Opus for reasoning)
- **Adds autonomous modes** for end-to-end task completion

## Agent Roster (19 agents)

| Agent | Model | Purpose |
|-------|-------|---------|
| explore | Haiku | Fast codebase search and pattern matching |
| analyst | Opus | Pre-planning analysis, hidden requirements |
| planner | Opus | Strategic planning, work plan creation |
| architect | Opus | Architecture design, hard debugging |
| critic | Opus | Plan review and validation |
| code-simplifier | Opus | Code clarity and refactoring |
| debugger | Sonnet | Root-cause diagnosis |
| executor | Sonnet | Focused task execution |
| verifier | Sonnet | Completion evidence, claim validation |
| designer | Sonnet | UI/UX visual changes |
| test-engineer | Sonnet | Test strategy and coverage |
| scientist | Sonnet | Data analysis, Python EDA |
| tracer | Sonnet | Evidence-driven causal tracing |
| qa-tester | Sonnet | Interactive CLI testing |
| git-master | Sonnet | Atomic commits, history management |
| document-specialist | Sonnet | External docs and reference lookup |
| writer | Haiku | Technical documentation |

## Magic Keywords

Use naturally in prompts — no slash commands:

| Keyword | Effect |
|---------|--------|
| `autopilot: <task>` | Full autonomous execution (plan → execute → verify) |
| `ralph: <task>` | Persistent mode with verify/fix loops until complete |
| `ulw <task>` | Maximum parallelism burst mode |
| `deep-interview` | Socratic requirements clarification |
| `deepsearch <query>` | Thorough codebase search |
| `ultrathink: <task>` | Extended reasoning mode |

## Windows Note

No tmux on Windows — `team` mode and CLI workers won't work natively. Consider `winget install psmux` if needed.

## Related

- [[nerv-autonomous-agent]] — OMC agents available throughout NERV development workflow
- [[autoagent-optimization]] — AutoAgent improves the agents that OMC orchestrates
- [[tallyai-munshi]] — OMC executor/verifier agents used during Munshi development phases
