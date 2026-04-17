# design-md-extract

Headless CLI that extracts design tokens from any live URL and emits a `DESIGN.md` and/or `SKILL.md` in the [TypeUI](https://www.typeui.sh/design-md) format.

Ports the extraction and markdown-generation logic from [bergside/design-md-chrome](https://github.com/bergside/design-md-chrome) (MIT) and runs it under headless Chromium via Playwright, so it works without a browser UI. Feeds the `super-designer` agent's BRAND REFERENCE SYSTEM by generating fresh references on demand.

## Install

Already installed at `~/tools/design-md-extract/`. Shims on `PATH`:

- `~/bin/design-md` (bash)
- `~/bin/design-md.cmd` (Windows cmd/PowerShell)

To reinstall from scratch:

```bash
cd ~/tools/design-md-extract
npm install
npx playwright install chromium
```

## Usage

```bash
design-md extract <url> [options]
```

### Options

| Flag | Default | Purpose |
| --- | --- | --- |
| `--out <dir>` | `~/.claude/design-references/<hostname>/` | Output directory. `~` is expanded. |
| `--design` | (default both) | Only emit `DESIGN.md`. |
| `--skill` | (default both) | Only emit `SKILL.md`. |
| `--brand <name>` | inferred from page title | Brand/system name to embed. |
| `--audience <text>` | inferred | Target audience line. |
| `--surface <text>` | inferred | Product surface (e.g. "marketing site", "web app"). |
| `--wait <state>` | `networkidle` | Playwright `waitUntil`: `load`, `domcontentloaded`, `networkidle`, `commit`. |
| `--timeout <ms>` | `30000` | Navigation timeout. |

### Examples

Fresh reference for the super-designer library:

```bash
design-md extract https://vercel.com --brand Vercel
# writes ~/.claude/design-references/vercel/{DESIGN.md,SKILL.md}
```

One-off into a project:

```bash
design-md extract https://linear.app --brand Linear --out ./docs/design
```

Only the agent-ready `SKILL.md`:

```bash
design-md extract https://stripe.com --brand Stripe --skill
```

## How it works

1. Playwright launches headless Chromium at `1440x900`.
2. Navigates to the URL and waits for `networkidle`.
3. Injects `vendor/page-extractor.js` — samples up to 280 visible elements and reads computed typography, colors, spacing, radius, shadows, and motion, plus component counts and site signals (meta tags, nav/CTA text, pricing/auth/checkout markers).
4. Feeds the payload through the upstream normalizer (`vendor/normalize.mjs`) to produce canonical token scales.
5. Renders `DESIGN.md` and `SKILL.md` via `vendor/generate-design-md.mjs` / `vendor/generate-skill-md.mjs`.

## Integration with super-designer

The `super-designer` agent's `BRAND REFERENCE SYSTEM` falls back to this CLI when a requested brand is not in `~/.claude/design-references/`. Invoke `design-md extract <url>` to generate a reference on the fly, then the agent loads the file through its normal path.

## Files

```
cli.mjs                       — Playwright-backed CLI entry
vendor/page-extractor.js      — browser-runtime extractor (Chrome API deps stripped)
vendor/normalize.mjs          — upstream, unmodified
vendor/generate-design-md.mjs — upstream, unmodified
vendor/generate-skill-md.mjs  — upstream, unmodified
vendor/validate.mjs           — upstream, unmodified
```

Upstream logic (`normalize`, `generate-*`) is vendored verbatim. Only the browser extractor is rewritten to drop the `chrome.runtime` message wrapper.

## License

MIT, matching upstream.
