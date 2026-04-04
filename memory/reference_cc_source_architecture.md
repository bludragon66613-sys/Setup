---
name: Claude Code Source Architecture Reference
description: Complete architecture map from CC source (nirholas/claude-code) — all subsystems explored across 2 sessions (Mar 31-Apr 1, 2026)
type: reference
---

# Claude Code Source Architecture (fully explored Apr 1, 2026)

Source: `github.com/bludragon66613-sys/claude-code` (forked from nirholas/claude-code)
Local clone: `~/claude-code-source/` (~512K lines TypeScript, ~1900 files)

---

## 1. Hook System — 5 Types, 23+ Events

Hook types (settings.json):
- **command**: shell command, stdout/stderr → blocking/non-blocking
- **prompt**: single LLM call (Haiku default), returns {ok, reason} JSON
- **agent**: multi-turn sub-agent with tools, structured output via SyntheticOutputTool, max 50 turns
- **http**: POST JSON to URL, SSRF-guarded, env var interpolation in headers, allowlist policy
- **function**: in-memory callback (internal only)

Events: SessionStart, Stop, SubagentStop, PreToolUse, PostToolUse, PostToolUseFailure, PreCompact, PostCompact, UserPromptSubmit, PermissionRequest, Notification, Setup, SessionEnd, FileChanged, CwdChanged, ConfigChange, SubagentStart + more

Advanced features: `if` conditions, matchers (tool/filePath/skills regex), elicitation (interactive prompts from hooks), trust model (first run requires acceptance)

Key files: `src/utils/hooks/execAgentHook.ts`, `execPromptHook.ts`, `execHttpHook.ts`, `sessionHooks.ts`, `hooksSettings.ts`

---

## 2. Memory System — 4 Types, Side-Query Selection

Types: user, feedback, project, reference
MEMORY.md: 200 line / 25KB cap, truncated with warning
findRelevantMemories(): side-query with Sonnet selects up to 5 relevant topic files per turn (based on user query + recent tools)
KAIROS mode: daily logs at `memory/logs/YYYY/MM/YYYY-MM-DD.md`, nightly /dream distills
Team memory: `memory/team/` shared subdirectory (feature: TEAMMEM)

Key files: `src/memdir/memdir.ts`, `paths.ts`, `memoryTypes.ts`, `findRelevantMemories.ts`

---

## 3. Coordinator Mode

Env: `CLAUDE_CODE_COORDINATOR_MODE=1`
Transforms CC into task manager: spawns workers, synthesizes findings, delegates implementation
Workers report via `<task-notification>` XML (task-id, status, summary, result, usage)
Scratchpad: cross-worker shared directory writable without permission prompts (feature: tengu_scratch)
Anti-pattern: "based on your findings" = lazy delegation. Good: synthesized specs with file paths + line numbers
Phases: Research (parallel) → Synthesis (coordinator) → Implementation → Verification (fresh worker)

Key file: `src/coordinator/coordinatorMode.ts`

---

## 4. Agent Frontmatter Config

Fields: model, color, backgroundMode, memoryScope (user/project/local), isolation (worktree/remote), effort, permissionMode, maxTurns, tools, skills, mcpServers, hooks
Hooks in frontmatter: Stop → SubagentStop auto-conversion for agents
Memory-enabled agents: Write/Edit/Read tools auto-injected

Key files: `src/tools/AgentTool/loadAgentsDir.ts`, `agentMemory.ts`, `src/utils/hooks/registerFrontmatterHooks.ts`

---

## 5. MCP Integration — Client + Server

**As client**: 5 transports (stdio, SSE, HTTP, WebSocket, SDK), 6 config scopes (dynamic > enterprise > user > project > local > plugin)
**As server**: `claude mcp serve` exposes CC tools to external clients
OAuth + XAA (Cross-App Access) for federated auth, keychain token storage
Tool output auto-truncated >32KB, binary → `/tmp/.claude/mcp-output/{hash}`
Resource support: ListMcpResourcesTool + ReadMcpResourceTool

Key files: `src/services/mcp/client.ts` (122KB!), `config.ts` (52KB), `auth.ts` (91KB)

---

## 6. Bridge System (Remote Sessions)

Purpose: persistent auth connection between CLI and claude.ai (CCR v2)
Flow: OAuth → Bridge API → WorkResponse polling → WorkSecret decrypt → session create → transport connect
WorkSecret: encrypted JSON with git info, auth tokens, MCP config, env vars
SpawnMode: single-session | worktree | same-dir
Message dedup via BoundedUUIDSet, exponential backoff, capacity wake signal

Key files: `src/bridge/replBridge.ts`, `bridgeApi.ts`, `workSecret.ts`

---

## 7. Query Engine (Main Loop)

query() = 1730-line main loop state machine:
1. nextMessage() → processUserInput() → buildSystemPrompt() → API call
2. Stream tool uses → execute in parallel → collect results
3. Speculation: background suggestion generation with abort
4. Auto-compact when context > threshold
5. Stop hooks on completion

Token budget: user specifies `+500k` or `spend 2M tokens`, becomes continuation threshold
System prompt sections: cached per-session, volatile sections break cache intentionally

Key files: `src/query.ts` (1730 lines), `src/QueryEngine.ts` (1297 lines)

---

## 8. Context & System Prompt Assembly

**System prompt is an array, not a string** — each block gets independent cache control.

### Assembly Order (static → dynamic):
1. Attribution & prefix (scope: null)
2. **Static cached content** (scope: global — cross-org, cross-user reuse):
   - Intro & mission, system rules, hooks guidance, tool usage, actions/safety, output style/tone
3. **SYSTEM_PROMPT_DYNAMIC_BOUNDARY** marker
4. **Dynamic session-specific** (scope: null — ephemeral):
   - Session guidance (agent/skill tool details), memory prompt, environment info, language preference, MCP instructions, scratchpad instructions, function result clearing

### Cache Strategy:
- Content before boundary → `scope: 'global'` (maximum reuse)
- Content after boundary → `scope: null` (session-only)
- MCP tools present → downgrade to org-level (can't guarantee static boundaries)
- TTL: 5m default, 1h for Ant/subscriber users on GrowthBook allowlist

### Context Injection:
- `getSystemContext()`: memoized git status, branch, recent commits (truncated 2000 chars)
- `getUserContext()`: CLAUDE.md files, current date
- `appendSystemContext()`: appended at end of system prompt array
- `prependUserContext()`: first user message wrapped in `<system-reminder>` tags

Key files: `src/constants/prompts.ts`, `systemPromptSections.ts`, `context.ts`, `utils/api.ts`, `services/api/claude.ts`

---

## 9. Compaction System — 3 Layers

### Layer 1: Session Memory Compaction (preferred)
- Tried first when available
- Preserves key context in session memory format

### Layer 2: Full Conversation Compaction
- Strips images/documents, re-injected attachments (skill_discovery, skill_listing)
- Summarize via forked agent (max output 20k tokens, shares parent prompt cache)
- Post-compact: restore files, skills, MCP instructions

### Layer 3: Microcompaction (per-tool-result)
- Compactable tools: FileRead, Bash, Grep, Glob, WebSearch, WebFetch, FileEdit, FileWrite
- Time-based clearing with `TIME_BASED_MC_CLEARED_MESSAGE` marker
- Cache-aware: pinned cache_edits re-sent at same positions for cache hits
- ~2000 tokens estimated per image/document

### Auto-compact Trigger:
- Threshold: `contextWindow - MAX_OUTPUT_TOKENS - 13,000 buffer`
- Warning at 20k before threshold
- Circuit breaker: 3 consecutive failures → stop trying
- Suppressed if: CCR session, CONTEXT_COLLAPSE enabled, REACTIVE_COMPACT active

### Truncation (prompt-too-long fallback):
- Drop oldest API-round groups until gap closed
- Minimum: keep 1 group
- Fallback: drop 20% if gap unparseable

Key files: `src/services/compact/compact.ts`, `autoCompact.ts`, `microCompact.ts`

---

## 10. Token Budget Tracking

- `checkTokenBudget()`: stops at 90% of budget OR on diminishing returns
- Diminishing returns: 3+ continuations + last 2 deltas < 500 tokens each
- Continuation nudges at 60%, 70%, 80%, 90% thresholds
- Separate from API-side task_budget (output_config)

Key file: `src/query/tokenBudget.ts`

---

## 11. Skills System — Discovery, Matching, Execution

### Discovery (priority order, first wins):
1. Managed: `{MANAGED_PATH}/.claude/skills/`
2. User: `~/.claude/skills/`
3. Project: `.claude/skills/` (walks up to home)
4. Additional: `--add-dir` paths
5. Legacy: `.claude/commands/` (deprecated)

### Dynamic Discovery:
- File operations (Read/Edit/Write) trigger `discoverSkillDirsForPaths()` — walks parent dirs for `.claude/skills/`
- Gitignore-aware: blocked on `git check-ignore`
- Dedup via `realpath()` to canonicalize symlinks

### Frontmatter Schema (all fields):
| Field | Type | Purpose |
|-------|------|---------|
| description | string | Skill description |
| name | string | Display name override |
| when_to_use | string | Usage scenarios for model |
| model | string | 'haiku'/'sonnet'/'opus'/'inherit'/specific |
| effort | string\|int | 'low'/'medium'/'high'/'max' or 1-100 |
| arguments | string\|string[] | Argument names for substitution |
| argument-hint | string | Gray hint text in autocomplete |
| allowed-tools | string\|string[] | Tool restrictions during execution |
| user-invocable | string | 'true'/'false' — /skill-name availability |
| disable-model-invocation | boolean | Block SkillTool from invoking |
| hooks | HooksSettings | PreToolUse, PostToolUse, Stop, ConfigChange |
| context | 'inline'\|'fork' | Execution mode |
| agent | string | Agent type for forked execution |
| paths | string\|string[] | Gitignore-style globs for conditional activation |
| shell | 'bash'\|'powershell' | Shell for !`cmd` blocks |
| skills | string | Comma-separated skills to preload (agents only) |
| version | string | Semantic version |

### Conditional Skills:
- Skills with `paths:` loaded but hidden until file match triggers activation
- Uses `ignore` library (gitignore-style matching)
- Activation persists within session (survives cache clears)

### Execution:
- **Inline** (default): expands skill markdown into conversation, substitutes args
- **Forked** (`context: 'fork'`): runs sub-agent with isolated context
- Permission pipeline: deny rules → allow rules → SAFE_SKILL_PROPERTIES auto-allow → ask user

### File Watching:
- `chokidar` with depth:2, 300ms debounce, 1000ms write stabilization
- ConfigChange hook fired before reload (can block)
- Clears: memoization, conditional map, command lookup, sent skill names

Key files: `src/skills/loadSkillsDir.ts`, `bundledSkills.ts`, `mcpSkillBuilders.ts`, `src/tools/SkillTool/SkillTool.ts`, `src/utils/skills/skillChangeDetector.ts`

---

## 12. State Management

React Context + Zustand store, DeepImmutable<T> typing
Ephemeral per session (no localStorage)
Key state: settings, model selection, permissions, speculation, task tracking, bridge state
Speculation: background message generation with pipelined suggestions

Key files: `src/state/AppStateStore.ts`, `store.ts`, `AppState.tsx`

---

## 13. Services Layer — All Subsystems

### extractMemories (Background)
Runs at end of each query loop. Uses forked agent sharing parent prompt cache. Scans transcript for memory-worthy items. If main agent already wrote memories, extractor skips that range. Tools: Read, Grep, Glob, read-only Bash, Edit/Write for memory dir only.
Key files: `src/services/extractMemories/extractMemories.ts`, `prompts.ts`

### autoDream (Memory Consolidation)
Fires every 24h with ≥5 sessions since last. 4 phases: Orient → Gather signal → Consolidate → Prune index (200 lines/25KB cap). Lock/rollback mechanism.
Key files: `src/services/autoDream/autoDream.ts`, `consolidationPrompt.ts`, `consolidationLock.ts`

### MagicDocs (ANT-only)
Files with `# MAGIC DOC: [title]` header auto-tracked. Background agent updates when idle. Only Edit on that specific file. Terse, architecture+entry points style.
Key files: `src/services/MagicDocs/magicDocs.ts`, `prompts.ts`

### AgentSummary
Periodic forked agent (every 30s) generates 3-5 word present-tense progress labels for coordinator sub-agents (e.g., "Reading runAgent.ts", "Fixing null check in validate.ts"). Reuses parent prompt cache. No-op default prevents overlapping summaries.
Key file: `src/services/AgentSummary/agentSummary.ts`

### PromptSuggestion (Intent Prediction)
Predicts what user would type next (2-12 words). Fires after 2+ assistant turns. Heavy filtering: blocks meta-text, Claude-voice, evaluations, new ideas. Cache-critical: does NOT override cache-key params (tools, system, model, thinking config) — overriding busted cache from 92.7% → 61% hit rate.
Key files: `src/services/PromptSuggestion/promptSuggestion.ts`, `speculation.ts`

### tips/ (Contextual Spinner Tips)
95+ tips with async relevance checks, cooldown scheduling, A/B testing. Categories: learning, productivity, tools, upsells, advanced. Environment-aware (ANT-only, SSH, IDE detection).
Key files: `src/services/tips/tipScheduler.ts`, `tipRegistry.ts`, `tipHistory.ts`

### awaySummary ("While You Were Away")
1-3 sentence recap when user returns. Uses Haiku on last 30 messages. Includes session memory context. Graceful null on abort/error.
Key file: `src/services/awaySummary.ts`

### toolUseSummary
Git-commit-subject-style labels for completed tool batches (e.g., "Searched in auth/", "Fixed NPE in UserService"). Truncates JSON to 300 chars. Non-critical (errors logged, returns null).
Key file: `src/services/toolUseSummary/toolUseSummaryGenerator.ts`

### Forked Agent Pattern (shared by all background services)
`runForkedAgent()` shares parent's prompt cache via CacheSafeParams (system prompt, tools, model, messages prefix, thinking config must be identical). Background agents nearly free on cache hits.
Key file: `src/utils/forkedAgent.ts`

---

## 14. Novel Subsystems

### buddy/ (Companion System)
Procedural companion character per user. Mulberry32 seeded PRNG from hash(userId). 18 species (duck, cat, dragon, octopus, etc.), rarity tiers (common 60%, legendary 1%), 6 eye styles, 8 hats, "shiny" 1% chance. 5-line animated ASCII sprites with 3 fidget frames. Bones regenerated from seed (never persisted), only soul (name, personality) stored.
Key files: `src/buddy/companion.ts`, `sprites.ts`, `types.ts`

### x402/ (Crypto Micropayments)
HTTP 402 protocol for machine-to-machine USDC payments on Base/Ethereum. Fetch-level wrapper intercepts 402 + X-Payment-Required header. Signs EIP-712/EIP-3009 transferWithAuthorization. Limits: $0.10/request, $5/session. Private key in `~/.claude/config.json` (mode 600).
Key files: `src/services/x402/paymentFetch.ts`, `config.ts`, `client.ts`, `tracker.ts`

### moreright/ (Internal Stub)
External build returns no-ops. Hook interface: onBeforeQuery, onTurnComplete, render. Internal-only feature.

### tasks/ (Task Management)
6 task types: LocalShellTask, LocalAgentTask, RemoteAgentTask, InProcessTeammateTask, LocalWorkflowTask, MonitorMcpTask, DreamTaskState. Union-based state machine. Pill labels with diamond indicators for ultraplan (◇ open/◆ filled).
Key files: `src/tasks/types.ts`, `pillLabel.ts`, `stopTask.ts`

### upstreamproxy/ (CCR Container Proxy)
Secure proxy for container-based runtime. Reads session token from `/run/ccr/session_token`, sets prctl(PR_SET_DUMPABLE, 0) to block ptrace, downloads CCR CA cert, starts CONNECT→WebSocket relay. NO_PROXY excludes anthropic.com (MITM breaks non-Bun runtimes). Fails open.
Key files: `src/upstreamproxy/upstreamproxy.ts`, `relay.ts`

---

## 15. Commands System

~120 built-in commands, feature-gated loading, lazy import for heavy modules
Types: PromptCommand (slash) | LocalCommand (JSX UI) | ResumeEntrypoint
Sources: built-in + skill dir + plugin + built-in plugin
Priority handling, lifecycle hooks, command queue

---

## 16. Voice System

Platform-native via NAPI (cpal), fallbacks: arecord (Linux), SoX rec
Lazy NAPI loading (dlopen costs 1-8s), silence detection (2s at 3%)
STT: streams WAV to Claude API v1 audio endpoint

---

## 17. Plugin System

ID format: `{name}@{marketplace}` (builtin: `@builtin`)
Components: skills, hooks, MCP servers
20+ discriminated union error types for type-safe error handling
Memoized loading with cache invalidation on settings change
User-toggleable in `/plugin` UI

---

## 18. Key Architectural Patterns

| Pattern | Where Used | Insight |
|---------|-----------|---------|
| Forked agent (prompt cache sharing) | extractMemories, autoDream, AgentSummary, PromptSuggestion | Background agents nearly free when CacheSafeParams match |
| System prompt as array | Context assembly | Enables per-block cache control scopes |
| Static/dynamic boundary | Prompt caching | Global vs session-specific cache scopes |
| 3-layer compaction | Context management | Session memory → full conversation → per-tool microcompaction |
| Diminishing returns detection | Token budget | Stop after 3+ continuations with <500 token deltas |
| Conditional activation | Skills system | Hidden until file pattern match, persists within session |
| Seeded PRNG | buddy system | Deterministic generation from hash(userId) |
| Fetch-level protocol wrapping | x402 | Transparent middleware at HTTP layer |
| Cooldown scheduling | tips system | Longest-time-since-last-shown selection |
| Cache-safe parameter preservation | PromptSuggestion | Never override cache-key params (92.7% → 61% hit rate lesson) |
