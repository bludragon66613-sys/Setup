---
name: Neo Tokyo Studios
description: AI anime production house — brand bible complete with new pixel-perfect PDF, Vercel live, Chakra v1.1 bible + PACK eps 1-10 scripted + anime-db research asset with 134 entries
type: project
originSessionId: 9e86436b-59af-4f1a-9783-e891df90ed72
---
AI anime production studio producing short-form anime series (1.5-3.5 min episodes, 60-150 per series) for social media, micro-drama platforms, and OTT partners.

**Why:** $11B micro-drama market with zero anime presence. 1.5T TikTok views on #anime. AI production drops costs 25-75x vs traditional.

**How to apply:** Brand decisions are locked — reference the brand bible for all NTS work.

## Brand Identity (Locked)
- **Name:** Neo Tokyo Studios / NTS / N/T
- **Direction:** Fusion of "The Glitch" + "The Slash" — controlled chromatic aberration with red "/" divider
- **Primary color:** #FF0066 (NTS Magenta)
- **Secondary:** #00FFFF (Signal Cyan)
- **Tagline:** "Tune in."
- **Sign-off:** "/ end transmission"
- **Archetype:** Cool Older Sibling / Genre DJ
- **AI stance:** Hidden weapon — never mention AI publicly
- **Typography:** Inter (800/700/500/400) + JetBrains Mono + Noto Sans JP

## Repo (consolidated 2026-04-12)
- **Local:** `~/neo-tokyo-studios/`
- **GitHub:** https://github.com/bludragon66613-sys/Neo-Tokyo-Studios (private)

## Key Files (all under `~/neo-tokyo-studios/`)
- `docs/anime-studio-plan.md` — Master business plan
- `docs/nts-brand-directions.md` — All 9 explored directions
- `docs/brand-bible-spec.md` — Full brand bible spec
- `nts-brand-bible.html` — Visual brand bible (standalone HTML)
- `brand-bible-site/` — Vercel project source (linked + functional)
- `brand-bible-site/build-pdf.py` — Pillow-based PDF builder, stitches 2x screenshots
- `NTS-Brand-Bible.pdf` — v1.1 pixel-perfect 11-page PDF (806KB, rebuilt 2026-04-13)
- `production/` — Series bibles, brand assets, templates
- `production/series/Chakra Artbook.pdf` — Chakra reference (14M, image-only)
- `production/anime-db/` — 134-entry anime art-style reference database (schema v2, real-frame k-means palettes via Shikimori + quality filter)

## Vercel
- **URL:** https://nts-ashen.vercel.app
- **Project:** NTS under bludragon66613-sys-projects
- **Status:** Linked and functional — verified 2026-04-13 via `vercel ls`. Earlier memory note about needing relink was stale.

## Series in Development

### PACK (パック) — Second IP, first to enter production
- **Based on:** Viral March 2026 story of 7 dogs escaping dog thieves in Jilin, China (230M views)
- **Format:** 60 episodes, 2-3 min each, 9:16 vertical
- **Tone:** Wolf's Rain meets Homeward Bound — emotional survival drama, no dialogue
- **Characters:** Dapang (Corgi leader, Welsh accent, counting mind), Sibao (German Shepherd warrior, German accent, sacrificial), Jin (Golden Retriever guardian, Scottish accent, body-as-barrier), Bao (Labrador heart, Canadian/Newfie accent, tempo-keeper), Lao Bai (Pekinese elder, Beijing accent, memory-carrier), Kuai (mutt scout, street polyglot, locksmith), Xiao (puppy youngest, learning)
- **Slash color:** #4A90D9 (Pack Blue)
- **Series bible:** `~/neo-tokyo-studios/production/series/pack/series-bible.md` (complete)
- **Episode summaries:** `~/neo-tokyo-studios/production/series/pack/episode-summaries.md` — all 60 episodes plotted across 5 acts
- **Production scripts:** `~/neo-tokyo-studios/production/series/pack/scripts/` — eps 1-10 complete as full production scripts (scene blocks, camera, sound, accent key, keyframes). Ep 1-5 = Act 1 (THE VILLAGE). Ep 6-10 = Act 2 (THE ESCAPE) opening.
- **Status:** Scripts 1-10 shipped. Next: eps 11-15 (Lao Bai's past, Xiao's first frozen river, Bao's leadership night, sunrise on the journey, the walk begins).

### Chakra — First IP (flagship)
- **Artbook:** `~/neo-tokyo-studios/production/series/Chakra Artbook.pdf` (14MB, 100 pages, image-only PDF)
- **Series bible:** `~/neo-tokyo-studios/production/series/chakra/series-bible.md` — v1.1 complete with 9 factions (Mruga, Deva, Naga, Kimpurusha, Daitya, Asura, Shakti, Vanara, Garuda), named artifacts (Jalastra, Thalmuhut), 100+ episode story arc across 4 acts, visual language, music direction
- **Recommended slash color:** #D7263D (Chakra Crimson) -- TBD confirm
- **Rendered page archive:** `~/chakra-pages/page-001.png` through `page-100.png` (1.5x zoom) for future bible extensions
- **Status:** Bible complete. Next: pilot script in production-script format, story room to validate adaptation strategy, IP rights confirmation with original Chakra creators (credited as STUDIOKAPI 0369 in artbook).

## anime-db (research asset, not a series)
- **Location:** `~/neo-tokyo-studios/production/anime-db/`
- **Scope:** 134 entries, schema v2, 23 taxonomy clusters, covers 1979-2024 canon
- **Decade balance:** 2 / 13 / 16 / 35 / 34 / 34 (70s/80s/90s/00s/10s/20s)
- **Palettes:** All 134 extracted via k-means from real Shikimori in-show screenshots, with quality filter rejecting low-variance / low-saturation / extreme-luminance frames
- **Fetcher:** `fetch_screencaps.py` — multi-source adapter (Shikimori / TMDB / AniList / Jikan) with per-candidate quality gating and provenance tracking
- **Purpose:** Visual direction reference across NTS series. When a scene needs "that Yuasa fluid look" or "Production IG cyberpunk blues," the db + cross-reference.json is the lookup.

## Completed TODOs (was pending — shipped 2026-04-13)
- ✅ PDF brand bible rebuild — replaced puppeteer-rendered v1.0 with pixel-perfect 11-page stitch from 2x screenshots via Pillow native multi-page save (`build-pdf.py`)
- ✅ Vercel relink — was already linked and functional, memory note stale
- ✅ PACK eps 6-10 production scripts — shipped
- ✅ Chakra series bible — already existed at v1.0, extended to v1.1 with Garuda + artifacts
- ✅ anime-db 2020s tail — +14 entries to match 2010s depth

## Still pending
- Reusable PDF review skill (flagged by user previously, not yet built)
- PACK eps 11-60 production scripts (5 of 60 shipped so far beyond Act 1)
- Chakra pilot script
- Chakra IP rights confirmation with STUDIOKAPI / original creators
- Chakra slash color lock (recommended Chakra Crimson #D7263D, pending confirm)
