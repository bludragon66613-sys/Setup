# Wiki Schema

> This document tells Claude how to maintain the wiki layer of this vault.
> It is the "schema" in Karpathy's LLM Wiki pattern — the configuration file
> that makes Claude a disciplined wiki maintainer rather than a generic chatbot.
> Co-evolve this with the vault as conventions mature.

---

## Architecture

```
vault/
├── raw/              # Layer 1: Immutable source documents (never edited)
├── wiki/             # Layer 2: LLM-maintained synthesis (Claude owns this)
│   ├── articles/     # Deep-dive pages on projects, systems, ideas
│   ├── entities/     # People, tools, companies, frameworks
│   ├── concepts/     # Cross-cutting ideas and patterns
│   └── summaries/    # Periodic landscape snapshots
├── WIKI_SCHEMA.md    # Layer 3: This file — conventions and workflows
├── index.md          # Flat catalog of every file
├── log.md            # Append-only changelog
└── MOC.md            # Master navigation (entry point)
```

### Ownership Rules

| Layer | Owner | Mutability |
|-------|-------|------------|
| `raw/` | Hook + human | Immutable after creation — never edit raw sources |
| `wiki/` | Claude | Claude creates, updates, and cross-references all pages |
| `index.md` | Claude | Updated on every ingest |
| `log.md` | Claude | Append-only — never edit existing entries |
| `MOC.md` | Claude | Updated when sections or counts change significantly |
| `WIKI_SCHEMA.md` | Human + Claude | Co-evolved — Claude proposes, human approves |

---

## Page Types

### Article (`wiki/articles/<slug>.md`)

Deep-dive pages on projects, systems, tools, or ideas. One article per distinct topic.

```yaml
---
title: "Human-readable title"
type: article
created: 2026-04-06
updated: 2026-04-06
sources:
  - "[[raw/source-filename]]"
tags: [project, ai, accounting]
entities: [munshi, tally, clerk]
---
```

**Body structure:**
1. One-paragraph summary (what it is, why it matters)
2. Sections with `##` headings — adapt to content (no rigid template)
3. Cross-references section at bottom: `## See Also` with wikilinks
4. Every entity mentioned should link to its entity page: `[[wiki/entities/entity-name|Entity Name]]`

**When to create:** A raw source introduces a new project, system, or substantial idea not already covered.
**When to update:** New sources add information about an existing topic. Update the article, add the new source to `sources:`, bump `updated:`.

### Entity (`wiki/entities/<name>.md`)

First-class pages for people, tools, companies, and frameworks. These are the connective tissue — they accumulate references from articles over time.

```yaml
---
title: "Entity Name"
type: entity
kind: person | tool | company | framework | platform | concept
created: 2026-04-06
updated: 2026-04-06
---
```

**Body structure:**
1. One-line description
2. `## Key Facts` — bullet list of important attributes
3. `## Appears In` — wikilinks to every article/concept that references this entity
4. `## Notes` — optional accumulated context

**When to create:** An entity is mentioned in ≥2 articles, or is central to ≥1 article.
**When to update:** Any article mentioning this entity is created or updated — add it to `Appears In`.

### Concept (`wiki/concepts/<name>.md`)

Cross-cutting ideas, patterns, and principles that span multiple articles.

```yaml
---
title: "Concept Name"
type: concept
created: 2026-04-06
updated: 2026-04-06
related: ["[[wiki/concepts/other-concept]]"]
---
```

**Body structure:**
1. Definition paragraph
2. `## How It Works` — the pattern or principle explained
3. `## Examples` — concrete instances from articles
4. `## See Also` — related concepts and articles

**When to create:** A pattern or idea appears across ≥3 articles, or is explicitly identified during ingest.
**When to update:** New articles demonstrate or extend the concept.

### Summary (`wiki/summaries/<date>-<topic>.md`)

Periodic landscape snapshots — ecosystem maps, status tables, strategic overviews.

```yaml
---
title: "Summary Title"
type: summary
created: 2026-04-06
scope: ecosystem | project | theme
---
```

**When to create:** On request, or when the wiki has accumulated significant new content since the last summary.
**Lifecycle:** Summaries are point-in-time artifacts. Create new ones rather than updating old ones.

---

## Naming Conventions

- **Filenames:** kebab-case, no dates (dates go in frontmatter). E.g., `agent-orchestration.md`
- **Wikilinks:** Use display names for readability: `[[wiki/entities/claude-code|Claude Code]]`
- **Tags:** lowercase, singular. E.g., `ai` not `AI`, `project` not `projects`
- **Slugs:** derived from title, max 60 chars. E.g., "TallyAI / Munshi" → `tallyai-munshi`

---

## Workflows

### Ingest (raw → wiki)

Triggered by `/wiki-ingest` skill after a new source lands in `raw/`.

1. **Read** the raw source file
2. **Identify** the primary topic — does an article already exist?
   - Yes → update the existing article (add new info, new source to frontmatter)
   - No → create a new article in `wiki/articles/`
3. **Extract entities** — people, tools, companies, frameworks mentioned
   - For each: check if `wiki/entities/<name>.md` exists
   - Exists → add this article to its `Appears In` section, bump `updated:`
   - Doesn't exist but mentioned in ≥2 articles → create entity page
   - Doesn't exist, first mention → note for future (don't create yet)
4. **Extract concepts** — cross-cutting patterns or ideas
   - If concept page exists → update with new example
   - If pattern appears in ≥3 articles → create concept page
5. **Cross-reference** — add wikilinks between the new/updated article and related pages
6. **Update `index.md`** — add new pages, update counts
7. **Append to `log.md`** — one entry with source, type, status, changes, notes
8. **Print reminder** — `qmd update && qmd embed` for search re-indexing

### Query (ask → synthesize → optionally file)

1. Read `index.md` to find relevant pages
2. Read those pages, synthesize an answer
3. If the answer is valuable and reusable → file it as a new wiki page (article, concept, or summary)
4. Update index and log if new page created

### Lint (health check)

Triggered by `/wiki-lint` skill. Checks:

1. **Unprocessed sources** — files in `raw/` with no corresponding wiki article
2. **Orphan pages** — wiki pages with zero inbound wikilinks
3. **Stale content** — `updated:` date >30 days old
4. **Broken wikilinks** — links pointing to non-existent pages
5. **Missing entity pages** — entities mentioned in ≥2 articles but lacking a page
6. **Missing concept pages** — patterns appearing in ≥3 articles but lacking a page
7. **Index drift** — pages that exist on disk but aren't in `index.md`
8. **Contradictions** — flag pages where claims may conflict (requires LLM judgment)

Output: structured report with severity (critical/warning/info) and suggested fixes.

---

## Cross-Reference Rules

1. Every article must link to ≥1 other wiki page (article, entity, or concept)
2. Every entity page must list all articles that mention it in `Appears In`
3. When an article references a tool/person/company, use a wikilink to the entity page
4. Concept pages should link to their best example articles
5. Use `## See Also` sections for related but non-inline references

---

## Frontmatter Standards

All wiki pages must have:
- `title:` — human-readable
- `type:` — one of: article, entity, concept, summary
- `created:` — YYYY-MM-DD
- `updated:` — YYYY-MM-DD (bumped on any edit)

Articles must additionally have:
- `sources:` — list of raw file wikilinks
- `tags:` — list of lowercase tags
- `entities:` — list of entity slugs mentioned

---

## What Claude Should Never Do

- Edit files in `raw/` — these are immutable source documents
- Delete wiki pages without human approval
- Create pages outside the defined directory structure
- Skip updating `index.md` and `log.md` after changes
- Use dates in filenames (use frontmatter instead)
- Create stub pages with no real content (minimum: 1 paragraph + frontmatter)
