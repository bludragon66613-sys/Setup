---
name: Mac iCloud Drive config
description: Documents/Desktop iCloud sync is OFF as of 2026-05-15. Re-enabling will trigger sync storm on this 8GB Mac.
type: reference
originSessionId: f236be9f-dd17-4d0a-bf90-6aa8295bf7b6
---
**Mac hardware:** Mac mini M2 (Mac14,7), **8GB RAM** — undersized for Rohan's workload (Claude desktop + multiple CC sessions + Chrome + Telegram + Obsidian + dev servers).

**iCloud Drive "Desktop & Documents Folders" sync: DISABLED** as of 2026-05-15. Do not re-enable.

**Why:** All Rohan's code repos live under `~/Documents/` (vault, joff, paperclip, aeon, fatfk, drip, ssquare-construction, etc.). Many include `node_modules`, `.git`, build artifacts, and large media. With Documents sync enabled, `bird` (iCloud daemon) tried to sync the entire tree → pegged at 75% CPU for hours, drove swap to 4.4GB on 8GB RAM, made Mac unusable. Confirmed 2026-05-15 03:30 — disabling the toggle dropped `bird` from 75% → 0% CPU, load avg from 16.37 → 8.47, swap from 9GB → 4GB total.

**How to apply:**
- If Mac is slow and `bird` / `iCloudDriveFileProvider` / `cloudd` are burning CPU, first check `brctl status` for `Under /Documents/` pending-scan entries. If they exist, Documents sync is back on — turn it off.
- Never recommend storing code in `~/Documents/` *if* Documents iCloud sync is on. It is currently off, so the existing layout is safe.
- For new projects, the canonical location remains `~/Documents/<project>/` per `feedback_project_layout.md`. iCloud sync staying off is what makes this safe.

**Verify off:**
```bash
brctl status 2>&1 | grep -E "Under /Documents|pending-scan" | head -5
# No fresh pending-scan entries → sync is off
ps -p $(pgrep -x bird) -o pid,pcpu
# bird should be <5% CPU when idle
```

**Disk pressure context:** Rohan's swap files inflate fast under any AI workload because of 8GB RAM ceiling. Closing redundant Claude Code sessions (`pkill` by PID) and Chrome/Claude-desktop when idle is the standard relief — see `feedback_obsidian_vault_health.md` for the diagnostic recipe.

**Important post-mortem note (2026-05-15):** Disabling the iCloud Documents toggle does NOT automatically copy files back to local `~/Documents/`. Whatever macOS dialog appears can be missed or dismissed, and the files stay at `~/Library/Mobile Documents/com~apple~CloudDocs/Documents/` while local `~/Documents/` becomes empty. Recovery: `mv ~/Library/Mobile\ Documents/com~apple~CloudDocs/Documents/{Vault,aeon,paperclip,fatfk,joff,ssquare-construction,claudecodemem,Setup,Archive,Codex} ~/Documents/` (same APFS volume, atomic rename). Also confirmed iCloud may have offloaded some `node_modules` contents to cloud-only storage — after recovery, `pnpm install` may be needed for any project where node_modules looks smaller than expected (joff/site needed reinstall after this incident).

**Spotlight + FileProvider housekeeping aftermath:** After the mass file move, `mds_stores` (Spotlight) and `fileproviderd` will burn massive CPU re-indexing and unhooking. `mds_stores` hit 138% CPU on this Mac. Mitigation: drop `.metadata_never_index` marker files into every heavy dir (node_modules, .git, .next, .vite, .vercel, .cache, dist, build, .turbo, .pnpm-store). Spotlight skips entire subtree. Lightweight, persistent, no sudo. One-liner:
```bash
for p in ~/Documents/*/; do
  for sub in node_modules .git .next .vite .vercel .cache dist build .turbo .pnpm-store; do
    [ -d "$p$sub" ] && touch "$p$sub/.metadata_never_index"
  done
done
```
Also useful: `brctl evict ~/Library/Mobile\ Documents/com~apple~CloudDocs/Documents/` releases local iCloud cache and triggers fileproviderd queue drain. fileproviderd queue can have 40k+ entries after a mass change; drains naturally over 10-30 min.
