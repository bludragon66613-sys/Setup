# NERV — Autonomous Agent System

> Synced from Claude Code memory — 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_nerv.md`

---

NERV is an autonomous AI agent system running on GitHub Actions, dispatched via a local Next.js dashboard. It is simultaneously a personal AI operations layer and the parent brand for Rohan's AI consultancy business.

## Architecture

- **Dispatch:** NERV terminal at `http://localhost:5555/nerv` sends `DISPATCH:{"skill":"<name>"}` commands
- **Execution:** GitHub Actions picks up the dispatch and runs the skill via Claude Code
- **Dashboard:** Next.js 16 app at `~/aeon/` — runs on `:5555` via `./aeon`
- **Intelligence:** `/intel` page shows Hyperliquid market data
- **Model:** Configurable between `claude-sonnet-4-6` and `claude-opus-4-6`
- **Proxy:** `openclaw-proxy` at `:5557` bridges dashboard → OpenClaw hooks API

## Skill Library (41 skills)

NERV's skills are autonomous, dispatched tasks that run in GitHub Actions:

**INTEL skills** — morning-brief, rss-digest, hacker-news-digest, paper-digest, tweet-digest, reddit-digest, research-brief, search-papers, security-digest, fetch-tweets, search-skill, idea-capture

**CRYPTO skills (Hyperliquid)** — hl-intel (flagship), hl-scan, hl-monitor, hl-trade, hl-report, hl-alpha

**CRYPTO MONITORING** — token-alert, wallet-digest, on-chain-monitor, defi-monitor

**GITHUB** — issue-triage, pr-review, github-monitor

**BUILD** — article, digest, feature, code-health, changelog, build-skill

**SYSTEM** — goal-tracker, skill-health, self-review, reflect, memory-flush, weekly-review, heartbeat, skill-eval, skill-evolve

## nerv-dashboard (Vercel)

Standalone deployment of the dashboard on Vercel.
- **Repo:** `github.com/bludragon66613-sys/nerv-dashboard`
- **Code:** `~/aeon/dashboard/`
- Uses Vercel SDK with API key on Vercel, Vercel CLI locally

## NERV as Brand

In [[signal-consultancy]] architecture:
- **NERV** = parent consultancy brand (contracts, invoices)
- **SIGNAL** = autonomous agent engine product
- **Paperclip** = open-source credibility
- **OpenClaw** = AI gateway infrastructure

## Startup Sequence

```bash
bash ~/startup-services.sh
# Order: OpenClaw → Paperclip → Dashboard
```

## Related

- [[openclaw-ai-gateway]] — Local AI gateway that OpenClaw-proxy bridges to
- [[omc-orchestration]] — Multi-agent orchestration integrated into NERV's workflow
- [[autoagent-optimization]] — Autonomous skill improvement running against NERV's skill library
- [[signal-consultancy]] — NERV as the parent consultancy brand
- [[paperclip-agent-platform]] — Distinct from NERV; manages teams vs single-agent dispatch
