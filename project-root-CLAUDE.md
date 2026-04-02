# Rohan's Claude Code Environment

## Identity
- GitHub: bludragon66613-sys
- Memory: `~/.claude/projects/C--Users-Rohan/memory/` — read MEMORY.md at session start

## Session Startup (run first every session)
Run `bash ~/startup-services.sh` to boot all services:
1. **OpenClaw** — Telegram bot gateway (healthcheck auto-fixes)
2. **Paperclip** — Agent platform on :3100 (start before dashboard)
3. **Dashboard** — NERV on :5555 (`--webpack` mode, NOT turbopack — Windows bug)

## Active Projects

### NERV_02 / Aeon (`~/aeon`)
Autonomous agent on GitHub Actions powered by Claude Code. 39 skills across crypto, intel, dev, and system ops.
- **Dashboard**: run `./aeon` from `~/aeon` → http://localhost:5555
- **NERV terminal**: http://localhost:5555/nerv (Claude command interface, dispatches skills to GH Actions)
- **Intel page**: http://localhost:5555/intel (Hyperliquid market intelligence)
- **Repo**: github.com/bludragon66613-sys/NERV_02
- **Stack**: Next.js 16, Tailwind, Anthropic SDK, Claude CLI fallback

### nerv-dashboard
Standalone version of the dashboard, deployed on Vercel.
- **Repo**: github.com/bludragon66613-sys/nerv-dashboard
- **Code**: lives at `~/aeon/dashboard/`

### claudecodemem
Backup repo for agents and memory. Always push here after changes.
- **Repo**: github.com/bludragon66613-sys/claudecodemem
- **Contents**: `agents/` (5 Claude agents), `memory/` (session memory)

## Available Agents
These are globally installed in `~/.claude/agents/` and available in every session:

| Agent | Trigger | Purpose |
|-------|---------|---------|
| `product-manager` | Product planning, PRDs, strategy, discovery, GTM, growth | Google-caliber PM with 65 skills across 8 workflows |
| `agent-architect-builder` | User wants to design/build an AI agent from scratch | 10-phase discovery → spec → build → deploy |
| `ui-ux-architect` | Design audit, UI polish, visual inconsistencies | Reads design docs, phases improvements, never touches logic |
| `senior-software-engineer` | Non-trivial code, refactors, debugging | Surfaces assumptions, pushes back, surgical scope |
| `technical-cofounder` | Building a product from an idea | Phase-by-phase: discovery → plan → build → polish → handoff |


## Backup & Restore
Everything is backed up to `github.com/bludragon66613-sys/claudecodemem`.

**After a PC reset — restore agents:**
```bash
node -e "
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const agents = ['product-manager','agent-architect-builder','ui-ux-architect','senior-software-engineer','technical-cofounder'];
for (const a of agents) {
  const content = execSync(\`gh api repos/bludragon66613-sys/claudecodemem/contents/agents/\${a}.md --jq '.content'\`).toString().trim();
  fs.writeFileSync(\`\${os.homedir()}/.claude/agents/\${a}.md\`, Buffer.from(content, 'base64').toString());
  console.log('restored', a);
}
"
```

**After a PC reset — restore PM skills (65 skills from phuryn/pm-skills):**
```bash
gh repo clone phuryn/pm-skills /tmp/pm-skills 2>/dev/null
for d in /tmp/pm-skills/pm-*/skills/*/; do
  name="pm-$(basename "$d")"
  mkdir -p ~/.claude/skills/"$name"
  cp "$d/SKILL.md" ~/.claude/skills/"$name"/SKILL.md
  echo "restored $name"
done
rm -rf /tmp/pm-skills
```

## OpenClaw (Telegram AI Bot)
Local AI gateway that powers the Telegram bot (@kaneda6bot). Must be running at all times.
- **Health check:** `bash ~/openclaw-healthcheck.sh` (auto-fixes common issues)
- **Current model:** `openai-codex/gpt-5.4` (primary), `openai-codex/gpt-5.4-mini` (fallback)
- **Auth expires:** ~March 31, 2026 (openai-codex OAuth)
- **Anthropic:** EXPIRED — refresh via `refresh-openclaw-auth.bat` in Windows Terminal when needed
- **Restore Claude:** Run `C:\Users\Rohan\refresh-openclaw-auth.bat` in Windows Terminal, then `openclaw models set anthropic/claude-sonnet-4-6 && openclaw gateway restart`
- **Full details:** see `memory/project_openclaw.md`

## Aeon Skills (41 total, +skill-eval +skill-evolve)
Dispatched to GitHub Actions via NERV terminal (`DISPATCH:{"skill":"<name>"}`):

**INTEL:** morning-brief, rss-digest, hacker-news-digest, paper-digest, tweet-digest, reddit-digest, research-brief, search-papers, security-digest, fetch-tweets, search-skill, idea-capture

**CRYPTO (Hyperliquid):** hl-intel *(flagship)*, hl-scan, hl-monitor, hl-trade, hl-report, hl-alpha

**CRYPTO MONITORING:** token-alert, wallet-digest, on-chain-monitor, defi-monitor

**GITHUB:** issue-triage, pr-review, github-monitor

**BUILD:** article, digest, feature, code-health, changelog, build-skill

**SYSTEM:** goal-tracker, skill-health, self-review, reflect, memory-flush, weekly-review, heartbeat, skill-eval, skill-evolve

## Preferences
- Always back up agents + memory to `claudecodemem` after significant changes
- Keep `dashboard/app/nerv/` committed — it was nearly lost (only lived locally)
- NERV_02 model toggles between claude-sonnet-4-6 and claude-opus-4-6
