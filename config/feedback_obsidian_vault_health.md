---
name: Obsidian vault stuck loading
description: Recovery recipe when Obsidian hangs on "Loading vault"/"Loading cache" — diagnose symlinks then reset cache. Full post-mortem in vault.
type: feedback
originSessionId: f236be9f-dd17-4d0a-bf90-6aa8295bf7b6
---
If Rohan reports Obsidian stuck on **"Loading vault"** or **"Loading cache"**: Renderer is at ~100% CPU grinding, not actually frozen. Cause is one of two things.

**Diagnostic order:**

1. Check for directory-level symlinks at vault root — Obsidian follows symlinks and will index entire repos including `node_modules`:
   ```bash
   find ~/Documents/Vault -maxdepth 2 -type l -exec sh -c 'test -d "$1" && echo "DIR-SYMLINK: $1 -> $(readlink -f $1)"' _ {} \;
   ```
   `unlink` any offenders. File-level symlinks (`projects/foo.md -> ~/Documents/foo/CLAUDE.md`) are fine.

2. If still hung after relaunch, stale IndexedDB cache is reconciling against the changed vault. Reset (reversible):
   ```bash
   pkill -9 -f Obsidian
   cd ~/Library/Application\ Support/obsidian && TS=$(date +%s)
   mv IndexedDB "IndexedDB.bak.$TS" && mv Cache "Cache.bak.$TS" && mv "Code Cache" "Code Cache.bak.$TS" && mv GPUCache "GPUCache.bak.$TS"
   ```
   Relaunch. Rebuild takes <10s for ~800 md files.

3. If still hung, disable `dataview` plugin (it scans whole vault on launch).

**Why:** Confirmed 2026-05-15 — `Vault/Joff -> ~/Documents/joff` (1.3GB w/ `node_modules`) caused Obsidian Renderer to peg at 102% CPU indefinitely. After fix, stale 45MB IndexedDB caused a second indexing storm on next launch. Cache reset solved it.

**How to apply:** When Rohan says Obsidian is hanging / stuck loading / slow, jump to step 1 immediately. Don't speculate — run the find command and check CPU on Renderer process first. Hard-rule on never directory-symlinking projects into vault lives in `feedback_project_layout.md`.

**Prevention rules:**
- New project setup: file-level symlink only — `ln -s ~/Documents/<project>/CLAUDE.md ~/Documents/Vault/projects/<project>.md`. Never a directory symlink.
- After any mass change to vault structure (delete a folder, rename a top-level dir, remove a symlink), assume the next Obsidian launch may hang on cache reconciliation. Be ready for step 2 (cache reset).
- Don't enable plugins that walk the whole vault on launch (`dataview`, full-text-search-rebuilds) unless needed. They compound indexing cost.
- After clean launches, delete the `.bak.*` cache backups: `rm -rf ~/Library/Application\ Support/obsidian/*.bak.*`

**Vault audit one-liner** — run periodically to catch issues before they hang Obsidian:
```bash
echo "md files:" && find ~/Documents/Vault -type f -name "*.md" | wc -l
echo "dir symlinks:"; find ~/Documents/Vault -maxdepth 3 -type l -exec sh -c 'test -d "$1"' _ {} \; -print
echo "vault size:" && du -sh ~/Documents/Vault
```
Healthy state: ~800-1000 md files, **0 dir symlinks**, vault under ~50MB.

**Incident log (2026-05-15):**
- Cause: `Vault/Joff -> ~/Documents/joff` (1.3GB w/ `node_modules`) — directory symlink at vault root.
- Aggravator: After unlinking Joff, stale IndexedDB still expected those paths → second indexing storm on next launch.
- Fix: unlink + cache reset (steps 1-2 above).
- Duration: ~10 min total. Vault data untouched throughout.
