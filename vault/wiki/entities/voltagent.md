---
title: "VoltAgent"
type: entity
kind: project
created: 2026-04-10
updated: 2026-04-10
---

Open-source repository providing 54 production-grade DESIGN.md files extracted from real-world websites. Used as the design reference library for Claude Code's super-designer agent.

## Key Facts

- Source: `github.com/VoltAgent/awesome-design-md` (MIT, 10K+ stars)
- Local path: `~/.claude/design-references/` (54 brand directories)
- Each brand has: DESIGN.md (15-20KB spec), preview.html, preview-dark.html
- Loader skill: `design-reference` at `~/.claude/skills/design-reference/SKILL.md`
- Installed: 2026-04-05

## Brands Included

airbnb, airtable, apple, bmw, cal, claude, clay, clickhouse, cohere, coinbase, composio, cursor, elevenlabs, expo, figma, framer, hashicorp, ibm, intercom, kraken, linear.app, lovable, minimax, mintlify, miro, mistral.ai, mongodb, notion, nvidia, ollama, opencode.ai, pinterest, posthog, raycast, replicate, resend, revolut, runwayml, sanity, sentry, spacex, spotify, stripe, supabase, superhuman, together.ai, uber, vercel, voltagent, warp, webflow, wise, x.ai, zapier

## Integration

- Works with super-designer agent, ui-ux-architect agent, designer agent
- Invoked via `/design-reference` skill or saying "build with the [brand] aesthetic"
- Each DESIGN.md contains: color tokens, typography scale, spacing, component patterns, dark mode

## Update

```bash
cd /tmp && git clone --depth 1 https://github.com/VoltAgent/awesome-design-md.git && cp -r /tmp/awesome-design-md/design-md/* ~/.claude/design-references/ && rm -rf /tmp/awesome-design-md
```

## Appears In

- [[super-designer]] — uses design-reference skill for brand loading
- [[claude-obsidian-memory-stack]] — part of Layer 1 skill system
