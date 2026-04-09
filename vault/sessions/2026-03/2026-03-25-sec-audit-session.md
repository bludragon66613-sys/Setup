# Session: 2026-03-25

**Started:** ~7:12am IST
**Last Updated:** 7:23am IST
**Project:** ~/aeon (NERV_02 dashboard)
**Topic:** Security audit and fix of dashboard API routes + openclaw-proxy

---

## What We Are Building

Security hardening pass on the NERV_02 autonomous agent dashboard (`~/aeon/dashboard/`).
The dashboard runs locally at localhost:5555, exposes API routes for triggering GitHub Actions skills,
managing secrets, chatting with Claude via NERV, and operating a multi-agent agency system.
A security agent audited the codebase and found 22 issues across 4 severity levels.
This session fixed 9 of the most critical/exploitable ones.

---

## What WORKED (with evidence)

- **Removed hardcoded JWT secret fallback** — `lib/auth.ts` now throws at startup if `DASHBOARD_SECRET` is unset. Confirmed: file rewritten and committed.
- **Added password gate to `/api/auth/token`** — now requires `DASHBOARD_PASSWORD` env var and matching body field before issuing a JWT. Confirmed: committed.
- **Fixed shell injection in skills/run route** — replaced `execSync(templateString)` with `execFileSync('gh', args[])`. Confirmed: committed.
- **Fixed shell injection in rnd route** — same `execFileSync` fix. Confirmed: committed.
- **openclaw-proxy fails closed** — changed `if (!SECRET) return next()` to `return res.status(503)`. Confirmed: committed.
- **Added auth to `/api/runs/[id]/logs`** — was publicly accessible. Confirmed: committed.
- **Added auth to `/api/skills/[name]/run`** — was publicly accessible. Confirmed: committed.
- **Path traversal fix in upload route** — added `path.posix.normalize` check that skips `..` and absolute paths. Confirmed: committed.
- **`git add -A` narrowed to explicit paths** — sync route now does `git add aeon.yml skills/`. Confirmed: committed.
- **Security headers added to `next.config.ts`** — CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`. Confirmed: committed.
- **All 9 fixes in one commit** — `git commit 25a597e` on `main` branch of `~/aeon`.

---

## What Did NOT Work (and why)

- **Auditor claimed `dashboard/.env.local` was git-tracked** — false positive. Running `git ls-files --cached | grep env` showed only `.env.example` and `next-env.d.ts` are tracked. `.env.local` was never committed.
- **`replace_all` on variable names** — using `replace_all: true` on the string `SECRET` in `lib/auth.ts` accidentally mangled `DASHBOARD_SECRET` to `DASHBOARD__SECRET` and created a mess. Fixed by rewriting the file with `Write` tool instead.

---

## What Has NOT Been Tried Yet

These are the **unfixed issues** from the audit (11 remaining, lower priority):

- **CRITICAL-04: No rate limiting** — All 24 API routes have zero rate limiting. `/api/auth/token`, `/api/nerv`, `/api/agency/dispatch` are most dangerous. Needs middleware or per-route limiter.
- **HIGH-04: Prompt injection via `activationPrompt`** — `agency/dispatch/route.ts` passes raw caller-supplied prompt to AI agents (including `hl-trade`). No content validation or length cap.
- **HIGH-05: Unvalidated message history in `nerv/route.ts`** — No max message count, no length cap, `role: 'assistant'` can be spoofed by client to manipulate model context.
- **HIGH-07: Arbitrary GitHub repo fetch in `import/route.ts`** — `repo` param used directly in GitHub API calls, no allowlist. Could write malicious skill content to the repo.
- **MEDIUM-03: Raw system error messages returned to client** — Multiple routes forward `error.message` directly. Should log server-side and return generic message.
- **MEDIUM-04: classify cache not scoped per-user** — Cache keyed by caller-supplied `idempotencyKey`, no user binding, no size cap.
- **MEDIUM-05: `/api/status` returns hardcoded static data** — No auth, always returns green. Not a vuln but misleads monitoring.
- **MEDIUM-06: LLM error messages streamed raw to browser** — `nerv/route.ts` streams Anthropic errors directly.
- **MEDIUM-07: JWT TTL is 24h with no revocation** — No refresh flow, no session binding, no invalidation mechanism.
- **LOW-03: Real config values in historical git commits** — `.env.example` in early commits had real `GITHUB_REPO` slug. Low risk.
- **LOW-04: No input length caps before AI/API calls** — `intent` in classify, messages in nerv, etc.

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `dashboard/lib/auth.ts` | ✅ Fixed | Hardcoded secret removed, fails hard at startup if DASHBOARD_SECRET unset |
| `dashboard/app/api/auth/token/route.ts` | ✅ Fixed | Now requires DASHBOARD_PASSWORD in body |
| `dashboard/app/api/skills/[name]/run/route.ts` | ✅ Fixed | execFileSync + requireAuth added |
| `dashboard/app/api/rnd/route.ts` | ✅ Fixed | execFileSync for POST shell dispatch |
| `dashboard/app/api/runs/[id]/logs/route.ts` | ✅ Fixed | requireAuth added |
| `dashboard/app/api/upload/route.ts` | ✅ Fixed | Path traversal check added |
| `dashboard/app/api/sync/route.ts` | ✅ Fixed | git add -A → git add aeon.yml skills/ |
| `dashboard/openclaw-proxy/index.js` | ✅ Fixed | Fails closed when SECRET unset |
| `dashboard/next.config.ts` | ✅ Fixed | Security headers added |
| `dashboard/app/api/agency/dispatch/route.ts` | ⚠️ Unfixed | HIGH-04: raw activationPrompt injection |
| `dashboard/app/api/nerv/route.ts` | ⚠️ Unfixed | HIGH-05: no message validation |
| `dashboard/app/api/import/route.ts` | ⚠️ Unfixed | HIGH-07: arbitrary repo fetch |
| All 24 API routes | ⚠️ Unfixed | CRITICAL-04: no rate limiting |

---

## Decisions Made

- **Fix the exploitable code-path vulns first, leave config/monitoring issues for later** — rate limiting, error message sanitization, and JWT rotation are real issues but not remotely exploitable on a localhost dashboard with auth now gating token issuance.
- **DASHBOARD_PASSWORD is a new required env var** — the login flow now needs it set in `.env.local`. Without it the token endpoint returns 503.
- **Did not push to remote** — committed locally only. Push when ready.

---

## Blockers & Open Questions

- **User must set `DASHBOARD_PASSWORD` in `.env.local`** before the dashboard login works again. Without it, `/api/auth/token` returns 503.
- **User must verify `DASHBOARD_SECRET` is set** in `.env.local` — server crashes at boot if missing.
- The trendwatching.com page that appeared in OpenClaw terminal was likely a broken URL in an RSS/digest skill feed. No security implication but worth checking which skill fetched it.

---

## Exact Next Step

1. Add to `~/aeon/dashboard/.env.local`:
   ```
   DASHBOARD_PASSWORD=<choose-strong-password>
   DASHBOARD_SECRET=<if-not-already-set: openssl rand -hex 32>
   ```
2. Restart the dashboard (`pm2 restart` or `npm run dev`) and verify login works.
3. If continuing security fixes, tackle rate limiting next — add middleware to Next.js `proxy.ts` or use a library like `express-rate-limit` equivalent for Next.js.

---

## Environment & Setup Notes

- Dashboard runs at `localhost:5555` via PM2
- openclaw-proxy runs at `localhost:5557`
- OpenClaw gateway runs at `localhost:18789`
- Current model: `openai-codex/gpt-5.4` (Claude auth expired, see `memory/project_openclaw.md`)
- Auth refresh batch: `C:\Users\Rohan\refresh-openclaw-auth.bat`
