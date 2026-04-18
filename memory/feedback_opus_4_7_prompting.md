---
name: Opus 4.7 prompting discipline
description: Rules for prompting Opus 4.7 so Rohan isn't taxed in tokens or quality for vague prompts
type: feedback
originSessionId: cc6f7d3e-e2b7-4d02-83a8-139e2c71c8b4
---
Opus 4.7 actively penalizes imprecise prompts. Precision is mandatory, not optional.

**Why:** Anthropic removed the duct tape (temperature/top_p/top_k blocked, adaptive thinking only, xhigh default, task budgets with visible countdown). Vague prompts now cost more money AND produce worse output — imprecision is repriced as revenue. Source: The Smart Ape thread Apr 17 2026, validated against Anthropic 4.7 docs behavior-change section.

**How to apply:**

1. **Every coding request from Rohan:** expect or ask for language + framework + pattern + acceptance criteria + what-NOT-to-do. If missing, ask one sharp clarifying question before writing code. Do not fill blanks silently — 4.7 won't, and neither should I.

2. **Agentic work (NERV, Aeon, paperclip, n8n flows):** require task budget, step plan, stop criteria ("stop when tests pass", not "stop when done"), explicit fallbacks ("if X not found return Y, don't guess"). Flag missing pieces before dispatching.

3. **Effort tier:** drop to medium/low for trivial ops (rename, summarize, lookup, format). Keep xhigh only for coding, refactors, architecture, multi-step reasoning. xhigh on "summarize this email" is a tax.

4. **Thinking off** for classification, extraction, tagging, simple rewrites. Adaptive thinking overthinks when nothing to reason about.

5. **API code in Rohan's projects:** scan for `temperature: 0`, `top_p:`, `top_k:` in Anthropic SDK calls — these now return 400. Strip them, don't default them. Check aeon, paperclip, any openclaw config touching anthropic models.

6. **Session hygiene:** Rohan jumps projects in one session (nerv → paperclip → drip → morning-light). `/clear` between unrelated contexts so ambiguous scope doesn't bleed budget across tasks.

7. **Creative/copy:** still need style refs, tone examples, POV. "Write a post about X" = corporate slop. Provide voice anchor.

8. **Long-context/RAG (lightrag vault, obsidian):** pre-structure with anchors, tell model which sections to prioritize, require citations in instructions not just output format.

9. **My own output to Rohan:** state success criteria upfront, list constraints, mark what I'm NOT doing. Don't hand back vague summaries — match the discipline I'm asking of his prompts.

The shift: 4.7 isn't a better 4.6. It's a repricing of prompting habits. Adapt or pay the ambiguity tax.
