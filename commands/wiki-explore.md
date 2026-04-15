# /wiki-explore

Human validation gate. List wiki pages with `explored: false` and walk through each for review, edit, or approval. This is the only way a page becomes `explored: true`.

## Usage

`/wiki-explore [--type article|concept|entity|output] [--limit N]`

## Workflow

1. **Grep** `~/OneDrive/Documents/Agentic knowledge/wiki/` for files with frontmatter `explored: false`
2. **Sort** by `created:` ascending (oldest unreviewed first)
3. **For each page** (up to `--limit`, default 10):
   - Show: title, type, confidence, sources, one-line TLDR
   - Ask the user:
     - `[a] approve` → set `explored: true`, bump `updated:`
     - `[e] edit` → open page for manual edit, re-prompt after save
     - `[r] reject` → move page to `wiki/_rejected/` (preserve, don't delete)
     - `[s] skip` → leave as-is, move to next
     - `[q] quit` → stop the session
4. **Track stats** during session: approved/edited/rejected/skipped counts
5. **Append to `log.md`** on exit: `YYYY-MM-DD | explore | approved=<n> rejected=<n>`

## Refuse to

- Set `explored: true` without human confirmation (even in --auto modes)
- Delete any file (use `_rejected/` directory instead)
- Touch `brand-foundation/` (those files are not wiki pages and have no exploration gate)
