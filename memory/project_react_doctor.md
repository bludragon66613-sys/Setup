---
name: react-doctor CI adoption
description: react-doctor lint+score tool installed across all React projects with PR-comment workflow and per-repo baseline configs
type: project
originSessionId: 97800f71-a514-4877-a643-a14ca2b24c43
---
react-doctor (npm: react-doctor, GH: millionco/react-doctor) adopted 2026-05-11 across all React projects.

**Why:** Catches bad-React patterns the agent generates — state/effects bugs, perf hits, a11y, dead code, Next.js misuse. Score-regression gate prevents quality drift PR-over-PR.

**How to apply:** On any React PR, expect a `react-doctor` bot comment with a 0–100 score. Score regressions = block merge until fixed. For new React files, the bundled skill auto-triggers on feature/bugfix work.

## Skill
Installed at `~/.claude/skills/react-doctor/` for Claude Code, Codex, OpenClaw. Auto-triggers on "finishing feature / fixing bug / before commit React code". Runs `npx -y react-doctor@latest . --verbose --diff`.

## Workflows live
| Repo | Workflow path | fail-on | Score |
|------|---------------|---------|------:|
| `Ssquare` | `.github/workflows/react-doctor.yml` | **warning** (gate active) | **100/100** |
| `NERV_02` | `.github/workflows/react-doctor.yml` (path `dashboard/**`) | **warning** (gate active) | **100/100** |
| `nerv-dashboard` | `.github/workflows/react-doctor.yml` | **warning** (gate active) | **100/100** |

All 3 repos reached 100/100 with fail-on:warning gates active. Future PRs introducing warnings fail CI.

## False-positive notes
- `app/api/agency/jobs/route.ts` in both NERV repos triggered `nextjs-no-side-effect-in-get-handler` on a per-request SSE `Map.set()` for dedup state. The Map is connection-scoped, dies on disconnect, not global. Rule semantics too coarse — exempted at file level with rationale.

## Config patterns
Per-repo `react-doctor.config.json` at project root. ssquare config has 14 narrow exemptions (each documented). NERV_02 + nerv-dashboard configs share 4 global rule ignores for the deliberate cyberpunk aesthetic (`no-tiny-text`, `no-wide-letter-spacing`, em-dash, three-period-ellipsis).

## Useful commands
- `npx -y react-doctor@latest . --score --offline` — quick score only
- `npx -y react-doctor@latest . --json --offline` — full JSON for piping
- `npx -y react-doctor@latest . --explain <file:line>` — diagnose suppression / why rule fired
- `npx -y react-doctor@latest install --yes` — re-install skill on a new machine

## Reference
- Repo: https://github.com/millionco/react-doctor
- Live demo: https://react.doctor
- Marketplace action: `millionco/react-doctor@main`
