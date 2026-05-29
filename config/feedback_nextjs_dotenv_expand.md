---
name: Next.js dotenv-expand corrupts $-containing values
description: Bcrypt hashes and any value with literal `$` get chunks eaten by Next's @next/env loader; must escape with `\$`.
type: feedback
originSessionId: dae5ef10-80d9-49fe-ac33-393a180efc64
---
Next.js loads `.env.local` through `@next/env` which uses `dotenv-expand`. Any unquoted `$VAR` in a value is interpolated, including bcrypt hashes (`$2b$12$...`) which look like three sequential undefined variables.

**Why:** Hit this on the SSquare admin panel build (2026-05-10) — login kept rejecting the right password because Next read `ADMIN_PASSWORD_HASH=.dRfk92.2m4lYOFnsVLmoAzTVcSOeZkO` (32 chars instead of 60). Single-quoting the value didn't help — dotenv-expand strips quotes then interpolates anyway.

**How to apply:**
- For bcrypt hashes, AWS secrets, or anything with literal `$`, write `\$` in `.env*` files: `ADMIN_PASSWORD_HASH=\$2b\$12\$...`
- The `scripts/hash-password.ts` helper in `~/ssquare-claude` already emits `\$`-escaped hashes by default.
- To verify what Next actually reads: `node -e "const {loadEnvConfig}=require('@next/env'); loadEnvConfig(process.cwd()); console.log(process.env.X)"`.

Also note: Prisma CLI reads `.env` only, not `.env.local`. For one-off `prisma db push` / `db:seed`, prefix with `set -a && source .env.local && set +a &&`.
