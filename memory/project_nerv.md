---
name: NERV_02 / Aeon
description: Autonomous agent on GitHub Actions with affective memory Phase 2 deployed — 54 skills including 7 relationship-store skills
type: project
originSessionId: a2b3024e-10e1-4001-8b89-8f32d2774b9f
---
# NERV_02 / Aeon

**Repo:** github.com/bludragon66613-sys/NERV_02
**Local:** `~/aeon`
**Stack:** GitHub Actions cron-triggered Claude Code sessions, 54 skills (markdown-as-logic), Node.js helper scripts, Next.js 16 dashboard deployed on Vercel

## Active state as of 2026-04-15

- **main** branch, synced with origin
- **Branch:** `main` (no feature branches currently)
- **Last non-intel commit:** `2ad5102 feat(skills): add autoagent + autoskills, enhance skill-evolve`
- **Intel updates:** commits every ~6h from automated hl-intel cron (SIDEWAYS market, FG ~14-23, BTC tracking)

## Phase 2 affective memory pipeline (2026-04-15)

Shipped in 8 commits. Pipeline is live in `aeon.yml` but has NOT yet had its first production runtime as of commit time — first scheduled run is 2026-04-16 06:30 UTC.

### Storage layer — `memory/relationship/`

| File | Contents | Writer |
|---|---|---|
| `README.md` | Layout guide + read order for skills | hand |
| `profile.md` | Slow-changing: identity, timezone (IST), communication style (brevity, no emojis), model prefs (Sonnet default, Opus for complex), quality bar, active project list, things to never assume | hand-curated |
| `projects.md` | Daily rebuild from `gh search/commits author:bludragon66613-sys`, ranked by recency, active/stalled/archived | `project-state` skill |
| `decisions.md` | Append-only log of stated preferences, architectural choices, rules | `decision-capture` skill |
| `pending.md` | Open follow-ups Aeon owes, with asked-date and due | `heartbeat` sweeps + hand |
| `interactions/YYYY-MM-DD.md` | Daily log of what happened — user commits, skill runs, notifications, inbound messages | multiple writers |
| `eval-results.jsonl` | One entry per day of the 5-check suite, tracks 14-day clean streak | `relationship-eval` skill |

### Daily cron flow (aeon.yml)

| Time UTC | Skill | Purpose |
|---|---|---|
| 06:30 | `project-state` | Rebuild `projects.md` from gh API |
| 07:00 | `morning-brief` | Reads relationship/, notifies |
| 09:00 | `issue-triage` / `pr-review` / `github-monitor` | Existing |
| 12:00 | `heartbeat` | Sweeps + appends to interactions/ |
| 12:00 | `hl-*` crypto skills | Existing |
| 18:00 | `self-review` | Audits relationship hygiene + reads `eval-results.jsonl` |
| 18:00 | `reflect`, `memory-flush` | Existing |
| 21:00 | `interaction-log` | End-of-day roll-up |
| 21:30 | `decision-capture` | Scans interactions for decisions |
| 22:00 | `relationship-eval` | 5-check suite, streak tracking |
| Every 5 min | `messages.yml` workflow | Polls Telegram/Discord/Slack, persists replies to interactions |

### Phase 2 exit criterion

14 consecutive clean days on `relationship-eval`. The 5 checks:

1. **profile-current** — every repo in `profile.md` active list has ≥1 commit in last 30 days (gh API query)
2. **pending-followup** — zero items in `pending.md` aged > 7 days
3. **project-freshness** — `projects.md` mtime < 25h (proves `project-state` is running)
4. **interaction-density** — ≥5 days/week have an interaction file
5. **notification-restraint** — zero notifications outside working hours from profile.md

Exit hit → self-review celebrates in weekly notification. Failure → surfaces in next notification as top finding.

### Phase 1 was retired

Commit `3f79bbf chore(cleanup): retire incomplete Phase 1 eval suite` deleted 4 files. Phase 1 was misimplemented (`identity-persists` eval claimed to check `SOUL.md`/`IDENTITY.md` but actually counted skill files; those files never existed in this repo), never wired to a scheduled skill, and accrued 1 clean day then 5 days of zero runs before this session.

## Skills inventory (54)

**Phase 2 new (7):** project-state, interaction-log, decision-capture, relationship-eval, autoagent, autoskills, (skill-evolve enhanced)

**Intel (13):** morning-brief, rss-digest, hacker-news-digest, paper-digest, tweet-digest, reddit-digest, research-brief, search-papers, security-digest, fetch-tweets, search-skill, idea-capture, rd-council

**Crypto (10):** hl-intel, hl-scan, hl-monitor, hl-trade, hl-report, hl-alpha, token-alert, wallet-digest, on-chain-monitor, defi-monitor

**GitHub (3):** issue-triage, pr-review, github-monitor

**Build (7):** article, digest, feature, code-health, changelog, build-skill, paperclip-eval

**System (11):** goal-tracker, skill-health, self-review, reflect, memory-flush, weekly-review, heartbeat, skill-eval, skill-evolve, session-debrief, session-sync

## Dashboard

Standalone Next.js 16 at `~/aeon/dashboard`, deployed on Vercel as nerv-dashboard. Has the terminal UI (/nerv) and intel display (/intel). Routes served at http://localhost:5555 in dev mode.

**Dashboard repo:** github.com/bludragon66613-sys/nerv-dashboard
**Aeon repo:** github.com/bludragon66613-sys/NERV_02
**Watched upstream:** github.com/aaronjmars/aeon

## Gotchas / invariants

- `AEON_TELEGRAM_BOT_TOKEN` is a **separate** repo secret from `TELEGRAM_BOT_TOKEN` (used by OpenClaw). Phase 2.5 inbound polling skips Telegram when this is unset — check GH repo secrets before expecting inbound messages to appear in `interactions/`.
- Aeon runs on **GitHub Actions Linux runners**, not the user's local machine. Skills that need to scan the user's filesystem (e.g. `project-state`) must use `gh` API instead of `git log` against local repos.
- Cross-workflow git push races: multiple skills write to `memory/relationship/interactions/${today}.md`. Each does its own commit + push. `messages.yml` has a retry-with-rebase loop; others rely on serial execution via cron scheduling. Watch for push failures in GH Actions logs.
- The `session-distill.js` Stop hook at `~/.claude/hooks/session-distill.js` is NOT registered in `~/.claude/settings.json` Stop hooks — only 1 manifest captured (2026-03-25). Phase 2.4 deliberately doesn't depend on it. Documented in `relationship/pending.md` as waiting-on-user with the exact JSON snippet to add.
- GitNexus-indexed: aeon (1002 symbols, 1986 relationships, 78 execution flows), dashboard (524 symbols, 1244 relationships, 41 execution flows). CLAUDE.md mandates running `gitnexus_impact` before editing any symbol.
