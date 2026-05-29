---
name: Project folder layout convention
description: New code project = new sibling folder under ~/Documents/, sibling to vault. Symlinks for back-compat + vault sync.
type: feedback
originSessionId: f236be9f-dd17-4d0a-bf90-6aa8295bf7b6
---
All code projects + vault live as siblings under `~/Documents/`. When starting a new project, follow this exact workflow:

1. **Create canonical folder:** `~/Documents/<project-name>/` (sibling to `~/Documents/Vault/`).
2. **Back-compat symlink at home root:** `ln -s ~/Documents/<project-name> ~/<project-name>` (so `cd ~/<name>` muscle memory works).
3. **Add CLAUDE.md** to the project: `~/Documents/<project-name>/CLAUDE.md` (project context, stack, commands).
4. **Symlink CLAUDE.md into vault:** `ln -s ~/Documents/<project-name>/CLAUDE.md ~/Documents/Vault/projects/<project-name>.md` (vault stays in sync with project context; edits in either location reflect in both since it's a symlink, not a copy).
5. **Optionally** add a free-form memory file in vault: `~/Documents/Vault/Memory/projects/project_<name>.md`.

**Why:** Rohan wants code in one place (`~/Documents/<project>`) and knowledge in one place (`~/Documents/Vault`) so dedicated Claude Code sessions can open the project root and have agents operate autonomously without confusion across projects. Vault acts as the canonical "who I am / what I'm building" 2nd brain that auto-syncs with project activity via symlinks. Established 2026-05-14 cleanup session — confirmed durable workflow.

**How to apply:** When the user says "starting new project X" / "new repo" / "let's build X" / "spinning up X" — before writing code, lay down the folder + home-root symlink + CLAUDE.md + vault `projects/` symlink. Never put code at `~/X` directly anymore; always at `~/Documents/X` with `~/X` as symlink. If user clones a repo with `gh repo clone X` from `~/`, immediately move it: `mv ~/X ~/Documents/X && ln -s ~/Documents/X ~/X`.

**Hard rule — never symlink a project root into vault.** Only file-level symlinks (`CLAUDE.md` → `projects/<name>.md`). A directory symlink at vault root drags `node_modules` and the whole repo tree into Obsidian's indexer and pegs the Renderer at 100% CPU forever ("loading vault" hang). Confirmed 2026-05-15 — vault had `Vault/Joff → ~/Documents/joff` (1.3GB with node_modules), Obsidian renderer stuck indexing it. Fix: `unlink Vault/<dirname>`. If a project actually needs prose surfaced in vault beyond its CLAUDE.md, add a free-form note in `Vault/Memory/projects/`, never a directory symlink.

**Established roster (2026-05-14):**
- `~/Documents/aeon` (NERV_02)
- `~/Documents/paperclip`
- `~/Documents/fatfk` (patient zero brand)
- `~/Documents/ssquare-construction`
- `~/Documents/Setup` (backup repo)
- `~/Documents/claudecodemem` (backup repo)
- Stale archive: `~/Documents/Archive/` (ssquare-claude, ssquare-codex)

**Asset routing for new projects:**
- Brand assets → `~/Documents/Vault/brand-foundation/brands/<brand>/`
- Project memory notes → `~/Documents/Vault/Memory/projects/project_<name>.md`
- Project CLAUDE.md symlink → `~/Documents/Vault/projects/<name>.md`
