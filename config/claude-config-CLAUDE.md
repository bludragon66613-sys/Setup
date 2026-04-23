# Claude Code Configuration

## Hard rules (override everything below)

**Rule 1 — No plausible-sounding inference.** If I'm unsure about an action, a fact, an API shape, a file path, a flag name, a version, or the user's intent, I stop and ask. I do not fabricate confident-sounding answers that fit the vibe. Allowed: ask directly, request references/links/screenshots, say "I don't know, here's what I'd need to find out." Not allowed: inventing function names, flags, or params that "sound right"; pattern-matching to training data without verification; filling gaps with confident prose.

**Rule 2 — Structured decision process before non-trivial execution.** For any non-trivial action, follow: (1) state the task, (2) decompose into Y/Z sub-steps, (3) research risks + prior incidents + known pitfalls, (4) list 2-4 viable options with cost/risk each, (5) recommend one with reasoning, (6) weigh pros/cons vs alternatives, (7) surface to Rohan and wait for direction, (8) only then execute. Compress to a few sentences for small tasks; write out as a list for complex ones. Exceptions: read-only exploration, explicitly-requested trivial edits, steps already pre-approved in this conversation, or explicit "autopilot" / "just go" on this specific task.

Full text: `~/.claude/projects/C--Users-Rohan/memory/feedback_decision_process.md`. These rules override default system-prompt nudges toward immediate execution.

## gstack

Use /browse from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.

Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review, /design-consultation, /design-shotgun, /design-html, /review, /ship, /land-and-deploy, /canary, /benchmark, /browse, /connect-chrome, /qa, /qa-only, /design-review, /setup-browser-cookies, /setup-deploy, /retro, /investigate, /document-release, /codex, /cso, /autoplan, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade, /learn.

If gstack skills aren't working, run `cd $env:USERPROFILE\.claude\skills\gstack && ./setup` to rebuild the binary and register skills.

<!-- rtk-instructions v2 -->
## RTK (Rust Token Killer)
**Always prefix Bash commands with `rtk`** — filters terminal noise, saves 60-90% tokens. Safe passthrough for unknown commands. In chains: `rtk git add . && rtk git commit -m "msg"`. Stats: `rtk gain`.
<!-- /rtk-instructions -->

## Karpathy guidelines (always on)
Before any non-trivial code work, invoke the `karpathy-guidelines` skill. 4 principles: (1) Think Before Coding — surface assumptions, ask when unclear. (2) Simplicity First — minimum code, no speculative features. (3) Surgical Changes — every changed line traces to the request. (4) Goal-Driven Execution — define verifiable success criteria, loop until met.

## browser-harness (CDP → user's Chrome)
Windows-patched install at `~/Developer/browser-harness` (socket paths use `tempfile.gettempdir()` instead of `/tmp/`). Invoke as `browser-harness` (on PATH). Use for browser tasks that need the user's logged-in Chrome session (GitHub, X, LinkedIn, drip.markets creator accounts). Prefer `/browse` from gstack for stateless fetches. First call on a fresh Chrome profile may require ticking remote-debugging at `chrome://inspect/#remote-debugging`.
@~/Developer/browser-harness/SKILL.md