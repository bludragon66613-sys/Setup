---
name: Session savepoint 2026-03-25i
description: Kaneda skill loadout updated — 42 Aeon skills registered as OpenClaw workspace skills, crypto skills removed, superpowers (14) + agentic (11) skills added. 67 total ready skills.
type: project
---

Kaneda (@kaneda6bot) now has a full native skill loadout in OpenClaw workspace.

**Why:** Kaneda needed to know about and dispatch Aeon skills from Telegram, plus have the superpowers framework and agentic engineering patterns available as first-class capabilities.

**How to apply:** Skills live in `~/.openclaw/workspace/skills/`. Add new skills by dropping a SKILL.md folder there and restarting the gateway.

## What was done

### Phase 1 — Aeon skills registered (42 total)
- Created `~/.openclaw/workspace/skills/aeon-{slug}/SKILL.md` for all 42 Aeon skills
- Each skill teaches Kaneda to dispatch: `gh workflow run aeon.yml --repo bludragon66613-sys/NERV_02 --field skill=<slug>`
- Skills include trigger phrases so Kaneda auto-selects the right one from natural language

### Phase 2 — Crypto skills removed (10 removed)
- Deleted: `aeon-hl-intel`, `aeon-hl-scan`, `aeon-hl-trade`, `aeon-hl-monitor`, `aeon-hl-alpha`, `aeon-hl-report`
- Deleted: `aeon-token-alert`, `aeon-wallet-digest`, `aeon-on-chain-monitor`, `aeon-defi-monitor`
- 32 Aeon skills remain (all non-crypto)

### Phase 3 — Superpowers + agentic skills added
**Superpowers (14)** — copied from `~/.claude/skills/`:
brainstorming, test-driven-development, systematic-debugging, writing-plans, executing-plans, dispatching-parallel-agents, subagent-driven-development, using-superpowers, using-git-worktrees, verification-before-completion, requesting-code-review, receiving-code-review, finishing-a-development-branch, writing-skills

**Agentic (11)** — copied from `~/.claude/skills/`:
agentic-engineering, ai-first-engineering, autonomous-loops, continuous-agent-loop, continuous-learning, continuous-learning-v2, enterprise-agent-ops, verification-loop, agent-harness-construction, agentic-actions-auditor, data-scraper-agent

### Final state
- **67 total ready skills** in `~/.openclaw/workspace/skills/`
- Gateway restarted: `openclaw gateway restart`

## Key paths
- Workspace skills: `~/.openclaw/workspace/skills/`
- Check: `openclaw skills list | grep "aeon-\|brainstorming\|agentic"`

## Watch out
- `~/.openclaw/workspace/AEON.md` still has the CRYPTO section — should be cleaned up so Kaneda doesn't think those skills are available
- Kaneda trigger phrases not yet end-to-end tested from real Telegram messages
- `hl-trade` guard (requires Totoro approval) is baked into each remaining Aeon skill's SKILL.md but not enforced by OpenClaw itself
