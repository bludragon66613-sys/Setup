---
name: session_savepoint_2026-03-23e
description: Brand pipeline built — 10 new luxury villa brands replacing Virāma/SSquare. PowerShell pipeline generates 10 HTML/PDF presentations from tokenized template + JSON data.
type: project
---

# Session Savepoint — 2026-03-23e (~2:30am IST)

## What Was Built This Session

### Brand Generation Pipeline
**Location:** `~/branding-pipeline/brand-pipeline/`

| File | Purpose |
|------|---------|
| `generate-brands.ps1` | PowerShell script — reads template + JSON, outputs HTML + PDF per brand |
| `brand-template.html` | 10-slide A4 landscape template, all 37 `{{TOKEN}}` placeholders |
| `brand-data.json` | 10 complete brand entries with copy, colors, fonts, amenities |

**To run:** `cd ~/branding-pipeline/brand-pipeline && .\generate-brands.ps1`
Outputs 10 `.html` + 10 `.pdf` files to same directory.

### The 10 Brands (SSquare fully replaced)

| # | Project | Developer | Tagline | Palette |
|---|---------|-----------|---------|---------|
| 1 | **Āvāsa** | Stratum | Come Home to Nothing Else. | Void black · copper |
| 2 | **Nidra** | Kāla | Where Rest Has Its Own Address. | Charcoal · silver |
| 3 | **Śānti** | Vela | The End of All Noise. | Deep sage · warm gold |
| 4 | **Prāna** | Grove | Breathe. Own. Belong. | Dark forest · amber |
| 5 | **Ākāśa** | Zenith | Above. Always. | Night navy · aged gold |
| 6 | **Ambara** | Sōl | The Day Ends Here. | Deep umber · sunset gold |
| 7 | **Sthāna** | Mark | Position Is Everything. | True black · platinum |
| 8 | **Vihāra** | Terra | Retreat Into Permanence. | Terracotta · bronze |
| 9 | **Mandapa** | Arch | Architecture Made Intimate. | Dark slate · copper patina |
| 10 | **Svara** | Resonance | Life, Tuned to Perfection. | Deep indigo · luminous gold |

## What Has NOT Been Done Yet

- Script not run — needs `.\generate-brands.ps1` to verify output renders
- No real photography added (all `images` fields set to `"none"`, falls back to CSS color)
- No winner selected from the 10 — still exploratory

## Key Decisions

- **Standalone brands** — no "by SSquare" anywhere; each entry is a fully independent developer + project
- **Images default `none`** — pipeline works photo-free; add real images by updating JSON `images` fields
- **Original Virāma untouched** — `~/branding-pipeline/output/Virama_SSquare_Brand_Presentation.html` preserved

## Why:
User asked to drop SSquare brand and create 10 new modern brand concepts for the same 12-villa Jubilee Hills project, wired into a PowerShell generation pipeline.
