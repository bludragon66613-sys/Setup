# /wiki-query

Ask a question, get a cited answer from the Obsidian wiki, and file the answer back as a new output page (compound loop).

## Usage

`/wiki-query <question>`

## Workflow

This command targets the Obsidian vault at `~/OneDrive/Documents/Agentic knowledge/`, not the OMC project-local wiki. Steps:

1. **Consult brand-foundation/** first if the question touches voice, design, or brand identity. BF is read-only context.
2. **Read `index.md`** to find relevant pages by TLDR
3. **Read those pages** — prefer `confidence: high` pages, note any `explored: false` warnings in the answer
4. **Call qmd** for semantic search if keyword matching is insufficient: `qmd search "<question>"`
5. **Synthesize** a cited answer:
   - Every claim must cite a wikilink: `[[wiki/articles/foo]]`
   - Flag uncertain claims explicitly: "unverified — see [[wiki/articles/foo]] (confidence: low)"
   - If evidence conflicts across sources, surface the contradiction
6. **File the answer back** as `wiki/outputs/YYYY-MM-DD-<slug>.md`:
   ```yaml
   ---
   title: "<question restated>"
   type: output
   created: YYYY-MM-DD
   sources: ["[[wiki/articles/...]]", "[[wiki/concepts/...]]"]
   explored: false
   confidence: <high|medium|low>
   ---
   ```
   Body: the cited answer + a `## Follow-ups` section for open questions
7. **Update `index.md`** — add the output page under an `## Outputs` section
8. **Append to `log.md`** — `YYYY-MM-DD | query | <question> | outputs/<slug>.md`

Every answer becomes a page. Next query about the same topic pulls from the new output too. This is the compounding loop.
