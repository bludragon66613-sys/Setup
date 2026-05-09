---
name: Obsidian vault canonical path
description: Which Agentic knowledge directory is real; what was archived
type: project
originSessionId: a0253b8a-0fdf-43a1-8a43-6fdcd070c60f
---
Canonical: `~/Downloads/Agentic knowledge/` (683 md files, 6.7M, daily notes Apr-May 2026, full Claude Sessions log). Indexed by qmd as `vault` collection (1142 vectors).

Archived 2026-05-09: `~/Documents/Agentic knowledge/` → `~/.cache/agentic-knowledge-archive-20260509` (404K, 70 md files, subset of canonical with 5 differing older Aeon Logs).

CLAUDE.md previously referenced `~/OneDrive/Documents/Agentic knowledge/` — never existed on this Mac (Windows-era path). Fixed 2026-05-09.

Git: vault now has initial commit `18d291b` ("Initial commit: full vault snapshot"). No remote yet.

**Why:** Two competing vault dirs caused qmd to index the wrong (smaller) one. User confirmed Downloads canonical.

**How to apply:** All vault edits, qmd queries, MindMap.md regenerations target `~/Downloads/Agentic knowledge/`. If user references "the vault", that path. If older session memories cite OneDrive or Documents path, treat as stale.
