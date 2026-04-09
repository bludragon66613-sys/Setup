---
name: Design Reference Library
description: 54 real-world brand DESIGN.md files installed at ~/.claude/design-references/ from VoltAgent/awesome-design-md, with design-reference skill for loading them
type: reference
---

## Design Reference Library (awesome-design-md)

54 production-grade DESIGN.md files from real websites, stored at `~/.claude/design-references/`.

**Source:** https://github.com/VoltAgent/awesome-design-md (MIT, 10K+ stars)
**Installed:** 2026-04-05
**Skill:** `design-reference` at `~/.claude/skills/design-reference/SKILL.md`

### Available Brands
airbnb, airtable, apple, bmw, cal, claude, clay, clickhouse, cohere, coinbase, composio, cursor, elevenlabs, expo, figma, framer, hashicorp, ibm, intercom, kraken, linear.app, lovable, minimax, mintlify, miro, mistral.ai, mongodb, notion, nvidia, ollama, opencode.ai, pinterest, posthog, raycast, replicate, resend, revolut, runwayml, sanity, sentry, spacex, spotify, stripe, supabase, superhuman, together.ai, uber, vercel, voltagent, warp, webflow, wise, x.ai, zapier

### Usage
- Say "build with the Linear aesthetic" and the DESIGN.md gets loaded
- Each brand has: DESIGN.md (15-20KB spec), preview.html, preview-dark.html
- Works with ui-ux-architect agent, designer agent, and /design-review skill

### Update Command
```bash
cd /tmp && git clone --depth 1 https://github.com/VoltAgent/awesome-design-md.git && cp -r /tmp/awesome-design-md/design-md/* ~/.claude/design-references/ && rm -rf /tmp/awesome-design-md
```
