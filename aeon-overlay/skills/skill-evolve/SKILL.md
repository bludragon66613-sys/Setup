---
name: Skill Evolve
description: >
  Autoresearch-driven skill improvement loop. Accepts a target skill name,
  uses the autoresearch framework to run metric-guided prompt-variant experiments,
  and gates keeper decisions through ccg_judge for cross-model validation.
var: ""
---
> **${var}** — Skill name to evolve (e.g. `morning-brief`). Required.
> Append `--loop` to run continuously (e.g. `morning-brief --loop`).

Run one autoresearch-driven iteration of the skill evolution loop.

---

## Objective

Improve `skills/${var}/SKILL.md` by running 3–5 prompt variants as experiments,
measuring each with `skill-eval`, and keeping only variants that pass ALL three gates:
1. Metric improvement (new eval_score > baseline_score)
2. Statistical confidence ≥ 2.0× MAD (reported by autoresearch)
3. Cross-model judge verdict = `keep` (via `ccg_judge.sh`)

---

## Pre-flight

```
TARGET="${var%%--loop}"  # strip --loop flag if present
TARGET="${TARGET// /}"   # trim spaces
```

1. Verify `skills/${TARGET}/SKILL.md` exists. If not, abort with message.
2. Read `memory/topics/skill-scores.json` — if no entry for `${TARGET}`, run `skill-eval ${TARGET}` first, then re-read.
3. Read `memory/topics/skill-evolution.md` if it exists — collect dead-end variants so we don't repeat them.
4. Read `memory/MEMORY.md` for current goals context.

---

## Step 1 — Establish baseline

Record:
- `baseline_score`: most recent composite from `skill-scores.json` for `${TARGET}`
- `baseline_date`: date of that entry

Also read the latest row in `memory/evals/daily-results.jsonl` where `skill == "${TARGET}"` as a secondary baseline confirmation.

---

## Step 2 — Initialize autoresearch session

Run:
```bash
cd ~/aeon
bash ~/.claude/skills/autoresearch/lib/init_experiment.sh \
  "skill-evolve-${TARGET}" \
  "eval_score" \
  "points" \
  "higher"
```

This writes `.autoresearch-state.json` with metric direction = higher.

---

## Step 3 — Write autoresearch.md (scope manifest)

Create or overwrite `autoresearch.md` in `~/aeon/`:

```markdown
# Autoresearch: ${TARGET} skill improvement

## Files in scope
- skills/${TARGET}/SKILL.md

## Metric
eval_score — higher is better. Measured by running skill-eval on the modified SKILL.md.

## Constraints
- One focused change per variant
- No changes to aeon.yml, skill-eval/SKILL.md, skill-evolve/SKILL.md, autoagent/SKILL.md
- No new external API calls
- Variants must not repeat dead ends in memory/topics/skill-evolution.md
```

---

## Step 4 — Generate 3–5 prompt variants

Read `skills/${TARGET}/SKILL.md` in full.

Identify the single weakest dimension from the baseline score:
- Completeness lowest → missing steps, ambiguous instructions
- Efficiency lowest → redundant fetches, bloated prompts
- Specificity lowest → vague output format, no examples

Generate 3–5 distinct SKILL.md variants. Each variant makes exactly ONE focused change:

| Variant | Change type | Example |
|---------|-------------|---------|
| V1 | Tighten output format — add concrete example block | |
| V2 | Add missing error-handling branch | |
| V3 | Remove redundant step | |
| V4 | Add few-shot example showing expected output | |
| V5 | Rephrase ambiguous instruction to imperative | |

Filter out any variants whose change matches a dead end in `skill-evolution.md`.

---

## Step 5 — Run experiments

For each variant `Vn`:

### 5a. Apply the change
Write the modified content to `skills/${TARGET}/SKILL.md`.

### 5b. Write autoresearch.sh
Create `autoresearch.sh` in `~/aeon/`:
```bash
#!/usr/bin/env bash
# Run skill-eval on the modified skill and emit METRIC line.
set -euo pipefail
SCORE=$(bash skills/skill-eval/eval_skill.sh ${TARGET} 2>/dev/null \
        || node skills/skill-eval/score.js ${TARGET} 2>/dev/null \
        || echo "0")
echo "METRIC eval_score=${SCORE}"
```

> If `eval_skill.sh` / `score.js` don't exist, fall back to mentally scoring via the
> skill-eval rubric and echo the result. Document the fallback in the experiment log.

### 5c. Run experiment
```bash
bash ~/.claude/skills/autoresearch/lib/run_experiment.sh 120 60
```

### 5d. Read the pending metric
```bash
NEW_SCORE=$(node -e "const p=require('fs').readFileSync('.autoresearch-pending.json','utf-8'); \
  process.stdout.write(String(JSON.parse(p).metric ?? '0'));")
```

### 5e. Apply three-gate check

**Gate 1 — Metric improvement**
```
new_score > baseline_score  →  PASS
otherwise                   →  FAIL → log_experiment discard
```

**Gate 2 — Statistical confidence**
Read `.autoresearch-state.json` for current MAD/confidence. Confidence ≥ 2.0 required.
```bash
CONF=$(node -e "const s=require('fs').readFileSync('.autoresearch-state.json','utf-8'); \
  process.stdout.write(String(JSON.parse(s).confidence ?? '0'));")
# If confidence < 2.0 → discard
```

**Gate 3 — Cross-model judge**
```bash
CCG_JSON=$(bash ~/.claude/skills/autoresearch/lib/ccg_judge.sh \
  "${baseline_score}" "${NEW_SCORE}" "higher" \
  "skill-evolve ${TARGET}: Vn change description")
VERDICT=$(echo "$CCG_JSON" | node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('/dev/stdin','utf-8')).verdict);")
# If verdict != "keep" → discard
```

### 5f. Finalize experiment

If all three gates pass:
```bash
bash ~/.claude/skills/autoresearch/lib/log_experiment.sh keep \
  "skill-evolve ${TARGET} Vn: <one-line description>" \
  '{"variant":"Vn","gate_confidence":"<val>","ccg_verdict":"keep"}'
```

If any gate fails:
```bash
bash ~/.claude/skills/autoresearch/lib/log_experiment.sh discard \
  "skill-evolve ${TARGET} Vn: <one-line description of why failed>"
```

After `keep`, stop running further variants — the winning change is now committed.
After all variants are `discard`, move to Step 6.

---

## Step 6 — Record outcome

Append to `memory/topics/skill-evolution.md` (create if missing):

```markdown
## ${today} — ${TARGET}

- **Variants tried:** Vn list and one-liner per variant
- **Winner:** <Vn description> OR none
- **Baseline:** ${baseline_score} → **New score:** ${new_score} (or unchanged)
- **Dead ends this run:** <list of discarded variant change-types>
- **Learning:** <one sentence — what signal this provides for future iterations>
```

Also append kept variant's score to `memory/topics/skill-scores.json`.

If a variant was kept, append to `memory/evals/daily-results.jsonl`:
```json
{"date":"<today>","skill":"${TARGET}","score":<new_score>,"source":"skill-evolve","variant":"Vn"}
```

---

## Step 7 — Log and notify

Append to `memory/logs/${today}.md`:
```
SKILL_EVOLVE: ${TARGET} <KEPT Vn / NO_IMPROVEMENT> ${baseline_score} → ${new_score}
```

Send via `./notify`:
```
Skill Evolved: ${TARGET}
Result: <KEPT: Vn description / No improvement after N variants>
Score: ${baseline_score} -> ${new_score}
CCG: <verdict>
```

---

## Continuous mode (--loop)

If `${var}` contains `--loop`, after completing one iteration:
1. Do NOT stop or ask whether to continue.
2. Return to Pre-flight and select the next target (lowest-scored skill not evolved in last 7 days).
3. Continue until explicitly interrupted.
4. Sleep 10 seconds between iterations to avoid rate limits.

---

## Guardrails

- Never modify `aeon.yml`, `skill-eval/SKILL.md`, `skill-evolve/SKILL.md`, or `autoagent/SKILL.md`
- One change per variant — resist the urge to fix everything
- Skip variants that repeat dead ends in the evolution log
- If `run_experiment.sh` or `log_experiment.sh` error, log the failure and move to the next variant
- If all 3 gates pass but the change is cosmetic-only (whitespace/typos), still accept — small wins compound
- If git operations fail, log the error and exit cleanly

---

## Example invocation

```
/dispatch skill-evolve morning-brief
```

Runs one evolution iteration on the `morning-brief` skill:
reads its baseline eval_score, generates up to 5 variants, runs each through
autoresearch + ccg_judge, keeps the first winner (or logs no improvement).

```
/dispatch skill-evolve morning-brief --loop
```

Runs continuously, cycling through all skills in score order.
