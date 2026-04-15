---
title: "Brand Foundation — Read-Only"
type: bf-index
created: 2026-04-15
updated: 2026-04-15
---

# Brand Foundation (BF)

**This directory is READ-ONLY for agents.** Only Rohan edits these files.

The BF is the static identity layer of the knowledge system. Agents consult it **before** producing any creative, design, code, or communication output that carries brand meaning. It is the anchor that keeps every output sounding like Rohan's work, not template-tier AI slop.

## Rules for agents

1. **Read before creating.** Any task that produces visuals, copy, PDFs, decks, brand assets, client-facing code, or marketing content must begin by reading the relevant BF file(s).
2. **Never edit files in this directory.** If something is wrong or outdated, report it to Rohan. Do not patch silently.
3. **Never file BF content as `wiki/` pages.** The wiki layer is dynamic and agent-maintained. BF is static and human-maintained. Keep them separate.
4. **When BF conflicts with a user request, surface the conflict.** Ask Rohan which wins before proceeding.
5. **When BF is silent on a question, say so.** Do not invent brand rules.

## Index

### Brands
- [[brands/munshi]] — AI accounting intelligence for Indian SMEs. Stripe Neelam direction. Roman-script only, no Devanagari.
- [[brands/signal-nerv]] — NERV (parent consultancy) + SIGNAL (product sub-brand) + Paperclip + OpenClaw architecture. Dual-market GTM.
- [[brands/virama-ssquare]] — Virāma residential project by SSquare (commercial RE developer, est. 1991).

### Cross-cutting standards
- [[design-standards]] — Japanese minimalism, Ma/Kanso/Shibui, billion-dollar quality bar, reference brands (Stripe, Linear, Vercel, Apple, Notion).
- [[design-antipatterns]] — 9 vibe-coded UI patterns to never generate (Yuwen Lu catalog).
- [[pdf-quality]] — PDF generation rules: proper libraries only, no Puppeteer HTML-to-PDF for brand docs.
- [[voice-rules]] — Banned words, AI slop vocab, tone, communication style.

## Consult order

For design work: design-standards → design-antipatterns → specific brand file.
For brand copy: voice-rules → specific brand file.
For PDFs: pdf-quality → design-standards → specific brand file.
For agent output text: voice-rules.
