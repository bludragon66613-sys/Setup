# Session: 2026-03-25

**Started:** ~8:22am GMT+5:30
**Last Updated:** ~8:36am GMT+5:30
**Project:** NERV Dashboard (`~/aeon/dashboard/`)
**Topic:** ElevenLabs voice chat integration + DASHBOARD_SECRET auth fix

---

## What We Are Building

Full voice interaction for the NERV dashboard interface. Users can hold a button to record audio, which is sent to a `/api/voice/stt` endpoint (ElevenLabs speech-to-text), processed by the LLM, and the response is streamed back as audio via `/api/voice/tts` (ElevenLabs TTS). The voice UI sits inside the NERV terminal interface at `http://localhost:5555/nerv`.

A secondary issue arose: the dashboard was throwing 503 errors on `/api/auth/token` and 401 errors on `/api/sync` and `/api/llm` after a PM2 restart — likely caused by `DASHBOARD_SECRET` not being loaded into the PM2 process environment.

---

## What WORKED (with evidence)

- **ElevenLabs API key configured** — confirmed by: `ELEVENLABS_API_KEY` added to aeon dashboard `.env`
- **ElevenLabs JS SDK installed** — confirmed by: `npm install` completed, package in `node_modules`
- **`/api/voice/` directory created** — confirmed by: files written to disk
- **`/api/voice/stt` endpoint** — confirmed by: file written (`app/api/voice/stt/route.ts`)
- **`/api/voice/tts` endpoint with streaming audio** — confirmed by: file written (`app/api/voice/tts/route.ts`)
- **Client-side voice helper functions** — confirmed by: file written in dashboard client code
- **Hold-to-record voice button in NERV interface** — confirmed by: UI component added
- **PM2 restart with `--update-env`** — confirmed by: process shows `online`, uptime 1s

---

## What Did NOT Work (and why)

- **DASHBOARD_SECRET env var not loading into PM2** — failed because: even after `pm2 restart nerv-dashboard --update-env`, logs show persistent 503 on `/api/auth/token` and 401 on `/api/sync` + `/api/llm`. The `/api/auth` endpoint returns 200, suggesting partial initialization or the secret is not being picked up from the environment file.
- **Voice chat testing** — blocked by: auth issue above prevents confirming voice endpoints work end-to-end

---

## What Has NOT Been Tried Yet

- Check if PM2 is reading the correct `.env` file — may need `pm2 start` with explicit `--env` flag or ecosystem config pointing to the right file path
- Verify `DASHBOARD_SECRET` is actually present in the PM2 process: `pm2 env nerv-dashboard | grep DASHBOARD_SECRET`
- Try stopping PM2 fully (`pm2 stop nerv-dashboard && pm2 delete nerv-dashboard`) then re-starting with explicit env: `pm2 start npm --name nerv-dashboard -- run start --env DASHBOARD_SECRET=<value>`
- Test voice endpoints directly with Postman/curl once auth is confirmed working
- Check if the 503 is a startup race condition (auth service initializing too slowly) vs. missing secret

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `~/aeon/dashboard/app/api/voice/stt/route.ts` | ✅ Complete | ElevenLabs STT endpoint |
| `~/aeon/dashboard/app/api/voice/tts/route.ts` | ✅ Complete | ElevenLabs TTS streaming endpoint |
| `~/aeon/dashboard/app/nerv/` | 🔄 In Progress | Voice button + recording UI added, untested |
| `~/aeon/dashboard/.env` | ✅ Complete | `ELEVENLABS_API_KEY` set |
| PM2 process `nerv-dashboard` | ❌ Broken | 503 on `/api/auth/token`, 401 on `/api/sync` + `/api/llm` |

---

## Decisions Made

- **Hold-to-record UX** — reason: more natural for voice commands than push-to-toggle, matches NERV interface aesthetic
- **Streaming audio for TTS** — reason: lower perceived latency vs. waiting for full audio file

---

## Blockers & Open Questions

- `DASHBOARD_SECRET` not propagating to PM2 process — need to verify env loading mechanism
- Is the 503 on `/api/auth/token` a missing-secret issue or a race condition on startup?
- Once auth is working, need to confirm ElevenLabs voice round-trip end-to-end

---

## Exact Next Step

Run this to verify if `DASHBOARD_SECRET` is in the PM2 process:
```bash
pm2 env nerv-dashboard | grep -i dashboard_secret
```

If missing: stop and re-create the PM2 process with explicit env injection:
```bash
pm2 stop nerv-dashboard && pm2 delete nerv-dashboard
cd ~/aeon/dashboard && pm2 start npm --name nerv-dashboard -- run start
```

Then check `pm2 logs nerv-dashboard --lines 30` to confirm 200s on all auth endpoints before testing voice.

---

## Environment & Setup Notes

- Dashboard runs on PM2, accessible at `http://localhost:5555`
- NERV interface: `http://localhost:5555/nerv`
- ElevenLabs key in `~/aeon/dashboard/.env` as `ELEVENLABS_API_KEY`
- OpenClaw (Telegram bot gateway) runs separately — currently on `openai-codex/gpt-5.4` (Anthropic token expired ~2026-03-25, refresh via `C:\Users\Rohan\refresh-openclaw-auth.bat`)
