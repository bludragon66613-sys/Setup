---
name: Design Agent Stack Follow-ups
description: Open TODOs from the 2026-04-19c design-mastery / ui-ux-architect / super-designer upgrade session. Pick these up to close the loop.
type: project
originSessionId: d6c57f1c-7624-4c9e-9851-db4e536cee28
---
# Design Agent Stack — TODOs

Paused 2026-04-19 evening. Three agents enhanced and synced to Setup + claudecodemem + Obsidian. Savepoint: `session_savepoint_2026-04-19c_design-agents.md`.

## 1. Seed the first real best-designs library
**Why:** The scoring rubric in ui-ux-architect and super-designer requires a named reference per score. Without `.claude/memory/best-designs-index.md` in at least one project, every score falls back to generic brand refs from `~/.claude/design-references/` — which works, but the library only starts getting smarter once local wins are logged.

**How to apply:**
- Pick one project as the pilot — **drip** is the strongest candidate (most active, strongest brand bible at BRAND.md, 2 recent reskin passes)
- Alternatives: NTS (clean slate, brand bible complete), Morning Light (energy vertical, fresh)
- Run: `Agent({ subagent_type: "design-mastery", prompt: "seed .claude/memory/best-designs-index.md for drip — pick 3 past surfaces I should treat as the taste baseline" })`
- design-mastery will prompt for the 3 seed surfaces, then write the append-only library header

## 2. First end-to-end trial of design-mastery
**Why:** The 3-agent loop has not been stress-tested. Until it runs on a real surface, we don't know whether the HANDOFF BUNDLE shape is tight enough, whether the pre-build gate catches the right things, and whether Task dispatch into ui-ux-architect + super-designer actually produces better work than running either alone.

**How to apply:**
- Pick a drip surface that is genuinely ugly AND blocks a real user flow — candidate: `/app/products` (flagged in `_archive/session_savepoint_2026-04-18_drip.md` as "inline-style mess needs BRAND.md treatment")
- Run: `Agent({ subagent_type: "design-mastery", prompt: "audit and rebuild drip's /app/products with the drip BRAND.md and the Swiss Clinical direction locked in" })`
- Watch for: (a) does it correctly pick mode C (Audit → Build)? (b) does ui-ux-architect emit a usable HANDOFF BUNDLE? (c) does super-designer self-score honestly? (d) does the Coordination Report cleanly show what shipped?
- If any friction: edit the agent prompt directly based on what was missing

## 3. Propose durable taste rules surfaced by the loop
**Why:** Grok's advice and my own design-process feedback suggest that after 3+ sessions, stable taste patterns should be encoded as either a new global feedback memory OR a reusable skill via Anthropic's Skill Creator. The loop is built to surface these automatically (see SELF-IMPROVEMENT LOOP in all three agents).

**How to apply:**
- After the first 3 real design-mastery runs, review what taste markers kept repeating in the HANDOFF BUNDLEs
- Anything that appeared verbatim across 3+ runs is a candidate for `~/.claude/projects/C--Users-Rohan/memory/feedback_*.md`
- Anything that requires >1 paragraph to explain is a candidate for a new skill

## 4. Optional: update `~/CLAUDE.md` agent table
**Why:** The agent table in `C:\Users\Rohan\CLAUDE.md` lists `ui-ux-architect` and `super-designer` but not `design-mastery`. Fresh sessions will not discover the coordinator unless it's in the table.

**How to apply:**
- Add one row: `| design-mastery | Lead design coordinator. Dispatches ui-ux-architect + super-designer, owns taste brief + best-designs library, gates pre-build and pre-ship |`
- Small edit. Do this when it naturally comes up, or as part of the first real trial.

## 5. Optional: `claudecodemem/agents/design/` folder
**Why:** `claudecodemem/agents/` has a `design/` subfolder that's currently empty (or near-empty). If the 3 design agents are treated as a coordinated stack, grouping them under `design/` would make the structure self-documenting.

**How to apply:**
- Low priority. Only worth doing if the directory layout starts mattering for discoverability.
- Would require matching restructure in `Setup/agents/` and `~/.claude/agents/` — which may or may not be desirable since Claude Code discovers agents by name regardless of folder.
