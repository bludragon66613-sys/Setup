---
name: Multi-agent isolation via worktrees
description: When >1 AI agent works on same repo, use worktree-per-agent, not branch-per-agent in shared dir
type: feedback
originSessionId: 1411abca-bf00-4f22-96d6-26f1a493251e
---
When more than one AI agent (Claude + Codex/OpenClaw, etc.) works on a project concurrently, use **worktree-per-agent** isolation:

```
~/<project>             main          shared baseline + PR target
~/<project>-claude      claude/main   Claude's workspace
~/<project>-codex       codex/main    Codex's workspace
```

Created via `git worktree add -b <branch> <path> main`. Each agent commits to its own branch; PRs merge into `main`.

**Why:** Branches alone don't solve concurrent filesystem access. If two agents share one working tree and one runs `git checkout` mid-edit, the other's WIP gets stomped. Worktrees give each agent an isolated filesystem checkout that shares the same `.git`.

**How to apply:** When the user says "let me work with codex/another agent in parallel" or "avoid conflicts between agents", default to worktree-per-agent. Push each branch with `-u origin <branch>` so the other agent can pull from anywhere. Don't suggest branch-per-agent in shared dir as a viable alternative — it isn't, for two-agent concurrency.
