---
name: Obsidian vault canonical path
description: Vault lives at ~/Documents/Vault (moved from Downloads 2026-05-14); Downloads path is now a back-compat symlink
type: project
---

Canonical (as of 2026-05-14): **`~/Documents/Vault/`** (1747 files). Sibling to all code projects under `~/Documents/`. Indexed by qmd as `vault` collection.

`~/Downloads/Vault` → symlink to canonical path, kept for back-compat with hardcoded refs.

Hook `~/.claude/hooks/lib/paths.js` `vaultBase()` checks Documents path first, then Downloads, then OneDrive variants.

Earlier stale entries: pre-2026-05-14 memory may cite `~/Downloads/Vault/` as canonical — that path still works via symlink, but the canonical is now Documents.

**Why:** Rohan wanted vault as a sibling to code projects under `~/Documents/` so all 2nd-brain + code live in one root, enabling dedicated Claude sessions per project with vault accessible at predictable path.

**How to apply:** All vault edits, qmd queries, MindMap.md regenerations target `~/Documents/Vault/`. New project setups must follow the layout convention (see `feedback_project_layout.md`).
