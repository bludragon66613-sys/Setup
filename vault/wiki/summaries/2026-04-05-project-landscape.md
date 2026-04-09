# Project Landscape — 2026-04-05

> Summary of all active projects, their current status, and how they interconnect.
> Generated from Claude Code memory sync.

---

## The Ecosystem at a Glance

Rohan's projects form an interconnected AI-first ecosystem: NERV is the operational backbone and brand parent, Paperclip runs agent teams, OpenClaw bridges Telegram, OMC orchestrates development, and AutoAgent continuously improves everything. Munshi (TallyAI) is the flagship SaaS product. SIGNAL packages this stack into a consultancy. Rei is a crypto-native entertainment play. Virāma is a standalone branding project.

```
┌─────────────────────────────────────────────────────────┐
│                  NERV (parent brand)                     │
│              github: bludragon66613-sys/NERV_02          │
│  Skills dispatch → GitHub Actions, 41 skills, :5555     │
└──────────┬──────────────┬───────────────────────────────┘
           │              │
    ┌──────▼──────┐  ┌────▼────────────────┐
    │  OpenClaw   │  │     Paperclip        │
    │  :18789     │  │     :3100            │
    │  Telegram   │  │   441 agents, org    │
    │  AI gateway │  │   charts, budgets    │
    └──────┬──────┘  └────┬────────────────┘
           │              │
    ┌──────▼──────┐  ┌────▼────────────────┐
    │ openclaw-   │  │     Munshi           │
    │ proxy :5557 │  │  (TallyAI) :3200    │
    └─────────────┘  │   10-agent company  │
                     └─────────────────────┘

    ┌─────────────────┐    ┌─────────────────┐
    │   OMC v4.9.3    │    │   AutoAgent     │
    │  19 agents,     │    │  evolve-loop,   │
    │  smart routing  │    │  hill climbing  │
    └─────────────────┘    └─────────────────┘

    ┌─────────────────┐    ┌─────────────────┐
    │     SIGNAL      │    │      Rei         │
    │  AI consultancy │    │  AI VTuber +     │
    │  ~$235K Y1      │    │  Solana launcher │
    └─────────────────┘    └─────────────────┘

    ┌─────────────────┐
    │    Virāma       │
    │  Real estate    │
    │  branding       │
    └─────────────────┘
```

---

## Project Status Table

| Project | Status | Phase | Next Action |
|---------|--------|-------|-------------|
| [[tallyai-munshi]] | Feature-complete, pre-launch | v2 all 6 phases done | Deploy to Vercel, CA outreach |
| [[nerv-autonomous-agent]] | Live | Active — 41 skills | Skill improvement via AutoAgent |
| [[signal-consultancy]] | Strategy complete, pre-launch | 1 client acquired | Case study permission, Razorpay setup |
| [[openclaw-ai-gateway]] | Running (with auth issues) | Operational | Fix openai-codex OAuth; plan VPS migration |
| [[paperclip-agent-platform]] | Running | 441 agents active | Integrate more companies |
| [[rei-ai-vtuber]] | Phase 4 done | Phase 5 pending | Raydium/Bonk integrations, streaming E2E |
| [[virama-branding]] | Strategy complete | Standalone brand pipeline built | Client delivery |
| [[autoagent-optimization]] | Live | Operational | Run overnight evolution loops |
| [[omc-orchestration]] | Installed | Active | No action needed |

---

## How They Interconnect

### Infrastructure Layer
- **OpenClaw** is the AI access layer for Telegram-based interaction
- **OMC** is the AI access layer for Claude Code development
- Both sit beneath everything else — when either breaks, productivity drops

### Agent Orchestration Layer
- **Paperclip** manages agent *teams* (orgs, budgets, governance)
- **NERV** dispatches individual *skills* (one-at-a-time, GitHub Actions)
- These are complementary, not competing

### Self-Improvement Loop
- **AutoAgent** runs improvement iterations against NERV's skills
- **autoskills** installs project-appropriate skills into TallyAI and NERV
- **skill-eval** + **skill-evolve** in NERV's skill library close the loop

### Product Layer
- **Munshi (TallyAI)** is the flagship SaaS — uses Paperclip for its 10-agent dev team
- **Rei** is the entertainment/crypto play — independent stack (Vue, not Next.js)
- **Virāma** is a standalone client engagement

### Business Layer
- **SIGNAL** is the consultancy wrapper around NERV + Paperclip + OpenClaw
- The brand hierarchy: NERV (parent) → SIGNAL (product) → OpenClaw (infra)
- India-first strategy; WhatsApp-first delivery (moat vs Zoho/Freshworks)

---

## Critical Dependencies

| If this breaks | These are affected |
|----------------|-------------------|
| OpenClaw auth | Telegram bot (@kaneda6bot) silently fails |
| Paperclip server | Munshi's agent team goes offline |
| NERV dashboard | Skill dispatch and intel monitoring stop |
| Anthropic API key | OpenClaw falls back to Qwen/GPT-5.4-mini/Gemini chain |

---

## Revenue Opportunities (Near-Term)

1. **Munshi launch** — Deploy to Vercel, get 50 founding CAs, ₹60L ARR Y1 target
2. **SIGNAL Client #1** — Get case study permission, use as anchor for LinkedIn outbound
3. **SIGNAL India** — Configure 3 WhatsApp starter packs, join 20 WhatsApp groups
4. **Rei Phase 5** — Token launches on Raydium could generate direct revenue

---

## Knowledge Gaps

- No session savepoint covering Rei Phase 5 or later work
- SIGNAL has strategy but no product/landing page yet
- AutoAgent results.tsv not reviewed for improvement patterns
- Virāma brand pipeline standalone brands not fully documented (see session_savepoint_2026-03-23e.md)
