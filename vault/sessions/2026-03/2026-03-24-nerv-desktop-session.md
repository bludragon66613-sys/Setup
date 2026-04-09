# Session: 2026-03-24

**Started:** ~7:25pm
**Last Updated:** ~8:00pm
**Project:** NERV Command Center (new — Tauri desktop app)
**Topic:** Brainstorming + designing a Tauri+React desktop command center integrating Claude Code, OpenClaw, MCP, aigency02, Aeon skills, and Superpowers

---

## What We Are Building

A Tauri 2.x + React desktop app (Windows-first) that serves as a unified AI infrastructure command center. It replaces the need to use the NERV web dashboard (`localhost:5555`) for most operations and adds capabilities the browser can't provide: MCP server inspection, Claude Code process management, native notifications, and a WebSocket server that lets OpenClaw and other agents autonomously control the UI.

The app is **NOT** a standalone system — it sits on top of the existing NERV infrastructure:
- Connects to NERV dashboard API (`localhost:5555`) for skill dispatch, agency jobs, memory, agents catalog
- Connects to OpenClaw proxy (`localhost:5557`) for model routing/fallback visibility
- Runs its own Rust WS server (`localhost:5558`) so agents can push to the UI
- Reads `~/.claude/settings.json` for MCP server discovery

**Architecture:** Turborepo monorepo — `apps/desktop` (Tauri), `apps/web` (existing NERV dashboard moved in), `packages/ui` (shared shadcn components), `packages/nerv-core` (shared API client + types).

---

## What WORKED (with evidence)

- **Brainstorming design complete** — all key decisions made, 6 issues identified and resolved in discussion
- **Visual companion server** — running at `http://localhost:55268`, mockups written to `~/aeon/.superpowers/brainstorm/5037-1774361110/`
- **Context gathered** — read `nerv/route.ts`, session savepoints, agency savepoint (c) — full picture of existing stack

---

## What Did NOT Work (and why)

- No implementation attempted yet — this was design-only session.

---

## What Has NOT Been Tried Yet

- Writing the spec doc to `docs/superpowers/specs/`
- Running spec-document-reviewer subagent
- Scaffolding the Turborepo monorepo
- Implementation

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/aeon/.superpowers/brainstorm/5037-1774361110/layout-v2.html` | ✅ Complete | 10-panel layout mockup |
| `~/aeon/.superpowers/brainstorm/5037-1774361110/agent-interaction.html` | ✅ Complete | WS server + agent interaction model |
| `~/aeon/.superpowers/brainstorm/5037-1774361110/approaches.html` | ✅ Complete | 3 architectural approaches, B chosen |
| Spec doc | 🗒️ Not Started | Next step — `docs/superpowers/specs/2026-03-24-nerv-desktop-design.md` |
| Turborepo monorepo | 🗒️ Not Started | New repo or subfolder TBD |

---

## Decisions Made

- **Framework: Tauri 2.x + React** — lighter than Electron (~10MB), Rust backend owns process/WS/fs, React frontend reuses existing NERV UI patterns
- **Structure: Turborepo monorepo (Approach B)** — shared `packages/ui` between desktop and NERV web dashboard; one component library upgrade benefits both
- **Connectivity: Hybrid** — direct to OpenClaw proxy (:5557) + Claude CLI for real-time; NERV dashboard API (:5555) for skill dispatch, jobs, memory (no logic duplication)
- **Agent interaction: WS server (:5558) + REST fallback** — WS for OpenClaw/local agents (persistent, bidirectional); REST for GH Actions (remote, one-shot). GH Actions skill completions route via NERV jobs SSE, not direct to desktop.
- **Multi-LLM: B+D** — OpenClaw routing visibility (model queue, fallback chain, rate limits) + MCP server inspector. Not a generic LLM chat client.
- **10 panels:** CLI (terminal), SES (sessions/logs), MCP (inspector), OC (OpenClaw monitor), AEON (39 skills → GH Actions), SP (205+ superpowers → browse/inject to CLI), AGN (NEXUS dispatch + SSE jobs), A02 (156 aigency02 agents catalog), MEM (memory browser), CFG (config)
- **nerv-sdk.js** — tiny WS client agents import to connect to app; bearer token auth validated by Rust backend on handshake

## Issue Fixes (resolved in design)

1. **GH Actions can't reach localhost:5558** → GH Actions posts to NERV :5555 jobs API; desktop subscribes to SSE. No direct path needed.
2. **MCP discovery complexity** → v1 read-only: parse `~/.claude/settings.json`, show configured servers + last-known status. Live tool-call testing = v2.
3. **Superpowers "invoke" ambiguous** → SP panel: Browse mode (read markdown, search, copy) + Inject mode (open NERV terminal with `/skill-name` pre-loaded). No magic invocation.
4. **Session Viewer complexity** → v1 log streamer only: tail `~/.claude/logs/` via Tauri fs watch. Process management = v2.
5. **Desktop app auth with NERV dashboard** → read `DASHBOARD_SECRET` from Tauri config, call `/api/auth/token` once, store JWT in Tauri secure store, refresh on 401.
6. **nerv-sdk.js auth** → bearer token required on WS handshake; agents get token from env (same DASHBOARD_SECRET flow).

---

## Blockers & Open Questions

- Where does the Turborepo monorepo live? New standalone repo, or fold into existing `~/aeon`? (Likely new repo `nerv-desktop` or similar)
- Does the existing NERV dashboard move into the monorepo, or stay at `~/aeon/dashboard` and share components via npm link/package?
- Tauri 2.x on Windows — verify WS server capability in Rust backend (should be fine with `tokio-tungstenite`)

---

## Exact Next Step

Resume brainstorming skill → write spec doc to `docs/superpowers/specs/2026-03-24-nerv-desktop-design.md` → run spec-document-reviewer subagent → get user approval → invoke writing-plans skill.

Run: open this session file, then continue the brainstorming conversation which was at "ready to write the spec" stage.

---

## Environment & Setup Notes

- Visual companion server: `http://localhost:55268` (may need restart next session)
- Screen dir: `~/aeon/.superpowers/brainstorm/5037-1774361110/`
- Restart server: `bash ~/.claude/plugins/cache/claude-plugins-official/superpowers/5.0.5/skills/brainstorming/scripts/start-server.sh --project-dir ~/aeon`
- NERV dashboard: `http://localhost:5555` (PM2-managed)
- OpenClaw proxy: `http://localhost:5557`
- Existing agency system: `/agency`, `/agents` pages already built in NERV dashboard
