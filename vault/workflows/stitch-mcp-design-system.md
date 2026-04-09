---
title: stitch mcp design system
type: workflow
status: active
---

# Google Stitch 2.0 + Claude Code via MCP Workflow

**Source:** Prajwal Tomar (@PrajwalTomar_)  
**Date:** 2026-03-26  
**Link:** https://x.com/prajwaltomar_/status/2037104246647382058

## Core Thesis

Stitch 2.0 isn't just a design tool — it's a **design system generator**. It auto-builds a \design.md\ file (typography, colors, components, rules) that becomes the single source of truth for Claude Code. No more design drift across screens.

## The Problem It Solves

Before: AI-built apps suffer from design drift. Every prompt is a different context — colors shift, fonts change, spacing becomes inconsistent. App looks like 10 different people built it.

After: \design.md\ locks the design language. Claude Code references it on every prompt. Consistency solved by one markdown file.

## The Workflow

### 1. Generate Design in Stitch
- Screenshot your app or drop in Dribbble/21st.dev refs
- Write one focused prompt: what the app does, which screens to redesign, design direction (dark mode, minimal, editorial), font preferences
- Stitch generates multiple variants — **curate, don't just accept**. Pull best elements from each (typography from one, layout from another, color energy from a third)
- Stitch generates **images first**, then code. Not constrained by HTML/CSS limits. You work backwards from the visual reference.

### 2. Export design.md
- Go to right-hand panel → Design Systems → click into auto-generated system
- Click \design.md\ → copy entire file
- Create \design.md\ in your project root → paste → save
- This is now the **single source of truth** for your design language

### 3. Connect Stitch to Claude Code via MCP
- Get API key from Stitch Settings → API
- Install Stitch MCP server (check Google Stitch docs for "Google Stitch MCP setup")
- Paste install command + API key into Claude Code terminal
- Start new session → Stitch shows as connected

### 4. Prompt Claude Code
\\\
"Update the dashboard screen to match the layout of the desktop frame in Google Stitch using the Stitch MCP."
\\\
Claude will:
- List your Stitch projects
- Find the right frame
- Fetch the source code
- Rebuild UI to match

## What design.md Contains

- Typography scales (display, headline, label, title, body fonts)
- Primary, secondary, tertiary color palettes (auto-generated, complementary)
- Color scales for every shade
- Component rules and patterns
- Elevation and depth specs
- Dos and don'ts for your design language

## Full Stack Integration (Post-Design)

Once design is solid, use Claude Code to handle infrastructure in the same session:

- **Auth:** Supabase — generate token from Supabase, Claude sets up user accounts, login flows, role-level security
- **Payments:** Stripe — create product in Stripe dashboard, give Claude public/secret keys, it finds product ID, builds checkout flow, connects to user system (test with \4242 4242 4242 4242\ first)
- **Email:** Resend — password resets, welcome emails, notifications auto-wired
- **Deploy:** Push to GitHub → deploy to Vercel. One click, site live.

## Caveats

- Fonts sometimes need manual nudging after Claude applies design
- Colors don't always carry exact shades
- MCP reads HTML/CSS, so complex designs may be interpreted slightly differently
- Token-heavy — longer sessions cost more
- Stitch sometimes designs features that don't exist in your app yet (e.g., "recent activity" section). Be explicit with Claude about what to include/skip.

## Why This Matters

What used to cost \–10K + weeks (hire designer, wait for Figma, implement designs) now takes one person an afternoon. The workflow isn't perfect yet, but it's **dramatically better** than everything before it.

## Related Workflows

- [[30-day-saas-claude-code]] — Full SaaS build playbook
- [[structured-design-critique-ai]] — Using taste signals to improve AI design outputs

