---
name: lightrag-vault
description: LightRAG semantic knowledge graph over Obsidian vault — MCP server for Claude Code, CLI, local + API providers
type: project
originSessionId: 1bf33710-9749-41c6-9ec3-8ce9de1aba8b
---
## Project: lightrag-vault
- **Location**: `~/lightrag-vault`
- **Purpose**: Semantic knowledge graph over Obsidian vault (`~/OneDrive/Documents/Agentic knowledge/`) via LightRAG
- **Config**: `~/.lightrag/config.yaml`
- **Data**: `~/.lightrag/data/`
- **Repo**: local only (not pushed to GitHub yet)

## Architecture
- `config.py` — YAML config loading/validation
- `locking.py` — Atomic file writes + data dir locking
- `providers.py` — LLM/embedding factories (Anthropic, Ollama, OpenAI/OpenRouter)
- `ingest.py` — Vault scanning, SHA-256 change detection, LightRAG orchestration
- `cli.py` — Click CLI (init, ingest, update, query, status)
- `server.py` — FastMCP server (vault_query, vault_status, vault_update, vault_ingest)

## MCP Integration
- Configured in `~/.claude.json` under `mcpServers.lightrag-vault`
- Auto-approved in `~/.claude/settings.json`
- Runs via `python -m lightrag_vault.server`
- 4 tools: vault_query, vault_status, vault_update, vault_ingest

## Config (current)
- **Bulk LLM**: `ollama/qwen2.5:1.5b` (free, slow)
- **Incremental LLM**: `ollama/llama3.2`
- **Embedding**: `sentence-transformers/BAAI/bge-small-en-v1.5` (local)
- **Vault**: 427 markdown files (excludes raw/, daily/, sessions/, .obsidian/, .git/, Claude Sessions/)

**Why:** Anthropic API credits ran out (~34 files processed before 402). OpenRouter also had no credits. Fell back to local Ollama.

**How to apply:** When credits are available, switch bulk back to `anthropic/claude-haiku-4-5-20251001` — it processed 100+ files/min vs ~3 files/min local.

## Ingest Status (2026-04-10)
- **PAUSED** — waiting for API credits (Anthropic or OpenRouter)
- 0/427 files in graph (partial data cleared)
- When credits are added, switch config bulk to `anthropic/claude-haiku-4-5-20251001` and run:
  ```bash
  ANTHROPIC_API_KEY=sk-ant-... lightrag-vault ingest
  ```
- Will finish in ~5 minutes with Haiku (~100 files/min)

## Key Fixes Made
1. Windows glob bug — `Path.glob("raw/**")` doesn't match files on Windows; fixed with `rglob` expansion
2. LightRAG kwargs — `hashing_kv`/`keyword_extraction` stripped before calling provider APIs
3. Config validation — `base_url` key in llm config skipped during provider validation
4. Lock scope — DataLock narrowed to hash save only, not entire ingest loop

## 9 Commits
```
e28c7ac fix: narrow DataLock scope to hash save only
e71e71c fix: strip LightRAG-internal kwargs before calling provider APIs
f5d2e77 fix: skip meta keys (base_url) when validating LLM provider roles
20de054 feat: Click CLI and FastMCP server with tests
86a3ac5 feat: vault scanning, hash-based change detection, and LightRAG orchestration
6e8d885 feat: LLM and embedding provider factories
288c15b feat: atomic file writes and data directory locking
3a7250c feat: config loading and validation with YAML schema checks
11fbf90 feat: project scaffolding with pyproject.toml, fixtures, and deps
```

## Tests
45 passing (pytest), covers config, locking, providers, ingest, CLI, MCP server

## ANTHROPIC_API_KEY
Not set in system env. Must be passed explicitly when using Anthropic provider:
```bash
ANTHROPIC_API_KEY=sk-ant-... lightrag-vault ingest
```
