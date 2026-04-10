# Rohan's Claude Code Environment

## Identity
- GitHub: bludragon66613-sys
- Memory: `~/.claude/projects/C--Users-Rohan/memory/` — read MEMORY.md at session start

## 3-Layer Memory
1. **Session** — `~/.claude/projects/C--Users-Rohan/memory/` (MEMORY.md + typed files), claude-mem plugin, continuous-learning hooks
2. **Knowledge Graph** — Obsidian vault `~/OneDrive/Documents/Agentic knowledge/`, qmd MCP, server-memory MCP, arscontexta plugin. MindMap.md auto-rebuilt via `memory-obsidian-sync.js`
3. **Ingestion** — `web-ingest-to-vault.js` saves WebFetch/WebSearch to vault, qmd re-indexes on session end

**Re-index:** `qmd update && qmd embed`

## Session Startup
Run `bash ~/startup-services.sh` — boots OpenClaw (:18789), n8n (:5678), Paperclip (:3100 via PM2), Dashboard (:5555 webpack mode), Obsidian sync, and auth expiry check.

## Active Projects

### NERV_02 / Aeon (`~/aeon`)
Autonomous agent on GitHub Actions. 47 skills across crypto, intel, dev, system ops.
- **Dashboard**: `./aeon` → http://localhost:5555 | NERV terminal: /nerv | Intel: /intel
- **Repo**: github.com/bludragon66613-sys/NERV_02
- **Stack**: Next.js 16, Tailwind, Anthropic SDK
- **Phase 1 eval tracking**: `node memory/evals/eval-runner.js` — clean streak in `memory/evals/daily-results.jsonl`

### nerv-dashboard
Standalone dashboard on Vercel. Code at `~/aeon/dashboard/`, repo: github.com/bludragon66613-sys/nerv-dashboard

### n8n (Workflow Automation)
Local on :5678, managed via n8n-mcp. 1,396 nodes, 2,646 templates. Data: `~/.n8n/` (SQLite).

### Paperclip (`~/paperclip`)
Agent orchestration platform on :3100. Managed via PM2 (`pm2 restart paperclip`). 16 companies, 451 agents.
- **Repo**: github.com/paperclipai/paperclip (upstream, no push access)

### claudecodemem + Setup
Backup repos. Push after significant changes.
- **claudecodemem**: github.com/bludragon66613-sys/claudecodemem — agents + memory
- **Setup**: github.com/bludragon66613-sys/Setup — 76 agents, 31 hooks, rules, scripts, config

## Available Agents
75 agents in `~/.claude/agents/`. Key ones:

### Custom Agents
| Agent | Purpose |
|-------|---------|
| `product-manager` | PM framework: PRDs, strategy, discovery, GTM, growth |
| `agent-architect-builder` | 10-phase agent design → spec → build → deploy |
| `ui-ux-architect` | Design audit, UI polish, visual consistency |
| `senior-software-engineer` | Non-trivial code, refactors, debugging |
| `technical-cofounder` | Idea → discovery → plan → build → polish → handoff |
| `super-designer` | Universal design intelligence — web + Apple platforms |

### OMC Agents (oh-my-claudecode)
Haiku for search/docs, Sonnet for execution, Opus for architecture. 17 agents: explore, analyst, planner, architect, critic, code-simplifier, debugger, executor, verifier, designer, test-engineer, scientist, tracer, qa-tester, git-master, document-specialist, writer.

**Magic keywords:** `autopilot:`, `ralph:`, `ulw`, `deep-interview`, `deepsearch`, `ultrathink:`

## Backup & Restore
All backed up to `Setup` repo. After PC reset:
```bash
# Full restore — one command per component
gh repo clone bludragon66613-sys/Setup ~/Setup
bash ~/Setup/restore.sh                           # agents, rules, memory
npm i -g oh-my-claude-sisyphus@latest && omc install && omc setup  # OMC
# Plugins: /plugin install arscontexta@agenticnotetaking, restart CC
```

## OpenClaw (Telegram AI Bot)
Local AI gateway powering @kaneda6bot. Must be running at all times.
- **Health:** `bash ~/openclaw-healthcheck.sh`
- **Default model:** `openrouter/qwen/qwen3.6-plus:free`
- **Fallback chain:** Claude Sonnet → GPT-5.4-mini → Gemini Flash → Gemini Flash Lite → Gemma 4 26B
- **Auth:** openai-codex email profile expires ~Apr 14 (has refresh token). Startup script warns on expiry.
- **Restore Anthropic:** Run `refresh-openclaw-auth.bat` in Windows Terminal, then `openclaw models set anthropic/claude-sonnet-4-6 && openclaw gateway restart`
- **Full details:** see `memory/project_openclaw.md`

## Aeon Skills (47 total)
Dispatched via NERV terminal (`DISPATCH:{"skill":"<name>"}`):

**INTEL:** morning-brief, rss-digest, hacker-news-digest, paper-digest, tweet-digest, reddit-digest, research-brief, search-papers, security-digest, fetch-tweets, search-skill, idea-capture
**CRYPTO:** hl-intel, hl-scan, hl-monitor, hl-trade, hl-report, hl-alpha, token-alert, wallet-digest, on-chain-monitor, defi-monitor
**GITHUB:** issue-triage, pr-review, github-monitor
**BUILD:** article, digest, feature, code-health, changelog, build-skill, paperclip-eval
**SYSTEM:** goal-tracker, skill-health, self-review, reflect, memory-flush, weekly-review, heartbeat, skill-eval, skill-evolve

## GitNexus (Code Intelligence)
Tree-sitter AST knowledge graph. 16 MCP tools. Indexed: aeon (1,002), paperclip (6,721), dashboard (524).
- **Re-index:** `gitnexus analyze ~/aeon && gitnexus analyze ~/paperclip && gitnexus analyze ~/aeon/dashboard`

## Preferences
- Back up agents + memory to `Setup` repo after significant changes
- Keep `dashboard/app/nerv/` committed — nearly lost once
- NERV_02 model toggles between claude-sonnet-4-6 and claude-opus-4-6
- Exclude shueb.io from all Obsidian syncs
