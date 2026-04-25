---
name: drip DESIGN.md adoption (Option C pilot)
description: drip pilots google-labs-code/design.md spec. brand/DESIGN.md is the parseable token + 18 component contract; lint runs as the design-mastery pre-build gate. Linter is local-only (devDep not committed) due to Vercel build bloat + auto-revert bot.
type: project
---

# drip DESIGN.md adoption (Option C pilot) — 2026-04-25

## What changed

`brand/DESIGN.md` (drip repo) is now the canonical token + component contract for drip frontend work. Authored from `brand/BRAND.md` §3-§4 + `apps/web/app/globals.css @theme` block. YAML frontmatter holds tokens; markdown body holds 8 canonical sections (Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts).

Lint passes 0/0/1 (12 colors, 15 type, 2 rounded, 6 spacing, 18 components). One contrast warning surfaced on author + got fixed: `status-error` text changed from `surface` (white-on-#FF3B30, 3.55:1) to `primary` (ink-on-#FF3B30, 5.0:1).

Drift report at `brand/DESIGN.drift.md` documents the naming gap between brand-native runtime tokens (`paper`, `ink`, `red-accent`) and DESIGN.md spec-recommended names (`surface`, `primary`, `tertiary`). Runtime CSS class names are unchanged. Tailwind export at `brand/DESIGN.tailwind.json` is reference-only (no auto-apply).

## The pre-build gate (effective immediately)

Before dispatching super-designer to any drip frontend surface, design-mastery must:

1. **Read `brand/DESIGN.md`** as the authoritative contract. `BRAND.md` is still the lore/voice/copy bible — DESIGN.md does not replace it.
2. **Run lint:**
   ```bash
   node ~/drip/node_modules/@google/design.md/dist/index.js lint ~/drip/brand/DESIGN.md
   ```
   Required: 0 errors. Warnings must either be acknowledged in the taste brief or fixed.
3. **Cross-check emitted output against component contracts** — quarantined colors used outside reserved surfaces (saline outside `/drip`, gold outside token-layer, mint/amber outside `/app/*` telemetry) become contract-level violations, not just brand-bible violations.
4. **Class-name surface unchanged.** super-designer keeps emitting `bg-paper`, `text-ink`, `border-red-accent`. Runtime Tailwind v4 `@theme` in `apps/web/app/globals.css` remains canonical for class names. The drift report documents the mapping.

## Local-only linter

`@google/design.md@0.1.1` is intentionally NOT in `package.json` / `pnpm-lock.yaml`.

**Why:** an auto-revert bot stripped the devDep on 2026-04-25 19:48 because Vercel's frozen-lockfile install rejected the deploy with `ERR_PNPM_OUTDATED_LOCKFILE` (manifest/lockfile mismatch from a prior incomplete `pnpm add`). Adding it back triggers ~117 transitive packages on every Vercel build for a design-time-only tool.

**How agents run lint going forward:**
- Preferred: `node ~/drip/node_modules/@google/design.md/dist/index.js lint brand/DESIGN.md` (works on Rohan's machine while node_modules entry persists).
- Fallback: `pnpm dlx @google/design.md@0.1.1 lint brand/DESIGN.md` (downloads on demand, doesn't persist to manifest).

**Future fix paths:**
- Wire lint into a CI workflow that runs outside Vercel.
- Move the tool into a separate workspace not built by Vercel.
- Wait for spec to leave alpha and decide whether bundling is worth it.

## Why this matters for the design-mastery loop

- **Pre-build catch.** The /app/products amber-on-error mistake from session 1 would now be caught at lint/contract time before super-designer writes a line of TSX. The contrast-ratio rule also caught a contrast bug we wouldn't have found by eye.
- **Diff regression check available.**
  ```bash
  node ~/drip/node_modules/@google/design.md/dist/index.js diff brand/DESIGN.md.prev brand/DESIGN.md
  ```
  Exit code 1 on any token-level regression. Wire into the post-edit step when we change BRAND tokens.
- **Tailwind theme exportable.** `brand/DESIGN.tailwind.json` regenerates from spec; we can later wire build-time diff against `globals.css` to fail builds on undocumented drift.

## What did NOT change

- `brand/BRAND.md` — untouched. Voice, lore, copy, motion semantics, designer brief stay there.
- `apps/web/app/globals.css` — untouched. Runtime Tailwind v4 `@theme` is canonical for class names.
- Motion / ease tokens — DESIGN.md spec at v0.1.1 has no motion section. globals.css keeps `--motion-instant/fast/normal/slow/hero` and ease curves.
- Instrument Serif basement font — prose explicitly excludes from token contract so agents don't use it on platform surfaces.

## Watch-list

- DESIGN.md spec is alpha. Re-evaluate on every minor bump. Schema changes will require regenerating `brand/DESIGN.md` from BRAND.md and re-linting.
- If creator-facing storefronts ship with per-creator DESIGN.md files, this drip platform DESIGN.md becomes a parent contract — figure out inheritance pattern.
- If a second platform launches (kaneda eye, drip mobile), introduce a sister DESIGN.md or a motion extension.
