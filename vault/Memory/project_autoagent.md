---
name: autoagent-integration
description: AutoAgent + autoskills — autonomous improvement loop (kevinrgu/autoagent) and tech-stack skill discovery (midudev/autoskills)
type: project
---

AutoAgent (from kevinrgu/autoagent) is an autonomous agent engineering framework cloned to `~/autoagent/`.
autoskills (from midudev/autoskills) auto-detects project tech stacks and installs matching AI skills.

**Why:** Enables overnight autonomous improvement of Claude Code agents and Aeon skills via score-driven hill climbing — the meta-agent reads `program-local.md`, selects the weakest target, applies one surgical change, benchmarks, and keeps/discards based on score delta.

**How to apply:** Use when discussing agent or skill quality, evolution, or autonomous improvement runs.

## Structure

```
~/autoagent/
├── program-local.md          # Meta-agent directives (local adaptation)
├── program.md                # Original from kevinrgu/autoagent
├── agent.py                  # Original OpenAI variant (reference)
├── agent-claude.py           # Original Claude SDK variant (reference)
├── evolve-loop.sh            # Overnight autonomous runner (multi-round)
├── evolve-once.sh            # Single iteration runner
├── benchmarks/
│   ├── agent-benchmarks.json # Test tasks for 5 Claude Code agents
│   └── skill-benchmarks.json # Test tasks + failure modes for 8 Aeon skills
├── results/
│   ├── results.tsv           # Unified experiment tracking
│   └── autoskills-scan.log   # Skill scan history
├── autoskills-scan.sh        # Multi-project skill scanner (wraps midudev/autoskills)
└── Dockerfile.base           # Original Docker config (not used locally)
```

## autoskills (midudev/autoskills)

Installed via `npx autoskills` — detects tech stack from package.json/configs and installs
matching AI skills from skills.sh into project-local `.claude/skills/` directories.

### Current project-local skills (installed 2026-04-04)
- **TallyAI** (`~/tallyai/.claude/skills/`): 19 skills — React, Next.js, Tailwind, shadcn, Drizzle, Neon, AI SDK, Vitest, accessibility, SEO
- **NERV** (`~/aeon/dashboard/.claude/skills/`): 13 skills — React, Next.js, Tailwind, TypeScript, Vercel, Node.js, accessibility, SEO

### Skill scan commands
```bash
# List current skills per project
bash ~/autoagent/autoskills-scan.sh --list

# Dry-run scan all projects
bash ~/autoagent/autoskills-scan.sh

# Install on all projects
bash ~/autoagent/autoskills-scan.sh --install

# Scan specific project
bash ~/autoagent/autoskills-scan.sh --project tallyai

# From NERV terminal
DISPATCH:{"skill":"autoskills"}
DISPATCH:{"skill":"autoskills","var":"tallyai"}
```

## Usage

```bash
# Single evolution iteration (auto-select weakest target)
bash ~/autoagent/evolve-once.sh

# Evolve specific skill
bash ~/autoagent/evolve-once.sh morning-brief

# Evolve specific agent
bash ~/autoagent/evolve-once.sh --agent product-manager

# Multi-round overnight loop
bash ~/autoagent/evolve-loop.sh --rounds 10
bash ~/autoagent/evolve-loop.sh --overnight

# From NERV terminal (dispatched to GitHub Actions)
DISPATCH:{"skill":"autoagent"}
DISPATCH:{"skill":"autoagent","var":"morning-brief"}
```

## Integration Points

- **Aeon skill (autoagent)**: `~/aeon/skills/autoagent/SKILL.md` — autonomous improvement loop
- **Aeon skill (autoskills)**: `~/aeon/skills/autoskills/SKILL.md` — tech-stack skill discovery
- **skill-evolve**: Enhanced with autoagent patterns (results.tsv, failure analysis, overfitting guard, continuous mode)
- **skill-eval**: Unchanged (locked evaluator)
- **Results tracking**: `~/autoagent/results/results.tsv` — shared across autoagent and skill-evolve

## Key Patterns (from kevinrgu/autoagent)

1. **program.md directive** — Human writes objectives, meta-agent iterates autonomously
2. **Score-driven hill climbing** — Keep if improved, discard if not
3. **Overfitting guard** — "If this benchmark disappeared, would this still help?"
4. **Simplicity criterion** — Equal performance + simpler code = keep
5. **Failure analysis** — Classify weaknesses, fix classes of issues not individual cases
6. **Never stop** — Continuous loop until human interrupts
