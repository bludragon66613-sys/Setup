---
name: workflow-tiering
description: Model-tier routing for Workflow tool scripts — Opus plans, Haiku scans, Sonnet ships. Use when authoring any Workflow script (pipeline/parallel/agent) or planning a multi-file sweep (audit, migration, bulk fix, codebase review) so read-only fan-out stages run on haiku, edit stages on sonnet in isolated copies, and the main session only reads verified survivors. Load together with workflow-authoring.
---

# Workflow Tiering

Rule of the house for every Workflow script: **the expensive model never reads raw transcripts — only verified findings.**

## The split

| Stage | Model | Why |
|-------|-------|-----|
| Author the workflow script | main session (opus/fable) | judgment-heavy, happens once |
| Read-only scan / extract / audit fan-out | `model: "haiku"` | fast + cheap, per-file candidate extraction |
| Patch / edit stages | `model: "sonnet"` | each edit in its own isolated copy (`isolation: "worktree"`) |
| Verify findings | `model: "sonnet"` (fresh agent, saw none of the build) | adversarial cross-check, drops false positives |
| Read survivors + sign off | main session | sees only `confirmed`, not transcripts |

## Script skeleton

```js
export const meta = {
  name: 'tiered-sweep',
  description: 'Haiku scan fan-out, sonnet verify+patch, main reads survivors',
  phases: [{ title: 'Scan' }, { title: 'Verify' }, { title: 'Patch' }],
}
const results = await pipeline(
  FILES,
  f => agent(`Read-only audit of ${f}: ${OBJECTIVE}. Report candidates only.`,
    { label: `scan:${f}`, phase: 'Scan', model: 'haiku', schema: FINDINGS_SCHEMA }),
  scan => parallel(scan.findings.map(fd => () =>
    agent(`Adversarially verify, assume it is wrong until proven: ${fd.claim}`,
      { label: `verify:${fd.file}`, phase: 'Verify', model: 'sonnet', schema: VERDICT_SCHEMA })
      .then(v => ({ ...fd, verdict: v }))
  ))
)
const confirmed = results.flat().filter(f => f.verdict?.isReal)
// Patch phase: one sonnet agent per confirmed finding, isolation: "worktree"
return { confirmed }
```

Schema-validated outputs (the `schema` opt) are the false-positive filter — malformed or non-conforming findings die in validation, not in the main context.

## Hard rules

1. **Verifier independence**: every finding passes through an agent that did not produce it, briefed with the code, not the conclusion. Never report unverified findings.
2. **Fix-loop circuit breaker**: a fix→verify loop stops after 2 consecutive rounds with no measurable progress (same failures, same count). Report the stall + evidence instead of round 3.
3. **Scan agents are read-only**; edit agents get `isolation: "worktree"` so parallel patches never collide.
4. Main session reads `confirmed` output only. If you need a transcript, the workflow is mis-structured — push the summarization into the agent's prompt.
5. Workflow tool needs explicit user opt-in (the "ultracode" keyword, session enablement, or the user asking for a workflow in their own words). This skill does not grant that — it only shapes the script once authorized.

## When NOT to use

- <10 independent units of work → plain Agent tool fan-out, no workflow
- Single-file or few-call tasks → do inline; a workflow costs more than it looks
- Anything needing mid-run human judgment per item → gated sequential work, not a swarm
