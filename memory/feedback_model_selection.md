---
name: Model Selection Preference
description: Use Sonnet by default, only use Opus for complex coding or deep reasoning tasks
type: feedback
---

Default to Sonnet (claude-sonnet-4-6) for all regular tasks. Only use Opus (claude-opus-4-6) for complex coding tasks or deep architectural reasoning.

**Why:** Cost efficiency — Opus is 3x more expensive and most tasks don't require its deeper reasoning. Rohan wants to reserve Opus for when it matters.

**How to apply:** When spawning subagents, use `model: "sonnet"` unless the task involves complex multi-file refactoring, architectural decisions, or intricate debugging. Research, document generation, simple edits, and routine tasks should all use Sonnet.
