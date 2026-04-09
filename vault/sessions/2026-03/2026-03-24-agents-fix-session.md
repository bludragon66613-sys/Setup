# Session: 2026-03-24

**Started:** ~22:35
**Last Updated:** 22:49
**Project:** NERV_02 / aeon dashboard (`~/aeon/dashboard/`)
**Topic:** Fix Obsidian empty session stubs + consolidate agent catalog (fix aeon slugs, drop aigency02, accurate division categories)

---

## What We Are Building

Three separate fixes in one session:

1. **Obsidian vault sync bug** — `vault-session-logger.js` was syncing `~/.claude/sessions/*.json` files (process metadata: pid, sessionId, cwd) as if they were conversation logs. Since these files have no `messages` array, the hook wrote empty stub `.md` files to the Obsidian vault on every session end.

2. **Agent catalog overhaul** — The `/agents` page catalog had two critical bugs: (a) all 39 aeon skills were slugged to `"skill"` because every skill file is named `SKILL.md` — the slug derivation used the filename not the parent directory, so only the first skill survived dedup; (b) aigency02 was included as a source (1095 agents) alongside local `~/.claude/agents/` (207 agents), causing fake duplicates because naming conventions differed (`design/ui-designer.md` → `ui-designer` vs `design-ui-designer.md` → `design-ui-designer`).

3. **Division categories** — The `inferDivision` function used loose keyword matching against name/description, which misfired constantly. Replaced with: explicit slug→category lookup table for aeon skills (Intel/Crypto/Build/System/GitHub), and filename-prefix→division for local agents (Engineering/Design/Game Dev/Marketing/Sales/Testing/Security/etc.).

---

## What WORKED (with evidence)

- **Obsidian fix** — confirmed by: deleted 4 empty stubs (161836.md, 198844.md, 211432.md, 255820.md), hook updated with `continue` on 0-message JSON files, future sessions will skip process metadata files
- **Aeon slug fix** — confirmed by: `deriveSlug` now returns parent dir name when basename === 'skill'; catalog built 246 agents (207 local + 39 aeon) vs previously only 207+1
- **Catalog source cleanup** — confirmed by: removed aigency02 from sources, `tsc --noEmit` clean, catalog built `246 agents → .cache/agents.json`
- **Division categories** — confirmed by node inspection of cached catalog:
  - Aeon: Intel:12, Crypto:10, System:8, Build:6, GitHub:3
  - Local: Engineering:65, Marketing:27, Game Dev:17, Sales:9, Design:8, Testing:8, Project Mgmt:6, Support:6, Research:5, Spatial:5, Product:5
- **AEON_REPO_ROOT env var** — confirmed by: persisted to `dashboard/.env.local`, PM2 restart with `--update-env` picks it up, catalog includes aeon skills on startup
- **UI division tabs** — source toggle resets division filter; Aeon Skills view shows Intel/Crypto/Build/System/GitHub tabs; Claude Agents view shows Engineering/Design/Game Dev/... tabs; card/modal border color follows source
- **Git pushes** — both commits pushed to `github.com/bludragon66613-sys/NERV_02` (8c83221, ee6f6be)

---

## What Did NOT Work (and why)

- **`AEON_REPO_ROOT` via PM2 ecosystem config** — ecosystem.config.cjs doesn't exist at `~/aeon/`; the process was started directly. Workaround: `pm2 restart --update-env` with env var in shell + persisted to `.env.local`.
- **aigency02 as catalog source** — abandoned because: 1095 agents with different naming conventions (`category/agent-name.md`) produced different slugs than local agents (`category-agent-name.md`), causing visual duplicates rather than clean dedup. The local `~/.claude/agents/` is the correct installed set.

---

## What Has NOT Been Tried Yet

- **NERV Desktop app spec** — brainstorm was done last session, spec hasn't been written. Ready to run `/write-plan` for the Tauri+React desktop architecture.
- **`openclaw-proxy` stability testing** — was deployed last session but no reliability testing done. Worth checking if the persistent WS reconnects correctly after crashes.
- **R&D Council follow-up** — built in session 2026-03-24b, no usage since. May need testing.
- **Division "Specialized" cleanup** — 40 local agents fall into Specialized (catch-all). Some may need new prefix entries in `LOCAL_PREFIX_DIVISION` (e.g., `gsd`, `harness`, `zk`, `loop`, `planner`, etc.).

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/.claude/hooks/vault-session-logger.js` | ✅ Complete | Skips JSON files with 0 messages (process metadata) |
| `~/aeon/dashboard/lib/catalog.ts` | ✅ Complete | Aeon slug fix, aigency02 removed, explicit division inference |
| `~/aeon/dashboard/app/agents/page.tsx` | ✅ Complete | Source toggle, dynamic division tabs per source, color-coded cards |
| `~/aeon/dashboard/.env.local` | ✅ Complete | `AEON_REPO_ROOT=C:/Users/Rohan/aeon` added |
| `~/aeon/dashboard/.cache/agents.json` | ✅ Built | 246 agents (207 local + 39 aeon), correct divisions |

---

## Decisions Made

- **Drop aigency02 from catalog** — reason: it's a marketplace/package (1095 files), not deployed agents. Local `~/.claude/agents/` is the actual installed set. No value in showing 1095 extra agents that mostly overlap.
- **Explicit lookup tables over keyword inference** — reason: `inferDivision` with regex was misfiring (e.g., "code-health" going to Engineering instead of Build for aeon). Explicit slug→category and prefix→division are deterministic and maintainable.
- **Division tabs switch per source** — reason: aeon categories (Intel/Crypto/Build/System/GitHub) and agent categories (Engineering/Design/etc.) are completely different taxonomies; mixing them in one static list made both views confusing.
- **SKILL.md → parent dir slug** — reason: all 39 aeon skills use `skills/<name>/SKILL.md` structure. Using parent dir name is the canonical slug for that skill.

---

## Blockers & Open Questions

- **AEON_REPO_ROOT persistence across PM2 restarts** — `.env.local` handles Next.js dev server reads, but if PM2 restarts without the env var in shell, it won't be set. Consider adding to PM2 `env` block or a startup script. Low priority for now.
- **NERV Desktop spec** — no blockers, just needs to be started. All design decisions from the brainstorm are still in `~/.claude/sessions/2026-03-24-nerv-desktop-session.md` (in Obsidian vault).

---

## Exact Next Step

Start NERV Desktop spec: run `/write-plan` with the Tauri+React desktop app design. Reference the brainstorm in the Obsidian vault at `Claude Sessions/2026-03-24-nerv-desktop-session.md`. The design covers a 7-panel unified infrastructure dashboard with OpenClaw model routing visibility, job board, agent catalog, and NERV command terminal.

---

## Environment & Setup Notes

- Dashboard: `http://localhost:5555` — PM2 process `nerv-dashboard`
- OpenClaw proxy: `http://localhost:5557` — PM2 process `openclaw-proxy`
- Agents page: `http://localhost:5555/agents`
- Agency page: `http://localhost:5555/agency`
- Restart with aeon skills: `AEON_REPO_ROOT="C:/Users/Rohan/aeon" pm2 restart nerv-dashboard --update-env`
- Catalog rebuilds on Next.js server startup via `instrumentation.ts`
