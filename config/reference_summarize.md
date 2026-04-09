---
name: summarize-cli-setup
description: steipete/summarize CLI tool — content extraction, summarization, vault integration
type: reference
---

## Summarize CLI (steipete/summarize v0.12.0)

Globally installed via `npm i -g @steipete/summarize`.

**What it does:** Extracts and summarizes content from URLs, PDFs, YouTube, podcasts, audio/video, local files.

**Config:** `~/.summarize/config.json`
- Claude CLI backend configured at `C:/Users/Rohan/.local/bin/claude.exe`
- Windows quirk: must use forward slashes in binary path (backslashes cause ENOENT)

**Default model:** `google/gemini-2.5-flash` via `SUMMARIZE_MODEL` env var (~$0.02/summary vs $0.41 for Claude)
- Override with `--cli claude` for deep analysis or `--model google/gemini-2.5-pro` for mid-tier

**Shell aliases** (in `~/.bashrc`):
- `sum <url>` — medium summary
- `sumshort <url>` — short summary
- `sumlong <url>` — long summary
- `sumextract <url>` — extract content only (no LLM, free)
- `sumvault <url> [length] [tag]` — summarize and save to Obsidian vault

**Vault integration:** `~/.local/bin/sum-to-vault.sh`
- Saves to `~/OneDrive/Documents/Agentic knowledge/summaries/`
- Frontmatter: title, source, date, type, length, tags

**API keys** (in `~/.bashrc`):
- `GEMINI_API_KEY` set from `GOOGLE_API_KEY`
- Claude CLI available as fallback (no API key needed)

**Cache:** SQLite at `~/.summarize/cache.sqlite` (7-day TTL, 2GB cap)
