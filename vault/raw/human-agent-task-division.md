# Human vs Agent Task Division
> Author: Totoro
> Date: 2026-04-03
---

## Core Principle
Agents build and review. Humans confirm and ship.
Third party does final validation before public release.

## Agent Tasks (Autonomous)
- Writing code, designing UI/UX, developing features
- Self-review and peer review between agents
- Product ideation and architecture
- Content creation and marketing
- SEO, research, data analysis
- Wiki and knowledge maintenance

## Human Tasks (Gatekeeping)
- Confirming agent reviews (approve/deny)
- Hosting and infrastructure configuration
- Security guardrails and access control
- Shipping to production
- API keys, credentials, financial decisions
- Legal and compliance

## Third Party (Final Gate)
- Independent review before public release
- Unbiased quality check on features, content, design
- Final validation that nothing slipped through

## Application Rules
1. Agents generate and review themselves
2. Peer review between agents before human confirmation
3. Humans confirm (approve/deny only, not do-the-work)
4. Third party validates before public release
5. High-risk tasks (security config, payments, legal) stay human-only
6. Release pipeline: Build → Self-Review → Peer Review → Human Confirm → Third Party Validate → Public
