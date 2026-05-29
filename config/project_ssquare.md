---
name: SSquare Constructions website project
description: SSquare project layout, repo, worktree topology, branch strategy
type: project
originSessionId: 1411abca-bf00-4f22-96d6-26f1a493251e
---
# SSquare Constructions website

Hyderabad commercial property developer-builder (founded 1993). Marketing + portfolio + investor site. Direction E (Cinematic / Photo-led, white/light body).

## Repo
- GitHub: `bludragon66613-sys/Ssquare` (private)
- URL: https://github.com/bludragon66613-sys/Ssquare

## Vercel
- Project: `bludragon66613-sys-projects/ssquare` (created 2026-05-10)
- Project ID: `prj_QrfHc0imZCQ0bhozl10d4zwukpEY` · Team ID: `team_EOpai4nuwLAUOHrzOrMfPB5S`
- Prod alias: https://ssquare-rouge.vercel.app
- **Production branch on Vercel = `main`** (re-linked 2026-05-11 via `vercel git connect`). Earlier session memory said phase-5; outdated. Project lost its git link at some point and was deploy-by-CLI only until this session. Now: any push to `main` auto-deploys to prod. Hotfix workflow: branch → PR → merge → auto-deploy.
- Linked from `~/ssquare-claude/.vercel/` (gitignored)
- Custom domain not yet wired
- Vercel CLI (`vercel`) installed globally on this mac (npm-global, 2026-05-10). `vercel deploy --prod --yes` from `~/ssquare-claude` works without re-auth.

## Local layout (multi-agent worktrees)
```
~/ssquare-construction   main         shared baseline + PR target
~/ssquare-claude         claude/main  Claude workspace
~/ssquare-codex          codex/main   Codex / OpenClaw workspace
```
All three share one `.git` (created via `git worktree add`). When I work on this project, I work in `~/ssquare-claude` and push to `origin claude/main`. PRs merge into `main`.

## Branch protocol
- Each agent commits/pushes only to its own branch (`claude/main` or `codex/main`).
- Cross-merge happens via PR into `main`.
- Pull `main` before opening a PR to keep merges clean.
- Never push directly to `main` from an agent worktree without a PR.

## Spec location
`docs/superpowers/specs/2026-05-09-ssquare-website-design.md` — locked design contract. 18 sections, business model in §1.5. Edit only when user asks.

## Codex coordination artifacts
- `CLAUDE.md` (repo-scoped) — codex-authored instructions for me.
- `docs/openclaw-handoff.md` — codex/openclaw handoff state.
- `docs/implementation-plan.md` — codex's phased build checklist.
- `docs/codex-phase-4.md` — Phase 4 handoff brief from claude → codex (committed on `codex/main` 2026-05-09).

## Phase status
- Phase 1+2+3 (scaffold + cinematic home) merged via PR #1 (commit `9a5954b`) on 2026-05-09.
- Phase 4 (7 inner routes + project-hero + spec-table) on branch `claude/main-phase-4`, PR #2 open. Codex = reviewer.
- Phase 4.1 refinement (2026-05-10, commit `ff03e54`) on same PR #2: ui-ux-architect → super-designer two-agent pass added mobile nav (was missing), wired 12 generated images via `next/image`, added 8 new buildings to data (36 Square, Crypton, Empire, Fantasy, Hitex Business, Jubilee, Kimtee, Millennium — `/work` now 14), tightened homepage copy (Build/Lease/Sell single words, "Speak with us." headline, "Selected work." static headline). Audit doc at `docs/reduced-v1-ux-flow.md`. Spectrum + Park stay on bar-motif placeholder.
- Phase 5 mobile-video permanent fix (2026-05-10, commit `67de13e`): root cause of mobile glitch was `moov` atom at END of `public/projects/club-emporio.mp4` (offset 5,657,215) — mobile browsers cannot start playback until full 5.4MB downloads. Fixed via `python3 -m qtfaststart` (moov now at offset 32). Also added tap-to-play overlay in `components/hero-video.tsx` that catches `play()` `NotAllowedError` (iOS Low Power Mode / data saver) and clears on `playing` event — user can no longer get stranded on poster. `qtfaststart` python pkg installed at `~/Library/Python/3.9/lib/python/site-packages/qtfaststart/`.
- Phase 5.1 perf pass (2026-05-10, commit `c8976cc`): /public payload ~13 MB → ~1.7 MB. 3 project hero PNGs (2.1-2.3 MB each) → JPG @85 max-1600w (~480 KB each). `public/logo.png` 830 KB → 66 KB (sips -Z 320, alpha kept). Hero video `club-emporio.mp4` 5.4 MB → 1.8 MB via libx264 -crf 26 -preset slow, audio stripped, faststart kept (moov@offset 32 verified). `next.config.mjs`: `images.formats=[avif,webp]`, `experimental.optimizePackageImports=['framer-motion']`, `headers()` returning `Cache-Control: public, max-age=31536000, immutable` for `/projects/*` + logo. `app/robots.ts` + `app/sitemap.ts` (21 URLs). `viewport` export with themeColor light/dark. `metadata.alternates.canonical='/'` + `robots.index/follow`. Playfair weights 4 → 2 (only 400/500 used). `public/logo-light.svg` deleted (unused). `.gitignore`: `.omc/` + `.tmp/`. ffmpeg 7.1.1 arm64 binary saved to `~/.local/bin/ffmpeg` (osxexperts.net build). Build: 30/30 static, FLJS 103 KB shared. **Vercel git webhook flaky this session** — both pushes needed manual `vercel --prod --yes` to deploy.
- Phase 6 admin panel (2026-05-10, branch `claude/admin-panel` merged into `main` via PR #3, merge commit `e0446ec`): full CMS at `/admin/*` — site, projects, brands, pages (block editor + public renderer), media (Vercel Blob), design tokens (colours + Google Fonts), revisions audit table. Public site reads from DB via `lib/cms.ts`, falls back to `content/*.ts` on DB failure. Stack: Prisma 6 + Postgres (Neon `muddy-dawn-19149196`, provisioned via `vercel integration add neon`), `@vercel/blob` for media, `jose` JWT cookie + `bcryptjs` (split lib/auth.ts edge-safe vs lib/auth-server.ts node-only), zod schemas in lib/schemas.ts. Single-admin password env `ADMIN_PASSWORD_HASH=gur123` (cost-12 hash). Local dev seeded from `content/*.ts` via `npm run db:seed`. Phase 4b: `<PageBlocks pageKey>` server component (`components/site/page-blocks.tsx`) renders `Page.published.blocks` on all 7 public routes; empty arrays render nothing. Phase 7 draft preview: cookie-gated (`ssq_preview` JWT, 1h, kind="preview" claim, distinct from admin token), admin sidebar toggle, amber banner on public site, all `lib/cms.ts` reads default to `currentMode()` from cookie — every public callsite dropped the explicit `"published"` arg except `generateStaticParams` (build-time, no cookies). Phase 8 hardening: `lib/env.ts` zod validates env at module-load (skipped during `next build` phase via `NEXT_PHASE` check), `lib/rate-limit.ts` per-IP in-memory bucket (5 attempts / 15 min, 429 + Retry-After), all admin cookies have httpOnly + sameSite=lax + secure-in-prod + path=/, `docs/admin/deploy.md` runbook. Rate-limit caveat: per-instance only, Upstash documented as upgrade path. **Why:** user wants to edit text/images/videos/fonts/colours from a UI without code changes. **How to apply:** further admin work happens on `claude/admin-panel`; merge to main only after Vercel Production Branch flip. PR #3 merged 2026-05-10. Phase 6 (section visibility), Phase 4b (public block renderer), Phase 7 (draft preview cookie + banner with 303-redirect after POST), Phase 8 (env validation + login rate-limit + deploy runbook), revisions audit, fluid clamp() typography scale, LexnLin design fixes (banned-font purge, contrast bumps, scroll-reveal cap), and Playwright E2E (admin happy-path + section-gate round-trip, 30.3s combined) all shipped + merged. Vercel Production Branch still on `claude/main-phase-5-transitions` — flip required for prod deploy. Two security review passes closed 2 critical + 3 high + 3 medium findings (HTML sanitizer via isomorphic-dompurify, CSS injection regex on font names + design-token record keys + dimension values, env consumers via lib/env.ts, x-real-ip rate-limit key, React.cache on currentMode).
- Phase 5 (2026-05-10, branch `claude/main-phase-5-transitions`): page transitions via Framer Motion `app/template.tsx`; r3f particle hero overlay (`hero-particles*.tsx`); ScrollReveal stagger on project grid; flat ESLint config replacing interactive `next lint`; premium audit pass (ordering Club Emporio first, slug rename `hitex-business-square` → `bizness-square`, real per-project descriptions from asset metadata, hide-empty spec rows, "managed income for investors" copy replacing landlord lines, contact "by appointment only" block replacing approximate map, softened display-heading tracking); favicon + apple-icon swapped to canonical logo; `app/opengraph-image.jpg` + `app/twitter-image.jpg` (1200x630, Club Emporio); `metadataBase` temporarily on `ssquare-rouge.vercel.app` (revert when DNS for ssquareconstructions.com cuts over). iOS Safari hero-video autoplay regression fixed: skip motion wrap + WebGL particle canvas on coarse-pointer (touch) devices — root cause was transformed parent + WebGL overlay above video, not reproducible in DevTools mobile emulation.

## Tech stack
Next.js 16 App Router + Tailwind + MDX, Vercel hosting, TypeScript strict.

## Key facts
- Founded 1993 (33 years as of 2026), Hyderabad single-city
- 27 projects, 2M+ sqft, 38 AAA tenants
- Anchor projects: Spectrum Square (1993, founding), 12th Square, Park Square, Quena Square, G Square, Club Emporio (latest)
- Phones: +91 98490 36000 · +91 94400 42000
- Business model: build to international standards → pre-lease to AAA tenants → sell pre-leased units to HNI investors
- Brand color: #1E96D6 (sampled from logo blue) — sparingly as accent only
