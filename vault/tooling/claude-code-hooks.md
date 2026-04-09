---
title: claude code hooks
type: tooling
status: active
---

# Claude Code Hooks — Automating Safety & Quality

**Source:** darkzod (@zodchiii)  
**Date:** 2026-04-03  
**Link:** https://x.com/zodchiii/status/2040000216456143002

## Core Thesis

`CLAUDE.md` is a suggestion. Hooks are automatic actions that fire every time Claude edits a file, runs a command, or finishes a task. Configured in `.claude/settings.json` (committed to git) so the whole team gets the same safety nets.

## Hook Types

**PreToolUse** — runs *before* Claude does something. Exit code 2 blocks the action.  
**PostToolUse** — runs *after* Claude does something. Cleanup, formatting, tests, logging.

---

## The 8 Essential Hooks

### 1. Auto-format Every File
PostToolUse on Write|Edit. Runs Prettier/black/gofmt automatically.

### 2. Block Dangerous Commands
PreToolUse on Bash. Blocks `rm -rf`, `git reset --hard`, `DROP TABLE`, `curl | sh`.

### 3. Protect Sensitive Files
PreToolUse on Edit|Write. Blocks edits to `.env`, `.git/*`, `package-lock.json`, secrets.

### 4. Run Tests After Every Edit
PostToolUse on Write|Edit. `npm run test --silent 2>&1 | tail -5`. Claude sees failures and fixes them.

### 5. Require Passing Tests Before PR
PreToolUse on `mcp__github__create_pull_request`. Hard gate: no green tests, no PR.

### 6. Auto-lint and Report Errors
PostToolUse on Write|Edit. `npx eslint --fix`. Chain with #1 for formatted + lint-clean code.

### 7. Log Every Command
PreToolUse on Bash. Appends timestamped commands to `.claude/command-log.txt`. Audit trail.

### 8. Auto-commit After Each Task
Stop hook. `git add -A && git commit -m "chore(ai): apply Claude edit"`. Atomic commits per task.

---

## Setup
1. Copy into `.claude/settings.json`
2. Create hook scripts in `.claude/hooks/`
3. `chmod +x .claude/hooks/*.sh`
4. Commit to git

## Related Workflows
- [[subconscious-agent-loop]]
- [[30-day-saas-claude-code]]
- [[stitch-mcp-design-system]]

