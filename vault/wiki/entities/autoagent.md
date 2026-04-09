---
title: "AutoAgent"
type: entity
kind: project
created: 2026-04-06
updated: 2026-04-06
---

Meta-agent for autonomous improvement of Claude Code skills. Evaluates skills on completeness/efficiency/specificity, then evolves low-scoring ones. Forked from kevinrgu/autoagent.

## Key Facts

- Local path: `~/autoagent`
- Skills: `skill-eval` (scoring rubric) + `skill-evolve` (improvement)
- Scores recorded in `memory/topics/skill-scores.json`
- Lightweight version of full AutoAgent (Harbor/Docker deferred)
- Inspired by Karpathy's autoresearch pattern

## Appears In

- [[wiki/articles/autoagent-optimization|AutoAgent Optimization]]
- [[wiki/articles/nerv-autonomous-agent|NERV Autonomous Agent]]
- [[wiki/articles/omc-orchestration|OMC Orchestration]]
