---
name: oh-my-claudecode Integration
description: OMC v4.9.3 multi-agent orchestration plugin — 19 agents, smart model routing, magic keywords, autopilot/ralph modes
type: project
---

oh-my-claudecode (OMC) v4.9.3 installed globally via `npm i -g oh-my-claude-sisyphus@latest`.

**Why:** Reduces hallucination through structured agent pipelines, saves 30-50% tokens via smart model routing (Haiku for search, Sonnet for execution, Opus for reasoning), and adds autonomous execution modes.

**How to apply:**
- Use `autopilot: <task>` for end-to-end autonomous feature development
- Use `ralph: <task>` for persistent tasks that must complete (retries on failure)
- Use `ulw <task>` for burst parallel fixes
- OMC agents are available alongside existing custom agents (product-manager, ui-ux-architect, etc.)
- No tmux on Windows — team mode and CLI workers won't work. Consider installing psmux via `winget install psmux` if needed.
- Restore after PC reset: `npm i -g oh-my-claude-sisyphus@latest && omc install && omc setup`
- Backup dir exists at `~/.claude/agents-backup-pre-omc/` with pre-OMC agent state

**Installed: 2026-04-02**
