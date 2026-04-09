---
name: workflow
description: Agent orchestration, development workflows, skill creation, autonomous loops, and Claude Code meta-skills
type: moc
---

# Workflow & Meta

How to work effectively with Claude Code — agent orchestration, skill creation, development pipelines, and autonomous operations.

## Development Pipeline

The canonical workflow: research → plan → TDD → review → commit. These skills enforce each stage:

1. [[search-first]] — research before coding: find existing tools, libraries, implementations
2. [[blueprint]] — turn a one-line objective into a step-by-step plan
3. [[writing-plans]] — create implementation plans from specs
4. [[executing-plans]] — execute plans with progress tracking
5. [[test-driven-development]] and [[tdd-workflow]] — RED → GREEN → REFACTOR
6. [[requesting-code-review]] and [[receiving-code-review]] — code review workflow
7. [[finishing-a-development-branch]] — final checks before merge
8. [[verification-before-completion]] — verify before claiming done

## Agent Orchestration

[[dispatching-parallel-agents]] — launch 2+ independent tasks in parallel. [[subagent-driven-development]] — execute plans with independent sub-agents.

[[team-builder]] — compose and dispatch parallel agent teams. [[dmux-workflows]] — multi-agent orchestration using tmux pane manager.

[[claude-devfleet]] — orchestrate multi-agent coding via Claude DevFleet. [[ralphinho-rfc-pipeline]] — RFC-driven multi-agent DAG with quality gates.

[[omc-reference]] — OMC agent catalog, tools, and routing reference.

## Autonomous Operations

[[autonomous-loops]] — patterns for continuous autonomous agent loops. [[continuous-agent-loop]] — quality-gated autonomous execution.

[[continuous-learning]] and [[continuous-learning-v2]] — extract reusable patterns from sessions. [[strategic-compact]] — manual context compaction at logical intervals.

## Skill Creation & Management

[[skill-creator]] — interactive guide for creating new skills. [[skill-improver]] — review and fix skill quality issues.

[[skill-stocktake]] — audit skills and commands for quality. [[writing-skills]] — best practices for skill authoring.

[[designing-workflow-skills]] — structure workflow-based skills.

## Claude Code Configuration

[[configure-ecc]] — install Everything Claude Code. [[using-superpowers]] — establish how to find and use capabilities.

[[using-git-worktrees]] — feature isolation with git worktrees. [[claude-in-chrome-troubleshooting]] — fix Chrome MCP extension issues.

## Thinking & Research

[[brainstorming]] — mandatory before creative work. [[ask-questions-if-underspecified]] — clarify before implementing.

[[prompt-optimizer]] — analyze and optimize prompts. [[web-researcher]] — systematic web research pipeline.

[[exa-search]] — neural search via Exa MCP. [[defuddle]] — extract clean markdown from web pages.

[[data-scraper-agent]] — build automated data collection agents.

## Agent Engineering

[[agentic-engineering]] — eval-first agent development. [[ai-first-engineering]] — operating model for AI-agent teams.

[[agent-harness-construction]] — design agent action spaces and tool definitions. [[enterprise-agent-ops]] — operate production agent workloads.

## Knowledge Management

[[obsidian-markdown]] — Obsidian-flavored markdown with wikilinks. [[obsidian-bases]] — Obsidian Bases (.base files).

[[obsidian-cli]] — interact with Obsidian vaults via CLI. [[json-canvas]] — JSON Canvas files for visual knowledge maps.

[[para-memory-files]] — PARA method file-based memory. [[nanoclaw-repl]] — persistent zero-dependency REPL.

## Code Quality

[[coding-standards]] — universal standards. [[plankton-code-quality]] — write-time quality enforcement.

[[coding-debugger]] — systematic debugging. [[systematic-debugging]] — root cause analysis methodology.

## Related

- [[testing]] MOC for TDD and verification
- [[engineering]] MOC for architecture patterns
