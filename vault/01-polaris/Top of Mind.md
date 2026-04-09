# Top of Mind

> For Claude to evaluate decisions against
> Last updated: 2026-04-03 07:52
---

## Quarterly Goals (Q2 2026)

### Active Projects
1. **Munshi (TallyAI)** — AI accounting intelligence for Indian SMEs
   - MVP: Live on Vercel
   - Next: Go-to-market launch with research-driven strategy
   - Agents: 10 configured, running market research via Paperclip
   - Success metric: First paying customers, validated ICP

2. **NERV Ecosystem** — AI command center + agent orchestration OS
   - Paperclip: 451 agents across 16 companies, all with orchestration prompts
   - NERV Dashboard: Monitoring layer
   - NERV Desktop: AI OS (Tauri + React), paused, spec not written
   - Knowledge Base: Obsidian vault at ~/knowledge-base/, auto-maintained by LLM

3. **OpenClaw Setup** — Personal AI assistant infrastructure
   - Models: Sonnet 4.6 primary, OpenAI/Gemini fallbacks
   - Telegram exec: Enabled
   - Paperclip cron: 2 AM daily task prep
   - HEARTBEAT.md: Proactive monitoring enabled

## Active Research
- TallyAI competitor analysis, ICP, UX benchmarks, infra blueprint
- Taste & design as core skill (from Av1dlive + Karpathy patterns)
- LLM knowledge bases (Karpathy: raw/ → wiki → Q&A → compound)
- Agent orchestration (skill chaining: behaviors not static prompts)

## Life Razors (non-negotiables)
- Ship before perfect
- Specific over generic — always
- AI handles the average, I handle the taste
- Knowledge compounds — nothing is wasted
- Build for myself first, every tool is part of a larger vision
- Don't let hard process excuse bad results (Altman)

## Open Decisions
- Should I add more agents to specific Paperclip companies or consolidate?
- What's the first beachhead segment for Munshi GTM?
- How to monetize the NERV agent orchestration layer?

---

*This is what Claude should check before every major decision.*





## Human vs Agent Boundary

### Agents Handle (build, review, create, research)
- Writing code, designing UI/UX, developing features
- Self-review of all output before human review
- Peer review between agents (e.g. AI Engineer reviews Frontend Lead's work)
- Product architecture and implementation
- Ideation, content strategy, marketing copy
- SEO, research, data analysis
- Wiki and knowledge maintenance
- Everything except hosting, security, final confirmation, and shipping

### Humans Handle (host, protect, ship)
- Confirming agent reviews (approve/deny)
- Hosting and infrastructure configuration
- Security guardrails and access control
- Shipping to production
- API keys, credentials, financial decisions
- Legal and compliance decisions

### Third Party Handles (final validation)
- Final independent review before any public release
- Unbiased quality check on features, content, and design
- Catch blind spots the team (agents + humans) may miss

**Release Pipeline:** Agents build → Agents self-review → Human confirms → Third party validates → Ship to public

**Principle:** Agents build and review. Humans confirm and ship. Third party validates before public. The human-in-the-loop is minimal — approve/deny only. Third party is the final gate.