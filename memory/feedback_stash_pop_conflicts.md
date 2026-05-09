---
name: Resolve stash pop conflicts before staging
description: After `git stash pop` produces an AA/DU/UU conflict, never just `git add` the path — verify clean text content first
type: feedback
originSessionId: 9e6a37ce-3490-4e6f-9069-a7defc600113
---
When `git stash pop` reports a conflict (status codes `AA`, `DU`, `UU`, `UD`, etc.), running `git add <path>` accepts the file as-is, conflict markers and all. Git treats the stage operation as "user finished resolving" — there is no syntactic check that `<<<<<<<` markers are gone.

Concrete failure mode (SSquare project, 2026-05-10): switched branches mid-edit, stashed, popped on the new branch, hit `AA components/hero-video.tsx`. I ran `git add components/hero-video.tsx public/projects/club-emporio.mp4` and committed. The committed file contained five unresolved conflict regions. Vercel's clean build failed with `Merge conflict marker encountered`. Cost: extra commit to undo, broken production deploy attempt, lost minutes.

**Why:** `git add` on a conflicted file marks it resolved without inspecting content. Pre-commit hooks (if any) often skip whitespace/marker checks. Compounded by Next.js build cache (`.next/`) which can succeed locally despite the markers — see `feedback_nextjs_build_cache.md`.

**How to apply:**
After ANY operation that may produce conflicts (`git stash pop`, `git merge`, `git rebase`, `git cherry-pick`, `git pull`):
1. Run `git status` and check for conflict status codes (`UU`, `AA`, `DU`, `AU`, `UA`, `UD`, `DD`).
2. Before `git add`, scan the file: `grep -nE '^(<<<<<<<|=======|>>>>>>>)' <path>`. Empty output = safe to stage.
3. For binary files in conflict, decide explicitly: `git checkout --ours <path>` or `--theirs <path>` rather than `git add`.
4. After staging, re-run the grep on the working tree and on the staged blob (`git show :<path> | grep ...`).
