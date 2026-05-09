---
name: Paperclip onboard quirks
description: Non-obvious behavior of `pnpm paperclipai onboard -y` and recovery recipe on mac
type: project
originSessionId: 95cbcd4d-21b8-44d2-af7c-87e5c2ffcc63
---
`pnpm paperclipai onboard -y` is NOT a pure config-write — it also boots a server (effectively implies `--run`). If `:3100` is busy, it picks the next free port (e.g. `:3101`) and runs there until killed. Output is silent for ~60s then dumps a full ASCII banner once server is listening.

**Why:** silent startup + implicit `--run` made the wizard look hung when actually it was provisioning DB, generating JWT, and binding a second listener. Killing it mid-flight (SIGTERM, exit 143) still leaves the JWT + company records persisted in `~/.paperclip/instances/default/db` because writes happen before the bind.

**How to apply:** if onboarding silently and original dev:server is running, do not assume hung. Wait ≥90s. After onboard ends, restart the original dev:server (`:3100`) so it loads the new JWT from `~/.paperclip/instances/default/config.json`. Health endpoint is `/api/health` not `/health`. Onboard recovery: `cd ~/paperclip && pnpm paperclipai onboard -y` from a clean state with no other paperclip server running.

Verified 2026-05-09: company `041efb27-4cbd-46df-ae5e-492e04451229` provisioned, agent JWT set, dev:server reboot picks it up.
