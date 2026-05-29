---
name: fatfk handoff — resume from this snapshot
date: 2026-05-11T21:00Z
type: handoff
---

# fatfk Session Handoff (2026-05-11)

## TL;DR
Store deployed to prod. Rebrand live. Catalog gracefully handles DB-down. **User must provision Vercel envs + run db:push to make the catalog actually load product data.**

## State at handoff

- **Repo:** `~/fatfk` clone synced with `origin/master` HEAD `0da4181` (after PR #15 squash)
- **GitHub default branch:** `master` (was stale `phase-1-identity`, flipped this session)
- **Vercel project link:** `fatfck-store` (prj_ziVQvUDTB9qektS47drUsnG065m7) now linked to `bludragon66613-sys/fatfk` with `rootDirectory=store`. Auto-deploy verified — PR #14 + #15 both triggered correct master builds end-to-end.
- **Local git config:** `user.name = bludragon66613-sys`, `user.email = bludragon66613@gmail.com` (per-repo)
- **Branding rules:** display = `FAT F*CK` (asterisk-censored), ad/media = `FAT FK` (censored variant SVGs untouched), domain/email/repo names = unchanged (`fatfck.com`, `orders@fatfck.com`, `fatfk` repo).

## PRs landed this session (12 total)

| # | Subject | SHA on master |
|---|---|---|
| [#4](https://github.com/bludragon66613-sys/fatfk/pull/4)  | rate-limit admin login (Vercel-IP, HMAC subkey) | 5b17d88 |
| [#5](https://github.com/bludragon66613-sys/fatfk/pull/5)  | EasyPost ship-from env | b5df6bd |
| [#6](https://github.com/bludragon66613-sys/fatfk/pull/6)  | per-SKU parcel dims | 24f3589 |
| [#7](https://github.com/bludragon66613-sys/fatfk/pull/7)  | JWT tamper flake fix | 1e9e702 |
| [#8](https://github.com/bludragon66613-sys/fatfk/pull/8)  | /api/health endpoint | e0fc644 |
| [#9](https://github.com/bludragon66613-sys/fatfk/pull/9)  | order-code birthday flake | 206c9f7 |
| [#10](https://github.com/bludragon66613-sys/fatfk/pull/10) | SHIP_FROM_* in checkRequiredEnv | (post #10) |
| [#11](https://github.com/bludragon66613-sys/fatfk/pull/11) | TOCTOU close on rate-limit (atomic CTE) | 26236f4 |
| [#12](https://github.com/bludragon66613-sys/fatfk/pull/12) | admin observability dashboard + cron cleanup (autopilot) | 3ff92ea |
| [#13](https://github.com/bludragon66613-sys/fatfk/pull/13) | rebrand FAT FCK → FAT F*CK (45 files) | 8e27bd4 |
| [#14](https://github.com/bludragon66613-sys/fatfk/pull/14) | chore: empty commit to trigger Vercel webhook | 8668b20 |
| [#15](https://github.com/bludragon66613-sys/fatfk/pull/15) | catalog graceful DB-error state + strip duplicated brand from titles | 0da4181 |

## **PENDING — user-only ops required**

### 1. Set Vercel production envs

URL: https://vercel.com/bludragon66613-sys-projects/fatfck-store/settings/environment-variables

Current state: **13 required envs missing in prod** per `/api/health` response.

Required:
```
DATABASE_URL=postgres://... (Neon project)
COINBASE_COMMERCE_API_KEY=
COINBASE_COMMERCE_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM=orders@fatfck.com
NEXT_PUBLIC_SITE_URL=https://fatfck-store.vercel.app
ORDER_TOKEN_SECRET=$(openssl rand -hex 32)
ADMIN_SESSION_SECRET=$(openssl rand -hex 32)
ADMIN_PASSWORD=<strong-password>
EASYPOST_API_KEY=
SHIP_FROM_NAME=
SHIP_FROM_STREET1=
SHIP_FROM_CITY=
SHIP_FROM_STATE=
SHIP_FROM_ZIP=
CRON_SECRET=$(openssl rand -base64 32)
```
Optional: `SHIP_FROM_STREET2`, `SHIP_FROM_COUNTRY` (default US), `SHIP_FROM_PHONE`.

### 2. Provision DB schema

After envs set + redeploy + DB reachable:
```bash
cd ~/fatfk/store && npm run db:push
```
This applies:
- New `admin_login_attempts` table (PR #4)
- `admin_login_attempts_attempted_at_desc_idx` (PR #12)
- `skus.length_mm` / `width_mm` / `height_mm` columns (PR #6)
- Any other schema diffs

### 3. Seed (only if first-time prod):
```bash
cd ~/fatfk/store && npm run db:seed
```

### 4. Smoke checks

```bash
curl -i https://fatfck-store.vercel.app/api/health
# expect 200, env=ok, db=ok

curl -sL https://fatfck-store.vercel.app/catalog | grep -oE "<title>[^<]+</title>"
# expect: <title>Catalog / FAT F*CK</title>
```

### 5. Resend domain verify
Resend dashboard → verify `fatfck.com` so `orders@fatfck.com` from-address ships emails.

### 6. Optional cleanup
Delete stale remote branch (carries my duplicate logos from earlier confusion):
```bash
gh api -X DELETE repos/bludragon66613-sys/fatfk/git/refs/heads/phase-1-identity
```

## Known deferred follow-ups (code-level)

- **Other DB-touching public pages** (sku/[code], coa/[lot], catalog/[category], order/[code]) need the same try/catch+empty-state pattern PR #15 applied to /catalog. Currently they will throw the same "something broke" boundary on DB failure.
- PR #5: state/zip format validation (US zip 5/9-digit, state 2-letter).
- PR #12: Vercel log alert on `[cron/cleanup] failed` for observability of cron failures.
- Webhook coinbase TOCTOU on charge:confirmed/failed (spotted but not fixed; medium risk).
- order-code is 31^6 ≈ 887M codes; consider 7-char if order volume justifies (post-launch).

## Architecture cheatsheet (for resumed session)

- **Stack:** Next.js 16 App Router + Drizzle ORM (neon-http) + Neon Postgres + Tailwind 4 + jose JWT cookie auth
- **Test runner:** vitest in `store/` (`npm test`)
- **Auth gate:** `store/src/proxy.ts` matchers `/admin/:path*` + `/api/admin/:path*` (cookie). `/api/cron/cleanup` lives outside, bearer-only.
- **Rate-limit semantics (PR #11):** every login attempt inserts as `success=false`, flips to `success=true` only on password match. `flaggedIpHashes` must filter `success=false`.
- **IP hashing (PR #4):** HMAC-SHA256 with derived subkey via label `admin-login-ip-rate-limit`. Read IP from `x-vercel-forwarded-for` → `x-real-ip` → `x-forwarded-for` (last is spoofable, dev only).
- **Title template:** `layout.tsx` sets `%s / FAT F*CK`. Page metadata titles do NOT include the brand.

## Resume invocation (paste in fresh session)

```
Continue fatfk work. Read ~/.claude/projects/-Users-tetsuo/memory/project_fatfk.md and ~/.claude/projects/-Users-tetsuo/memory/handoff_fatfk_2026-05-11.md for full state. Master HEAD on origin is 0da4181 (PR #15 merged). Prod store at https://fatfck-store.vercel.app — already deployed, env-pending. Pick up from the 6-step user-ops checklist or tackle any deferred code follow-up.
```
