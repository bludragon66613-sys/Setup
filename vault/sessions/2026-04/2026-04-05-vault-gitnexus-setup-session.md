# Session: 2026-04-05

**Started:** ~4:50pm IST
**Last Updated:** 5:45pm IST
**Project:** ~/vault (arscontexta) + global Claude Code setup
**Topic:** Knowledge vault setup, QMD semantic search, arscontexta tutorial, GitNexus code intelligence, Setup repo backup

---

## What We Are Building

Three major upgrades to Rohan's Claude Code environment in one session:

1. **Arscontexta knowledge vault** at ~/vault -- an AI research knowledge graph using atomic prose-as-title notes, wiki-link connections, topic maps, and a processing pipeline. The vault was scaffolded in a prior session; this session initialized QMD semantic search, ran the interactive tutorial (researcher track), and created 5 new claims with connections.

2. **GitNexus code intelligence** -- a local knowledge graph engine that indexes codebases via Tree-sitter AST parsing into a graph database (LadybugDB) and exposes 16 MCP tools to Claude Code agents. Three repos indexed: aeon (1,002 nodes), paperclip (6,721 nodes), dashboard (524 nodes). MCP server configured in ~/.claude.json with auto-approve in settings.json.

3. **Setup repo backup** -- pushed all upgrades to github.com/bludragon66613-sys/Setup including new mcp-servers.json, updated restore.sh with auto-install, updated README with GitNexus/QMD/arscontexta docs, updated settings/plugins/memory.

---

## What WORKED (with evidence)

- **QMD installed and initialized** -- confirmed by: `qmd query "agentic patterns" -c vault` returned agentic-patterns.md at 93% score, 53 chunks embedded from 25 documents
- **Arscontexta tutorial completed (all 5 steps)** -- confirmed by: ops/tutorial-state.yaml shows current_step: 6, completed: [1,2,3,4,5], 4 new claims created with connections and topic map membership
- **GitNexus installed (v1.5.3)** -- confirmed by: `gitnexus list` shows all 3 repos indexed
- **Aeon indexed** -- confirmed by: 1,002 nodes, 1,986 edges, 51 clusters, 78 flows (14.1s)
- **Paperclip indexed** -- confirmed by: 6,721 nodes, 20,977 edges, 422 clusters, 300 flows (26.4s)
- **Dashboard indexed** -- confirmed by: 524 nodes, 1,244 edges, 36 clusters, 41 flows (7.5s)
- **GitNexus query works** -- confirmed by: `gitnexus query "skill dispatch" --repo aeon` returned relevant process flows
- **MCP server configured** -- confirmed by: ~/.claude.json has gitnexus entry pointing to dist/cli/index.js mcp
- **Settings auto-approve** -- confirmed by: settings.json has `mcp__gitnexus` in allow list
- **Setup repo pushed** -- confirmed by: `git push origin main` succeeded, commit ae90ddd on main
- **Vault health check passed** -- confirmed by: all 4 tutorial claims have descriptions, no broken links, all in agentic-patterns topic map

---

## What Did NOT Work (and why)

- **GitNexus MCP entry point at dist/mcp.js** -- failed because: the actual MCP server is invoked via the CLI `gitnexus mcp` command, which routes through dist/cli/index.js -> dist/cli/mcp.js -> dist/mcp/server.js. Fixed by pointing to dist/cli/index.js with "mcp" arg.
- **QMD collection add from within vault dir** -- failed because: `qmd collection add vault .` resolves to vault/vault (appends collection name to cwd). Fixed by running from parent dir: `cd ~ && qmd collection add vault vault`.
- **GitNexus CLI query without --repo** -- failed because: with 3 repos indexed, the CLI requires explicit `--repo` parameter. MCP server handles this via the `repo` tool parameter automatically.

---

## What Has NOT Been Tried Yet

- **GitNexus MCP tools in live Claude session** -- the MCP server is configured but requires a Claude Code restart to activate. Next session should verify tools are available.
- **GitNexus multi-repo groups** -- groups are configured via MCP tools at runtime, not CLI. Could create a group linking aeon + dashboard + paperclip for cross-repo queries.
- **GitNexus hooks** -- PreToolUse hooks that intercept Grep/Glob and augment with graph context. Not installed yet.
- **QMD MCP in live session** -- configured in ~/.claude.json but not tested in this session.
- **Vault /reflect command** -- suggested as next action in tutorial but not run yet. Would find connections across all 11 notes.

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/vault/ops/tutorial-state.yaml` | Complete | Tutorial finished, researcher track |
| `~/vault/notes/multi-agent-architectures-*.md` | Complete | Tutorial claim 1, linked to claim 2 |
| `~/vault/notes/agent-specialization-*.md` | Complete | Tutorial claim 2, bidirectional links |
| `~/vault/notes/naive-context-stuffing-*.md` | Complete | Extracted from sample, linked |
| `~/vault/notes/hierarchical-memory-*.md` | Complete | Extracted from sample, linked |
| `~/vault/notes/precomputed-code-knowledge-*.md` | Complete | GitNexus research claim, dual topic maps |
| `~/vault/notes/agentic-patterns.md` | Complete | Updated with 5 new claims in Core Claims |
| `~/vault/notes/tool-use-frameworks.md` | Complete | Updated with GitNexus claim |
| `~/.claude.json` | Complete | GitNexus MCP server added |
| `~/.claude/settings.json` | Complete | mcp__gitnexus auto-approved, arscontexta plugin enabled |
| `~/CLAUDE.md` | Complete | GitNexus section added |
| `~/Setup/` (11 files) | Complete | Pushed to GitHub as commit ae90ddd |

---

## Decisions Made

- **GitNexus MCP via CLI entry point** -- reason: the package exposes mcp via `gitnexus mcp` command, not a standalone server script. Using dist/cli/index.js with "mcp" arg is the correct invocation.
- **All three repos indexed** -- reason: aeon, paperclip, and dashboard are the primary active codebases. Cross-repo dependency awareness is the main value add.
- **Auto-approve GitNexus MCP tools** -- reason: these are read-only code analysis tools (except rename), safe to auto-approve for agent workflow speed.
- **Researcher track for tutorial** -- reason: the vault is configured for AI research (claims, patterns, techniques).
- **QMD collection named "vault"** -- reason: matches the directory name and arscontexta derivation-manifest vocabulary.

---

## Blockers & Open Questions

- GitNexus MCP tools need verification after Claude Code restart -- they should appear as mcp__gitnexus__* tools
- QMD MCP tools also need verification -- should appear as mcp__qmd__* tools (some already referenced in derivation-manifest.md)
- GitNexus re-indexing strategy: should it be automated (hook on git commit?) or manual?

---

## Exact Next Step

Restart Claude Code to activate the GitNexus and QMD MCP servers. Verify tools are available by checking for `mcp__gitnexus__list_repos` and `mcp__qmd__search` in the tool list. Then run `/reflect` in the vault to find connections across all 11 notes.
