# /wiki-lint

Run health checks on the Obsidian wiki. Report issues by severity, apply safe auto-fixes, flag everything else for human judgment.

## Usage

`/wiki-lint [--fix]`

- Default: report only
- `--fix`: apply safe auto-fixes (broken wikilink cleanup, index drift, missing entity stubs)

## Checks

This command targets the Obsidian vault at `~/OneDrive/Documents/Agentic knowledge/`, not the OMC project-local wiki. Check:

1. **Unprocessed sources** — files in `raw/` with no matching wiki article (suggest: run `/wiki-ingest`)
2. **Orphan pages** — wiki pages with zero inbound wikilinks (info level)
3. **Stale content** — `updated:` >30 days old on any article (info)
4. **Broken wikilinks** — links pointing to nonexistent pages (warning; `--fix` removes)
5. **Missing entity pages** — entity mentioned in ≥2 articles but no page (warning; `--fix` creates stub)
6. **Missing concept pages** — pattern in ≥3 articles, no page (info)
7. **Index drift** — pages on disk not in `index.md` (warning; `--fix` adds)
8. **Contradictions** — pages with conflicting claims (critical; human required)
9. **Missing validation gate** — any page without `explored:` or `confidence:` frontmatter (warning; `--fix` adds `explored: false, confidence: medium`)
10. **Missing bias-check sections** — articles/concepts without `## Counter-arguments` or `## Data gaps` (warning; human required)
11. **BF drift** — any edit to `brand-foundation/*.md` in last 24h where author was an agent, not human (critical)

## Output

Structured report:
```
CRITICAL: <count>
  - <issue> → <page> → <fix>
WARNING: <count>
  - ...
INFO: <count>
  - ...
```

Append summary to `log.md`: `YYYY-MM-DD | lint | critical=<n> warning=<n> info=<n>`
