---
title: "GitHub Actions"
type: entity
kind: tool
created: 2026-04-06
updated: 2026-04-06
---

CI/CD system powering NERV's autonomous skill dispatch. Skills are triggered via the Aeon Dashboard NERV terminal and executed as GitHub Actions workflows.

## Key Facts

- NERV dispatches skills via `DISPATCH:{"skill":"<name>"}` → GitHub Actions
- 41 skills run as workflows (intel, crypto, build, system domains)
- AutoAgent's skill-eval and skill-evolve also execute here
- Repo: `bludragon66613-sys/NERV_02`

## Appears In

- [[wiki/articles/nerv-autonomous-agent|NERV Autonomous Agent]]
- [[wiki/articles/autoagent-optimization|AutoAgent Optimization]]
- [[wiki/articles/omc-orchestration|OMC Orchestration]]
- [[wiki/articles/rei-ai-vtuber|Rei AI VTuber]]
