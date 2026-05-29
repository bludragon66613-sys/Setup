---
name: qmd search engine on Mac
description: qmd CLI install procedure on this Mac. Use npm-global path, not bun, due to bun:sqlite needing Homebrew SQLite.
type: reference
originSessionId: f236be9f-dd17-4d0a-bf90-6aa8295bf7b6
---
**Install on Mac:** `npm install -g @tobilu/qmd` — uses node + better-sqlite3 (self-contained), no Homebrew needed.

**Do NOT use the bun-built version** of qmd (e.g., the local plugin at `~/.claude/plugins/marketplaces/qmd/`). Bun's `bun:sqlite` calls `setCustomSQLite()` looking for `/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib` or `/usr/local/opt/sqlite/lib/libsqlite3.dylib`. Neither exists on this Mac (no Homebrew installed). Result: every `qmd` call dlopen-fails. The package author's `loadSqliteVec()` hint confirms: *"On macOS with Bun, install Homebrew SQLite OR install qmd with npm instead."* npm is the easier path.

**Binary location:** `/Users/tetsuo/tools/node-global/bin/qmd` (npm prefix is `~/tools/node-global`). Already on PATH via `~/.zshrc` and `~/.zprofile`.

**Config:** `~/.config/qmd/index.yml` — points to vault:
```yaml
collections:
  vault:
    path: /Users/tetsuo/Documents/Vault
    pattern: "**/*.md"
```

**Index:** `~/.cache/qmd/index.sqlite` (~14MB for 826 docs with 1728 vectors).

**Re-index commands** (per CLAUDE.md):
```bash
qmd update    # re-scan markdown files (new/updated/removed)
qmd embed     # generate vector embeddings for new/changed content
```

`qmd update` is fast (seconds). `qmd embed` runs the embeddinggemma-300M model (~4s for 38 chunks on this Mac).

**First `qmd query` call** downloads a 1.28GB reranking model (`hf_tobil_...k_m.gguf`) — one-time. The lighter `qmd search` (BM25 only) and `qmd vsearch` (vector only) work immediately without the reranker.

**Status verified 2026-05-15:** 826 files / 1728 vectors / index 13.7MB. qmd MCP is also wired to Claude Code via `~/.claude.json`.

**How to apply:** When asked to install/repair qmd on this Mac, prefer `npm install -g @tobilu/qmd`. If the user already has a broken bun-built version at `~/.claude/plugins/marketplaces/qmd/`, leave it — the npm-global binary takes PATH precedence.
