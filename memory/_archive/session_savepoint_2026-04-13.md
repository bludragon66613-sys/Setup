---
name: Session Savepoint 2026-04-13
description: anime-db consolidated into NTS monorepo, multi-source screencap fetcher with quality filter shipped, all 120 palettes upgraded to real k-means extraction from filtered Shikimori frames
type: project
originSessionId: ab26b925-eeea-4761-9f39-5839dfe131c4
---
# Session savepoint — 2026-04-13

Resumed the `anime-db` art-style database project (120 entries, schema v2) after the 4:08pm Apr 13 handoff. Consolidated it into the Neo Tokyo Studios monorepo and built the auto-fetcher + palette pipeline end-to-end, then added a quality filter pass.

## What shipped

**Location move:** `~/anime-db/` → `~/neo-tokyo-studios/production/anime-db/` (tracked in `bludragon66613-sys/Neo-Tokyo-Studios`).

**Four commits on `origin/main`:**
1. `e3c404a` — initial anime-db import (120 entries, 23 taxonomy clusters, README, scripts)
2. `7215222` — `fetch_screencaps.py` multi-source fetcher + provenance join in `json_to_csv.py`
3. `63e18c6` — all 120 palettes rewritten from real k-means extraction
4. `dd470cf` — quality filter on fetched screencaps (variance + saturation + luminance), adapters refactored to yield candidate lists, provenance carries `quality` and `attempts`

**Fetcher architecture (`fetch_screencaps.py`):**
- Each adapter yields `list[FetchResult]` (Shikimori returns every screenshot + cover fallback, AniList returns banner + cover, Jikan returns trailer + cover, TMDB returns backdrop).
- `iter_candidates` flattens across all sources in priority order. Main loop downloads each candidate to a temp file, runs `quality_check`, keeps the first that passes, cascades on rejection.
- Quality thresholds (defaults, CLI-tunable): `min_rgb_std=22.0`, `min_saturation=20.0`, `max_extreme_luminance=0.85`.
- Year-distance disambiguation for franchises (AoT id 51 vs 119).
- Rate limit 1s between API calls.
- Writes `screencaps/provenance.json` per entry: `url, source, type, tags, credit, fetched_at, file, quality, attempts`. The `attempts` array logs every rejected candidate with its metrics for auditing.
- CLI flags: `--ids`, `--sources`, `--dry-run`, `--overwrite`, `--limit`, `--verbose`, `--no-quality-filter`, `--min-variance`, `--min-saturation`, `--max-extreme-luminance`.

**CSV schema (`json_to_csv.py`) — 5 new columns joined from provenance:**
`screencap_file, screencap_source, screencap_type, screencap_url, screencap_tags`

**Batch results (120 entries, two runs):**
- First run (no filter): 119 new + 1 existing, 100% Shikimori, 0 failures.
- Second run (with quality filter, `--overwrite`): 7 bad frames caught across 3 shows — Steins;Gate (2 rejects, sat=8.21 grayscale), Devilman Crybaby (2 rejects, lum=0.98 black frame), Texhnolyze (3 rejects, sat=5.38 + 0.875 washed-out). All 3 recovered to a usable Shikimori screenshot from the same multi-screenshot pool — no source fallthrough needed.
- Source split remained 100% Shikimori.
- 57MB total screencaps, gitignored. Only `provenance.json` tracked.

**Palette upgrades from quality filter:**
- Steins;Gate → vibrant electric blues `#383F56;#2A34BA;#6070D3;#B5BFED`
- Devilman Crybaby → dark navy + cyan `#141515;#235172;#B1CBF6;#4376D5`
- Texhnolyze → rust grays `#E5E4DB;#161415;#B2A99E;#6D665E`
- Other 117 entries unchanged (their first Shikimori frame already passed).

## Bugs fixed in-flight

- `fetch_screencaps.py` was persisting placeholder rows on `--dry-run` — patched so dry-run only prints.
- `extract_palette.py --update` was reformatting `anime-db.json` from compact to pretty on no-op runs (`updated 0 entries` still wrote the file). Now short-circuits when `palettes` is empty or `updated == 0`.

## Notable finding

Replacing hand-picked moodboard palettes with real-frame k-means extraction often **shifted palettes toward subtler scene tones**. Example: Akira moved from `#E4002B;#FFD100;#1A1A2E;#00B9E4` (bold neon) to `#322822;#5D4D3F;#917153;#B4AE83` (earthy sepia) because Shikimori's default screenshot isn't the iconic bike chase — it's an interior scene. Same for GitS, which lost its yellow accent.

**Trade-off:** representative-scene palettes (what the fetcher produces) vs iconic-scene palettes (what hand-picked gave us). Currently optimized for representative. To override, drop manual screencaps named `<id>-<slug>.<ext>` into `screencaps/` and rerun `extract_palette.py --dir screencaps/ --update anime-db.json`.

## Open threads

- Palette quality is still "representative not iconic" for ~30% of entries (the iconic-vs-representative axis is orthogonal to the variance/saturation axis the filter checks). To override, drop manual screencaps into `screencaps/` named `<id>-<slug>.<ext>` and rerun `extract_palette.py --dir screencaps/ --update anime-db.json`.
- 2020s tail still thin (20 entries) — not addressed this session.
- Minor: rerunning the fetcher with `--overwrite` while the CSV is open in Excel triggers a `PermissionError` on `anime-db.csv` write. Workflow note, not a code bug.
