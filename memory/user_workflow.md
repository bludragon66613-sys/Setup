---
name: User workflow style
description: Orchestration prefs, terseness pref, agent delegation pattern
type: user
originSessionId: a0253b8a-0fdf-43a1-8a43-6fdcd070c60f
---
- Runs OMC (oh-my-claudecode) orchestration layer; delegates to specialized agents for multi-file work.
- Defaults to caveman mode (terse output) at session start. Hook auto-injects intensity each turn.
- Heavy slash-command user: invokes via `/<skill>` patterns. Prefers wizard-style configuration over editing JSON manually.
- Verifies setup state by listing pending items rather than re-discovering.
- Uses claude-mem plugin for cross-session observation history; recent context auto-injected at session start.
