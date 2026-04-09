# Session: 2026-03-25

**Started:** ~9:50 AM IST
**Last Updated:** 10:21 AM IST
**Project:** AASARA pitch deck + Kaneda Telegram bot
**Topic:** Rebuilt AASARA home care pitch deck with India/Hyderabad imagery, fixed Kaneda 409 bot conflict

---

## What We Are Building

Two parallel tasks:
1. **AASARA Pitch Deck** — A 5-page A4 PDF for AASARA Personalized Home Care (Hyderabad). Rebuilt from a 6-page deck that had hallucinated content, a founder page to remove, and a blank last page. New deck uses actual Hyderabad Unsplash photos (Durgam Cheruvu skyline + doctor-elderly patient) and a saffron/gold Indian-themed design. No Hindi text — professional global tone.

2. **Kaneda Telegram bot 409 fix** — Kaneda (OpenClaw local AI gateway) was crashing with `409: Conflict: terminated by other getUpdates request`. Root cause: something external (likely Aeon on GitHub Actions) is polling the same bot token simultaneously. Needed to identify, kill the conflict, and send the AASARA PDF via Telegram.

---

## What WORKED (with evidence)

- **AASARA deck rebuilt** — confirmed by: `aasara_deck.pdf` (803KB) generated on Desktop via Chrome headless, visually reviewed
- **Founder page removed** — confirmed by: HTML restructured to 5 pages (Hero → Why → Services → Pricing → CTA), print CSS updated
- **Blank last page fixed** — confirmed by: removed `images-band` div that had no print styles; CTA now exactly `calc(297mm - 52px)` + 52px footer = one clean page
- **Hyderabad skyline as hero** — confirmed by: used Chrome DevTools MCP to extract real CDN URL `photo-1601619933635-023753974a65` (Durgam Cheruvu lake at night)
- **Doctor-elderly patient card image** — confirmed by: `photo-1758691462858-f1286e5daf40` (free tier, doctor consulting elderly patient)
- **All Hindi text removed** — confirmed by: no Hindi characters in final HTML, subtitle is "Personalized Home Care · Hyderabad"
- **PDF sent to Telegram** — confirmed by: `curl sendDocument` returned `OK - msg id: 220`, delivered to chat_id `6871336858`
- **Chat ID located** — confirmed by: found in `~/aeon/dashboard/.env.local` as `TELEGRAM_CHAT_ID=6871336858`

---

## What Did NOT Work (and why)

- **`openclaw gateway restart` to fix 409** — failed because: external process (likely Aeon GH Actions) is also polling same bot token; local restart doesn't stop the remote poller
- **`taskkill /F /IM` via bash** — failed because: bash on Windows interprets `/F` as a path; need `cmd /c "taskkill /PID X /F"` syntax
- **`taskkill /PID 404124 /F`** — partially worked: killed the local gateway process but it didn't stop the 409 because the competing poller is remote (not local)
- **Unsplash `plus.unsplash.com` photos** — failed because: Indian family (`lYt-hQca1B0`) and Asian nurse (`jg91muAG9Kc`) are premium photos requiring subscription; won't load freely
- **WebFetch on Unsplash pages** — failed because: Unsplash is JS-rendered; WebFetch only gets CSS/HTML shell, no image URLs
- **`source.unsplash.com` URL format** — avoided: deprecated by Unsplash, unreliable for PDF generation
- **`curl getUpdates` to find chat ID** — caused 409: my curl call to the Telegram API consumed pending updates AND triggered the conflict state

---

## What Has NOT Been Tried Yet

- **Fix the real root cause of 409**: Aeon on GitHub Actions likely has the same `KANEDA_BOT_TOKEN` configured and polls it during skill runs. Fix options:
  - Option A: Give Aeon a separate dedicated bot token (cleanest)
  - Option B: Switch Aeon's Telegram integration to webhook mode instead of polling
  - Option C: Disable Telegram polling in the Aeon GH Actions environment variable
- Check which GitHub Actions workflow/skill is using the Kaneda bot token and where it's configured
- Verify `NERV_02` repo secrets for any `TELEGRAM_BOT_TOKEN` that matches `8573892946:AAFzDV6eDwiOr_Azj-eKOODV9UD-Fpf-LD4`

---

## Current State of Files

| File | Status | Notes |
|------|--------|-------|
| `C:/Users/Rohan/.openclaw/workspace/aasara-deck/aasara_deck.html` | ✅ Complete | 5-page deck, India theme, no Hindi, Hyderabad images |
| `C:/Users/Rohan/Desktop/aasara_deck.pdf` | ✅ Complete | 803KB, sent to Telegram msg ID 220 |

---

## Decisions Made

- **Remove founder page entirely** (not replace) — reason: user said "for now", keep deck tight at 5 pages
- **Hyderabad skyline (night) for hero** — reason: immediately establishes Hyderabad identity; dark enough for navy overlay with AASARA branding
- **Saffron `#E07829` as secondary accent** — reason: culturally Indian without requiring any text-based cultural markers
- **No Hindi text anywhere** — reason: user explicitly requested clean/global/professional tone
- **Bypass OpenClaw to send PDF** — reason: 409 conflict makes Kaneda non-functional; used direct Telegram Bot API `sendDocument` curl instead
- **Use `cmd /c "taskkill..."` for Windows process kill** — reason: bash on Windows treats `/F` as filepath prefix

---

## Blockers & Open Questions

- **Kaneda 409 conflict is unresolved** — Kaneda cannot receive or respond to messages while external poller is active. Bot is essentially dead for interactive use until fixed.
- **Which Aeon skill/workflow is polling Kaneda's token?** — Need to check NERV_02 GitHub repo secrets and workflow files for `TELEGRAM_BOT_TOKEN` matching `8573892946:...`
- **OpenClaw is running but receiving no Telegram messages** — because incoming updates are being consumed by the competing process before OpenClaw sees them

---

## Exact Next Step

1. Go to GitHub → `bludragon66613-sys/NERV_02` → Settings → Secrets
2. Find any secret named `TELEGRAM_BOT_TOKEN` or similar — check if it matches `8573892946:AAFzDV6eDwiOr_Azj-eKOODV9UD-Fpf-LD4`
3. If yes: either create a new dedicated bot via @BotFather and update either OpenClaw or Aeon's token, OR switch Aeon's Telegram calls to webhook-only (no polling)
4. After fix: run `openclaw gateway restart` and test by sending a message to @kaneda6bot

---

## Environment & Setup Notes

- **Kaneda bot token:** `8573892946:AAFzDV6eDwiOr_Azj-eKOODV9UD-Fpf-LD4`
- **Rohan's Telegram chat ID:** `6871336858`
- **Send PDF directly (bypass OpenClaw):**
  ```bash
  curl -s -F "chat_id=6871336858" -F "document=@/path/to/file.pdf" \
    "https://api.telegram.org/bot8573892946:AAFzDV6eDwiOr_Azj-eKOODV9UD-Fpf-LD4/sendDocument"
  ```
- **OpenClaw gateway:** runs as Windows Scheduled Task / login item on port 18789
- **Kill a PID on Windows from bash:** `cmd /c "taskkill /PID {pid} /F"`
