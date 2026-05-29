---
name: Agent routing for website builds
description: For website + frontend builds, use senior-software-engineer for coding + ui-ux-architect for audits; do not default to plain executor agent
type: feedback
---

When building or iterating on websites / frontend apps:

- **Coding tasks** → use `senior-software-engineer` (better stack judgment, surfaces assumptions, enforces scope discipline, higher precision than plain executor). Not for trivial single-file edits; for non-trivial implementations, refactors, integrations.
- **Visual audits / UX critiques / brand fidelity reviews** → use `ui-ux-architect` (10-dimension scored rubric, phased improvement plans, surgical visual refinements). Don't rely on the executor's self-verify screenshots — that's a marking-own-homework anti-pattern.
- **Visual implementation (after audit + spec approval)** → `super-designer` for build/iterate, scored against best-designs library.
- **Plain `executor`** stays for known scoped work (file moves, copy-paste, config edits, npm installs) where the path is unambiguous.

**Why:** User on 2026-05-15 pushed back during the JOFF site build: "why don't you invoke the senior-engineer agent to help with coding tasks while you're building out websites, it has good knowledge on what stack to use, also use the ui-ux-designer agent to audit the website and see flaws, i can see so many already so." Plain executor was missing flaws the user could spot on first look (z-index overlaps, blank widget render, layout gaps).

**How to apply:** Default routing for any website / frontend rebuild:
- Plan → planner / architect
- Build (non-trivial) → senior-software-engineer
- Audit → ui-ux-architect (parallel with build, not after)
- Visual rebuild → super-designer
- Trivial ops → executor

Run audit + build in parallel where possible so flaws surface during work, not after.
