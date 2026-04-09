---
title: subconscious agent loop
type: workflow
status: active
---

# Subconscious Agent Loop — Self-Improving Agents for Hermes/OpenClaw

**Source:** Graeme (@gkisokay)  
**Date:** 2026-04-03  
**Link:** https://x.com/gkisokay/status/2040044476060864598

## Core Thesis

Most agent systems break in the same boring ways:
- They need babysitting
- They drift
- They burn tokens on vague exploration
- They produce output, but not momentum

The **subconscious agent** flips that. Instead of asking "What should this agent do right now?" the system keeps asking:
- What did we learn?
- What failed?
- What should we try next?
- What needs guardrails?
- What should be frozen until it earns trust?

This is the difference between agents that *guess* improvements and agents that actually **compound**.

## The Architecture

A small but relentless loop:

1. **Gather evidence** from latest run
2. **Generate candidate ideas**
3. **Debate** those ideas against hard objections (with a smarter model)
4. **Synthesize** one recommendation (accept/reject)
5. **Write result into state**
6. **Next run starts from updated state** (not zero)

The last part is the real unlock. Most systems "remember" in a loose, fuzzy way. This one remembers by keeping the winning direction, rejected paths, and next improvement in a **durable workspace**.

So the machine doesn't just answer. It learns how to answer better.

## What You Actually Need To Build It

### 1. Runner
Something that coordinates the whole cycle:
- Load the brief
- Fetch current state
- Run ideation
- Run critique
- Run synthesis
- Write artifacts
- Hand off the result

In Graeme's setup, this is the 
unner — the control plane for the loop.

### 2. Persistent State
The system needs memory that survives process restarts:
- **JSON** for current summaries and governance
- **JSONL** for append-only history
- **Markdown** for human-readable outputs
- **Stable directory structure** so later runs can pick up where the last one ended

Without durable state, the system cannot improve. It just reenacts the same conversation every time.

### 3. Scheduler or Trigger Source
Decide when the loop runs:
- On a cron schedule
- After new metrics arrive
- After a live signal changes
- After a manual review request

**Be realistic** about frequency. Too many runs can lead to excessive divergence from original principles.

### 4. Transport or Delivery Layer
The loop is useless if nobody sees the result:
- Discord (Graeme's setup)
- Telegram
- File path
- Dashboard
- Task queue

The transport should be **separate from the reasoning layer**. Keeps the model from becoming tightly coupled to one output channel.

### 5. Model Router
Different phases should use different models:
- **Cheap/local model** for ideation (e.g., qwen3.5 9B)
- **Stronger model** for challenge and synthesis (e.g., GPT-5.4 mini)
- **Execution model** for artifact generation or final writes

Graeme's stack: qwen3.5 9B locally for fast ideation, GPT-5.4 mini for synthesis/challenge. Other options: OpenRouter (routes different models to each phase), MiniMax M2.7 (/mo).

The mix keeps costs sane and quality high.

### 6. Review and Approval Gate
If the system can ship directly without a human check, you're building an autopilot, not an assistant loop.

This pattern keeps approval at the end, so the system can be smart without becoming reckless. Test with human approval first; decide later which tasks to auto-approve.

### 7. Artifact Writers
The loop writes back into the filesystem in a predictable way:
- \ideas/ideas-internal.jsonl\
- \debate/debate-log.jsonl\
- \winning-concept.md\
- \improvement-backlog.md\
- \
un-summary.json\

These are the system's memories.

## Minimal Folder Structure

\\\
your-system/
  runner/
    run.js
    cron.js
    transport.js
  state/
    governance.json
    memory.jsonl
    outcomes.jsonl
    latest-summary.json
  runs/
    current-run/
      ideas/
      debate/
      recommendation/
        winning-concept.md
        improvement-backlog.md
        run-summary.json
  targets/
    content-daily.js
  briefs/
    content-daily.md
\\\

Keep the separation: runner code, persistent state, per-run artifacts, target definitions, human-readable briefs.

## The Guardrails

This matters more than the \"agent magic.\" Guardrails are the security layers that keep workflows intact.

**The rules:**
- Evidence first
- Explicit states instead of fuzzy opinions
- One human approval gate at the end
- No automatic promotion from zero-confirmation clusters
- One seed may re-enter through a manual review gate
- The next run must write its learning back into the state

## Minimal Pseudo-Code

\\\
load brief
load recent state
load recent memory
load governance rules

ideas = generate_candidate_directions(brief, state)
curated = select_strongest(ideas)

for idea in curated:
  debate = challenge_and_defend(idea, brief, state)
  if debate converges:
    synthesize = produce_final_recommendation(debate, brief, state)
    if human_approval_required:
      write_artifacts(synthesize)
      persist_learning(synthesize, state)
      deliver_output(synthesize)
    else:
      stop
\\\

**The important part is the order:**
1. Inspect state
2. Generate options
3. Challenge weak ideas
4. Choose one strong direction (if possible)
5. Persist the result
6. Make the next run smarter

If you skip persistence, the loop is broken.

## What Changed After Graeme Added It

Before: agents would try to guess improvements and fixes. Simple fixes were fine, but complex drift/misalignment issues weren't clear-cut.

After: the subconscious became aware of runtime drift and delivery output misalignment. It created 5 fresh fix ideas, debated them with the main brain, and recommended a fix that the coding agent could implement.

## How to Make It Configurable

Don't hard-code the system to a single model or style. Make the loop configurable.

**What your LLMs should be able to customize:**
- What counts as evidence
- What the explicit states are
- When to freeze output
- When to allow re-entry
- What the approval gate looks like
- What the next run should improve

## Example Walkthrough: Content Generation

Graeme's subconscious loop for daily content creation:

1. **\ideas/\ stores candidate directions** — draws from Base crypto AI agent research pipeline. Options changed, but mission stayed the same: Base Decision Audit, Base Signal Filter, Base Builder Triage. System converging on one thesis: builders want practical decision tools, not more noise.

2. **\debate/\ stores challenge and defence turns** — first version challenged for being too meta, too close to yesterday's angle, not specific enough. Pushback forced more concrete execution. Result: better direction, not different one.

3. **\winning-concept.md\ stores final approved direction** — system lands on long-form article helping Base builders decide what to ship, watch, and ignore. Data backs it: dense, utility-heavy posts performed best. Shallow posts didn't.

4. **\improvement-backlog.md\ stores what next run should sharpen** — direction is strong, but needs to stay fresh. Next run asks: what part still feels too familiar, what would make it sharper?

Every run leaves a trail:
- What the system thought
- What it resisted
- What survived the critique
- What should happen next

For builders, that's the difference between "AI output" and "AI compounding."

## Related Workflows

- [[30-day-saas-claude-code]] — Rapid SaaS build with Claude Code
- [[stitch-mcp-design-system]] — Design system generation for AI agents
- [[structured-design-critique-ai]] — Taste-driven design iteration

