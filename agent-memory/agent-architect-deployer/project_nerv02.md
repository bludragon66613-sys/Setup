---
name: project_nerv02
description: NERV_02 project design system tokens and stack details
type: project
---

NERV_02 is an autonomous agent dashboard at C:\Users\Rohan\aeon\dashboard.

Stack: Next.js (app router), TypeScript, Tailwind CSS, Geist Sans + Geist Mono (from geist package).

The canonical design system lives in the `C` constant in app/nerv/page.tsx:

Backgrounds: bg #04040a, bgPanel #06070d, bgDeep #020206, (bgRaised #0a0c14 inferred)
Borders: border #12161e, borderHi #1c2230
Accent: orange #ff6600, orangeDim #7a3200
Semantic: red #cc0000, redBright #ff1100, green #00ff88, blue #0088ff, amber #ffaa00, yellow #ffcc00, purple #aa44ff
Text: textBright #d8e4f0, text #a8b4c4, textDim #2e3848, textMuted #181e28

Group color map: HYPERLIQUID #cc0000, INTEL #0088ff, OPERATIONS #ff6600, FINANCIAL #ffaa00, CREATIVE #aa44ff, MAINTENANCE #00ff88, META #ff2244

Signature motifs: corner bracket decoration (thin 1px lines), hex data cascade background, scan line animation, pulse ring on live indicators.

**Why:** This is a live trading intelligence dashboard with multiple skill groups running on GitHub Actions.
**How to apply:** Always use these exact tokens when extending NERV_02. Never invent new color values without referencing this system.
