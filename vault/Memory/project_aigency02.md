---
name: project_aigency02
description: Aigency02 agent repo — current state, superpowers integration, restore instructions for new sessions
type: project
---

# Aigency02 — Supercharged with Superpowers

**Local path:** `~/aigency02`
**Repo:** `github.com/bludragon66613-sys/Aigency02`
**Last commit:** `ee915e2` — "Add superpowers skills framework and update code-reviewer agent"

## What's in the repo (as of 2026-03-22)

- **156 agents** across: academic, design, engineering, game-development, marketing, paid-media, sales, product, project-management, testing, support, spatial-computing, specialized
- **14 superpowers skills** in `skills/` — sourced from `obra/superpowers`:
  - brainstorming, test-driven-development, systematic-debugging
  - writing-plans, executing-plans, dispatching-parallel-agents
  - subagent-driven-development, using-superpowers, using-git-worktrees
  - verification-before-completion, requesting-code-review, receiving-code-review
  - finishing-a-development-branch, writing-skills
- **Updated `scripts/install.sh`** — claude-code installer now copies both agents to `~/.claude/agents/` AND skills to `~/.claude/skills/`
- **code-reviewer agent** updated from upstream obra/superpowers in `engineering/engineering-code-reviewer.md`

## Restore Instructions (new session / after PC reset)

Run these to restore full agent + skill setup locally:

```bash
cd ~/aigency02
bash scripts/install.sh --tool claude-code --no-interactive
```

This installs:
- 156 agents → `~/.claude/agents/`
- 14 skills → `~/.claude/skills/`

## Star Agents (personal, backed up in claudecodemem)

These live in `~/.claude/agents/` and are backed up at `github.com/bludragon66613-sys/claudecodemem/agents/`:
- `agent-architect-builder.md`
- `ui-ux-architect.md`
- `senior-software-engineer.md`
- `technical-cofounder.md`

Restore after PC reset:
```bash
node -e "
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const agents = ['agent-architect-builder','ui-ux-architect','senior-software-engineer','technical-cofounder'];
for (const a of agents) {
  const content = execSync(\`gh api repos/bludragon66613-sys/claudecodemem/contents/agents/\${a}.md --jq '.content'\`).toString().trim();
  fs.writeFileSync(\`\${os.homedir()}/.claude/agents/\${a}.md\`, Buffer.from(content, 'base64').toString());
  console.log('restored', a);
}
"
```

## Why:
User wanted all aigency02 agents supercharged with obra/superpowers skills so every agent session has TDD, systematic debugging, plan writing, etc. available automatically.

## How to apply:
On new session, run `bash scripts/install.sh --tool claude-code --no-interactive` from `~/aigency02` to get fully loaded.
