---
name: Design Reference Library
description: 74 real-world brand DESIGN.md files installed at ~/.claude/design-references/ from VoltAgent/awesome-design-md; read directly by design-mastery agent
type: reference
---

## Design Reference Library (awesome-design-md)

74 production-grade DESIGN.md files from real websites, stored at `~/.claude/design-references/`. Reinstalled on Mac 2026-09-29 from upstream commit f696123 (was missing after Windows→Mac move).

**Source:** https://github.com/VoltAgent/awesome-design-md (MIT, 10K+ stars)
**Installed:** 2026-04-05
**Skill:** the old `design-reference` skill is gone (not in any backup as of 2026-09-29); `design-mastery` reads `~/.claude/design-references/<brand>/DESIGN.md` directly.

### Available Brands
airbnb, airtable, apple, binance, bmw, bmw-m, bugatti, cal, claude, clay, clickhouse, cohere, coinbase, composio, cursor, dell-1996, elevenlabs, expo, ferrari, figma, framer, hashicorp, hp, ibm, intercom, kraken, lamborghini, linear.app, lovable, mastercard, meta, minimax, mintlify, miro, mistral.ai, mongodb, nike, nintendo-2001, notion, nvidia, ollama, opencode.ai, pinterest, playstation, posthog, raycast, renault, replicate, resend, revolut, runwayml, sanity, sentry, shopify, slack, spacex, spotify, starbucks, stripe, supabase, superhuman, tesla, theverge, together.ai, uber, vercel, vodafone, voltagent, warp, webflow, wired, wise, x.ai, zapier

### Usage
- Say "build with the Linear aesthetic" and the DESIGN.md gets loaded
- Each brand has: DESIGN.md (spec) + README.md (upstream removed preview.html files)
- Works with design-mastery agent and designer agent

### Update Command
```bash
cd /tmp && git clone --depth 1 https://github.com/VoltAgent/awesome-design-md.git && cp -r /tmp/awesome-design-md/design-md/* ~/.claude/design-references/ && rm -rf /tmp/awesome-design-md
```
