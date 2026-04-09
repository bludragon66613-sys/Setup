# NERV — Project Summary

> Last synced: 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_nerv.md`

---

## Overview

NERV_02 and nerv-dashboard are the primary active AI agent projects. NERV is both a technical system and the parent consultancy brand for Rohan's AI operations business.

## NERV_02

Autonomous agent project powered by Claude Code on GitHub Actions. Features 41 skills across crypto, intel, dev, and system ops categories.

- **Repo:** `github.com/bludragon66613-sys/NERV_02`
- **Code:** `~/aeon/`
- **Dashboard:** `http://localhost:5555` — run `./aeon` from `~/aeon`
- **NERV terminal:** `http://localhost:5555/nerv` — Claude command interface, dispatches skills to GitHub Actions
- **Intel page:** `http://localhost:5555/intel` — Hyperliquid market intelligence
- **Model:** Toggles between `claude-sonnet-4-6` and `claude-opus-4-6`
- **Stack:** Next.js 16, Tailwind, Anthropic SDK, Claude CLI fallback

## nerv-dashboard

Standalone version of the NERV dashboard, deployed on Vercel.

- **Repo:** `github.com/bludragon66613-sys/nerv-dashboard`
- **Code:** `~/aeon/dashboard/`
- **Deployment:** Vercel (uses Vercel SDK with API key on Vercel, Vercel CLI locally)
- **Features:** Terminal button, skill dispatch interface

## NERV as Brand

In the SIGNAL consultancy architecture:

- **NERV** = parent consultancy brand (signs contracts, sends invoices)
- **SIGNAL** = product/platform sub-brand (the autonomous agent engine)
- **Paperclip** = open-source credibility signal
- **OpenClaw** = AI gateway infrastructure

## Skill Categories (41 total)

| Category | Skills |
|----------|--------|
| INTEL | morning-brief, rss-digest, hacker-news-digest, paper-digest, tweet-digest, reddit-digest, research-brief, search-papers, security-digest, fetch-tweets, search-skill, idea-capture |
| CRYPTO | hl-intel, hl-scan, hl-monitor, hl-trade, hl-report, hl-alpha, token-alert, wallet-digest, on-chain-monitor, defi-monitor |
| GITHUB | issue-triage, pr-review, github-monitor |
| BUILD | article, digest, feature, code-health, changelog, build-skill |
| SYSTEM | goal-tracker, skill-health, self-review, reflect, memory-flush, weekly-review, heartbeat, skill-eval, skill-evolve, autoagent, autoskills |

## Related Projects

- [[openclaw-ai-gateway]] — Bridge between NERV dashboard and Telegram bot
- [[omc-orchestration]] — oh-my-claudecode agent orchestration integrated into NERV workflow
- [[autoagent-optimization]] — AutoAgent loop for autonomous skill improvement
- [[signal-consultancy]] — NERV as parent brand for AI consultancy
