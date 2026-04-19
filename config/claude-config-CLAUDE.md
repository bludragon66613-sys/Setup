# Claude Code Configuration

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