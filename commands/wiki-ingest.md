# /wiki-ingest

Ingest a raw source into the Obsidian wiki at `~/OneDrive/Documents/Agentic knowledge/` following `WIKI_SCHEMA.md`.

## Usage

`/wiki-ingest [path-or-url]`

- Path: absolute file path to a source in `raw/` or elsewhere
- URL: http(s) URL — fetched via `/browse` (gstack) or WebFetch, saved to `raw/` first
- No args: process all unprocessed files in `raw/` (files with no matching `wiki/articles/*.md` entry)

## Workflow

This command targets the Obsidian vault at `~/OneDrive/Documents/Agentic knowledge/`, not the OMC project-local wiki. Follow `WIKI_SCHEMA.md` in the vault root for the full spec. For each source:

1. **Read** the raw source file
2. **Check** `index.md` — does an article on this topic already exist?
   - Yes → update existing article (add new info, append source to frontmatter `sources:`, bump `updated:`)
   - No → create new `wiki/articles/<slug>.md`
3. **Extract entities** (people, tools, companies, frameworks). For each:
   - Page exists → append to its `Appears In` section, bump `updated:`
   - Mentioned in ≥2 articles → create `wiki/entities/<name>.md`
   - First mention → note for future, don't create yet
4. **Extract concepts** (cross-cutting patterns). If pattern appears in ≥3 articles → create `wiki/concepts/<name>.md`
5. **Cross-reference** — add wikilinks between new/updated pages
6. **Frontmatter** on every new page must include:
   ```yaml
   ---
   title: "..."
   type: article|entity|concept|summary
   created: YYYY-MM-DD
   updated: YYYY-MM-DD
   sources: ["[[raw/source-filename]]"]
   explored: false
   confidence: medium
   counter_arguments: []
   data_gaps: []
   tags: []
   ---
   ```
7. **Body requirement** — every article/concept page must have a `## Counter-arguments` and `## Data gaps` section. Minimum 2 counter-arguments or mark `confidence: uncertain`.
8. **Update `index.md`** — add new pages, update counts
9. **Append to `log.md`** — one entry: `YYYY-MM-DD | ingest | <source> | <pages touched> | <notes>`
10. **Print** — `qmd update && qmd embed` reminder for search re-indexing

## Refuse to

- Edit files in `brand-foundation/` (read-only BF layer)
- Overwrite an existing `sources:` entry (append only)
- Mark `explored: true` (only the human does that via `/wiki-explore`)
