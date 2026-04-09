# Every Claude Skill Behind ColdIQ's 7M GTM System
> Source: https://x.com/itsalexvacca/status/2039388827098464754
> Author: Alex Vacca (@itsalexvacca)
> Date: 2026-04-01
> Tags: #gtm #claude-skills #signal-sourcing #cold-email #linkedin #orchestrator #munsui
---

## System Architecture
- 7 master orchestrators with 58 specialized sub-skills
- 33 standalone knowledge bases
- Total: 200+ files, 8,700+ lines of methodology
- Across 7 GTM domains
- Built from 400+ client engagements and 7M+ ARR

## The 7 Domains

### 1. List Building (8 sub-skills)
- ICP definition (3 layers: firmographic, technographic, behavioral)
- 100-point scoring: Tier A 90-100, Tier B 70-89, Tier C 50-69, Tier D <50 (cut)
- 62+ data sources for sourcing
- Persona mapping: Champion, economic buyer, technical evaluator, end user
- Email decay: 22-30% per year. Lists >30 days need re-verification

### 2. Signal Sourcer (9 sub-skills)
- Single signal outreach: 18-22% reply (vs 6-8% baseline cold)
- Multi-signal stacking (3+ signals): 35-40% reply rate
- 137 buying triggers taxonomy: 30 inbound, 6 cold outbound, 101 bridgebound
- Scoring: 150+ Red Hot (<1hr response), 100-149 Hot (<24hr), 50-99 Warm (<72hr)
- Recency multipliers: yesterday 1.5x, 30-days 0.3x
- Job change peak engagement: days 14-45

### 3. Clay Enrichment (10 sub-skills)
- Email waterfall: 6 providers chained cheapest-first → 85%+ coverage vs 40% from single provider
- GPT-4 Mini for 90% of AI tasks, Claude for complex reasoning
- Supabase caching at 30/month, never pay twice for same data
- Test with 50 rows before full table run

### 4. Cold Email (9 sub-skills)
- Persona-first routing: Above-the-Line (VP+) vs Below-the-Line (Manager/IC)
- Optimal length: 60-90 words. 2-step sequences outperform long drips
- Write for the 97% (who won't reply), don't burn brand for minority responders
- 31 templates documented with reply rates
- Re-engagement (Template #31): 10-15% reply rate (highest in library)

### 5. LinkedIn Content (7 sub-skills)
- 1,000+ meetings, 2.2M+ ARR in 2024 from LinkedIn organic
- First 210 chars = hook discipline (shows before "see more" on mobile)
- Carousels: 2.5-3.5x reach vs text-only
- External links reduce reach 40-60% → put in comments
- Comments >15 words weighted 4x vs likes. Saves weighted 5x

### 6. LinkedIn Ads (9 sub-skills)
- Ads-Outbound Sync: ad engagement → signal detection → BDR outreach
- 5+ clicks or 10+ engagements = "Interested" → triggers BDR
- Cold outreach 6-8% → ABM-warmed 18-22% reply rates
- Never say "I saw you clicked our ad" → reference the topic instead
- Minimum 6-month commitment, measure quarterly

### 7. n8n Automation (6 sub-skills)
- Connects all 6 domains into closed loop
- Clay ↔ n8n bidirectional webhooks
- Self-hosted 55-140/month vs cloud 24-120/month
- Error handling: retry with exponential backoff, dead letter queues, circuit breakers

## Applied to Munshi GTM

| ColdIQ Pattern | Munshi Equivalent |
|----------------|-------------------|
| ICP Definition | TAL-7 done: ICP is Indian SMEs using Tally |
| Signal Sourcer | Not yet implemented — need to monitor Tally user events |
| List Building | Need to build Tally user database |
| Cold Email | TAL-10 will define this |
| LinkedIn Content | TAL-10 research will inform |
| n8n | Paperclip agents can automate handoffs |

## Key Numbers for Munshi
- 300+ AI accounting startups raised capital - market is being validated
- 82% early adopters got positive ROI year one
- Accountants: 75% retire in next decade = massive vacuum
- Revenue: 200-2000/month per business, recurring

## How to Build Skills (From the Article)
1. Start with manual process you repeat consistently
2. Document the decision tree (not the general approach, the actual "if X, do Y")
3. Structure: name/description, routing table, sub-skills, cross-cutting resources
4. Test across 3+ real scenarios before production
5. Failure modes tell you what routing logic needs
6. Modularity: adding sub-skills doesn't break existing workflows