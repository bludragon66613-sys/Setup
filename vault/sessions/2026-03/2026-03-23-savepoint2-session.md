# Session: 2026-03-23

**Started:** ~6:38 AM IST
**Last Updated:** ~7:15 AM IST
**Project:** Claude Code environment (`~/.claude/`)
**Topic:** qmd + Obsidian vault sync pipeline — fully complete

---

## What We Are Building

Two integrated systems completed this session:

1. **qmd + Claude Code MCP** — `tobi/qmd` on-device hybrid search (BM25 + vector + LLM re-ranking) installed globally, MCP server registered, Obsidian vault indexed as collection `obsidian`.

2. **Session log → vault pipeline** — Stop hook auto-copies session `.tmp` files to `Agentic knowledge/Claude Sessions/` on close. SessionStart hook injects recent logs as context on open.

---

## What WORKED (with evidence)

- **qmd installed** — `npm install -g @tobilu/qmd` ✅
- **Obsidian vault found** — `$APPDATA/obsidian/obsidian.json` → `C:\Users\Rohan\OneDrive\Documents\Agentic knowledge` ✅
- **Collection `obsidian` created + embedded** — `qmd status` confirms 1 doc, 1 vector, RTX 4060 GPU offloading ✅
- **MCP server registered** — `claude mcp add qmd -- qmd mcp` → `~/.claude.json` ✅
- **qmd plugin registered** — `extraKnownMarketplaces` + `enabledPlugins["qmd@tobi"]` in `settings.json` ✅
- **Stop hook** — `vault-session-logger.js` tested, exit 0 ✅
- **SessionStart hook** — `vault-session-context.js` tested, exits silently when no sessions yet ✅
- **Both hooks wired** — `settings.json` Stop + SessionStart entries added ✅
- **Session file saved** — `2026-03-23-qmd-obsidian-session.tmp` written ✅

---

## What Did NOT Work (and why)

- **`mcpServers` in `settings.json`** — schema rejects it; use `claude mcp add` instead
- **`extraKnownMarketplaces` string source shorthand** — needs nested `{ "source": { "source": "github", ... } }`

---

## What Has NOT Been Tried Yet

- Verify qmd MCP tools appear after Claude Code restart
- Full end-to-end test: close → Stop hook syncs → reopen → context injected
- Add Obsidian notes and verify search works
- `qmd mcp --http --daemon` for persistent server (avoids model reload)

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/.claude/hooks/vault-session-logger.js` | ✅ Complete | Stop hook |
| `~/.claude/hooks/vault-session-context.js` | ✅ Complete | SessionStart hook |
| `~/.claude/settings.json` | ✅ Complete | Hooks + qmd plugin wired |
| `~/.claude.json` | ✅ Complete | qmd MCP server registered |
| `~/.cache/qmd/index.sqlite` | ✅ Complete | obsidian collection, 1 doc |
| `Agentic knowledge/Claude Sessions/` | ✅ Ready | Empty, waiting for first sync |

---

## Decisions Made

- **`claude mcp add` not settings.json** — only way to register MCP in Claude Code
- **Stop hook async** — qmd embed takes time, shouldn't block close
- **Direct file fallback in context hook** — if qmd slow, reads last 2 .md files directly

---

## Blockers & Open Questions

- qmd MCP scoped to `C:/Users/Rohan` project — untested in subdirectories
- Vault has only `Welcome.md` — search not useful until more notes added

---

## Exact Next Step

Close Claude Code → Stop hook syncs session files to vault → reopen → verify qmd MCP tools in tool list.
