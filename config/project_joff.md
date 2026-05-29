---
name: joff project
description: joff (the F.A.T. F*K mascot/brand)—Vite+React+TS+Tailwind landing site plus brand materials. Repo bludragon66613-sys/joff (private), canonical path ~/Documents/joff.
type: project
originSessionId: f236be9f-dd17-4d0a-bf90-6aa8295bf7b6
---
**Repo:** `bludragon66613-sys/joff` — private — initialized 2026-05-15.

**Canonical paths:**
- Local: `~/Documents/joff/` (home-root symlink `~/joff` → here)
- Vault entry: `~/Documents/Vault/projects/joff.md` → `~/Documents/joff/CLAUDE.md` (file-level symlink, per feedback_project_layout convention)

**Layout:**
```
joff/
├── CLAUDE.md, DIRECTION.md, JOFF.md, PERSONALITY.md/.html  (project docs)
├── tweets-corpus.json/.txt   (input corpus)
├── .ids.txt
├── brand/                    (README, assets, bible, design, reference — 58 tracked files)
├── memes/                    (138 Telegram-sourced meme images)
├── outputs/                  (images/prompts/videos — GITIGNORED, not in repo)
├── site/                     (Vite + React + TS frontend at port 5173)
│   ├── src/                  (App.tsx, components/, hooks/, sections/, store.ts — 13 files)
│   ├── public/               (fonts/, mascot/, memes/)
│   ├── package.json          (deps: framer-motion, react, react-dom, zustand)
│   └── .vercel/              (Vercel-linked)
├── .claude/                  (skills: joff-prompt, joff-meme-builder, joff-media)
└── .omc/
```

**Stack:** Vite ^5.3.4 + React 18.3.1 + TypeScript ^5.5.3 + Tailwind ^3.4.6 + framer-motion ^11 + zustand ^5. Dev: `npm run dev` (port 5173).

**Sensitive files (NEVER commit):** `.env` contains `OPENROUTER_API_KEY`. Properly excluded via `.gitignore`.

**Initial commit context:** First commit 14e1f6c — 256 files — was a *rescue commit* after iCloud Drive data recovery on 2026-05-15. joff had previously been at `~/Documents/joff/` while Documents was iCloud-synced; .git directory either never existed or was lost during the iCloud unhook. Files were intact but unversioned. Recovery flow: moved from `~/Library/Mobile Documents/com~apple~CloudDocs/Documents/joff/` back to `~/Documents/joff/`, ran `npm install` to restore the one missing package, then `git init && commit && gh repo create --private --push`.

**How to apply:** When working on joff, the project root is `~/joff` (or `~/Documents/joff/`). Build artifacts (`.vite/`, `.next/` if added later, `outputs/`) are gitignored. PR workflow via `gh` against the new repo.
