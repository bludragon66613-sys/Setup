---
name: AI Marketing Skills Suite
description: 11 marketing skills installed from ericosiu/ai-marketing-skills — covers growth, sales, content, SEO, finance, outbound, podcasts, revenue intelligence, team ops
type: reference
---

## Source
GitHub: https://github.com/ericosiu/ai-marketing-skills (MIT license)
Installed: 2026-04-02

## Installed Skills (11 total)

| Skill Name | Slash Command | Purpose |
|------------|--------------|---------|
| content-ops | `/content-ops` (name: expert-panel) | Expert panel scoring — auto-assembles 7-10 domain experts, recursive scoring to 90+, handles copy/sequences/landing pages/strategy |
| conversion-ops | `/conversion-ops` | Landing page CRO audits (8 metrics) + survey-to-lead-magnet generation |
| finance-ops | `/finance-ops` | CFO briefings from QuickBooks exports, codebase cost estimation, burn rate/runway analysis |
| growth-engine | `/growth-engine` | Autonomous A/B experiments with statistical analysis (bootstrap CI + Mann-Whitney U), auto-promotes winners to playbook |
| outbound-engine | `/outbound-engine` (name: cold-outbound-optimizer) | Cold outbound email campaign design/optimization for Instantly, expert panel scoring |
| podcast-ops | `/podcast-ops` (name: podcast-pipeline) | Podcast-to-everything pipeline: 1 episode to 15-20 content pieces across platforms |
| revenue-intelligence | `/revenue-intelligence` | Gong transcript analysis, revenue attribution (first-touch/linear/time-decay), client reports from GA4/HubSpot/Ahrefs |
| sales-pipeline | `/sales-pipeline` | RB2B visitor ID to outbound pipeline, deal resurrection, trigger prospecting, ICP optimization |
| sales-playbook | `/sales-playbook` | Value-based pricing, pre/post-call analysis, pattern library, deal upselling ($10K to $40-100K/mo) |
| seo-ops | `/seo-ops` | Content Attack Briefs, GSC integration, trend scouting, keyword prioritization |
| team-ops | `/team-ops` | Team performance audits (Elon Algorithm), meeting intelligence with action item extraction |

## Utility Modules
- `ai-marketing-telemetry/` — shared telemetry (opt-in, local-first usage analytics)
- `ai-marketing-security/` — PII sanitization and data protection

## Location
All installed at `~/.claude/skills/<skill-name>/`

## Python Dependencies
Most skills have `requirements.txt` — install per-skill as needed:
```bash
pip install -r ~/.claude/skills/<skill-name>/requirements.txt
```

## Key Integrations Referenced
- HubSpot, Gong, GA4, Ahrefs, Google Search Console (revenue-intelligence, seo-ops, sales-pipeline)
- Instantly (outbound-engine, sales-pipeline)
- Brave Search API (sales-pipeline trigger prospecting)
- QuickBooks (finance-ops)
