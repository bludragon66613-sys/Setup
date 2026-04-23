---
name: Next.js NEXT_PUBLIC_* env server fallback
description: Server-side helpers should accept NEXT_PUBLIC_* as a fallback when the public name is canonical for a secret's app id counterpart
type: feedback
originSessionId: bf3eb612-1bc4-4604-8b31-f79b2e03cc02
---
When a Next.js app uses a `NEXT_PUBLIC_FOO_APP_ID` env var for a provider (Privy, Clerk, Supabase, etc.), the server-side SDK helpers should read the app id as `process.env.FOO_APP_ID ?? process.env.NEXT_PUBLIC_FOO_APP_ID`, not just the bare name.

**Why:** Operators usually only set the `NEXT_PUBLIC_` variant because it's the only one the client needs. If server code insists on a second non-public copy, the server quietly disables auth (helper returns null → every protected route 401s) even though the client sign-in flow looks healthy. This burned drip on the Clerk→Privy migration: sign-in worked, but every `/api/*` route returned `{"ok":false,"error":"unauthorized"}` because `lib/privy.ts` only checked `PRIVY_APP_ID`.

**How to apply:** When writing `hasFoo()` / `fooServer()` helpers for any SDK whose app-id is exposed via a `NEXT_PUBLIC_` env, coalesce both names. Keep the secret name as-is.
