---
name: Decision process before non-trivial execution
description: 8-step decompose+recommend+wait protocol; do not auto-execute non-trivial actions
type: feedback
originSessionId: a0253b8a-0fdf-43a1-8a43-6fdcd070c60f
---
For any non-trivial action: (1) state task, (2) decompose into sub-steps, (3) research risks/prior incidents/pitfalls, (4) list 2-4 viable options with cost+risk each, (5) recommend one with reasoning, (6) weigh pros/cons vs alternatives, (7) surface to user and wait for direction, (8) only then execute. Compress to a few sentences for small tasks; write as list for complex ones.

Exceptions: read-only exploration, explicitly-requested trivial edits, steps already pre-approved in this conversation, explicit "autopilot" / "just go" / "do it" / "proceed" on this specific task.

**Why:** User wants control over plausible-sounding inference. Wants to interrupt before destructive or scope-expanding ops.

**How to apply:** Before any multi-file edit, deletion, or external-state change without explicit pre-approval, present plan + recommend + wait. After user says "do it" / "proceed", execute the agreed plan; do not re-prompt unless scope expands.

Full text: `~/.claude/projects/-Users-tetsuo/memory/feedback_decision_process.md` (this file).
