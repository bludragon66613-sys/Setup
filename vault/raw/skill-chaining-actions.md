# Skill Chaining: Skills Should Be Actions
> Source: https://x.com/realmcore_/status/2039382343581147414
> Author: Akira (@realmcore_)
> Date: 2026-04-01
> Tags: #agents #skills #automation #architecture #paperclip
---

## Summary
Skills should be contextual behaviors agents execute, not static prompts they read once.

## Key Concepts
- **Knowledge overhang** = gap between what model knows vs what it actually does
- Rules load all context blindly; skills progressive disclosure
- Skills as isolated threads with scoped context + permissions
- Orchestration skills: skills that reference other skills in sequences
- Context forking: synchronous execution for interactive skills

## What We Applied
- All 451 Paperclip agents updated with role-aware orchestration prompts
- 87 core agents get full 5-phase chain (research, analyze, build, review, reflect)
- 354 bulk agents get tight chain (read, build, self-review, reflect)
- Skill-chaining reference added to all 81+ skill files
- Universal agent orchestration skill created