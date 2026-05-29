---
name: fatfk (FAT FCK) repo
description: Research-peptide brand + Next.js store. Repo bludragon66613-sys/fatfk. Default branch on GitHub is the stale phase-1-identity; canonical line of dev lives on master.
type: project
---

# fatfk / FAT FCK

**Repo:** [bludragon66613-sys/fatfk](https://github.com/bludragon66613-sys/fatfk) (private, single `c` in repo name; product spelling is two-c "FAT FCK").

**Local clone:** `~/fatfk` (clone on demand; not part of startup services).

## Branch reality
- `master` — canonical (44 commits, Phase 1 brand identity + Phase 2.0 store)
- `phase-1-identity` — **stale**, is the GitHub default-branch pointer (causes `git clone` to land here). Contains old logo/manifesto state. Holds duplicate commit `b66437a` (logo SVGs I authored before noticing master had them).
- `phase-1-design-assets`, `ship-v1.0` — archived

**Why:** Bug to fix on GitHub: set default branch to `master`, delete `phase-1-identity` (requires user OK — destructive).

## Stack
- **Phase 1** (shipped, v1.0-identity): brand bible single-file HTML + Playwright PDF render; logos as SVG (no Adobe outlines yet, Neue Haas pending purchase); copy deck; vial label, box dieline, COA insert as SVG/HTML.
- **Phase 2.0 store** at `store/`: Next.js 16, Drizzle ORM + Neon, Coinbase Commerce, Resend, EasyPost, jose JWT auth (admin + magic-link order auth), Tailwind. `store/src/proxy.ts` gates `/admin/*` and `/api/admin/*` via signed cookie.

## Required envs (store/)
`DATABASE_URL`, `COINBASE_COMMERCE_API_KEY`, `COINBASE_COMMERCE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_FROM`, `NEXT_PUBLIC_SITE_URL`, `ORDER_TOKEN_SECRET`, `ADMIN_SESSION_SECRET`, `ADMIN_PASSWORD`, `EASYPOST_API_KEY`, `SHIP_FROM_NAME`, `SHIP_FROM_STREET1`, `SHIP_FROM_CITY`, `SHIP_FROM_STATE`, `SHIP_FROM_ZIP`. Optional: `SHIP_FROM_STREET2`, `SHIP_FROM_COUNTRY` (default US), `SHIP_FROM_PHONE`.

Generate secrets: `openssl rand -hex 32`.

## Workflow
- Pushing directly to `master` is blocked by hook → always work on feature branch, open PR with `gh pr create --base master`.
- DB is Drizzle push-style (`npm run db:push`); no SQL migrations checked into repo. After any schema change merge, run `db:push` against prod Neon to apply.
- Test runner: `vitest` for store (`npm test` in `store/`). Phase 1 brand site uses Playwright tests at repo root (`npm test`).
- Pre-existing flake: `order-token` / `admin-token` "rejects a tampered token" used `slice(-1) + flip A/B` — HS256 sig last char only encodes 2 bits, so often a no-op. Fix: replace whole sig with same-length 'A's. Fixed in PR #7.

## Open follow-ups (savepoint 2026-05-12 + observed)
- Resend domain verify (`orders@fatfck.com`) — operational, Resend dashboard
- **Vercel prod envs still unset** — `/api/health` returns 503 `13 required env var(s) missing`; user-only ops from handoff_fatfk_2026-05-11.md
- Stale `phase-1-identity` remote branch (destructive delete, needs user OK)
- No CI workflow in `.github/workflows`; only Vercel preview comments
- (resolved 2026-05-11) Git config: local user.name/email set to `bludragon66613-sys` / `bludragon66613@gmail.com`; Vercel author-email warning silenced
- (resolved 2026-05-12) Graceful DB-error pattern extended from /catalog to 4 other public routes — PR #16

## Post-2026-05-11 session merges (9 PRs landed on master)
- #7 deterministic JWT tamper test (kill ~1/5 flake) — 1e9e702
- #9 drop order-code uniqueness sample 10k → 1k (kill ~5.6% birthday flake) — 206c9f7
- #8 /api/health endpoint (env + db reachability, 10s edge cache) — e0fc644
- #5 EasyPost ship-from address from SHIP_FROM_* env — b5df6bd
- #4 rate-limit admin login (5 fails / 15 min per IP-hash; uses x-vercel-forwarded-for) — 5b17d88
- #6 per-SKU parcel dimensions for EasyPost rates — 24f3589
- #10 /api/health includes SHIP_FROM_* in required-env check
- #11 close TOCTOU race in admin-login rate limiter (atomic CTE INSERT+COUNT)
- #12 admin observability dashboard + cron-driven login-attempts cleanup (autopilot run)
- #13 rebrand display wordmark `FAT FCK` → `FAT F*CK` across site + bible (45 files; censored variant `FAT FK` preserved for ad/media)
- #15 catalog graceful DB-error empty state + drop duplicated brand from page titles — 0da4181
- #16 extend graceful DB-error pattern to catalog/[category], sku/[code], coa/[lot], order/[code] via shared `Unavailable` component — ebdfdf4

Repo default branch flipped phase-1-identity → master.

### Brand spelling rules (after #13)
- **Display everywhere** (web, brand bible, packaging, copy, logo wordmark SVG, page titles, admin UI): `FAT F*CK`
- **Censored ad/media** (Meta, Google, profanity-restricted placements): `FAT FK` (use `censored-paper.svg` / `censored-signal.svg`)
- **Domain + email + filenames + repo**: unchanged — `fatfck.com`, `orders@fatfck.com`, `fatfck-brand-bible.html`, repo `bludragon66613-sys/fatfk` (single `c` historic)

### Test counts
71 → 96 vitest tests across 12 files. tsc/build always green on master.

### Post-merge ops needed
- `cd store && npm run db:push` — provisions `admin_login_attempts` table (#4) + adds `length_mm`/`width_mm`/`height_mm` columns to `skus` (#6); existing rows pick up safe defaults
- Set `SHIP_FROM_*` envs in Vercel (prod + preview) — until set, the admin "ship cheapest label" action throws "Missing required ship-from env vars"
- Smoke /api/health on prod — should return 200 with `{ ok: true, env: "ok", db: "ok" }`

### Known deferred (not yet PRed)
- PR #4: cleanup job for stale admin_login_attempts rows (needs Vercel cron / GH Action)
- PR #5: state/zip format check (validate US zip 5/9-digit, state 2-letter)
- Stale remote branch `phase-1-identity` (carries b66437a duplicate logos; safe to delete — destructive, needs user OK)

## Useful paths
- Plan: `docs/superpowers/plans/2026-05-03-fatfck-brand-identity.md`
- Spec: `docs/superpowers/specs/2026-05-03-fatfck-brand-design.md`
- Bible v2 sources: `bible-v2/`
- Store README: `store/README.md` (has full env list + setup steps)
