# Session: 2026-03-25

**Started:** ~12:30am IST
**Last Updated:** ~2:00am IST
**Project:** ~/nerv-desktop (Tauri 2 + React desktop app) + ~/aeon (NERV_02 dashboard)
**Topic:** NERV Desktop Plans 2–4 — implementing remaining panels (Agency, Memory, Sessions, Config)

---

## What We Are Building

NERV Desktop is a Tauri 2 + React + Vite desktop app in a Turborepo monorepo at ~/nerv-desktop/. It is a command center for the Aeon autonomous agent system. The app has a 3-column layout with a 52px NavSidebar (10 panels), a MainPanel (lazy-loaded panel router), and a StatusSidebar.

Plans 1–3 were already executed in a previous session. This session:
- Completed Plan 2 (CLI panel, MCP Inspector, OpenClaw Monitor) — all committed
- Completed Plan 3 (Axum WS server on :5558, nerv-sdk.js, toast notifications) — all committed + e2e tested
- Wrote Plan 4 (Agency, Sessions, Memory, Config panels)
- Started executing Plan 4 via Subagent-Driven Development — completed T1 only before context ran out

---

## What WORKED (with evidence)

- **Plan 2 complete** — CliPanel, McpPanel, OpenclawPanel all committed and pushed to nerv-desktop master
- **Plan 3 complete** — Axum WS server, useNervSocket, NotificationToast, nerv-sdk.js all committed
- **nerv-sdk e2e test** — `node ~/aeon/test-nerv-notify.js` returned `{ ok: true }` with Tauri app running
- **P2 API endpoints** — `/api/status`, `/api/nerv/command`, `/api/stats` all smoke-tested and return correct data
- **P4-T1 complete** — `Skill`, `Run`, `MemoryFile` types + `apiFetch` helper added to @nerv/core, committed as `3294abe`, spec review ✅ passed

---

## What Did NOT Work (and why)

- **Cargo not on bash PATH** — `cargo` is a Windows binary, not available in git bash. `npm run tauri dev` works from Windows cmd/PowerShell but not from the bash shell Claude uses. Tauri dev/build commands must be run manually by the user in a Windows terminal.
- **Subagent context exhaustion** — The Vercel plugin injects a very large system prompt (~18KB+), leaving subagents with very little working context. Previous session ran into this repeatedly. Mitigation: keep implementer prompts short and self-contained.
- **nerv-desktop branch is `master` not `main`** — git push to `main` failed; correct command is `git push origin master`.

---

## What Has NOT Been Tried Yet

- P4-T2: `useSkills`, `useRuns`, `useMemory` hooks
- P4-T3: `AgencyPanel.tsx`
- P4-T4: `SessionsPanel.tsx`
- P4-T5: `MemoryPanel.tsx`
- P4-T6: `ConfigPanel.tsx` + `useNervStatus.ts`
- P4-T7: Wire all 4 into `MainPanel.tsx`
- P4-T8: Integration test + push

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `packages/nerv-core/src/types.ts` | ✅ Complete | Skill, Run, MemoryFile appended at end (commit 3294abe) |
| `packages/nerv-core/src/api.ts` | ✅ Complete | apiFetch with auth header injection (commit 3294abe) |
| `packages/nerv-core/src/index.ts` | ✅ Complete | exports apiFetch (commit 3294abe) |
| `apps/desktop/src/hooks/useSkills.ts` | 🗒️ Not Started | fetch /api/skills |
| `apps/desktop/src/hooks/useRuns.ts` | 🗒️ Not Started | fetch /api/runs, poll 30s |
| `apps/desktop/src/hooks/useMemory.ts` | 🗒️ Not Started | fetch /api/memory |
| `apps/desktop/src/hooks/useNervStatus.ts` | 🗒️ Not Started | fetch /api/status (full NervStatus) |
| `apps/desktop/src/panels/AgencyPanel.tsx` | 🗒️ Not Started | skill list + dispatch + job feed |
| `apps/desktop/src/panels/SessionsPanel.tsx` | 🗒️ Not Started | GH Actions run table |
| `apps/desktop/src/panels/MemoryPanel.tsx` | 🗒️ Not Started | memory file browser |
| `apps/desktop/src/panels/ConfigPanel.tsx` | 🗒️ Not Started | token input + service health |
| `apps/desktop/src/components/MainPanel.tsx` | 🗒️ Not Started | needs 4 new panel routes |
| `apps/desktop/src-tauri/src/ws_server.rs` | ✅ Complete | Axum WS on :5558, bearer auth |
| `apps/desktop/src-tauri/src/lib.rs` | ✅ Complete | spawns ws_server on startup |
| `apps/desktop/src/components/NotificationToast.tsx` | ✅ Complete | toast renderer |
| `apps/desktop/src/hooks/useNervSocket.ts` | ✅ Complete | WS message listener |
| `apps/desktop/src/store/notifications.ts` | ✅ Complete | Zustand toast store |
| `nerv-sdk/nerv-sdk.js` | ✅ Complete | zero-dep agent HTTP client |
| `~/aeon/nerv-sdk.js` | ✅ Complete | copy in aeon root |
| `~/aeon/test-nerv-notify.js` | ✅ Complete | e2e integration test |

---

## Decisions Made

- **apiFetch lives in @nerv/core, not in the app** — shared across hooks, consistent auth header injection
- **nerv-sdk uses plain http (no ws dep)** — zero runtime dependencies, silently fails when app not running
- **WS server spawned via `tauri::async_runtime::spawn`** — not tokio::spawn directly, since Tauri manages the tokio runtime
- **Panel 4 scope: Agency + Sessions + Memory + Config only** — AEON, AIGENCY, SUPERPOWERS stay as stubs
- **Sessions panel = GitHub Actions runs** (not Claude Code process list) — /api/runs already exists, no new backend needed
- **nerv-desktop branch is `master`** — push with `git push origin master`

---

## Blockers & Open Questions

- Cargo not on bash PATH — Tauri build/dev must be run manually from Windows cmd/PowerShell. Cannot automate full e2e Tauri test from Claude's shell.

---

## Exact Next Step

Resume Plan 4 subagent-driven execution starting at **P4-T2**.

Task list state (in Claude task system):
- #23 P4-T1 ✅ completed
- #24 P4-T2 pending — useSkills, useRuns, useMemory hooks
- #25 P4-T3 pending — AgencyPanel
- #26 P4-T4 pending — SessionsPanel
- #27 P4-T5 pending — MemoryPanel
- #28 P4-T6 pending — ConfigPanel + useNervStatus
- #29 P4-T7 pending — wire MainPanel.tsx
- #30 P4-T8 pending — push

Plan file: `~/aeon/.superpowers/plans/2026-03-25-nerv-desktop-04-panels.md`

**P4-T2 task spec** (dispatch to implementer subagent):

Create three hooks in `apps/desktop/src/hooks/`:

**useSkills.ts** — fetches `/api/skills`, one-shot on mount:
```typescript
import { useState, useEffect } from 'react'
import { apiFetch } from '@nerv/core'
import type { Skill } from '@nerv/core'

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    apiFetch('/api/skills')
      .then(r => r.json())
      .then(d => { setSkills(d.skills ?? []); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [])
  return { skills, loading, error }
}
```

**useRuns.ts** — fetches `/api/runs`, polls every 30s:
```typescript
import { useState, useEffect } from 'react'
import { apiFetch } from '@nerv/core'
import type { Run } from '@nerv/core'

export function useRuns() {
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    function poll() {
      apiFetch('/api/runs')
        .then(r => r.json())
        .then(d => { setRuns(d.runs ?? []); setLoading(false) })
        .catch(() => setLoading(false))
    }
    poll()
    const t = setInterval(poll, 30_000)
    return () => clearInterval(t)
  }, [])
  return { runs, loading }
}
```

**useMemory.ts** — fetches `/api/memory`, one-shot:
```typescript
import { useState, useEffect } from 'react'
import { apiFetch } from '@nerv/core'
import type { MemoryFile } from '@nerv/core'

export function useMemory() {
  const [files, setFiles] = useState<MemoryFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    apiFetch('/api/memory')
      .then(r => r.json())
      .then(d => { setFiles(d.files ?? []); setLoading(false) })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [])
  return { files, loading, error }
}
```

Commit: `git add apps/desktop/src/hooks/useSkills.ts apps/desktop/src/hooks/useRuns.ts apps/desktop/src/hooks/useMemory.ts && git commit -m "feat: add useSkills, useRuns, useMemory data hooks"`

---

## Environment & Setup Notes

- NERV dashboard: `pm2 start` from `~/aeon` → http://localhost:5555
- OpenClaw proxy: also started by PM2 → http://localhost:5557
- Tauri dev: must run from Windows cmd/PowerShell: `cd C:\Users\Rohan\nerv-desktop\apps\desktop && npm run tauri dev`
- nerv-desktop git branch: **master** (not main) — push with `git push origin master`
- aeon git branch: **main** — push with `git push origin main`
- Auth tokens: `sessionStorage.getItem('nerv_token')` in browser / desktop app
