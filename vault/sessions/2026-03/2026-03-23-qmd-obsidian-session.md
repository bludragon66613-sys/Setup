# Session: 2026-03-23

**Started:** ~6:38 AM IST
**Last Updated:** ~7:10 AM IST
**Project:** Claude Code environment (`~/.claude/`)
**Topic:** Install qmd, index Obsidian vault, auto-sync session logs to vault

---

## What We Are Building

Two integrated systems:

1. **qmd + Claude Code MCP integration** — `tobi/qmd` is an on-device hybrid search engine (BM25 + vector embeddings + LLM re-ranking). We installed it globally, registered it as an MCP server so Claude Code has 4 search tools (`query`, `get`, `multi_get`, `status`), and indexed the user's Obsidian vault (`C:\Users\Rohan\OneDrive\Documents\Agentic knowledge`) as a qmd collection named `obsidian`.

2. **Session log → Obsidian vault pipeline** — Two Claude Code hooks that automatically log sessions to the vault and inject recent session context at startup:
   - **Stop hook** (`vault-session-logger.js`): when Claude Code session ends, copies new `~/.claude/sessions/*.tmp` files to vault as `.md` under `Claude Sessions/`, then runs `qmd update + embed`
   - **SessionStart hook** (`vault-session-context.js`): on startup, searches vault via qmd for recent session logs and injects them as `additionalContext` so Claude has prior session memory

---

## What WORKED (with evidence)

- **qmd installed globally** — confirmed by: `npm install -g @tobilu/qmd` succeeded, `qmd status` shows index at `~/.cache/qmd/index.sqlite`
- **Obsidian vault detected** — confirmed by: `$APPDATA/obsidian/obsidian.json` read, vault at `C:\Users\Rohan\OneDrive\Documents\Agentic knowledge` confirmed, contains `Welcome.md`
- **qmd collection `obsidian` added** — confirmed by: `qmd collection add` output showed `1 new` indexed, `qmd status` shows collection with 1 file and 1 context
- **Embedding model downloaded + embeddings generated** — confirmed by: 300MB `embeddinggemma-300M-Q8_0.gguf` downloaded to `~/.cache/qmd/models/`, `qmd embed` ran successfully ("Embedded 1 chunks from 1 documents in 5s"), GPU offloading via RTX 4060 confirmed
- **MCP server registered** — confirmed by: `claude mcp add qmd -- qmd mcp` added entry to `~/.claude.json` under `C:/Users/Rohan` project scope: `{ type: "stdio", command: "qmd", args: ["mcp"] }`
- **qmd plugin registered** — confirmed by: `settings.json` updated with `extraKnownMarketplaces.tobi` (github source `tobi/qmd`) and `enabledPlugins["qmd@tobi": true]`
- **`Claude Sessions/` folder created** — confirmed by: `mkdir -p` ran in vault
- **Stop hook (`vault-session-logger.js`)** — confirmed by: `node ~/.claude/hooks/vault-session-logger.js` ran without errors (exit 0)
- **SessionStart hook (`vault-session-context.js`)** — confirmed by: `node ~/.claude/hooks/vault-session-context.js` output `context OK` (no sessions yet, exited silently as expected)
- **Both hooks wired into `settings.json`** — confirmed by: file updated successfully, `Stop` and `SessionStart` hooks added

---

## What Did NOT Work (and why)

- **Adding `mcpServers` directly to `settings.json`** — failed because: Claude Code schema validation rejects `mcpServers` as a top-level field in `settings.json`. Correct approach is `claude mcp add` which writes to `~/.claude.json` (project-scoped)
- **`extraKnownMarketplaces` with `"source": "github"` as string** — failed because: schema expects `source` to be a nested object `{ "source": { "source": "github", "repo": "..." } }`, not a string shorthand. Fixed on second attempt.

---

## What Has NOT Been Tried Yet

- Verify qmd MCP tools actually appear in Claude Code after restart (needs new session)
- Test the full pipeline: `/save-session` → Stop hook syncs `.tmp` → `Claude Sessions/` has `.md` → next session start injects context
- Add more Obsidian notes and verify `qmd search` returns relevant results
- Consider running `qmd mcp --http --daemon` for persistent server (avoids model reload per session)

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/.claude/hooks/vault-session-logger.js` | ✅ Complete | Stop hook — copies .tmp to vault, runs qmd update+embed |
| `~/.claude/hooks/vault-session-context.js` | ✅ Complete | SessionStart hook — injects recent session logs as context |
| `~/.claude/settings.json` | ✅ Complete | Added Stop hook, SessionStart hook, qmd plugin registration |
| `~/.claude.json` (project: `C:/Users/Rohan`) | ✅ Complete | qmd MCP server registered via `claude mcp add` |
| `~/.cache/qmd/index.sqlite` | ✅ Complete | 1 doc indexed, 1 embedded, `obsidian` collection configured |
| `OneDrive/Documents/Agentic knowledge/Claude Sessions/` | ✅ Complete | Empty folder created, ready to receive session logs |

---

## Decisions Made

- **MCP via `claude mcp add`** — reason: `settings.json` schema doesn't support top-level `mcpServers`; project-scoped `~/.claude.json` is the correct location
- **Stop hook is async** — reason: `qmd embed` can take time (model loads), shouldn't block Claude Code from closing
- **Fallback to direct file read in context hook** — reason: if qmd is unavailable/slow, hook falls back to reading last 2 `.md` files directly so context still loads
- **Plugin registered via `extraKnownMarketplaces`** — reason: installs qmd skills into Claude Code on next startup; complements the MCP server

---

## Blockers & Open Questions

- qmd MCP server is project-scoped to `C:/Users/Rohan` — will it be available in sessions started from subdirectories? (Likely yes for `~/aeon`, `~/branding-pipeline` etc. since they inherit parent scope, but unverified)
- The vault currently has only 1 file (`Welcome.md`) — qmd search won't be useful until more notes are added

---

## Exact Next Step

1. Close this Claude Code session — the Stop hook will auto-sync this session file to vault
2. Reopen Claude Code — verify qmd MCP tools appear (`/mcp` or check tool list)
3. Add a note to Obsidian, then run `qmd update && qmd embed` to verify the sync pipeline works end-to-end

---

## Environment & Setup Notes

- qmd binary: `C:/Users/Rohan/AppData/Roaming/npm/qmd`
- qmd index: `~/.cache/qmd/index.sqlite` (3.1 MB)
- qmd models: `~/.cache/qmd/models/` (embeddinggemma ~300MB downloaded; reranker + query-expansion will download on first `qmd query`)
- Obsidian vault: `C:\Users\Rohan\OneDrive\Documents\Agentic knowledge`
- Session logs in vault: `C:\Users\Rohan\OneDrive\Documents\Agentic knowledge\Claude Sessions\`
- GPU: RTX 4060 Laptop (15.6 GB VRAM) — qmd uses Vulkan offloading automatically
