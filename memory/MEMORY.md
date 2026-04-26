# Memory Index

> Full session context is in `C:\Users\Rohan\CLAUDE.md` — read it at session start.

## User
- [user_profile.md](user_profile.md) — Rohan's GitHub (bludragon66613-sys), active repos, Claude Code agent setup

## Projects
- [project_signal.md](project_signal.md) — SIGNAL consultancy: GTM, pricing, brand architecture, dual-market strategy
- [project_nerv.md](project_nerv.md) — NERV_02/Aeon: Phase 2 affective memory pipeline shipped 2026-04-15, 54 skills, full daily cron flow, 14-day eval streak exit criterion
- [project_openclaw.md](project_openclaw.md) — OpenClaw local AI gateway: config, auth, startup, token refresh
- [project_virama.md](project_virama.md) — Virama by SSquare branding project, all file locations, brand facts
- [project_aigency02.md](project_aigency02.md) — Aigency02 agent repo, superpowers integration, restore instructions
- [project_rei.md](project_rei.md) — Rei AI VTuber + Solana token launcher (~/companion/), forked from AIRI
- [project_paperclip.md](project_paperclip.md) — Paperclip AI: open-source agent orchestration platform at ~/paperclip. **PR #3746 open** (11-pass cleanup branch, −2,440 lines, 16→7 cycles)
- [project_tallyai.md](project_tallyai.md) — TallyAI: AI accounting intelligence for Indian SMEs, Tally XML parser + dashboard
- [project_munshi_brand.md](project_munshi_brand.md) — Munshi brand bible v3.0: Direction A Stripe Neelam, no Devanagari, repo renamed to Munshi
- [project_omc.md](project_omc.md) — oh-my-claudecode v4.9.3: multi-agent orchestration, smart model routing, autopilot/ralph modes
- [project_autoagent.md](project_autoagent.md) — AutoAgent: autonomous agent/skill improvement loop at ~/autoagent (from kevinrgu/autoagent)
- [project_dexfolioexp.md](project_dexfolioexp.md) — DexFolioExp: Solana DEX analytics platform, Rust+React, forked from GPoet/dexfolio
- [project_dexfolioexp_design.md](project_dexfolioexp_design.md) — DexFolioExp design direction and UI decisions
- [project_lightrag.md](project_lightrag.md) — lightrag-vault: LightRAG knowledge graph over Obsidian vault, MCP server + CLI, 45 tests
- [project_n8n.md](project_n8n.md) — n8n 2.15.0 on :5678 + n8n-mcp for Claude Code, workflow automation layer complementing OpenClaw/Paperclip
- [project_furniture_design_tool.md](project_furniture_design_tool.md) — kitchenandwardrobe: Next.js 16 layout generator, Phase 6 quality toggle + inspiration refs shipped 2026-04-13, 281 tests, on master
- [project_wiki_automation.md](project_wiki_automation.md) — **DEFERRED.** 3-layer plan (n8n cron + SessionEnd hook + OpenClaw) to automate /wiki-ingest /wiki-lint /wiki-digest against the Obsidian vault. Picks up from 2026-04-15 session.

## Session Savepoints (latest 3 — 38 older ones in _archive/)
- [session_savepoint_2026-04-26b_drip-sprint3.md](session_savepoint_2026-04-26b_drip-sprint3.md) — drip Phase 0 finish: 12 commits, Sprint 3 shipped (T3.1-T3.7), prod schema audit + apply scripts, monorepo CI bootstrap (4 jobs green), 6 missing migrations applied (12→18/18), value-semantic em-dash sweep. Branch 38 ahead, PR #1 CI green.
- [session_savepoint_2026-04-26_drip-cleanup.md](session_savepoint_2026-04-26_drip-cleanup.md) — drip cleanup: 0007 orders multi-rail tracked, 23 prose em-dashes + 1 § swept across 5 Sprint-2 pages and 5 incidental files, /tiers comparison-table label-column overflow fixed. Branch 21 ahead, all pushed. Two webhook secrets need rotation before PENDING.md commit.
- [session_savepoint_2026-04-25_drip-sprint2.md](session_savepoint_2026-04-25_drip-sprint2.md) — drip Phase 0 Sprint 2 shipped + deployed. 16 commits ahead, Vercel preview Ready. T2.1/T2.3/T2.4/T2.5/T2.6 + 3 cleanup commits (stripe lazy, inngest bump, @google/design.md removal).

## TODOs
- [todo_design_agents.md](todo_design_agents.md) — design-mastery stack follow-ups: seed first best-designs library (drip), run first end-to-end trial (`/app/products`), update CLAUDE.md agent table, optional claudecodemem `design/` subfolder
- [todo_personal_jarvis.md](todo_personal_jarvis.md) — Personal ops Jarvis (Obsidian vault overlay) — build-efficiency + systems-in-check. Parked 2026-04-24. Un-park trigger: ≤3 active projects OR specific pain surfaces. Full spec inside.

## Stalled
- NERV Desktop app (Tauri+React) — superseded by Kaneda Eye (same Tauri+React stack, broader scope)

## Reference
- [reference_skill_graphs.md](reference_skill_graphs.md) — Skill graph architecture: 11 domain MOCs in _mocs/ connecting 285 skills via wikilinks (arscontexta pattern)
- [reference_cc_source_architecture.md](reference_cc_source_architecture.md) — CC source architecture: hooks (5 types), memory, coordinator, plugins, context mgmt
- [reference_marketing_skills.md](reference_marketing_skills.md) — 11 AI marketing skills from ericosiu/ai-marketing-skills: growth, sales, content, SEO, finance, outbound, podcasts
- [reference_design_library.md](reference_design_library.md) — 54 brand DESIGN.md files at ~/.claude/design-references/ (awesome-design-md), design-reference skill
- [reference_memory_architecture.md](reference_memory_architecture.md) — 3-layer memory: session memory, Obsidian knowledge graph (qmd+server-memory), web ingestion pipeline
- [reference_summarize.md](reference_summarize.md) — steipete/summarize CLI: content extraction, Gemini Flash default, vault integration via sum-to-vault

## Feedback
- [feedback_decision_process.md](feedback_decision_process.md) — **HARD RULE.** No plausible-sounding inference — ask when unsure. For non-trivial tasks: state task, decompose, research risks, list options, recommend, weigh tradeoffs, ask for direction, then execute. Overrides default "just do it" nudges.
- [feedback_model_selection.md](feedback_model_selection.md) — Use Sonnet by default, Opus only for complex coding/reasoning
- [feedback_session_startup.md](feedback_session_startup.md) — Boot OpenClaw->Paperclip->Dashboard at every session start
- [feedback_openclaw_startup.md](feedback_openclaw_startup.md) — OpenClaw restart pitfalls: zombie shells, duplicate gateway instances
- [feedback_backup.md](feedback_backup.md) — Back up agents and memory to claudecodemem after significant changes
- [feedback_design_quality.md](feedback_design_quality.md) — Japanese minimalism, no tacky effects, always include brand marks, billion-dollar product quality
- [feedback_obsidian_sync.md](feedback_obsidian_sync.md) — Always exclude shueb.io from Obsidian vault syncs
- [feedback_pdf_quality.md](feedback_pdf_quality.md) — HTML-to-PDF via Puppeteer is sloppy; use proper PDF libs, always visually review, build PDF review skill
- [feedback_ai_design_antipatterns.md](feedback_ai_design_antipatterns.md) — 9 vibe-coded UI anti-patterns to never generate: icon boxes, glassmorphism, gradient abuse, nested cards, broken animations
- [feedback_openclaw_glm_routing.md](feedback_openclaw_glm_routing.md) — GLM on OpenClaw: free OR tier caps max_tokens under runtime default; only glm-4.5-air:free works free, paid GLMs silently fall back
- [feedback_secret_handling.md](feedback_secret_handling.md) — Never Edit/Write/Read files containing secrets — Claude Code's file-change notification echoes contents into session jsonl, creating a leak loop (lesson from 3-rotation incident 2026-04-15)
- [feedback_design_process.md](feedback_design_process.md) — Before any visual surface: read the project brand bible + study an existing component. Inline styles against a generic dark palette produces trash.
- [feedback_copy_style.md](feedback_copy_style.md) — Three AI-slop glyphs to never use in copy: em-dash `—`, double-hyphen `--`, section mark `§`. Replace with period/comma/colon/mid-dot, or rephrase.
- [feedback_opus_4_7_prompting.md](feedback_opus_4_7_prompting.md) — Opus 4.7 punishes imprecision: temperature/top_p/top_k blocked, xhigh default, adaptive thinking eats budget on vague prompts. Demand explicit intent + success criteria + constraints + what-NOT-to-do.
- [feedback_rtk_filter.md](feedback_rtk_filter.md) — rtk filter drops tsc error lines so broken builds look green. After schema/type changes, run `pnpm typecheck` without rtk at least once before committing.
- [feedback_nextjs_public_env_server_fallback.md](feedback_nextjs_public_env_server_fallback.md) — Server SDK helpers must coalesce `FOO_APP_ID ?? NEXT_PUBLIC_FOO_APP_ID`, else operators who only set the public name get silent server-side 401s while client auth looks healthy

## Projects (New)
- [project_nts.md](project_nts.md) — Neo Tokyo Studios: AI anime production house, brand bible complete, Vercel deployed
- [project_kaneda_eye.md](project_kaneda_eye.md) — Kaneda Eye: Tauri 2 screen-aware AI companion + voice command layer, scaffold complete
- [project_cos.md](project_cos.md) — Chief of Staff: Obsidian vault overlay for actions, decisions, clients, transcripts, frameworks
- [project_autoresearch.md](project_autoresearch.md) — Autoresearch: karpathy-style experiment loop ported from davebcn87/pi-autoresearch, wired into NERV dashboard + Aeon skill-evolve + n8n cron + Obsidian sync
- [project_drip.md](project_drip.md) — **drip** (rebranded from "DRIP Protocol" 2026-04-17): peptide creator-brand platform at drip.markets, AI discovery + creator storefronts + MD-pharmacy rails + $DRIP token. Domain secured. With Matteo (cybergenesis621).
- [project_morning_light.md](project_morning_light.md) — **Morning Light Energy** (was "Singularity Energy" pre-2026-04-17): AI-powered Premier-backed rooftop solar EPC in TG+AP, `morning-light-energy` repo, `morninglight.energy` domain. 5-phase plan (residential → district aggregator → C&I → platform → utility 10MW).
- [project_browser_harness.md](project_browser_harness.md) — **browser-harness (Windows-patched)** at `~/Developer/browser-harness`, installed 2026-04-19. AF_UNIX → TCP loopback + UTF-8 stdout fixes. Global `browser-harness` CLI, imported into `~/.claude/CLAUDE.md`.
