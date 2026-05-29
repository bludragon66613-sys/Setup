---
name: reference-setup-upgrade
description: "How to upgrade the whole CC setup — OMC, plugins, and the paperclip upstream pull"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0bdd288b-88d7-4274-89b1-301688ba4971
---

Recurring "look for updates and upgrade my setup" task. Three independent layers:

**OMC (oh-my-claude-sisyphus, npm global at `~/tools/node-global`)**
- `npm i -g oh-my-claude-sisyphus@latest` bumps the package, but `omc install` then NO-OPS ("already installed") — it skips when present unless `--force`.
- The real refresh is **`omc setup`** — version-aware sync of hooks/agents/skills/CLAUDE.md/HUD. It merges CLAUDE.md (backs up old to `CLAUDE.md.backup.<ts>`) and **preserves custom non-OMC hooks** (memory-obsidian-sync.js, web-ingest-to-vault.js) by skipping them without `--force-hooks`. So default `omc setup` is safe — does not clobber custom config.
- Verify after: diff CLAUDE.md vs the `.backup` — should only show the `OMC:VERSION` stamp change.

**Plugins (`claude plugin ...`)**
- Refresh first: `claude plugin marketplace update` (all sources, no name arg).
- Then `claude plugin update <plugin@marketplace>` per plugin (e.g. `caveman@caveman`, `claude-mem@thedotmack`). **Restart CC to apply.**
- Only bother with **enabled** plugins; disabled ones (varies) aren't in use. Check `claude plugin list`.
- The `claude-plugins-official` marketplace isn't a plain git repo, so a manual `git -C` behind-count in `~/.claude/plugins/marketplaces/` won't measure it — use `claude plugin update` (no-ops if already latest).

**Paperclip repo (`~/Documents/paperclip`)** — see [[project-paperclip-onboard]]
- Tracks `origin/master` = `paperclipai/paperclip` upstream, **pull-only (no push access)**. Goes many commits behind.
- Local uncommitted-and-kept files: `AGENTS.md` (+~44), `.gitignore`, untracked `.omc/`, `CLAUDE.md`, `.claude/skills/gitnexus/`, `.gitnexus/`. These are local-only, never committed.
- Safe pull: `git stash push -- AGENTS.md .gitignore` → `git pull --rebase origin master` → `git stash pop` → resolve. `.gitignore` conflicts predictably (upstream `.herenow` vs local `.gitnexus`) — union-resolve, keep both. Per [[feedback_stash_pop_conflicts]] grep `<<<<<<<` before any `git add`. Then `git reset` to restore unstaged state.
- After a big pull, deps likely shifted → `pnpm install` (+ `pnpm --filter @paperclipai/plugin-sdk build`) before it boots.

Backup: per CLAUDE.md, push agents+memory to `Setup` repo after significant `~/.claude` changes (confirm before pushing — outward-facing).
