# AutoAgent — Autonomous Agent Optimization

> Synced from Claude Code memory — 2026-04-05
> Source: `~/.claude/projects/C--Users-Rohan/memory/project_autoagent.md`

---

AutoAgent (from kevinrgu/autoagent) is an autonomous agent engineering framework for score-driven improvement of Claude Code agents and Aeon skills. Cloned to `~/autoagent/`.

Also integrated: autoskills (from midudev/autoskills) — auto-detects project tech stacks and installs matching AI skills.

**Why:** Enables overnight autonomous improvement of agents and skills via hill climbing. The meta-agent reads `program-local.md`, selects the weakest target, applies one surgical change, benchmarks, and keeps/discards based on score delta.

## Directory Structure

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
└── autoskills-scan.sh        # Multi-project skill scanner
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

# From NERV terminal
DISPATCH:{"skill":"autoagent"}
DISPATCH:{"skill":"autoagent","var":"morning-brief"}
```

## autoskills Integration

`npx autoskills` detects tech stack from package.json/configs and installs matching skills into project-local `.claude/skills/` directories.

### Currently installed (as of 2026-04-04)

| Project | Skills |
|---------|--------|
| TallyAI (`~/tallyai/.claude/skills/`) | 19 skills: React, Next.js, Tailwind, shadcn, Drizzle, Neon, AI SDK, Vitest, accessibility, SEO |
| NERV (`~/aeon/dashboard/.claude/skills/`) | 13 skills: React, Next.js, Tailwind, TypeScript, Vercel, Node.js, accessibility, SEO |

```bash
# Autoskills commands
bash ~/autoagent/autoskills-scan.sh --list     # list current skills per project
bash ~/autoagent/autoskills-scan.sh --install  # install on all projects
bash ~/autoagent/autoskills-scan.sh --project tallyai  # scan specific project
```

## Key Patterns (from kevinrgu/autoagent)

1. **program.md directive** — Human writes objectives, meta-agent iterates autonomously
2. **Score-driven hill climbing** — Keep if improved, discard if not
3. **Overfitting guard** — "If this benchmark disappeared, would this still help?"
4. **Simplicity criterion** — Equal performance + simpler code = keep
5. **Failure analysis** — Fix classes of issues, not individual cases
6. **Never stop** — Continuous loop until human interrupts

## Integration Points

- **Aeon skill (autoagent):** `~/aeon/skills/autoagent/SKILL.md`
- **Aeon skill (autoskills):** `~/aeon/skills/autoskills/SKILL.md`
- **skill-evolve:** Enhanced with autoagent patterns (results.tsv, failure analysis, overfitting guard)
- **Results tracking:** `~/autoagent/results/results.tsv` — shared across autoagent and skill-evolve

## Related

- [[nerv-autonomous-agent]] — Primary target of AutoAgent improvement runs (41 skills)
- [[omc-orchestration]] — OMC provides the agent infrastructure AutoAgent improves
- [[tallyai-munshi]] — autoskills installed 19 project-local skills for Munshi
