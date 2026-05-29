---
name: GitHub repos
description: Repo paths, push access, restore source
type: reference
originSessionId: a0253b8a-0fdf-43a1-8a43-6fdcd070c60f
---
Owned (push access):
- `bludragon66613-sys/NERV_02` — Aeon agent
- `bludragon66613-sys/nerv-dashboard` — standalone dashboard on Vercel
- `bludragon66613-sys/claudecodemem` — agents + memory backup
- `bludragon66613-sys/Setup` — 55 active + 183 archived agents, hooks, rules, scripts
- `bludragon66613-sys/Ssquare` — Hyderabad commercial real-estate site
- `bludragon66613-sys/Drip` — Solana peptide+creator platform
- `bludragon66613-sys/fatfk` — F.A.T. F*CK research-peptide brand + Next.js store
- `bludragon66613-sys/joff` (private) — F.A.T. F*K mascot landing site, Vite+React (init 2026-05-15 as iCloud rescue commit)
- `bludragon66613-sys/Vault` (private) — Obsidian knowledge graph (`~/Documents/Vault`), default branch `master`, pushed 2026-05-15 as 484e8fa snapshot

Read-only (no push):
- `paperclipai/paperclip` — upstream

Restore after PC reset:
```bash
gh repo clone bludragon66613-sys/Setup ~/Setup
bash ~/Setup/restore.sh
npm i -g oh-my-claude-sisyphus@latest && omc install && omc setup
```

Auth: `gh auth login` complete 2026-05-09 (device flow, code FEF3-8041).
