---
name: session_savepoint_2026-03-23c
description: Session savepoint — Trail of Bits + Obsidian + awesome-claude-code commands installed. ~200 skills total.
type: project
---

# Session Savepoint — 2026-03-23c (LATEST)

## Skills Count
- **~200 skills** → `~/.claude/skills/`
- **207 agents** → `~/.claude/agents/`
- **65 commands** → `~/.claude/commands/`

## Added This Session
### Trail of Bits (59 skills installed)
All from `github.com/trailofbits/skills` — security, fuzzing, blockchain vulnerability scanners, static analysis, semgrep, YARA, differential review, constant-time analysis, supply chain risk, etc.

### Obsidian Skills (5 skills)
From `github.com/kepano/obsidian-skills`: obsidian-markdown, obsidian-bases, json-canvas, obsidian-cli, defuddle

### awesome-claude-code (commands)
From `github.com/hesreallyhim/awesome-claude-code`:
- `/evaluate-repository` — 6-dimension repo assessment
- `/analyze-issue` — GitHub issue → implementation spec
- `/tdd-implement` — TDD red→green→refactor
- `/create-docs` — Code analysis → documentation
- `/do-issue` — Implement GitHub issues with review points

## To Restore All Skills/Agents
```bash
# Aigency02
cd ~/aigency02 && bash scripts/install.sh --tool claude-code --no-interactive

# ECC
git clone --depth=1 https://github.com/affaan-m/everything-claude-code.git /tmp/ecc
cd /tmp/ecc && npm install --silent && node scripts/install-apply.js --target claude --profile full

# Trail of Bits
git clone --depth=1 https://github.com/trailofbits/skills /tmp/tob-skills
cd /tmp/tob-skills && for plugin in plugins/*/; do
  skill_name=$(basename "$plugin")
  if [ -f "$plugin/skills/$skill_name/SKILL.md" ]; then
    mkdir -p ~/.claude/skills/$skill_name
    cp "$plugin/skills/$skill_name/SKILL.md" ~/.claude/skills/$skill_name/SKILL.md
  fi
  for subskill in "$plugin/skills"/*/; do
    sub_name=$(basename "$subskill")
    if [ "$sub_name" != "$skill_name" ] && [ -f "$subskill/SKILL.md" ]; then
      mkdir -p ~/.claude/skills/$sub_name
      cp "$subskill/SKILL.md" ~/.claude/skills/$sub_name/SKILL.md
    fi
  done
done

# Obsidian skills
BASE="https://raw.githubusercontent.com/kepano/obsidian-skills/main/skills"
for skill in defuddle json-canvas obsidian-bases obsidian-cli obsidian-markdown; do
  mkdir -p ~/.claude/skills/$skill
  curl -sL "$BASE/$skill/SKILL.md" -o ~/.claude/skills/$skill/SKILL.md
done

# GSD
npx get-shit-done-cc@latest --claude --global
```

## Why:
Context approaching limit. Saving state before compression.
## How to apply:
Say "saved point" → read this → restore from commands above.
