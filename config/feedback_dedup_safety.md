---
name: Dedup safety — always readlink before delete
description: Never delete one of two "identical" paths without verifying neither is a symlink to the other (or hardlinked); inode match alone is not enough.
type: feedback
---

When two paths look like duplicates, before deleting one of them:

1. Run `ls -la <path>` and `readlink <path>` on **both sides** to check for symlinks.
2. Run `stat -f "%i" <file>` on a sample file to check inode equality — but a matching inode doesn't mean independent dupes; it means either symlinked (one resolves to the other) or hardlinked (deleting one still removes a reference). 
3. If either side is a symlink, deleting it is fine. Deleting the *target* of the symlink is destructive even though `diff -rq` shows zero difference.
4. `diff -rq A B` where A or B contains a symlink to the other will return empty (comparing path to itself via resolution). Empty diff is NOT sufficient proof of independence.
5. Safer pattern: `mv` to a temp/archive location first, verify the "other" copy still works, then delete from archive after a delay.

**Why:** On 2026-05-14, I (Claude) deleted `~/Joff` while believing `vault/Joff` was an independent copy. `vault/Joff` was actually a symlink TO `~/Joff`, so deleting `~/Joff` orphaned the symlink and lost ~16MB of content (memes recoverable from OpenClaw skill, tweets-corpus.json/txt lost permanently — though re-derivable from restored .ids.txt). Inode match + empty diff misled me. Time Machine was off; no backup recovery.

**How to apply:** Before any `rm -rf` on a "duplicate" directory:
- `readlink <path>` on both sides
- `ls -laL <path>` to follow symlinks
- If the diff used `-r` and showed empty, treat with extra suspicion — verify it's not symlink-induced false equivalence
- For destructive ops on user data, prefer `mv` to `~/Archive/` over `rm -rf` so user retains recovery window

This applies to any "I found a dupe, can I delete?" decision. Always verify the symlink direction first.
