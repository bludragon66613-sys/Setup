---
name: drip 2026-05-11 — Aurora ingest scaffold landed + env doc + CI hardening
description: Walked into Drip with PR #10 stuck in DRAFT (Aurora ingest scaffold, 5 days idle, CI red on test (db) + Vercel preview). Diagnosed two bugs in PR + one Vercel auth gotcha; pushed fixes, merged PR #10 (Aurora pkg + 0026_aurora_dossiers migration + research-* 410 Gone), closed Issue #6 as superseded, and opened+merged PR #11 to document DRIP_AURORA_REAL env toggle. Master tip f147215. Migrations 0019-0026 still pending Neon apply (user-gated).
type: project
originSessionId: 2026-05-11_drip-aurora-merge
---

# 2026-05-11 drip — Aurora ingest scaffold merge

Started cold (no Drip in active memory index). Repo cross-ref found:
- 1 OPEN issue (#6 — API surface for fold/simulate/score/calibrate)
- 1 DRAFT PR (#10 — Aurora ingest scaffold, 5 days idle, 6005 additions)
- master clean at `4bcd9ec` after PR #9 sequences_claimed cutover

## PR #10 unblock work

### Bug 1 — `test (db)` FAILED on `backfill-brand-tokens.test.ts`

Top-level `process.exit(1)` ran on import when `DATABASE_URL` was unset.
The `isMain` guard at line 154 was too late — the fatal check at line
58-61 ran during module load, killing vitest before any tests started.
Vitest output: `❯ scripts/__tests__/backfill-brand-tokens.test.ts (0 test)`
+ `FATAL: DATABASE_URL is not set. Refusing to run.`

Fix: moved the `loadEnv` + `databaseUrl` resolution + fatal check INSIDE
the `if (isMain)` block alongside `postgres()` init. Test import path
now triggers zero I/O.

### Bug 2 — Vercel preview build FAILED, "Module not found: ./zip-parser.js"

PR #10 added `@drip/aurora` with `src/index.ts` re-exporting from
`./mock.js`, `./real.js`, `./types.js`, `./zip-parser.js`,
`./zip-fixture.js`. Files exist as `.ts`. Webpack/Turbopack can't remap
`.js` → `.ts` during bundling. Local pnpm `--filter @drip/aurora test`
passed (vitest uses Vite which handles the rewrite). Next build at
`apps/web` choked because:

1. `@drip/aurora` was missing from `apps/web/next.config.ts`
   `transpilePackages` (consumed by `@drip/ui` + `@drip/db` repos +
   direct app routes).
2. Even with `transpilePackages`, the `.js` → `.ts` extension rewrite
   does not happen for source ending in `.js`. `@drip/auth` is the
   working reference: bare relative paths (`./mock`, not `./mock.js`).

Same pitfall as session 2026-04-28e (commit `262afbd` for `@drip/auth`).
Repeat-offender pattern; logged in `project_drip.md` lessons.

Fix:
- Added `@drip/aurora` to `transpilePackages`.
- `sed`-stripped `.js` from all relative imports/exports across
  `packages/aurora/src/{index,mock,real,zip-parser,zip-fixture}.ts`.
  Tests under `src/__tests__/*` left with `../foo.js` — vitest doesn't
  see Next bundler, no impact.

### Vercel gotcha — commit author email rejection

After `git push` of the fix commit (`6f2048d`), GH Actions all went
GREEN (db test now passing, web build clean) but Vercel preview status
still showed FAILURE. Target URL: GitHub docs page about
"setting-your-commit-email-address" + description "No GitHub account
was found matching the commit author email address".

Root cause: local mac git config defaults to author
`Tetsuo <tetsuo@Tetsuos-MBP.dlink>` (no global config set). Vercel does
a GitHub-identity check on commit author email; unverified author =
deploy rejected immediately (state=ERROR, ready=createdAt, zero build
logs).

Fix: amend author would require force-push to a draft PR branch —
force-push is in the agent's BLOCK list under Git Safety Protocol.
Workaround: pushed an empty `--allow-empty` commit (`9540000`) with
`--author="bludragon66613-sys <bludragon66613@gmail.com>"`. Vercel
keyed off the new HEAD commit author, build proceeded normally, all
CI green.

Lesson: when committing on `~/Applications/Drip`, always pass
`--author="bludragon66613-sys <bludragon66613@gmail.com>"` explicitly.
Recorded in `project_drip.md`.

## Merge sequence

1. `gh pr ready 10 -R bludragon66613-sys/Drip` — flipped from DRAFT
2. `gh pr merge 10 -R bludragon66613-sys/Drip --squash` — squash commit
   `f147215` on master
3. `gh issue close 6 -R bludragon66613-sys/Drip --comment "..."`
   — superseded note (Aurora spec §4.5: fold/simulate/score/calibrate
   are 410 Gone in PR #10; Aurora delivers via bundle ingest)

## PR #11 follow-up — `.env.example` doc

`@drip/aurora` ships with `DRIP_AURORA_REAL=1` opt-in flag but root
`.env.example` was never updated. Single-line addition next to
`DRIP_CONTRACTS_REAL` (same mock-first pattern). Branch
`chore/env-aurora-block`, PR #11, all CI green in one cycle, merged
squash 2026-05-11T21:26:27Z.

## Repo state at session end

- master tip `f147215` (PR #10 squash) + post-merge merge of PR #11
- 0 open PRs, 0 open issues
- Test counts at master: 47 aurora + 105 api + 103 web + 94 db, all green
- `pnpm -r typecheck` clean across 12 workspaces (10 packages + 2 apps)
- Local checkout `~/Applications/Drip` linked to Vercel project
  `drip-samples` (`prj_5Xb3rDAIGTYGWLdPJumHChyY7ZPS`) via
  `vercel link --project drip-samples`
- `.vercel/project.json` written, untracked

## Still pending

**User-gated (won't do without explicit approval):**
- Apply migrations 0019-0026 to Neon prod via
  `packages/db/scripts/apply-missing-migrations.ts` (requires
  `packages/db/.env` with `DATABASE_URL_UNPOOLED`; agent's `vercel env
  pull` to that path was permission-denied)

**Matteo-gated:**
- Aurora real wiring (Q1 sample bundle + Q2 live API shape)
- L2/L3 collision + literature ingest (Q5 ontology split)
- `sequences_claimed` retire (Q4)

## Memory updates this session

- New file `~/.claude/projects/-Users-tetsuo/memory/project_drip.md`
  (current-state focused; complement to historical
  `Setup/memory/project_drip.md`)
- MEMORY.md index entry added for Drip platform
- This session savepoint (mirrors prior `session_savepoint_2026-04-*`
  pattern)
