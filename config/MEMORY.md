# Memory Index

## User
- [Identity](user_identity.md) — GitHub `bludragon66613-sys`, email `bludragon66613@gmail.com`, mac primary host
- [Workflow style](user_workflow.md) — uses caveman mode for terse comms, OMC orchestration layer, decision-process discipline

## Feedback
- [Decision process](feedback_decision_process.md) — non-trivial actions need 8-step decompose+recommend+wait, not auto-execute
- [Caveman mode](feedback_caveman_mode.md) — drop articles/filler/pleasantries; fragments OK; code/security normal
- [Multi-agent isolation](feedback_multi_agent_isolation.md) — when 2+ AI agents share a repo, use worktree-per-agent (claude/main + codex/main), not branches in shared dir
- [Next.js build cache](feedback_nextjs_build_cache.md) — `rm -rf .next` before declaring "build green"; cache can mask conflict markers + source errors
- [Stash pop conflicts](feedback_stash_pop_conflicts.md) — never `git add` a conflicted file without grep for `<<<<<<<` first; git accepts marker-laden files silently
- [Next.js dotenv-expand](feedback_nextjs_dotenv_expand.md) — bcrypt hashes / `$`-containing env values get chunks eaten; escape with `\$` in `.env*`
- [Project folder layout](feedback_project_layout.md) — new projects always go at `~/Documents/<name>/` (sibling to vault) + home-root symlink + vault `projects/<name>.md` symlink
- [Dedup safety](feedback_dedup_safety.md) — never `rm` one of two "identical" paths without `readlink` on both; inode match + empty `diff -rq` can be symlink-induced false equivalence (caused real data loss 2026-05-14)
- [Design-first workflow](feedback_design_workflow.md) — visual rebuilds need brand bible → super-designer previews → approvals BEFORE code; do not skip gates
- [Single-root project folders](feedback_project_folder_singleroot.md) — sub-artifacts (brand/site/design) nest inside `~/Documents/<project>/`, never as siblings at Documents root
- [Obsidian vault stuck loading](feedback_obsidian_vault_health.md) — "Loading vault/cache" hang = dir symlink at vault root OR stale IndexedDB; check symlinks first, reset cache second; never directory-symlink projects into vault

## Project
- [Active stack](project_active_stack.md) — NERV_02/Aeon, nerv-dashboard, n8n, Paperclip, OpenClaw, claudecodemem
- [Vault canonical path](project_vault_path.md) — `~/Documents/Vault/` is canonical (moved from Downloads 2026-05-14); Downloads path is back-compat symlink
- [Paperclip onboard quirks](project_paperclip_onboard.md) — `onboard -y` silently boots second server; `/api/health` not `/health`; restart dev:server to load JWT
- [SSquare website](project_ssquare.md) — Hyderabad commercial property dev-builder site; repo `bludragon66613-sys/Ssquare`; worktrees at ~/ssquare-claude (claude/main) + ~/ssquare-codex (codex/main); spec locked Direction E
- [Kaneda workspace](project_kaneda_workspace.md) — Telegram bot @kaneda6bot, ~/.openclaw/workspace, Spike self-improvement loop ported 2026-05-10 (PROGRAM/ROADMAP/clawchief/evals/KB + vault round-trip)
- [react-doctor CI](project_react_doctor.md) — react-doctor lint+score adopted 2026-05-11 across Ssquare/NERV_02/nerv-dashboard; all 3 repos at 100/100 with fail-on:warning gates active
- [fatfk / FAT FCK](project_fatfk.md) — research-peptide brand + Next.js store; repo `bludragon66613-sys/fatfk` (single `c`); rebranded `FAT FCK` → `FAT F*CK` for display (PR #13); censored `FAT FK` preserved for ad/media
- [fatfk handoff 2026-05-11](handoff_fatfk_2026-05-11.md) — resume bundle: 12 PRs merged, prod deployed, **awaiting Vercel envs + db:push** for store to actually serve products
- [fatfk todo 2026-05-12](handoff_fatfk_todo_2026-05-12.md) — pending punch list; #16 merged, #17 + #18 open (CI-green); 7-step user-ops checklist still blocks prod
- [drip.markets platform](project_drip.md) — Solana peptide+creator platform; repo `bludragon66613-sys/Drip`; co-founder Matteo; Next.js 16 + Hono + 9 workspace pkgs; PR #10 Aurora ingest merged 2026-05-11; migrations 0019-0026 still pending Neon apply
- [joff project](project_joff.md) — F.A.T. F*K mascot/brand landing site; repo `bludragon66613-sys/joff` (private, initialized 2026-05-15 as rescue commit after iCloud recovery); Vite+React+TS+Tailwind at site/, 256 files in initial commit

## Reference
- [Infra ports](reference_infra.md) — OpenClaw :18789, n8n :5678, Paperclip :3100, dashboard :5555
- [MCP servers](reference_mcp.md) — gitnexus, qmd, memory wired to ~/.claude.json (require CC restart to activate)
- [Repos](reference_repos.md) — bludragon66613-sys/{NERV_02, nerv-dashboard, claudecodemem, Setup, Ssquare}, paperclipai/paperclip
- [ffmpeg install](reference_ffmpeg.md) — static arm64 ffmpeg 7.1.1 at `~/.local/bin/ffmpeg` (no brew); osxexperts.net source; hero-loop transcode preset
- [Mac iCloud config](reference_mac_icloud.md) — Mac mini M2, 8GB RAM; iCloud "Desktop & Documents Folders" sync **DISABLED** 2026-05-15 (re-enabling = sync storm on code repos under ~/Documents)
- [qmd on Mac](reference_qmd_mac.md) — install via `npm i -g @tobilu/qmd` (not bun, due to libsqlite3.dylib not found); 826 docs / 1728 vectors indexed as of 2026-05-15
- [Setup upgrade routine](reference_setup_upgrade.md) — how to upgrade OMC (`omc setup`, not `install`), plugins (`claude plugin update`), and pull paperclip upstream safely
