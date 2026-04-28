---
name: drip 2026-04-28b — Matteo PR #1 unblock reply + license memo absorbed
description: Matteo dropped DRIP_PR1_UNBLOCK_REPLY.md (10 answers) + DRIP_LICENSE_CONSTRAINTS.md (BLOCKING). 6 commits absorbed both: specs ingest, atlas+decode framing sweep, /methodology rewrite (stale AUROCs out, Aurora model card path in), capability matrix swap to competitor compare, /for-researchers run-based pricing, /creator-agreement license-conformance fix. Aurora is licensor, drip is licensee+operator — output-only, non-sublicensable, no white-label, no embed, no fine-tuning. Partner reply written, ready to send.
type: project
originSessionId: 2026-04-28_drip-license-absorption
---

# 2026-04-28b drip — Matteo reply + license absorption

Matteo (cybergenesis621) dropped two markdown files via Telegram:
`DRIP_PR1_UNBLOCK_REPLY.md` (answers to my 10 PR #1 unblock
questions) and `DRIP_LICENSE_CONSTRAINTS.md` (BLOCKING memo on the
Aurora ↔ drip license shape). This session absorbed both.

## License shape (load-bearing for everything else)

**Aurora** is the IP holder. Owns the Aurora Peptide Stack — model
weights, architecture, training data, training procedure. Aurora is
cybergenesis621's principal entity.

**drip Markets** licenses the Aurora Peptide Stack on:
- **Field-restricted** (peptide skincare/wellness/research only).
- **Non-sublicensable** (drip cannot grant any third party model
  rights — researcher, biotech, lab, enterprise, builder, partner,
  no exceptions at any tier).
- **Output-only** (customers consume sequences, predictions,
  embeddings, fold/sim/score/calibration *behavior* via API; never
  the model itself).

What this forbids across every artifact:
- White-label, embed, OEM offerings (any tier).
- Reverse-engineering, weight extraction, distillation, fine-tuning
  by drip, partner, employees, contractors, or any drip customer.
- Architecture disclosure (drip-side specs, marketing, contracts,
  builder docs, investor decks must not describe how the Aurora
  Peptide Stack works internally).
- Standalone NDAs that imply mechanism disclosure under-NDA. Trade-
  secret strategy, not patent strategy. Coca-Cola posture: nobody
  outside Aurora ever sees the formula.

Required canonical phrasing across every public surface:
> drip delivers X via licensed Aurora technology

Forbidden phrasing:
> drip's model does X

## What landed on `phase-0-novelty-gateway` (6 commits)

Branch went 60 → 66 ahead of master. PR #1 still draft. CI re-kicks
on each push, all jobs green.

| Commit | Effect |
|---|---|
| `62924aa` | `docs(specs): ingest Matteo's 2026-04-28 PR #1 unblock reply + license memo`. Both files copied into `~/drip/specs/` next to the existing 8 canonical specs. `specs/README.md` provenance table extended; deferred-action list now reflects the partner-side items from §1, §6, §8, §9, §10 + the license-blocking surface (builder ecosystem, customer contracts, term sheet). |
| `32b4d66` | `refactor(license): atlas-ontology + atlas + decode model framing pass`. 13 instances of "drip's discovery model" in `atlas-ontology.ts` swept to "drip's discovery pipeline". Header comment expanded with the rule. `/atlas` page metadata + openGraph + `/decode` metadata reframed. Pure copy. Discovery = the service drip operates; Aurora owns the underlying model. |
| `0a0f261` | `feat(methodology): rewrite for license compliance + Q2/Q3 unblock answers`. Page rewritten end-to-end. Stale AUROC table removed (six hardcoded numbers from earlier reports — model has stepped into AlphaFold structure-prediction tier per Matteo §2, classifier numbers are stale). New benchmark section names what publishes pre-launch: dataset DOIs (Veltri 2018, PepBenchmark ICLR 2026, AntiCP 2.0, AVP starPep, CASP15-16 + AFDB holdouts), reproducibility CSVs (sequence, model_score, ground_truth_label), structure-track headline metrics (TM-score, lDDT, RMSD). Section 04 reframed as Aurora-owned model card + Zenodo DOI + drip-as-citing-party. Section 05 retitled "what stays with aurora" with full forbidden-modes enumeration. |
| `9ecf864` | `feat(researchers): swap capability matrix to competitor compare (Q10)`. The 7-endpoint feature inventory deleted. Replaced with the 5-axis competitor compare Matteo specified (vendors-to-replicate, unified-pipeline, on-chain-attestable, private-calibration, public-API-pricing) across 8 columns (drip + 7 competitors: Cradle, BioLM, Chroma, ESM3, RFdiffusion, Tamarind, Menten). Bottom kill-shot row: "replicating drip via a competitor stack: roughly $8k to $15k a month, plus six weeks of integration engineering." License-mandated header on the matrix. New `Cell` discriminated union, `Col` interface (was a fragile `as const satisfies` pattern that broke type narrowing — rewritten as a normal interface). |
| `795ffd3` | `feat(researchers): run-based pricing + license framing (Q9 + license memo)`. Seat-based PRICING list deleted. New 5-tier shape (Open Research free / Lab $499 / Biotech $2,499 / Enterprise $25k+$25k setup / DeSci post-launch). Pricing table now 5 cols (tier / who / price / includes / quota), down from 6 (SLA + rebate cols dropped). Hero copy reframed for license compliance. Section 02 retitled "drip vs the field". Section 04 retitled "priced per pipeline run". Section 06 (legal) extended from 4 bullets to 7 to absorb output-only / no-resale / Aurora-licensee clauses. |
| `ff3fe53` | `fix(legal): creator agreement § 5 + § 6 license-conformance`. **Critical fix to a binding contract.** Line 73 had previously claimed drip ownership of "the discovery engine source code, trained models, underlying ip" — every signed creator agreement was a per-creator legal exposure. Section 5 platform-retains bullet rewritten to exclude fine-tuning of the Aurora stack. Section 6 IP bullet split into "drip-owns" (orchestration code, public API, storefront, tools, aggregate platform data) + "aurora-owned, licensed to drip" (weights, architecture, training data, training procedure, the underlying peptide stack itself). Creators now see the license boundary on day one when they click "i agree". |

## Workspace + tests state

- Repo-wide `pnpm -r typecheck` clean.
- 39 web tests pass (39 → 39).
- No tests reference the removed AUROC constants, the prior pricing
  tiers, or the license-violating phrases (grep verified each time).

## Matteo's answers (full reply) — load-bearing

1. **Embedding dim** — final dim NOT 512 (~150 native, may add
   projection layer to 512). Partner side has confirmed brand-text
   encoder also outputs 512-d → preference for Matteo's projection
   layer (path b), keeps registry schema as-is.
2. **/methodology benchmarks** — current AUROCs stale, structure-
   prediction now headline (TM-score / lDDT / RMSD vs CASP15-16 +
   AFDB holdouts). Dataset DOIs + reproducibility CSVs ship pre-
   launch. /methodology now reflects this.
3. **Model card DOI** — Aurora-authored, Zenodo, minted pre-launch.
   drip cites it. drip does NOT mint a drip-branded model card.
4. **Pod /embed live** — no, T-1 day from launch. OpenAPI contract +
   mock server spec delivered ahead so PR #1 can integrate against
   the contract without live infra.
5. **Ontology split timing** — at discovery. `lane ENUM('cosmetic',
   'research', 'clinical') NOT NULL`. Set at sequence creation, no
   defaults, no backfill.
6. **`sequences_claimed` + `sequence_registry`** — migrate to single
   `sequence_registry`, kill `sequences_claimed`. Partner side
   confirmed `sequences_claimed` is in active use (lifecycle repo
   joins through it). Decision still open: drop in PR #1 or one-
   release dual-write first.
7. **Inngest-only** — yes, defer NATS. Confirmed no NATS dep in
   workspace tree (`pnpm-lock.yaml` has zero `nats`-prefixed
   packages).
8. **Spec files location** — move to private GitHub repo
   `drip-specs`. Aurora owns model-side specs, joint on pipeline /
   business specs, partner owns site/UX/frontend/app-backend specs.
   Partner GitHub username: `bludragon66613-sys`.
9. **Researcher pricing** — REJECTED seat model. Approved run-based
   tiers (Lab $499 / Biotech $2,499 / Enterprise $25k+$25k setup,
   Open Research free, DeSci deferred). Already shipped to
   `/for-researchers`.
10. **Capability matrix** — APPROVED swap to competitor compare with
    5 sharper axes + kill-shot bottom row. Already shipped to
    `/for-researchers` Section 02.

## Q11-14 (deferred to second batch)

Matteo deferred these until first batch processes + PR #1 merges:
- Q11. Researcher pod build progress, ETA on 5 endpoints. Q11 needs
  rewording — your earlier 7-endpoint figure was stale per spec
  §4.5; the 5 are generate / predict / embed + two batch endpoints.
- Q12. Auth0 + ORCID — tenant ownership.
- Q13. Email + Haiku vendor parser inbox + key ownership.
- Q14. China CMO shortlist post-WuXi BIOSECURE.

Partner-side reads on Q11-14 already drafted in
`~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md`
so Matteo can scope his second-batch reply.

## Files changed (high-level)

```
NEW:
  specs/DRIP_PR1_UNBLOCK_REPLY.md           (Matteo's reply)
  specs/DRIP_LICENSE_CONSTRAINTS.md         (Matteo's license memo)

EDITED:
  specs/README.md                           (provenance + action list)
  apps/web/lib/atlas-ontology.ts            (13 model→pipeline + header rule)
  apps/web/app/atlas/page.tsx               (metadata sweep)
  apps/web/app/decode/page.tsx              (metadata sweep)
  apps/web/app/methodology/page.tsx         (full rewrite, AUROCs out, Aurora model card in)
  apps/web/app/for-researchers/page.tsx     (pricing swap + hero + section headers + legal extension)
  apps/web/app/for-researchers/_components/capability-matrix.tsx
                                            (full rewrite, 7-endpoint → competitor compare)
  apps/web/app/creator-agreement/page.tsx   (Section 5 + Section 6 license-conformance fix)
```

## Telegram reply ready to send

`~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md`
written. Carries:
- Confirmed brand-text encoder outputs 512-d → preference for
  projection-layer path (b).
- `sequences_claimed` consumers enumerated → ask Matteo whether to
  drop in PR #1 or one-release dual-write first.
- GitHub username for `drip-specs` repo invite.
- §9, §10, §7 explicit approvals.
- Six-commit license-sweep recap so Matteo sees the absorption
  shape across atlas, /decode, /methodology, /for-researchers, and
  /creator-agreement.
- Partner-side reads on Q11-14 to scope his second-batch reply.

## Next session priorities

1. **Push the 6 commits** — branch is local-only on the new commits
   (60 → 66 ahead but origin is at 60 from earlier session).
2. **Send the Telegram reply** — markdown ready in
   `~/Downloads/Telegram Desktop/`. User-side action.
3. **Schema migration plan to user (still open):**
   - Q5: add `lane ENUM('cosmetic','research','clinical') NOT NULL`
     to `sequence_registry`. New migration `0018_lane_enum.sql`.
     Decide: backfill existing rows to 'cosmetic' (current scope) or
     reject migration on non-empty registry.
   - Q6: drop `sequences_claimed`. Requires: rewrite
     `sequence-lifecycle.ts` JOIN, drop the table + 3 indexes + the
     orders FK, and decide between same-PR drop vs one-release
     dual-write. **HIGH-RISK migration. Need user direction before
     implementing.**
4. **Builder ecosystem audit** — `docs/BUILDER_ECOSYSTEM_SOURCE.md`
   needs a license pass: builders consume Aurora *output* through
   drip's API = OK; builders embedding the model = forbidden. Open
   action item from license memo §3.
5. **Aurora ↔ drip license term sheet** — Matteo will draft (9
   clauses, "Licensed Technology" defined-term pattern, Schedule A
   escrow). Lawyer + partner review before PR #1 merges.

## Source-of-truth pointers

- License memo: `~/drip/specs/DRIP_LICENSE_CONSTRAINTS.md`
- Matteo's reply: `~/drip/specs/DRIP_PR1_UNBLOCK_REPLY.md`
- Partner reply (ready to send): `~/Downloads/Telegram Desktop/DRIP_PR1_UNBLOCK_REPLY_FROM_PARTNER.md`
- Phase 0 plan: `~/drip/.planning/phase_000_novelty_gateway_v0/PLAN.md`
- Vercel preview: `https://drip-samples-git-phase-0-nov-78a3bb-bludragon66613-sys-projects.vercel.app`
- PR #1: https://github.com/bludragon66613-sys/Drip/pull/1 (draft)
