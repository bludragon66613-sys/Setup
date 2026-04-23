---
name: rtk filter hides error lines
description: rtk filtering silently drops tsc compilation errors, making green builds look green when they're broken — always spot-check by running plain pnpm/tsc on any diff that touches schemas
type: feedback
originSessionId: 8196452c-4d01-4a9f-8f88-050b160f0ad7
---
`rtk` (Rust Token Killer) filters terminal output to save tokens. In doing so it **drops tsc compilation error lines** — the wrapper prints "TypeScript compilation completed" with no error lines, but exit code is non-zero. A later `pnpm typecheck` without rtk surfaces the actual errors.

**Why:** caught on 2026-04-18 while wiring brand tokens to the drip storefront. After a schema change, `rtk pnpm typecheck` reported "TypeScript compilation completed" so the commit shipped. A later `pnpm typecheck` (no rtk) showed 8 mock-object errors in `brand.test.ts` / `storefront.test.ts` / `checkout/create/route.test.ts` that had been suppressed for multiple runs.

**How to apply:**
- After any change that touches a drizzle schema, `InferSelectModel` type, zod response shape, or any mock fixture — run `pnpm typecheck` (or `pnpm -r typecheck`) at least once **without rtk** before committing.
- Treat rtk-wrapped "green" results as soft signal, not proof.
- Same caution applies to `rtk pnpm -r test` — if it ever looks suspiciously quiet, strip the rtk wrapper and re-run.
- Does not apply to git/ls/simple commands where there's nothing useful to filter anyway.
