---
name: drip phase 0 sprint continuation
description: Resume point for DRIP Phase 0 Novelty Gateway — Sprint 1 shipped, Sprints 2-3 queued, awaiting Matteo review of PR #1
type: project
originSessionId: d1752750-e8ea-4d62-ac66-b3faaa8401a8
---
# DRIP Phase 0 — resume tomorrow 2026-04-25

## Current state (2026-04-24 01:40 IST)

**PR:** https://github.com/bludragon66613-sys/Drip/pull/1 (draft)
**Branch:** `phase-0-novelty-gateway` (8 commits ahead of `master`)
**Plan docs:** `C:/Users/Rohan/drip/.planning/phase_000_novelty_gateway_v0/{RESEARCH.md,PLAN.md}`
**Repo status:** typecheck green, 7 unit tests green, perf suite pending Neon branch

## Blocking before Sprint 2 starts

Matteo must answer these before writing more code:
1. Embedding dim 512 matches `peptides-creator` pod output? (affects vector(512) column)
2. `/methodology` benchmarks — reuse existing benchmark data or fresh gen?
3. Model card DOI once bioRxiv preprint drops (placeholder for now)
4. Is there a pod embedding endpoint today, or is that Phase B? (affects whether Layer 3 can compile against real fn)
5. Ontology split timing — enum values land now or metadata JSONB until researcher lane opens?
6. Confirm `sequences_claimed` + `sequence_registry` coexistence model
7. Confirm Inngest-only for Phase 0 (no NATS)

## Sprint 1 — DONE

| T | Commit | Status |
|---|---|---|
| T1.1 | f12645d pgvector | done |
| T1.2 | 756fe92 sequence_registry table | done |
| T1.3 | 155d5c6 backfill from sequences_claimed | done |
| T1.4 | ac16981 novelty L1 + atomic lock | done |
| T1.5 | 2d33ae0 wire L1 into /api/v1/discover | done |
| T1.6 | 69f2e6f POST /api/v1/lock endpoint | done |
| T1.7 | 5dde72d typed Inngest event schemas | done |
| T1.8 | 0784c6c unit tests + perf suite | done |

## Sprint 2 — DONE 2026-04-25 (5 atomic commits pushed to PR #1)

| T | Commit | Status |
|---|---|---|
| T2.1 | `6b1c743` | done — tier enum + validation_tier columns (Option A column rename) |
| T2.2 | absorbed into T2.1 | no-op — 0 matches in scope at sweep time |
| T2.3 | `cda6198` | done — /tiers explainer (~800 LOC, 7 sections) |
| T2.4 | `958a6f3` | done — /methodology benchmarks (.tsx, MDX deferred) |
| T2.5 | `3def6de` | done — /for-researchers + waitlist API + migration 0016 |
| T2.6 | `daf69a6` | done — TierBadge in new @drip/ui package, inline SVG |

Visual verification pending Vercel preview rebuild on PR #1 (PENDING at push).

## Sprint 3 — AFTER (target week of 2026-05-08)

| T | Deliverable | Key files |
|---|---|---|
| T3.1 | `sequence_lifecycle` SM table + audit | `0016_sequence_lifecycle.sql` |
| T3.2 | Inngest handler: LOCKED on phase.1 event | `apps/api/src/inngest/functions/on-sequence-locked.ts` |
| T3.3 | Monday auction cron stub | `apps/api/src/inngest/functions/synthesis-auction-cron.ts` |
| T3.4 | Product "The Science" block | `apps/web/app/app/products/[id]/_components/science-block.tsx` |
| T3.5 | Dashboard "What's next?" card | `apps/web/app/app/dashboard/_components/whats-next-card.tsx` |
| T3.6 | Daily eval harness cron | Inngest fn + `evals/fixtures/golden_briefs.json` |
| T3.7 | CI guard against `Tier A/B/C` strings | `scripts/check-tier-nomenclature.sh` + GH Actions |

## Post-P0 roadmap

- **Phase 0.5:** Novelty Layer 2 (k-mer LSH + Levenshtein) + Layer 3 (pgvector HNSW queries) + literature ingest cron (GenBank/UniProt/USPTO) + expiry/recycling SM (180d at-risk, 30d recycle)
- **Phase A:** GenScript email adapter + Haiku 4.5 parser, IIVS Proof adapter, UMA testnet, Monday Dutch auction real, formulation handoff
- **Phase B (Matteo):** peptides-research pod, `/research/generate|predict|fold|simulate|score|embed|calibrate`, Auth0 ORCID, Python SDK v0.1, model card DOI on bioRxiv
- **Phase C:** `/atlas`, `/regulatory`, `/decode`, Private Calibration

## Pipeline specs ingested (source of truth)

Canonical pipeline specs live in `C:/Users/Rohan/Downloads/Telegram Desktop/DRIP MASTER PIPELINE/specs/`:
- `DRIP_MASTER_PIPELINE.md`
- `DRIP_DISCOVERY_STACK.md`
- `DRIP_NOVELTY_GATEWAY.md` (canonical; near-dup at Telegram root is safe to delete)
- `DRIP_RESEARCHER_STACK.md` (older; **replace with Telegram-root version which uses `representation: default|coarse|fine`**)
- `DRIP_AUTOMATION_STACK.md`

Plus at Telegram root (not duplicates):
- `DRIP_BRIEF.md` — partner/cofounder overview, locks tier names `Proof/Verified/Clinical`, 9-phase count, 7 researcher endpoints, Private Calibration, domain drip.markets
- `DRIP_VS_CLARITY.md` — competitive analysis, 4 defensive mitigations ranked

Pending patch spec:
- `PATCH_WEBSITE_CONTENT (2).md` — 7 new routes (`/atlas /regulatory /methodology /decode /tiers /for-researchers` + product Science block + dashboard card) — not yet applied to `DRIP_MASTER_PIPELINE.md`

## Decisions locked

1. Domain: `drip.markets` (not `drip.xyz` from patch doc)
2. Postgres: Neon (pgvector native)
3. Event bus: Inngest-only (no NATS)
4. Researcher pod: Matteo owns
5. Auth for researcher alpha: Auth0 with ORCID social connector
6. Tier rename: global hard rename, code + DB (`proof | verified | clinical` enum values)

## Resume command tomorrow

```bash
cd ~/drip && git checkout phase-0-novelty-gateway && git pull
# Check Matteo's PR review + answers to open questions
gh pr view 1
# If unblocked, start Sprint 2 T2.1
```
