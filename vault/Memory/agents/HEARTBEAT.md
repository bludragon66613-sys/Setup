# HEARTBEAT.md

# Orchestrated chief-of-staff heartbeat

Canonical sources:
- Priority map: `clawchief/priority-map.md`
- Auto-resolver: `clawchief/auto-resolver.md`
- Meeting-notes policy: `clawchief/meeting-notes.md`
- Meeting-notes ledger: `workspace/memory/meeting-notes-state.json`
- Live tasks: `clawchief/tasks.md`
- EA workflow: `executive-assistant` skill
- Biz-dev / outreach workflow: `business-development` skill
- Task workflow: `daily-task-manager` skill

On heartbeat, during normal work hours:

1. Read the priority map.
2. Read the auto-resolver policy.
3. Read the meeting-notes policy and meeting-notes ledger.
4. Read the live task file.
5. Run the executive-assistant workflow for meeting-notes ingestion plus inbox / calendar / scheduling triage.
6. If a signal is really about outreach tracker state, lead status, prospect pipeline, or partner follow-up, use the business-development workflow instead of treating it as generic EA work.
7. Auto-resolve low-risk operational items when the next step is obvious and authority is clear.
8. If meeting notes create principal tasks, add them to `clawchief/tasks.md`.
9. If the principal needs to know or act, send one short, direct update.
10. If there is no EA or biz-dev issue needing attention, use the remaining heartbeat value for at most one priority nudge anchored in a live program from the priority map or an open task from `clawchief/tasks.md`.
11. If there is nothing useful to say, reply: HEARTBEAT_OK

Rules:
- Be proactive, but do not create noise.
- Keep this file as an orchestrator, not as a duplicate workflow spec.
- Let the skills own their detailed procedures.
- Let `clawchief/priority-map.md` own people/program priority and urgency.
- Let `clawchief/auto-resolver.md` own auto-resolution policy.
- Let `clawchief/meeting-notes.md` own meeting-notes ingestion policy.
- Let `clawchief/tasks.md` own the live task state.
- Keep any task-related update short and direct.
- Do not send repeated or near-identical nudges unless there is materially new information, a changed recommendation, or a concrete trigger.

---

## 1. Claude Code Session Sync
- Read ~/.claude/history.jsonl (last 20 entries)
- Check latest task session folders in ~/.claude/tasks/
- If new tasks or progress since last check -> update PROJECTS.md + today's daily log
- Track last checked timestamp in memory/heartbeat-state.json

## 2. OpenClaw Model Health
- Run openclaw models status -- check all auth profiles are healthy
- OpenAI Codex OAuth expires ~April 13 -- warn Totoro 2 days before
- Google fallbacks should always show Auth: yes

## 3. Gemma 4 Catalog Watch
- Run openclaw models list --all | grep -i gemma-4
- When it appears, tell Totoro so we can add it

## 4. TallyAI Research Watch
- Check Paperclip task status: http://localhost:3100/api/companies/7cf2c89a-a57a-48c0-a41f-07191d2bb8a0/issues
- When TAL-10 (Full go-to-market plan for TallyAI) status changes to 'done' -> notify Totoro immediately

## 5. Task List Maintenance
- Read clawchief/tasks.md on each heartbeat
- Promote any overdue items from Backlog -> Today
- Archive completed items to clawchief/tasks-completed.md
- Add new tasks from conversations if captured

## 6. Active Monitoring
- Check Paperclip is alive (pm2 status, port 3100 reachable)
- If Paperclip is down, alert Totoro

## 7. Knowledge Base Linting
- Run wiki-linter.mjs in ~/knowledge-base/ to find gaps
- Check raw/ for new sources that need wiki compilation
- Update MOC.md topic counters (raw count, articles, concepts)
- Flag stale summaries or missing concept backlinks

## 8. Obsidian Sync
- Run: node ~/.claude/scripts/memory-obsidian-sync.mjs
- Syncs Claude memory files -> Agentic knowledge vault (OneDrive)
- Also copies SPIKE_MEMORY.md (my workspace MEMORY.md)
- Run once per day (skip if checked within last 12h)

## 9. Weekly Failure Review (Sundays)
- Scan `memory/failures.jsonl` for error patterns
- Cluster by root cause tags (e.g., `mcp_timeout`, `auth_expiry`, `kb_link_rot`)
- Propose systemic fixes for top 3 clusters
- Update `evals/suite.json` with new regression tests
- Log review outcomes in daily note

## 10. Eval Runner Checks
- Verify heartbeat response time < 5s
- Confirm memory sync completed in last 24h
- Check KB commits since last X thread read
- Ensure Obsidian vault synced after KB updates
- Flag any eval failures in heartbeat response

## 11. Phase 1 Completion Tracking
- Monitor eval-runner.js results daily
- Track consecutive clean weeks in memory/phase1-progress.md
- Alert when Phase 1 exit criteria met (0 failures x 2 weeks)
- Trigger Phase 2 setup: session-quality.jsonl schema + quality tagging
