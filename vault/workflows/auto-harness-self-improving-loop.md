---
title: auto harness self improving loop
type: workflow
status: active
---

# Auto-Harness: Self-Improving Agentic Systems

**Source:** Gauri Gupta (@gauri__gupta) / NeoSigma  
**Date:** 2026-04-04  
**Link:** https://x.com/gauri__gupta/status/2040251170099524025  
**Repo:** https://github.com/neosigmaai/auto-harness

## Core Thesis

The engineering bottleneck has shifted from writing code to **validating behavior, catching regressions, and maintaining reliability** as systems evolve. The future is designing systems that sustain and improve themselves via automated feedback loops.

## The Self-Improvement Loop

A flywheel that gets better with agent experience:

1.  **Mine Failures:** Observe production traces to find where the agent failed.
2.  **Cluster by Root Cause:** Group failures by their underlying cause (not just symptoms).
3.  **Generate Living Evals:** Convert failure clusters into reusable test cases that stay in the regression suite.
4.  **Propose & Validate:** The agent autonomously proposes harness changes and tests them in a sandbox.
5.  **Regression Gate:** Accept changes **only** if they improve performance on new cases AND don't regress on previously fixed ones.

## Results

On the Tau3 benchmark, NeoSigma’s agent score improved from **0.56 to 0.78** (~40% jump) by mining failures and auto-maintaining live evals.

## Key Learnings

*   **Clustering is Key:** Grouping failures by proposed fix prevents overfitting to individual cases and forces the agent to solve the root cause.
*   **Manage Context with Sub-Agents:** Verbose traces flood context. Use sub-agents to own their output; the parent agent only sees a recursive summary.
*   **The Regression Gate Compounds Gains:** Fixed failures become permanent constraints. The system can't backslide. Without this gate, you optimize in a loop; with it, the bar only moves up.
*   **Meta-Layer Leverage:** Human instructions, bias rules, and optimization playbooks in the "meta-layer" drive the most significant improvements.

## Comparison to Other Loops

This is the production-grade evolution of the [[subconscious-agent-loop]]. While the subconscious loop focuses on ideation and design refinement, **auto-harness** focuses on **reliability and eval maintenance** with a hard regression gate.

## Related Workflows

*   [[subconscious-agent-loop]] — Ideation and design self-improvement
*   [[claude-code-hooks]] — Local safety and quality automation
*   [[30-day-saas-claude-code]] — Rapid validation and shipping

