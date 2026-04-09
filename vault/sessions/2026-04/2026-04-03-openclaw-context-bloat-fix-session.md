# Session: 2026-04-03

**Started:** ~9:05am IST
**Last Updated:** 9:20am IST
**Project:** OpenClaw (Telegram AI gateway)
**Topic:** Diagnosing and fixing OpenClaw context bloat — sessions carrying forward memory across conversations

---

## What We Are Building

Not a new feature — this was a diagnostic and fix session. The problem: OpenClaw's Telegram bot was accumulating context across all conversations into a single ever-growing session. The main session had ballooned to 369,173 tokens (37% of the 1M context window), with 1,327 message lines in a 2.1MB transcript file. Additionally, 23 stale hook sessions from 9+ days ago were never cleaned up, adding another ~400k tokens of dead weight. Every new Telegram message was sent with all this accumulated history as context, causing slow responses and wasted tokens.

---

## What WORKED (with evidence)

- **Root cause identification** — confirmed by: `openclaw sessions --json` showed main session at 369k tokens, 20 stale hook sessions 218-226h old, no contextTokens cap configured, no compaction, no session maintenance
- **`agents.defaults.contextTokens: 32000`** — confirmed by: `openclaw config validate` passed, caps context window per session
- **`agents.defaults.compaction`** — confirmed by: config valid with `reserveTokens: 8000`, `keepRecentTokens: 12000`, `maxHistoryShare: 0.6`
- **`agents.defaults.contextPruning: cache-ttl`** — confirmed by: config valid, prunes stale tool outputs over 2k chars
- **`session.scope: per-sender`** — confirmed by: config valid, isolates sessions per Telegram user
- **`session.maintenance`** — confirmed by: config valid with `pruneAfter: 24h`, `pruneDays: 2`, `rotateBytes: 512KB`
- **`telegram.dmHistoryLimit: 20`** — confirmed by: config valid, limits context to last 20 messages
- **Session cleanup** — confirmed by: `openclaw sessions cleanup --enforce` pruned 23 stale sessions, manual wipe freed 3.57MB, `openclaw sessions` shows 0 sessions after full restart
- **Full config validation** — confirmed by: `openclaw config validate` returns "Config valid"

---

## What Did NOT Work (and why)

- **Custom config keys `sessionRotation` and `sessionCleanup`** — failed because: OpenClaw schema validation rejects unrecognized keys under `agents.defaults`. Had to revert and use the actual schema-supported keys (`compaction`, `contextPruning`, `session.maintenance`).
- **Gateway restart alone to reset bloated session** — failed because: gateway holds session state in memory and persists it back to the store on restart. The 369k token count survived multiple `openclaw gateway restart` calls. Required full stop -> wipe transcript files -> wipe store -> start to truly reset.
- **`openclaw sessions cleanup --enforce` alone** — failed because: cleanup correctly prunes stale sessions but preserves the active main session. The main session's 369k tokens couldn't be cleaned up via the CLI — required manual file deletion.

---

## What Has NOT Been Tried Yet

- Sending a test Telegram message to verify the new 32k cap and compaction work in practice (bot should respond with fresh context, not bloated history)
- Monitoring session growth over 24h to confirm `session.maintenance.pruneAfter: 24h` triggers automatic cleanup
- Testing whether `rotateBytes: 512KB` correctly rotates transcript files before they grow too large
- Verifying `per-sender` scope creates separate sessions for different Telegram users (only one user currently: 6871336858)

---

## Current State of Files

| File | Status | Notes |
| --- | --- | --- |
| `~/.openclaw/openclaw.json` | ✅ Complete | Added 6 new config sections for context management |
| `~/.openclaw/agents/main/sessions/sessions.json` | ✅ Complete | Wiped clean, empty store with 0 entries |
| `~/.openclaw/agents/main/sessions/*.jsonl` | ✅ Complete | All transcript files deleted (25 files, 3.57MB freed) |

---

## Decisions Made

- **32k context token cap** — reason: balances having enough conversation history for coherent responses while preventing unbounded growth. Most Telegram conversations are short; 32k is ~20-30 message exchanges which is plenty.
- **per-sender session scope over global** — reason: prevents one user's conversation from leaking into another's context. Currently single-user but correct architecture.
- **24h session pruning with 2-day hard limit** — reason: Telegram bot conversations are ephemeral; keeping sessions beyond a day serves no purpose and just wastes disk/tokens.
- **dmHistoryLimit: 20** — reason: only the last 20 messages are relevant for continuing a Telegram conversation. This is the most impactful setting for preventing context carry-forward.
- **Full session wipe over incremental cleanup** — reason: the main session was so bloated (369k tokens) that compaction couldn't help retroactively. Clean slate was the only option.

---

## Blockers & Open Questions

- Need to verify the fixes work in practice by sending a Telegram message and checking that the new session stays small
- The `pruneAfter: 24h` setting hasn't been tested in production yet — unclear if OpenClaw runs maintenance on a schedule or only when `openclaw sessions cleanup` is invoked
- If maintenance only runs on CLI invocation, may need a Windows Scheduled Task to run `openclaw sessions cleanup --enforce` daily

---

## Exact Next Step

Send a test message to the Telegram bot (@kaneda6bot), then run `openclaw sessions --json` to verify the new session was created with the 32k context cap and stays under the limit. If the session shows >32k tokens after a few messages, the `contextTokens` cap may not be working as expected and needs further investigation.

---

## Environment & Setup Notes

- OpenClaw 2026.4.2 running on Windows 11, gateway auto-starts via Windows login item
- Gateway was stopped and restarted during this session — currently running with clean state
- Primary model: `anthropic/claude-sonnet-4-6`, fallback chain: qwen3.6-plus:free -> gpt-5.4-mini -> gemini-2.5-flash -> gemini-2.5-flash-lite
- Config path: `~/.openclaw/openclaw.json`
- Session store: `~/.openclaw/agents/main/sessions/sessions.json`
