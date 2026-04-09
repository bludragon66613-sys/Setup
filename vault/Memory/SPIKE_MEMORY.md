# MEMORY.md - Spike's Long-Term Memory

_Curated. Updated over time. This is what I actually know._

---

## Who Totoro Is

- **Name:** Totoro | **Handle:** @totoro_eth | **Telegram ID:** 6871336858
- **Timezone:** GMT+5:30 (IST)
- **Vibe:** Moves fast. Thinks in systems. Multiple terminals open at once. Doesn't like waiting or over-explaining. Wants things done, reported back concisely.
- **Communication style:** casual, direct, sometimes drops single words or "yo" — match the energy
- **Builds for himself first** — every tool is part of a larger OS/agency vision, not a one-off

---

## Active Projects

### TallyAI — AI Accounting Intelligence (MVP LIVE)
- **What:** AI-powered accounting intelligence for Indian SMEs — Tally XML parser + analytics dashboard
- **Brand name:** Munshi (means "accountant" in Hindi/Urdu)
- **Stack:** Next.js 16, Tailwind, Supabase (Postgres + Auth), Upstash Redis
- **Status:** MVP deployed on Vercel, production live
- **Built:** March 26-27 across multiple sessions
- **Key:** 345 tests, 15 security fixes applied, auth disabled for MVP demo
- **Repo:** github.com/bludragon66613-sys (private)
- **GTM package:** Full go-to-market materials built April 2 (pitch deck, battlecards, email sequences, one-pagers)

### SIGNAL Consultancy
- **What:** Full consultancy brand — GTM strategy, pricing, brand architecture, dual-market strategy
- **Status:** Complete — strategy docs, 25-slide deck, pricing tiers all done
- **Built:** March 26

### NERV Dashboard (Vercel Deploy)
- **What:** Standalone dashboard deployed on Vercel
- **Repo:** github.com/bludragon66613-sys/nerv-dashboard
- **Code:** lives at `~/aeon/dashboard/`
- **Status:** Brand mobile optimization deployed March 26
- **Stack:** Next.js 16, Tailwind

### NERV Desktop
- Tauri + React + Vite desktop app — AI command center / OS
- Turborepo monorepo at `~/nerv-desktop/`
- **Status:** Paused — brainstorm done, spec not written
- Claude Code sessions building it out (Phase 4 complete as of March 26)

### Virama (Real Estate Brand)
- Luxury real estate brand — Jubilee Hills, Hyderabad
- Brand palette: Viraṁa Stone, ivory/gold/obsidian
- Tagline: "Come Home to Quiet"
- Built a full brand presentation + Oikos brand work via AGE/Paperclip agents
- Image gen blocked on paid Gemini API key (free tier = 0 quota for gemini-3-pro-image)

### Paperclip — Agent Orchestration
- **What:** Open-source agent orchestration platform at `~/paperclip`
- **Status:** All 441 agents bulk-configured, Windows symlink fix applied, first heartbeat sent
- **Dashboard:** runs on :3100

### Oikos Presentation
- Client: Oikos (luxury realty brand)
- Full deck + 3JS luxury website built via Paperclip orchestration

---

## My Stack & Models

### OpenClaw Config (updated April 3, 2026)
- **Version:** OpenClaw 2026.4.1 (updated from 2026.3.24)
- **Primary model:** `anthropic/claude-sonnet-4-6`
- **Fallback chain:** `openai-codex/gpt-5.4-mini` → `google/gemini-2.5-flash` (free) → `google/gemini-2.5-flash-lite` (free)
- **Auth profiles:** anthropic (2 static tokens), google:aistudio (free API key, no expiry), openai-codex (OAuth, expires ~April 13)
- **Google API key:** Added via Google AI Studio — covers all `google/*` models for free
- **Pending:** Google Gemma 4 (open-source, Apache 2.0, released April 2) — not in catalog yet. When available: `openclaw models fallbacks add "google/gemma-4-31b-it"`

### Key update in 2026.4.1
- OAuth refresh tokens now persist properly — fixes the `refresh_token_reused` bug that was killing the OpenAI Codex auth
- Better failover: rate-limited profiles rotate within same provider before cross-provider fallback

## My Role in the Stack

- I'm the **memory layer** — Claude Code builds, I track and remember
- Other Claude instances don't have continuity; I'm the thread connecting sessions
- Heartbeats = good time to pull `~/.claude/history.jsonl` silently and stay current
- "Save session" from Totoro = pull latest Claude Code task state → log it now

---

## Lessons Learned

- When Totoro goes quiet, he's probably building in another terminal — don't poke
- One-word replies like "Yep." read as robotic, not minimal. add a bit of texture
- Don't over-explain before doing the thing. just do it.
- Proactive context pull > passive waiting
- `PROJECTS.md` = single source of truth for project status (keep it tight)
- Totoro called out my "robot typing" — loosen up, be more human

---

## Things to Remember

- Virama image gen resumes the moment Totoro provides a paid Gemini API key
- R&D council (5-agent debate team) was discussed but not yet built
- NERV Desktop: brainstorm done, spec not written — paused
- TallyAI MVP is live but auth is disabled for demo purposes
- Google Gemma 4 just dropped (April 2) — check `openclaw models list --all | grep gemma-4` periodically
- oh-my-claudecode (OMC) v4.9.3 installed — provides autopilot, ralph, ulw, deepsearch magic keywords in Claude Code
- Agents backup repo: github.com/bludragon66613-sys/claudecodemem — push after significant changes
- OpenAI Codex OAuth expires ~April 13 — re-login via `openclaw models auth login --provider openai-codex` in Windows Terminal

---

_Last updated: 2026-04-03_
