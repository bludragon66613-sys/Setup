# Skill Graph

285 skills organized as a traversable graph. Start from the domain MOC that matches your task and follow wikilinks to exactly what you need.

**How to navigate:** Read a MOC → scan descriptions → follow wikilinks to relevant skills → read only what the task requires. Most decisions happen before reading a single full SKILL.md.

## Domain Maps of Content

| MOC | Skills | Entry Point |
|-----|--------|-------------|
| [[security]](./_mocs/security.md) | ~30 | Writing secure code, scanning, auditing, vulnerability detection |
| [[fuzzing]](./_mocs/fuzzing.md) | ~12 | Coverage-guided fuzzing across C/C++, Rust, Python, Ruby |
| [[blockchain]](./_mocs/blockchain.md) | ~7 | Smart contract vulnerability scanning across 6 chains |
| [[engineering]](./_mocs/engineering.md) | ~25 | Architecture, APIs, databases, infrastructure, AI/ML |
| [[languages]](./_mocs/languages.md) | ~35 | Python, Go, Rust, Kotlin, Swift, Java, Laravel, Django, Perl, C++ |
| [[testing]](./_mocs/testing.md) | ~15 | TDD, verification loops, E2E, property-based testing |
| [[product-management]](./_mocs/product-management.md) | ~65 | Discovery → strategy → execution → GTM → growth |
| [[design-creative]](./_mocs/design-creative.md) | ~10 | Brand identity, UI/UX, presentations, media |
| [[content-marketing]](./_mocs/content-marketing.md) | ~12 | Content creation, distribution, SEO, sales, growth |
| [[workflow]](./_mocs/workflow.md) | ~25 | Agent orchestration, skill creation, development pipeline |
| [[business-ops]](./_mocs/business-ops.md) | ~15 | Supply chain, logistics, manufacturing, investor relations |

## Quick Access by Task

**"I'm writing new code"** → [[engineering]] for patterns, [[languages]] for language-specific, [[security]] for secure defaults

**"I need to test"** → [[testing]] for TDD workflow, [[languages]] for language-specific test frameworks

**"I'm building a product"** → [[product-management]] for PM frameworks, [[design-creative]] for UI/UX

**"I need to ship content"** → [[content-marketing]] for strategy + distribution, [[design-creative]] for visuals

**"I'm doing security work"** → [[security]] for scanning + review, [[fuzzing]] for crash discovery, [[blockchain]] for smart contracts

**"I want to improve my workflow"** → [[workflow]] for agent orchestration, autonomous loops, skill creation

## Uncategorized / Standalone

These skills don't fit neatly into a domain cluster:
- [gstack](./gstack/SKILL.md) — headless browser for QA and site dogfooding
- [second-opinion](./second-opinion/SKILL.md) — external LLM code reviews (Codex, Gemini)
- [project-guidelines-example](./project-guidelines-example/SKILL.md) — example project-specific skill template
- [paperclip](./paperclip/SKILL.md), [paperclip-create-agent](./paperclip-create-agent/SKILL.md), [paperclip-create-plugin](./paperclip-create-plugin/SKILL.md) — Paperclip platform tools

## Graph Statistics

- **285** skill directories
- **311** SKILL.md files
- **11** domain MOCs in `_mocs/`
- **~200** cross-references via wikilinks
