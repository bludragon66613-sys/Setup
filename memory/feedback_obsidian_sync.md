---
name: Obsidian Sync Rules
description: Obsidian vault sync rules — shueb.io exclusion + Google Drive backup requirement
type: feedback
originSessionId: a7e3f77e-b13c-49b7-9902-eb6c3a949c64
---
1. Never sync shueb.io content to the Obsidian vault ("Agentic knowledge").
2. Always sync to Google Drive (`gdrive:Agentic knowledge/`) alongside OneDrive as a backup.

**Why:** shueb.io explicitly excluded from knowledge graph. Google Drive backup added because OneDrive is the single point of failure for the vault — gdrive is the redundancy layer.

**How to apply:** The `memory-obsidian-sync.js` hook handles both automatically — syncs to OneDrive vault then spawns background rclone to gdrive. If doing manual syncs, always push to both. Requires `rclone` installed with `gdrive:` remote configured (bludragon66613@gmail.com).
