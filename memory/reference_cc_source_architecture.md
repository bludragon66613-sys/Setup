---
name: Claude Code Source Architecture Reference
description: Complete architecture map from leaked CC source (nirholas/claude-code) — hooks, memory, coordinator, plugins, bridge, MCP, query engine, voice, state
type: reference
---

# Claude Code Source Architecture (explored Mar 31-Apr 1, 2026)

Source: `github.com/bludragon66613-sys/claude-code` (forked from nirholas/claude-code)
Local clone: `~/claude-code-source/` (~512K lines TypeScript, ~1900 files)

## Hook System — 5 Types, 23+ Events

Hook types (settings.json):
- **command**: shell command, stdout/stderr → blocking/non-blocking
- **prompt**: single LLM call (Haiku default), returns {ok, reason} JSON
- **agent**: multi-turn sub-agent with tools, structured output via SyntheticOutputTool, max 50 turns
- **http**: POST JSON to URL, SSRF-guarded, env var interpolation in headers, allowlist policy
- **function**: in-memory callback (internal only)

Events: SessionStart, Stop, SubagentStop, PreToolUse, PostToolUse, PostToolUseFailure, PreCompact, PostCompact, UserPromptSubmit, PermissionRequest, Notification, Setup, SessionEnd, FileChanged, CwdChanged, ConfigChange, SubagentStart + more

Advanced features: `if` conditions, matchers (tool/filePath/skills regex), elicitation (interactive prompts from hooks), trust model (first run requires acceptance)

Key files: `src/utils/hooks/execAgentHook.ts`, `execPromptHook.ts`, `execHttpHook.ts`, `sessionHooks.ts`, `hooksSettings.ts`

## Memory System — 4 Types, Side-Query Selection

Types: user, feedback, project, reference
MEMORY.md: 200 line / 25KB cap, truncated with warning
findRelevantMemories(): side-query with Sonnet selects up to 5 relevant topic files per turn (based on user query + recent tools)
KAIROS mode: daily logs at `memory/logs/YYYY/MM/YYYY-MM-DD.md`, nightly /dream distills
Team memory: `memory/team/` shared subdirectory (feature: TEAMMEM)

Key files: `src/memdir/memdir.ts`, `paths.ts`, `memoryTypes.ts`, `findRelevantMemories.ts`

## Coordinator Mode

Env: `CLAUDE_CODE_COORDINATOR_MODE=1`
Transforms CC into task manager: spawns workers, synthesizes findings, delegates implementation
Workers report via `<task-notification>` XML (task-id, status, summary, result, usage)
Scratchpad: cross-worker shared directory writable without permission prompts (feature: tengu_scratch)
Anti-pattern: "based on your findings" = lazy delegation. Good: synthesized specs with file paths + line numbers
Phases: Research (parallel) → Synthesis (coordinator) → Implementation → Verification (fresh worker)

Key file: `src/coordinator/coordinatorMode.ts`

## Agent Frontmatter Config

Fields: model, color, backgroundMode, memoryScope (user/project/local), isolation (worktree/remote), effort, permissionMode, maxTurns, tools, skills, mcpServers, hooks
Hooks in frontmatter: Stop → SubagentStop auto-conversion for agents
Memory-enabled agents: Write/Edit/Read tools auto-injected

Key files: `src/tools/AgentTool/loadAgentsDir.ts`, `agentMemory.ts`, `src/utils/hooks/registerFrontmatterHooks.ts`

## MCP Integration — Client + Server

**As client**: 5 transports (stdio, SSE, HTTP, WebSocket, SDK), 6 config scopes (dynamic > enterprise > user > project > local > plugin)
**As server**: `claude mcp serve` exposes CC tools to external clients
OAuth + XAA (Cross-App Access) for federated auth, keychain token storage
Tool output auto-truncated >32KB, binary → `/tmp/.claude/mcp-output/{hash}`
Resource support: ListMcpResourcesTool + ReadMcpResourceTool

Key files: `src/services/mcp/client.ts` (122KB!), `config.ts` (52KB), `auth.ts` (91KB)

## Bridge System (Remote Sessions)

Purpose: persistent auth connection between CLI and claude.ai (CCR v2)
Flow: OAuth → Bridge API → WorkResponse polling → WorkSecret decrypt → session create → transport connect
WorkSecret: encrypted JSON with git info, auth tokens, MCP config, env vars
SpawnMode: single-session | worktree | same-dir
Message dedup via BoundedUUIDSet, exponential backoff, capacity wake signal

Key files: `src/bridge/replBridge.ts`, `bridgeApi.ts`, `workSecret.ts`

## Query Engine (Main Loop)

query() = 1730-line main loop state machine:
1. nextMessage() → processUserInput() → buildSystemPrompt() → API call
2. Stream tool uses → execute in parallel → collect results
3. Speculation: background suggestion generation with abort
4. Auto-compact when context > threshold
5. Stop hooks on completion

Token budget: user specifies `+500k` or `spend 2M tokens`, becomes continuation threshold
System prompt sections: cached per-session, volatile sections break cache intentionally

Key files: `src/query.ts` (1730 lines), `src/QueryEngine.ts` (1297 lines)

## State Management

React Context + Zustand store, DeepImmutable<T> typing
Ephemeral per session (no localStorage)
Key state: settings, model selection, permissions, speculation, task tracking, bridge state
Speculation: background message generation with pipelined suggestions

Key files: `src/state/AppStateStore.ts`, `store.ts`, `AppState.tsx`

## Services Layer (22 subdirectories)

mcp (508KB), api, analytics, voice, tools, compact, plugins, oauth, SessionMemory, extractMemories, lsp, MagicDocs, PromptSuggestion, settingsSync, teamMemorySync, autoDream, toolUseSummary, policyLimits

## Voice System

Platform-native via NAPI (cpal), fallbacks: arecord (Linux), SoX rec
Lazy NAPI loading (dlopen costs 1-8s), silence detection (2s at 3%)
STT: streams WAV to Claude API v1 audio endpoint

## Commands System

~120 built-in commands, feature-gated loading, lazy import for heavy modules
Types: PromptCommand (slash) | LocalCommand (JSX UI) | ResumeEntrypoint
Sources: built-in + skill dir + plugin + built-in plugin
Priority handling, lifecycle hooks, command queue

## Plugin System

ID format: `{name}@{marketplace}` (builtin: `@builtin`)
Components: skills, hooks, MCP servers
20+ discriminated union error types for type-safe error handling
Memoized loading with cache invalidation on settings change

## Background Services (Most Novel)

### extractMemories
Runs at end of each query loop (when model finishes without tool calls). Uses forked agent sharing parent prompt cache. Scans transcript for memory-worthy items. If main agent already wrote memories, extractor skips that range. Tool budget: Read, Grep, Glob, read-only Bash, Edit/Write for memory dir only.
Key files: `src/services/extractMemories/extractMemories.ts`, `prompts.ts`

### autoDream (Memory Consolidation)
Fires every 24h with ≥5 sessions since last. 4 phases: Orient (ls memory, read MEMORY.md) → Gather signal (daily logs, drifted memories, transcript search) → Consolidate (merge, fix dates, delete contradicted) → Prune index (keep under 200 lines/25KB). Read-only Bash, lock/rollback mechanism.
Key files: `src/services/autoDream/autoDream.ts`, `consolidationPrompt.ts`, `consolidationLock.ts`

### MagicDocs (ANT-only)
Auto-updating documentation. Files with `# MAGIC DOC: [title]` header auto-tracked. Background agent updates when conversation idle. Only allows Edit tool on that specific file. Custom prompts loadable from `~/.claude/magic-docs/prompt.md`.
Philosophy: terse, high-signal-only, architecture+entry points, NOT code walkthroughs.
Key files: `src/services/MagicDocs/magicDocs.ts`, `prompts.ts`

### Forked Agent Pattern
All 3 services use `runForkedAgent()` which shares parent's prompt cache (CacheSafeParams: system prompt, tools, model, messages prefix, thinking config must be identical). This makes background agents nearly free on cache hits.
Key file: `src/utils/forkedAgent.ts`
