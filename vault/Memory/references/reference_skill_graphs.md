---
name: skill-graph-architecture
description: Skill graph pattern (arscontexta) — 11 domain MOCs in ~/.claude/skills/_mocs/ connecting 285 skills via wikilinks for progressive disclosure
type: reference
---

# Skill Graph Architecture

## What
285 flat skills reorganized into 11 domain MOCs (Maps of Content) at `~/.claude/skills/_mocs/`. Each MOC uses wikilinks to connect related skills with contextual prose. Based on Heinrich (@arscontexta)'s skill graph pattern.

## Structure
```
~/.claude/skills/
├── SKILLS.md          ← master graph index (entry point)
├── _mocs/
│   ├── security.md       (~30 skills)
│   ├── fuzzing.md        (~12 skills)
│   ├── blockchain.md     (~7 skills)
│   ├── engineering.md    (~25 skills)
│   ├── languages.md      (~35 skills)
│   ├── testing.md        (~15 skills)
│   ├── product-management.md (~65 skills)
│   ├── design-creative.md (~10 skills)
│   ├── content-marketing.md (~12 skills)
│   ├── workflow.md       (~25 skills)
│   └── business-ops.md   (~15 skills)
├── <skill-name>/SKILL.md  ← individual skills (unchanged)
```

## Progressive Disclosure Pattern
SKILLS.md → MOC descriptions → wikilinks in prose → individual SKILL.md → full content

## arscontexta Plugin
- Repo: `agenticnotetaking/arscontexta`
- Install: `/plugin marketplace add agenticnotetaking/arscontexta` → `/plugin install arscontexta@agenticnotetaking`
- Commands: `/arscontexta:setup`, `/reduce`, `/reflect`, `/reweave`, `/pipeline`
- 249 research claims about knowledge graph construction

## Created
2026-04-05. Non-destructive — existing skill triggers all work unchanged.
