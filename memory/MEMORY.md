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

## Project
- [Active stack](project_active_stack.md) — NERV_02/Aeon, nerv-dashboard, n8n, Paperclip, OpenClaw, claudecodemem
- [Vault canonical path](project_vault_path.md) — `~/Downloads/Agentic knowledge/` is canonical (683 md), Documents copy archived 2026-05-09
- [Paperclip onboard quirks](project_paperclip_onboard.md) — `onboard -y` silently boots second server; `/api/health` not `/health`; restart dev:server to load JWT
- [SSquare website](project_ssquare.md) — Hyderabad commercial property dev-builder site; repo `bludragon66613-sys/Ssquare`; worktrees at ~/ssquare-claude (claude/main) + ~/ssquare-codex (codex/main); spec locked Direction E
- [Kaneda workspace](project_kaneda_workspace.md) — Telegram bot @kaneda6bot, ~/.openclaw/workspace, Spike self-improvement loop ported 2026-05-10 (PROGRAM/ROADMAP/clawchief/evals/KB + vault round-trip)
- [react-doctor CI](project_react_doctor.md) — react-doctor lint+score adopted 2026-05-11 across Ssquare/NERV_02/nerv-dashboard; all 3 repos at 100/100 with fail-on:warning gates active

## Reference
- [Infra ports](reference_infra.md) — OpenClaw :18789, n8n :5678, Paperclip :3100, dashboard :5555
- [MCP servers](reference_mcp.md) — gitnexus, qmd, memory wired to ~/.claude.json (require CC restart to activate)
- [Repos](reference_repos.md) — bludragon66613-sys/{NERV_02, nerv-dashboard, claudecodemem, Setup, Ssquare}, paperclipai/paperclip
- [ffmpeg install](reference_ffmpeg.md) — static arm64 ffmpeg 7.1.1 at `~/.local/bin/ffmpeg` (no brew); osxexperts.net source; hero-loop transcode preset
