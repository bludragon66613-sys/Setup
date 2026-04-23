---
name: 2026-04-19c Design Agent Upgrade
description: ui-ux-architect + super-designer enhanced with scored rubrics, taste encoding, and best-designs library; design-mastery created as third agent coordinating them
type: project
originSessionId: d6c57f1c-7624-4c9e-9851-db4e536cee28
---
# Session Savepoint: Design Agent Upgrade

**Date:** 2026-04-19 (evening)
**Scope:** `~/.claude/agents/` — three design agents upgraded into a coordinated stack
**Origin:** Grok share https://x.com/i/grok/share/7c2444b20e9645bfabb187ff79ce9708 — advice on enhancing design agents via encoded preferences, best-designs library, Claude Design → Code handoff, and meta-skill coordination

## What changed

### `ui-ux-architect.md` (374 → 520 lines)
- Frontmatter rewritten: now 10-dimension scored rubric, taste-memory-first, hands off to super-designer
- Added `design-review` skill; added Bash tool
- **Startup Protocol section B** — mandatory load of 5 user feedback memories (taste, AI-slop, process, copy style, PDF quality); fails loudly if missing
- **Startup Protocol section C** — global design reference library (`~/.claude/design-references/`, 54 brands) with `design-md extract` propose-and-approve flow
- **Step 1b: Score Every Finding** — every audit dimension gets 1-10 score with named reference; "score without reference" is disallowed
- **Scorecard table** baked into audit output (12 rows incl. Taste alignment)
- **Best-Designs Library Protocol** — append-only `.claude/memory/best-designs-index.md`; seeds on first contact; never overwrite
- **Handoff to Super-Designer** — exact markdown bundle shape (Intent / Taste markers / Target references / Change list / DESIGN_SYSTEM updates / Out-of-scope / Verification checklist)
- **Self-Improvement Loop** — auto-updates design-memory.md + best-designs-index.md + LESSONS.md each session; proposes new global feedback memories with approval
- **Agent Coordination** — names design-mastery as lead, super-designer as builder, plus code-reviewer / e2e-runner / designer / Skill Creator

### `super-designer.md` (310 → 448 lines)
- Frontmatter rewritten: consumes bundles from ui-ux-architect OR Claude Design; self-scores before ship
- Added `design-review` + `design-iterator` skills
- **Taste Encoding section** — same 5 feedback memories + best-designs-index, fail-on-missing
- **Phase 0: Intake (Handoff Bundle)** — distinguishes 3 input shapes (ui-ux-architect bundle / Claude Design bundle / freeform) and adjusts behavior per source
- **Self-Critique Rubric** — 11 dimensions, composite ≥ 8/10 required to ship; < 8 escalates with options
- **9-item AI-slop gate** — explicit list inline; auto-fail if any present
- **Best-Designs Library Protocol** — scan on intake, append on win (≥ 9/10 + beats existing entry)
- **Handoff Bundle Output** — when acting as lead (no upstream bundle), emits its own bundle for user approval before building
- **Self-Improvement Loop** — same shape as ui-ux-architect
- **Agent Coordination** — names design-mastery as lead

### `design-mastery.md` (NEW, 320 lines)
- **Role:** lead/coordinator; does not audit or build directly — dispatches ui-ux-architect and super-designer
- **Color:** cyan, `maxTurns: 60`, `Task` tool enabled for sub-agent dispatch
- **11 skills:** ui-styling, frontend-design, design-system, ui-ux-pro-max, design, design-system-evaluation, design-review, design-iterator, design-shotgun, design-consultation, design-html
- **4 modes:** Audit-only / Build-only / Audit→Build / Reference→Build
- **Taste brief** generated from feedback memories + best-designs-index + brand refs, passed verbatim into every dispatch
- **Dispatch templates** — exact `Task()` prompt shapes for ui-ux-architect and super-designer + peer skills
- **Pre-build gate + pre-ship gate** — rejects incomplete HANDOFF BUNDLEs and composite < 8/10 outputs
- **Claude Design ↔ Claude Code bundle translator** — round-trips both directions
- **Library custodian** — owns `.claude/memory/best-designs-index.md`, seeds-append-never-overwrite
- **Coordination Report** output at session end — stable format
- **Self-improvement:** proposes new global feedback memories and stable-pattern skill encodings after 3+ sessions

## Files touched

- `C:\Users\Rohan\.claude\agents\ui-ux-architect.md` (edited)
- `C:\Users\Rohan\.claude\agents\super-designer.md` (edited)
- `C:\Users\Rohan\.claude\agents\design-mastery.md` (created)
- `C:\Users\Rohan\.claude\agent-memory\design-mastery\` (created, empty)
- `C:\Users\Rohan\Setup\agents\*` (three files synced)

## Follow-ups

1. Seed `.claude/memory/best-designs-index.md` in an active project (drip, NTS, or Morning Light) as the first real library
2. Optionally backup to `claudecodemem/agents/` too — has stale copies of ui-ux-architect and super-designer, and no design-mastery
3. First end-to-end trial: dispatch design-mastery on a drip surface that needs both audit and rebuild

## Invocation examples

```
Agent({
  subagent_type: "design-mastery",
  prompt: "audit and rebuild drip's onboarding with Linear's precision"
})
```

```
Agent({
  subagent_type: "design-mastery",
  prompt: "build a pricing page for Morning Light with the Stripe aesthetic"
})
```
