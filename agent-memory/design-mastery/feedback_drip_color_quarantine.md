---
name: drip color quarantine — BRAND.md §3
description: drip's reserved color tokens are hard-quarantined to specific surfaces. Using them elsewhere is a bug, not a style choice.
type: feedback
---

BRAND.md §3 post-2026-04-18 quarantines these tokens strictly:

- `--color-amber` (#F59E0B): in-progress / warning, telemetry surfaces only (`/app/*` telemetry panels). Never on general error states.
- `--color-saline` (#00D4FF): `/drip` basement page only.
- `--color-mint` (#00E5A0): success state inside `/app/*` telemetry only.
- `--color-gold` (#FFB800): $DRIP-layer surfaces only (`/drip`, `/stake`, `/markets`, etc.)
- `--color-stone-800` (#1A1A1A): `/drip` + creator dark mode only.

Platform surfaces (all `/app/*` routes that are NOT telemetry-specific) use only: `--color-paper`, `--color-ink`, `--color-rule`, `--color-red-accent`, `--color-stone-500`, `--color-stone-200`.

**Why:** Caught in 2026-04-24 audit — `--color-amber` was used for error feedback on `/app/products`. Amber reads as "in-progress" per the brand system, not "error." The correct error signal on platform surfaces is `--color-red-accent` (one use per viewport max).

**How to apply:** Before any new `/app/*` component, check every color reference against this list. If it's a quarantined token on a non-quarantined surface, replace it. The audit catches this as a brand-alignment deduction.
