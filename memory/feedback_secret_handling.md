---
name: Secret file handling
description: Never use Edit/Write/Read on files containing secrets — Claude Code's file-change notification echoes contents into session jsonl, creating a leak loop
type: feedback
originSessionId: a2b3024e-10e1-4001-8b89-8f32d2774b9f
---
# Secret file handling

**Rule:** Never use Edit, Write, or Read tools on any file that currently contains or might contain plaintext secrets. Never `cat`, `head`, `grep -n`, or any Bash command that prints file contents to stdout for secrets files.

**Why:** Session 2026-04-15 hit this three times in a row with `~/.env.secrets`. The failure mode:
1. I Read `.env.secrets` to find the var name — instant leak: all 4 secrets into session context
2. I Edit `.env.secrets` to blank the value — fine, but the file is now in Claude Code's watch list
3. I Write to `.env.secrets` with a gh-OAuth replacement — system-reminder echoes the full file contents back to me on every subsequent change (including user edits), re-leaking every new token
4. User pastes fresh tokens manually — system-reminder echoes again, leaking the new pair
5. Each cycle requires revocation + regeneration, and the loop keeps going because the same tool pathway re-triggers

The net cost was 3 GitHub token rotations, 2 Supabase token rotations, 1 gh CLI OAuth rotation, and the user ultimately accepted the latest-round leak because the loop was unbreakable through my tool surface.

**How to apply:**

### When you need to know whether a var is set or what length/prefix it has

Use a subshell that sources the file without reading it:
```bash
bash -c 'source ~/.env.secrets 2>/dev/null && echo "VAR len=${#THE_VAR} prefix=${THE_VAR:0:4}"'
```
The length and 4-char prefix are safe indicators of "token present and correct format" without exposing the value.

### When you need to see the file's STRUCTURE without values

Use `awk` to print line numbers and var names only:
```bash
awk '/^export / {n=split($0,a,"="); k=a[1]; sub(/^export /,"",k); v=$0; sub(/^[^=]*=/,"",v); print NR": "k" len="length(v)}' ~/.env.secrets
```
This shows `14: GITHUB_PERSONAL_ACCESS_TOKEN len=42` without the value.

### When the user needs to rotate secrets

**Do not** open the secrets file in any tool. Instead:
1. Open the provider's revoke page in a browser (`start "" "https://..."` on Windows, `open "..."` on macOS)
2. Give the user a terminal-only command to paste the new value (using `read -rsp` for silent input)
3. Tell the user to run it themselves — your Bash tool never sees the value
4. Verify via the subshell length-check above

### The loader pattern (for future-proofing)

`.env.secrets` should be a loader:
```bash
[ -f ~/.secrets-live ] && source ~/.secrets-live
export SUMMARIZE_MODEL="google/gemini-2.5-flash"   # non-sensitive defaults OK here
```
The actual secrets live in `~/.secrets-live`, which you (the assistant) **must never touch** — not Read, not Edit, not Write, not grep, not cat. Once you've touched a file, Claude Code tracks it and echoes changes back. The only way to keep secrets safe is to keep them in a file you've never interacted with.

### What to tell the user when a leak happens

Be immediate and explicit:
- "The system-reminder just echoed [specific values] into this conversation's jsonl"
- "That token is now compromised, needs revocation"
- "Don't paste new values into a file I've touched"

Don't try to continue the task through the leaked state — stop, triage, rotate.

### Related files that have the same risk

- `~/.env.local`, `~/.env`, `~/.env.secrets` — any `.env*` file
- `~/.git-credentials` — git credential store
- `~/.claude/settings.local.json` — can contain embedded secrets in `allow` entries
- Any `*.env.local` inside project directories
- Git remote URLs with embedded PATs (`https://user:ghp_xxx@github.com/...`) — strip immediately

### What is safe to Read

- `.env.example`, `.env.sample` — template files with placeholder values
- A secrets file the user has confirmed is currently empty/blanked
- A loader file that only sources other files and defines non-sensitive defaults
