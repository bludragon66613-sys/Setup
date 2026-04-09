# Session: 2026-03-24

**Started:** ~22:50
**Last Updated:** 23:20
**Project:** ~/aeon/dashboard (NERV_02 Dashboard)
**Topic:** Dashboard auth improvements — auto-Claude auth + multi-LLM connect modal

---

## What We Are Building

Two features shipped to the NERV_02 dashboard (Next.js 16 app at ~/aeon/dashboard, PM2 at localhost:5555):

1. **Auto-authenticate Claude on page load** — The old "Authenticate" button was conditional and hidden when authStatus was null. The `claude setup-token` flow used previously was interactive and always failed headlessly. Replaced with a system that reads `~/.claude/.credentials.json` directly to extract `claudeAiOauth.accessToken` and sets it as `CLAUDE_CODE_OAUTH_TOKEN` via `gh secret set`. A `useRef` guard auto-triggers this once on page load if not authenticated.

2. **Multi-LLM Connect modal** — Always-visible `◈ CONNECT` button in the nav bar replaces the old conditional Authenticate button. Shows a `● X/4` connected count indicator. Opens a modal grid of 4 providers: Claude, OpenAI, Gemini, Grok. Claude auto-detects from credentials file; others show an inline key input on first click. Claude accepts both OAuth tokens (`sk-ant-oat` → `CLAUDE_CODE_OAUTH_TOKEN`) and API keys (`sk-ant-api` → `ANTHROPIC_API_KEY`). All keys saved as GitHub Actions secrets so Aeon skill runs can use them.

---

## What WORKED (with evidence)

- **Auto-auth via credentials file** — confirmed by: TypeScript compiled clean (`npx tsc --noEmit` no output), `~/.claude/.credentials.json` structure verified (keys: `claudeAiOauth.accessToken` with `sk-ant-oat` prefix), committed afedfb4
- **LLM Connect modal** — confirmed by: TypeScript compiled clean, PM2 restart successful (pid 89052 online), committed 4ed0a39
- **Provider consolidation** — confirmed by: Claude now detects key prefix to route `sk-ant-api` → `ANTHROPIC_API_KEY`, committed ebd0c13
- **Visual companion server** — confirmed by: served 3 mockup screens at localhost:61331, user picked layouts via browser, cleanly stopped (exit 143 = SIGTERM)

---

## What Did NOT Work (and why)

- **`claude setup-token` for auto-auth** — failed because: interactive command requiring browser OAuth flow; `execSync` in a Next.js route handler always times out or returns no usable output. Replaced with direct credentials file read.
- **Conditional "Authenticate" button** — effectively invisible: showed only when `authStatus.authenticated === false`, but `authStatus` stayed `null` when `checkAuth()` failed silently, so button never rendered.

---

## What Has NOT Been Tried Yet

- Verifying modal works end-to-end in the browser (user hasn't confirmed yet)
- "Test connection" step after saving a key — make a lightweight API call to verify validity before writing to GH secrets
- Additional providers: Mistral, DeepSeek, Groq
- NERV Desktop app (Tauri + React 7-panel) — brainstorm was attempted but user pivoted to dashboard improvements instead; design never written

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `dashboard/app/api/llm/route.ts` | ✅ Complete | New file — GET status + POST connect for 4 providers |
| `dashboard/app/api/auth/route.ts` | ✅ Complete | POST now reads ~/.claude/.credentials.json directly |
| `dashboard/app/page.tsx` | ✅ Complete | CONNECT button + modal + fetchProviders + connectProvider added; old auth modal removed |

---

## Decisions Made

- **Read credentials file directly over `claude setup-token`** — reason: non-interactive, instant, always available when Claude Code is running
- **4 providers (Claude, OpenAI, Gemini, Grok)** — merged Claude + Anthropic into one; reason: user confirmed they're duplicates, type detected from key prefix
- **Smart Connect (auto-first, key-input fallback)** — over always-paste; reason: user picked option A in visual companion mockup
- **Always-visible CONNECT button** — over conditional Authenticate; reason: user explicitly requested permanent nav bar button

---

## Blockers & Open Questions

- `gh` CLI must be authenticated locally (`gh auth status`) for the connect flow to work — not verified this session
- Modal connect flow not confirmed working in browser by user yet

---

## Exact Next Step

Open http://localhost:5555, click `◈ CONNECT` in the nav bar, verify:
1. Modal opens with 4 provider cards (Claude, OpenAI, Gemini, Grok)
2. Claude shows `● connected` if `CLAUDE_CODE_OAUTH_TOKEN` secret already exists
3. Clicking Connect on Claude auto-sets the secret without needing a key input

If anything looks off: `pm2 logs nerv-dashboard --lines 30`

---

## Environment & Setup Notes

- Dashboard: `pm2 restart nerv-dashboard` or `./aeon` from ~/aeon → http://localhost:5555
- OpenClaw proxy: port 5557 (separate PM2 process, untouched this session)
- Claude credentials: `~/.claude/.credentials.json` → `claudeAiOauth.accessToken`
- GH secrets require: `gh auth login` to be completed locally
