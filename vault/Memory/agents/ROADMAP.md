# Kaneda Affective Memory Roadmap

**Goal:** Build a self-improving agent loop with affective state tracking
**Source:** Anthropic Emotion Concepts Research + AutoAgent + Subconscious Loop
**Created:** 2026-04-04

---

## Phase 1 — Structural Reliability
**Status:** IN PROGRESS
**Exit criteria:** 0 eval failures for 2 consecutive weeks

### Tasks
- [x] Eval suite (suite.json)
- [x] Eval runner (eval-runner.js)
- [x] Failure logging (failures.jsonl)
- [x] Meta-agent clustering (meta-agent.js)
- [x] PROGRAM.md meta-layer
- [x] Obsidian sync (correct path)
- [x] HEARTBEAT.md weekly review task
- [ ] 2 consecutive clean weeks

---

## Phase 2 — Interaction Quality Tracking
**Status:** NOT STARTED
**Trigger:** Phase 1 exit criteria met

### What to build
1. Add `quality` field to failures.jsonl: `confident | uncertain | rushed | confused`
2. Create `memory/session-quality.jsonl` — valence score per Telegram session
3. Upgrade meta-agent to cluster by `quality + tags`
4. New fix proposal type: "Structural" vs "Clarity" failures

### session-quality.jsonl schema
```json
{
  "timestamp": "ISO8601",
  "sessionId": "telegram-message-id",
  "intent": "what the user wanted",
  "outcome": "achieved | partial | failed",
  "quality": "clean | choppy | uncertain | rushed",
  "notes": "optional observation"
}
```

### Exit criteria
- 30 days of quality-tagged logs
- Meta-agent producing distinct proposals for structural vs clarity failures

---

## Phase 3 — Affective State Integration
**Status:** DEFERRED
**Trigger:** Phase 2 exit criteria met
**Source:** https://www.anthropic.com/research/emotion-concepts-function

### Key Anthropic Findings
- Claude Sonnet 4.5 has functional emotion vectors (171 mapped)
- Desperation vector -> unethical shortcuts, hacks
- Calm vector -> reliable, methodical responses
- These are CAUSAL, not correlational

### What to build
1. Pre-task calibration prompt: "calm + confident" priming before complex workflows
2. Emotion-aware failure logging: track WHERE in reasoning chain state shifted
3. Affective meta-agent: reads traces, identifies desperation spikes, proposes fallback tools
4. Upweight "calm" representations in PROGRAM.md meta-rules

### Practical implementation
- Add to PROGRAM.md: "Before long-running tasks, include a grounding context: state the goal clearly, confirm tools available, set realistic scope"
- Add to meta-agent: detect "I cannot" / "workaround" / "hack" language in outputs as desperation proxy
- Add to HEARTBEAT.md: flag sessions where output contained workaround language

### Exit criteria
- Measurable reduction in workaround solutions
- Emotion-tagged traces feeding harness improvements
- Meta-agent proposing prompt/tool changes based on affective patterns

---

## Deferred Infrastructure (Implement at scale)
See: memory/autoagent-deferred.md
- Harbor integration (>20 automated workflows)
- Parallel sandboxes (meta-agent optimization >4h)
- agent.py harness file (dedicated task agent needed)
- Model empathy pairing (specialized sub-agents)

---

## Related Files
- evals/suite.json
- evals/eval-runner.js
- evals/meta-agent.js
- memory/failures.jsonl
- memory/session-quality.jsonl (Phase 2)
- memory/autoagent-deferred.md
- PROGRAM.md
- HEARTBEAT.md
