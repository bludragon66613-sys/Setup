---
name: gpt-review
description: 'Run a code review through the local codex CLI (OpenAI GPT) on the uncommitted diff, a GitHub PR by number, a branch vs base, or specific files. Returns severity-tagged findings (CRITICAL/HIGH/MEDIUM/LOW) with file:line and a fix suggestion. Use when the user explicitly wants codex, GPT, or OpenAI to review, or asks for a second-opinion review from another model: "gpt review", "codex review", "review with codex/gpt", "get codex to check PR 42". Read-only, never applies fixes. Not for a plain "review my PR/diff" with no codex/GPT/second-model mention (use code-review), and not for using codex to write or fix code.'
license: MIT
---

# GPT Review (codex)

Wraps the local `codex` CLI to produce a structured, severity-tagged review. Four input modes are auto-detected from the argument.

## Usage

```
/gpt-review                    # uncommitted: staged + unstaged + untracked vs HEAD
/gpt-review <PR#>              # GitHub PR diff (argument is purely numeric)
/gpt-review <branch>           # HEAD vs <branch> (argument resolves as a git ref)
/gpt-review <path> [<path>...] # specific file(s) or directory
```

If the argument is ambiguous (e.g. a path that also happens to be a valid branch name), ask the user which mode they meant before dispatching.

## Prereqs (verify before dispatching)

Run silently, surface only on failure:

```bash
command -v codex >/dev/null || { echo "codex not installed. Run: npm install -g @openai/codex"; exit 1; }
codex login status 2>&1 | grep -qi "logged in" || { echo "codex not authenticated. Run: codex login"; exit 1; }
# PR mode only:
command -v gh >/dev/null || { echo "gh CLI required for PR mode. Run: brew install gh && gh auth login"; exit 1; }
# git modes only (uncommitted/branch/PR):
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Not in a git repo"; exit 1; }
```

## Dispatch logic (Claude executes in this order)

Given `$ARG` = the skill argument string:

1. **No argument** → **uncommitted mode**.
2. **`$ARG` matches `^[0-9]+$`** → **PR mode** (treat as PR number).
3. **`[ -e "$ARG" ]` (path exists on disk)** → **paths mode** (one or more files/dirs).
4. **`git rev-parse --verify "$ARG^{commit}"` succeeds** → **branch mode** (review HEAD vs $ARG).
5. Otherwise → **ask the user** which mode they meant. Do not guess.

Order matters: path check beats ref check, so a branch named after an existing file is treated as a path (safer; the user can re-invoke and say they meant the branch).

## Review prompt (write verbatim to a temp file, then pass to codex)

Each Bash tool call runs in a fresh shell, so `$$` and shell variables do not survive between calls. Create the file once with `mktemp`, note the printed path, and use that literal path in every later command (shown below as `$PROMPT_FILE`; start each later call with `PROMPT_FILE=<that path>`). Alternatively run write + codex + cleanup in a single Bash call.

```bash
PROMPT_FILE=$(mktemp "${TMPDIR:-/tmp}/gpt-review-prompt.XXXXXX") && echo "$PROMPT_FILE"
cat > "$PROMPT_FILE" <<'PROMPT'
<prompt below, verbatim>
PROMPT
```

Prompt text (the quoted heredoc keeps shell quoting from corrupting it):

```text
You are a senior code reviewer. Review the provided changes for defects.
Output ONLY findings — no preamble, no praise, no summary of what the code does.

Format each finding on ONE line, exactly:
<SEVERITY>: <relative/path>:<line>: <one-sentence problem>. Fix: <one-sentence suggested change>.

Severities (use exactly these tokens):
- CRITICAL  — security holes, data loss, crashes in normal use, broken auth, exposed secrets
- HIGH      — correctness bugs, race conditions, resource leaks, unhandled errors on the happy path
- MEDIUM    — API contract / type mismatches, perf cliffs, dead error branches, fragile patterns
- LOW       — duplicated logic, unclear naming that masks a real bug risk, missing edge-case handling

Cover: off-by-one, null/undefined, race conditions, injection, auth bypass, secrets in code,
unsafe deserialization, type / contract mismatches, resource leaks, unbounded loops, broken
error handling, dead code with side effects.

SKIP: formatting nits, style preferences, "consider renaming", praise of any kind, restating
what the diff already shows. If you have nothing at a severity, omit that severity entirely.

End with ONE summary line:
TOTAL: <n> CRITICAL, <n> HIGH, <n> MEDIUM, <n> LOW.
```

## Invocations per mode

Model: codex uses its configured default. Only if the user names a model, add `-c model="<name>"` right after the subcommand (`codex review -c model="<name>" ...`, `codex exec -c model="<name>" -`). That is the config override documented in `codex --help`; `codex exec` also accepts `-m <name>`, `codex review` does not.

### Mode 1 — uncommitted

```bash
codex review --uncommitted "$(cat "$PROMPT_FILE")"
```

### Mode 2 — PR by number

`codex review` has no built-in PR fetcher. Fetch via `gh`, feed both prompt + diff via stdin to `codex exec`:

```bash
{
  cat "$PROMPT_FILE"
  printf '\n\n--- BEGIN PR #%s DIFF ---\n' "$PR"
  gh pr diff "$PR"
  printf '\n--- END DIFF ---\n'
} | codex exec -
```

If `gh pr diff` returns empty or errors, surface the error and stop — do not run codex on an empty diff.

### Mode 3 — branch vs base

```bash
codex review --base "$BRANCH" "$(cat "$PROMPT_FILE")"
```

### Mode 4 — paths

```bash
{
  cat "$PROMPT_FILE"
  printf '\n\nReview the following file(s):\n'
  for f in "${PATHS[@]}"; do
    if [ -d "$f" ]; then
      find "$f" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.py' -o -name '*.go' -o -name '*.rs' -o -name '*.swift' -o -name '*.php' -o -name '*.rb' -o -name '*.java' -o -name '*.kt' -o -name '*.sh' \) -print0 \
        | while IFS= read -r -d '' file; do
            printf '\n--- %s ---\n' "$file"
            cat "$file"
          done
    else
      printf '\n--- %s ---\n' "$f"
      cat "$f"
    fi
  done
} | codex exec -
```

## Output handling (Claude post-processes codex output)

1. Capture codex stdout.
2. Strip everything before the first line matching `^(CRITICAL|HIGH|MEDIUM|LOW):`.
3. Group findings by severity, CRITICAL first.
4. Render to the user as a markdown list, one finding per bullet, severity bolded.
5. End with the `TOTAL:` line verbatim.
6. **Do NOT** apply fixes automatically. This skill is read-only review. If the user wants the fixes applied, that is a separate follow-up they must ask for explicitly.

## Cleanup

```bash
rm -f "$PROMPT_FILE"
```

## Failure modes

Missing codex / not logged in / missing gh: the prereq block above prints the install or login command; relay it and stop.

| Symptom | Action |
| --- | --- |
| Empty diff (uncommitted/PR/branch) | Print "No changes to review." and stop. Do not call codex. |
| codex exits non-zero | Print stderr verbatim, do not pretend the review succeeded |
| Output has zero severity-prefixed lines | Tell user: "codex returned no structured findings — raw output below:" then dump output |

## Notes

- Read-only. Never mutates the working tree, never runs `gh pr checkout`, never auto-applies fixes.
- The review prompt is fixed in this skill on purpose — consistent output format across runs.
- If the user wants a different review focus (e.g. only security), they should say so; append their extra instructions to the prompt file **before** the severity rules, never after.
