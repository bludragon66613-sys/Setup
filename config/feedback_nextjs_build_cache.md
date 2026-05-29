---
name: Next.js build verification needs clean .next
description: rm -rf .next before declaring "build green" — Next.js cache can mask source-level errors including unresolved git conflict markers
type: feedback
originSessionId: 9e6a37ce-3490-4e6f-9069-a7defc600113
---
When verifying a Next.js change with `npm run build`, **always `rm -rf .next` first** if the build is supposed to be a real correctness gate. Running `npm run build` against a populated `.next/` directory can return a clean exit code and a successful route table even when the source has compile-blocking errors.

Concrete failure mode (SSquare project, 2026-05-10): `components/hero-video.tsx` was committed with unresolved git conflict markers (`<<<<<<<` / `=======` / `>>>>>>>`) after a `git stash pop` AA conflict was incorrectly resolved by just `git add`. Local `npm run build` reported success and printed the route table. I pushed and reported "build green." Vercel's clean-checkout build then failed with `Merge conflict marker encountered` and `Build failed because of webpack errors`. Reproduced locally only after `rm -rf .next && npm run build`.

**Why:** Next.js incremental compilation reuses cached chunks under `.next/cache/webpack/` and `.next/server/`. When source changes look "minor" by mtime/size, the affected chunks may not be re-emitted, so the build skips re-typechecking/re-bundling the broken module.

**How to apply:**
- Whenever a build is the verification gate before a commit, push, or "ready to ship" claim — `rm -rf .next` first, then `npm run build`. Treat the cached path as for dev-server speed, not for correctness verification.
- If the user is asking "did this build pass?" — uncached build is the only honest answer.
- After resolving any git conflict (stash, merge, rebase) — also `rm -rf .next` because the prior cache won't represent the resolved file.
