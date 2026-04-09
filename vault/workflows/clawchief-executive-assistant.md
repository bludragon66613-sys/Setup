---
title: clawchief executive assistant
type: workflow
status: active
---

# ClawChief — The OpenClaw Executive Assistant OS

**Source:** Ryan Carson (@ryancarson)  
**Date:** 2026-04-03  
**Repo:** https://github.com/snarktank/clawchief

## Core Thesis

"I didn't get the world's best assistant by asking OpenClaw better questions. I got it by giving OpenClaw a better **operating system**."

ClawChief isn't a replacement for OpenClaw. It's an **operating layer on top** — skills, workspace files, context, and cron jobs that make the assistant proactive instead of reactive.

"What it can do" (Executive Assistant Mode):
- Schedule meetings, parse booking links
- Check inbox every 15 min, surface only what matters
- Proactively follow up on unanswered emails
- Watch calendar, flag conflicts, warn about upcoming events
- Run your day from **one canonical markdown task list**
- Prep task list before you wake up
- Keep tasks clean (no duplicates)
- Update outreach tracker/CRM from email activity
- Research suppliers/partners and reach out
- Send short, high-signal updates only when action is needed

## The 8-Step Install

### 1. Start with working OpenClaw
Prerequisite. (Already done for Kaneda.)

### 2. Get GOG working
GOG (Google Operations Gateway) must handle:
- Gmail message search
- Calendar list and event reads
- Google Sheets metadata reads
- Google Docs reads (for meeting-notes ingestion)

If these are broken, the assistant can't do real EA work reliably.

### 3. Install the skills
Copy skill directories into `~/.openclaw/skills/`. These teach OpenClaw how to:
- Act like an executive assistant
- Manage a real task list
- Prepare the day proactively
- Handle operational business-development workflows

### 4. Install the workspace files
Copy into `~/.openclaw/workspace/`:

**HEARTBEAT.md** — Tells the assistant how to be proactive:
- Read the priority map
- Read the auto-resolver
- Read the meeting-notes policy + ledger
- Read the live task file
- Run the right workflow
- Message only when something actually matters

*Why it matters:* Stops the assistant from being passive *without* turning it into a noisy mess.

**TOOLS.md** — Environment-specific notes:
- Preferred email accounts
- Tracker / Google Sheets notes
- Local environment quirks
- Target-market notes
- Tactical operating rules (not buried in prompts)

**clawchief/tasks.md** — One canonical markdown task list:
- Live source of truth for "what matters today"
- Assistant checks this instead of guessing from stale conversation history

### 5. Create your private context files
Customize heavily:
- `AGENTS.md` — Who the assistant is
- `SOUL.md` — Tone and boundaries
- `USER.md` — Who the human is
- `IDENTITY.md` — Assistant identity
- `MEMORY.md` — Long-term memory
- `memory/` — Continuity across sessions

*Why it matters:* This is where OpenClaw becomes *your* assistant instead of a generic template.

### 6. Replace every placeholder
The repo includes placeholders for:
- Owner name, assistant name, assistant email
- Primary work email, personal email
- Business name, business URL, timezone
- Primary update channel/target
- Google Sheet ID, target market/geography

Then customize for your real world:
- `workspace/TOOLS.md`
- `clawchief/priority-map.md`
- `clawchief/tasks.md`
- `skills/business-development/resources/partners.md`
- `cron/jobs.template.json`

### 7. Set up cron jobs
This is where the assistant starts to feel alive. Recommended starting jobs:
- Executive assistant sweep
- Daily task prep
- Daily business-development sourcing

*The important point:* "The assistant becomes dramatically more useful when it wakes itself up to do recurring work. That's what shifts it from reactive to proactive."

### 8. Validate the install
A real install means the assistant can:
- Read source-of-truth files correctly
- Route proactive updates to the right place
- Use Gmail message-level search
- Check all relevant calendars before booking
- Treat the tracker/sheet as the live outreach source of truth
- Promote due-today items into `## Today`
- Archive prior-day completions
- Ingest meeting notes into real tasks and follow-ups

## Key Insights

**HEARTBEAT.md is the proactivity engine:**
It tells the assistant *when* to act, *what* to read, and *when* to message. Without it, the assistant is reactive. With it, the assistant is proactive but not noisy.

**TOOLS.md captures tactical rules:**
Preferences, environment quirks, and operating rules that don't belong in prompts. Keeps the prompt layer clean and the tactical layer editable.

**clawchief/tasks.md is the single source of truth:**
One live file, not scattered conversation history. The assistant checks this to know what matters *now*.

**Customization is everything:**
"Generic assistants are generic because they are under-configured. Great assistants are opinionated, specific, and deeply shaped around one person's operating reality."

## Comparison to Kaneda's Setup

**Overlap:**
- We already have `HEARTBEAT.md`, `SOUL.md`, `IDENTITY.md`, `USER.md`, `MEMORY.md`, `TOOLS.md`, `AGENTS.md`, and `PROGRAM.md`.
- Our `HEARTBEAT.md` already includes proactive tasks (Claude Code sync, model health, TallyAI watch, task list maintenance).
- Our `memory/` folder serves the same continuity function.

**What ClawChief adds:**
- **Canonical task list** (`clawchief/tasks.md`) — We use `tasks/current.md` but it's not as strictly enforced as a single source of truth.
- **Priority map** — A structured file defining what matters most right now. We have this implicitly in `PROGRAM.md` but not as a standalone artifact.
- **Auto-resolver** — A policy file for handling common email/task patterns automatically.
- **Meeting-notes ingestion** — Workflow for turning meeting notes into tasks and follow-ups.
- **Outreach tracker integration** — CRM-like Google Sheets workflow for business development.

**What Kaneda has that ClawChief doesn't:**
- **Self-improvement loop** (AutoAgent-inspired meta-agent, eval suite, failure clustering)
- **Knowledge base** with wiki-links and Obsidian sync
- **Affective state tracking roadmap** (Phase 2/3)
- **Agent orchestration** (Paperclip, NERV)

## Synthesis for Kaneda

**Immediate actions:**
1. Enforce `tasks/current.md` as the single canonical task list (mirror `clawchief/tasks.md` discipline)
2. Create `priority-map.md` — explicit file defining current focus areas
3. Add "meeting notes → tasks" ingestion workflow to HEARTBEAT.md
4. Consider an `auto-resolver.md` for common patterns (e.g., "if X thread, read and file to KB")

**Deferred (EA-specific):**
- GOG integration for Gmail/Calendar (we don't use OpenClaw for email yet)
- Outreach tracker / CRM (not relevant for current workflows)
- Business-development sourcing cron (not current focus)

## Related Workflows
- [[auto-harness-self-improving-loop]] — Self-improving agent infrastructure
- [[subconscious-agent-loop]] — Ideation and design self-improvement
- [[30-day-saas-claude-code]] — Rapid SaaS build playbook
- [[claude-code-hooks]] — Local safety and quality automation

