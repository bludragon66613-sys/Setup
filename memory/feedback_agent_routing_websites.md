---
name: agent-routing-for-website-builds
description: "For website + frontend builds, use executor (opus) + karpathy-guidelines for coding and a separate design-mastery AUDIT instance for audits; never let the builder grade itself"
metadata:
  node_type: memory
  type: feedback
  originSessionId: e0ded856-4734-4805-8294-ba53d23259fc
  modified: 2026-09-29T14:09:51.871Z
---

When building or iterating on websites / frontend apps:

- **Coding tasks (non-trivial)** → `executor` with `model=opus`, plus the `karpathy-guidelines` skill (surface assumptions, scope discipline, stack judgment). Replaced `senior-software-engineer`, archived 2026-09-29 (restorable from `~/Documents/Setup/agents/_archived/`).
- **Visual audits / UX critiques / brand fidelity reviews** → `design-mastery` in AUDIT mode, as a **separate instance** from whatever built the surface. Don't rely on the builder's self-verify screenshots — that's a marking-own-homework anti-pattern.
- **Visual implementation (after audit + spec approval)** → `design-mastery` in BUILD or FULL LOOP mode, scored against best-designs library. (`ui-ux-architect` + `super-designer` merged into `design-mastery` 2026-09-29.)
- **Plain `executor` (sonnet)** stays for known scoped work (file moves, copy-paste, config edits, npm installs) where the path is unambiguous.

**Why:** User on 2026-05-15 pushed back during the JOFF site build: "why don't you invoke the senior-engineer agent to help with coding tasks while you're building out websites, it has good knowledge on what stack to use, also use the ui-ux-designer agent to audit the website and see flaws, i can see so many already so." Plain executor was missing flaws the user could spot on first look (z-index overlaps, blank widget render, layout gaps). Agent roster consolidated 2026-09-29 with user approval; routing updated to keep the same intent.

**How to apply:** Default routing for any website / frontend rebuild:
- Plan → planner / architect
- Build (non-trivial) → executor (opus) + karpathy-guidelines
- Audit → design-mastery AUDIT, separate instance (parallel with build, not after)
- Visual rebuild → design-mastery BUILD / FULL LOOP
- Trivial ops → executor (sonnet)

Run audit + build in parallel where possible so flaws surface during work, not after.
