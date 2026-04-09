# PROGRAM.md — Meta-Layer Rules for Kaneda's Workspace

**Last Updated:** 2026-04-04  
**Scope:** General agent setup (NERV, Paperclip, OpenClaw, personal workflows)

---

## 1. Evidence Sources (Where We Learn From)

- **Telegram chats:** User requests, corrections, feedback
- **Claude Code history:** `~/.claude/history.jsonl` — task outcomes, errors, successes
- **Paperclip logs:** Agent orchestration failures, MCP timeouts, dispatch errors
- **NERV dashboard:** Task completion rates, latency metrics, user interactions
- **KB commits:** What we've learned, what we've forgotten
- **Heartbeat checks:** System health, model auth status, cron job outcomes

**Rule:** Every failure in these sources gets logged to `memory/failures.jsonl` with tags.

---

## 2. Freeze Rules (What's Locked Until It Earns Trust)

- **OpenClaw model config:** Don't change fallback chain or auth profiles without explicit approval
- **Heartbeat prompt:** Don't modify the core heartbeat logic without testing in a sandbox first
- **Memory sync script:** Don't change `memory-obsidian-sync.mjs` without verifying it doesn't delete existing notes
- **Claude Code hooks:** Don't disable safety hooks (block-dangerous, protect-files) unless explicitly requested
- **Paperclip agent configs:** Don't bulk-edit agent configs without a backup

**Rule:** Frozen items require a `/approve` or explicit "go ahead" before modification.

---

## 3. Optimization Targets (Current Focus)

- **Response latency:** Keep Telegram replies under 10s for simple queries
- **Memory freshness:** Sync Claude Code history to daily logs within 1 hour of session end
- **KB completeness:** Every X thread read → KB article written → Obsidian synced
- **Agent reliability:** Paperclip dispatch success rate > 95%
- **Heartbeat accuracy:** Zero false positives (don't alert on healthy systems)

**Rule:** Weekly review of these targets. If one slips, propose a fix in the next heartbeat.

---

## 4. Regression Constraints (What Can Never Break)

- **Heartbeat must respond:** `HEARTBEAT_OK` or alert within 5s
- **Memory sync must complete:** No data loss between sessions
- **KB articles must be cross-linked:** Every new workflow/tooling file gets wikilinks to related content
- **Obsidian vault must stay synced:** KB updates → vault copy within 5 minutes
- **Agent identity must persist:** SOUL.md and IDENTITY.md changes must be explicit and logged

**Rule:** If any constraint breaks, stop all other work and fix it first.

---

## 5. The Failure Loop (Weekly Review)

**Every Sunday (or first heartbeat of the week):**

1. **Mine failures:** Scan `memory/failures.jsonl`, Claude Code history, Paperclip logs for errors
2. **Cluster by root cause:** Group similar failures (e.g., "MCP timeout", "auth expiry", "KB link rot")
3. **Propose fixes:** For each cluster, draft a systemic fix (not a one-off patch)
4. **Add to eval suite:** Convert each fixed failure into a test case in `evals/suite.json`
5. **Update PROGRAM.md:** If a new freeze rule or optimization target emerges, add it here

**Rule:** Don't skip this. Compound improvements require disciplined review.

---

## 6. Sub-Agent Context Management

**For NERV Desktop and complex multi-agent tasks:**

- **Parent agent:** Orchestrates, sees only summaries
- **Sub-agents:** Own their raw traces, report distilled outputs
- **Recursive summarization:** If a sub-agent's output exceeds 500 tokens, summarize before passing to parent

**Rule:** Never flood the parent context with raw traces. Summarize first.

---

## 7. Approval Boundaries

- **Auto-approve:** KB writes, memory syncs, daily log updates, non-destructive file edits
- **Require approval:** Model config changes, hook deletions, agent config bulk-edits, external API calls (emails, tweets, public posts)
- **Never auto-approve:** `rm -rf`, `git reset --hard`, database drops, `.env` edits

**Rule:** When in doubt, ask. Safety > speed.

---

## Related Documents

- `SOUL.md` — Identity and vibe (OpenClaw workspace)
- `AGENTS.md` — Operational rules (OpenClaw workspace)
- [[memory/agents/TOOLS]] — Local capabilities
- [[memory/agents/HEARTBEAT]] — Proactive checks
- [[subconscious-agent-loop]] — Self-improvement architecture
- [[auto-harness-self-improving-loop]] — Production-grade failure mining

## 8. Knowledge Base Maintenance (Karpathy Pattern)

**Index:** \knowledge-base/index.md\ — Catalog of all pages with one-line summaries.  
**Log:** \knowledge-base/log.md\ — Append-only record of ingests and queries.

**Workflows:**
- **Ingest:** When a new source (X thread, article, paper) is read, the LLM must:
  1. Write a summary to \knowledge-base/workflows/\ or \concepts/\
  2. Update \index.md\ with the new entry
  3. Append an entry to \log.md\
- **Query:** When answering complex questions, file the synthesized answer back into the KB as a new page if it provides lasting value.
- **Lint:** Weekly health check for:
  - Contradictions between pages
  - Stale claims superseded by new sources
  - Orphan pages with no inbound links from \index.md\
  - Missing cross-references
