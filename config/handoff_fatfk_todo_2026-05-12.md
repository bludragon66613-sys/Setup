---
name: fatfk pending todo handoff
date: 2026-05-12
type: handoff
---

# fatfk — Pending TODO (as of 2026-05-12)

**Repo:** [bludragon66613-sys/fatfk](https://github.com/bludragon66613-sys/fatfk)
**Master HEAD:** `754edfd` (PR #24 — rebrand stragglers swept; full PR #16-#24 chain shipped)
**Prod:** https://fatfck-store.vercel.app — deployed, `/api/health` returns **503** (13 envs missing)

---

## Recently merged (2026-05-12 session)

| # | Title | Master SHA |
|---|---|---|
| [#17](https://github.com/bludragon66613-sys/fatfk/pull/17) | fix(store): enforce US zip + state format in checkout schema | 83b884c |
| [#18](https://github.com/bludragon66613-sys/fatfk/pull/18) | fix(security): close TOCTOU race in coinbase webhook | d16f489 |
| [#19](https://github.com/bludragon66613-sys/fatfk/pull/19) | feat(store): stock-level badge + prominent HPLC % on cards | b6f26b3 |
| [#20](https://github.com/bludragon66613-sys/fatfk/pull/20) | feat(store): catalog search, sort, pagination | d8ed2e5 |
| [#21](https://github.com/bludragon66613-sys/fatfk/pull/21) | feat(store): reconstitution calculator at /reconstitution | 5e8a64f |
| [#22](https://github.com/bludragon66613-sys/fatfk/pull/22) | feat(store): /faq + /contact pages | 2911651 |
| [#23](https://github.com/bludragon66613-sys/fatfk/pull/23) | feat(store): /wholesale + /policy pages | 369f5b0 |

No open PRs remain. Master HEAD: `369f5b0`.

---

## User-only ops (blocks prod launch)

### 1. Set 13 Vercel production envs
URL: https://vercel.com/bludragon66613-sys-projects/fatfck-store/settings/environment-variables

```
DATABASE_URL=postgres://...                    # Neon project
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
Optional: `SHIP_FROM_STREET2`, `SHIP_FROM_COUNTRY` (default `US`), `SHIP_FROM_PHONE`.

### 2. Provision DB schema (after envs set + redeploy)
```bash
cd ~/fatfk/store && npm run db:push
```
Applies: `admin_login_attempts` table (PR #4) + index (PR #12) + `skus.length_mm`/`width_mm`/`height_mm` (PR #6).

### 3. Seed (first-time prod only)
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
Resend dashboard → verify `fatfck.com` so `orders@fatfck.com` can ship.

### 6. Merge open PRs (#17, #18)
Both squash-merge to master once you've reviewed.

### 7. Delete stale remote branch
```bash
gh api -X DELETE repos/bludragon66613-sys/fatfk/git/refs/heads/phase-1-identity
```
(carries duplicate logo commits from earlier confusion; destructive)

---

## Deferred code follow-ups (non-blocking, ship anytime)

- **PR #12 follow:** Vercel log alert on `[cron/cleanup] failed` (operational — needs Vercel UI rule or in-code webhook ping)
- **order-code length:** 31^6 ≈ 887M codes; consider 7-char if order volume justifies. Post-launch optimization.

---

## Architecture cheatsheet (for fresh agent)

- **Stack:** Next.js 16 App Router + Drizzle ORM (neon-http) + Neon Postgres + Tailwind 4 + jose JWT cookie auth
- **Tests:** vitest in `store/` (`npm test`) — currently 96 on master, 105 on #17 branch
- **Auth gate:** `store/src/proxy.ts` matchers `/admin/:path*` + `/api/admin/:path*` (cookie). `/api/cron/cleanup` is bearer-only, outside the gate.
- **DB:** Drizzle push-style (`npm run db:push`); no SQL migrations checked in. Apply after any schema change merge.
- **Branding rules:**
  - Display everywhere → `FAT F*CK`
  - Ad/media restricted → `FAT FK` (use `censored-paper.svg` / `censored-signal.svg`)
  - Domain/email/repo unchanged → `fatfck.com`, `orders@fatfck.com`, repo `fatfk`
- **Title template:** `layout.tsx` sets `%s / FAT F*CK`. Page metadata titles do NOT include the brand.
- **Rate-limit semantics (PR #11):** every login attempt inserts as `success=false`, flips to `success=true` only on password match.
- **IP hashing (PR #4):** HMAC-SHA256 with derived subkey via label `admin-login-ip-rate-limit`.

---

## Resume invocation (paste into fresh session)

```
Continue fatfk work. Read ~/.claude/projects/-Users-tetsuo/memory/handoff_fatfk_todo_2026-05-12.md and project_fatfk.md for full state. Master HEAD ebdfdf4, two PRs (#17, #18) open and CI-green, prod at https://fatfck-store.vercel.app awaiting Vercel envs + db:push. Pick up from the 7-step user-ops checklist or any deferred code item.
```
