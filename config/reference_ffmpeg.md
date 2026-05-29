---
name: ffmpeg install (mac arm64)
description: Static ffmpeg 7.1.1 arm64 binary at ~/.local/bin/ffmpeg, sourced from osxexperts.net (no brew needed)
type: reference
originSessionId: e43f0db4-e97d-4ab3-bbc9-541ecd326787
---
`~/.local/bin/ffmpeg` — static ffmpeg 7.1.1 arm64 build.

**Why:** brew was not installed on this mac, evermeet.cx ships x86_64 only (Bad CPU type on arm64 host without Rosetta), osxexperts.net ships native arm64 zip.

**How to apply:** When transcoding video on this mac, use `~/.local/bin/ffmpeg` directly. To re-install or update:

```bash
node -e 'fetch("https://www.osxexperts.net/ffmpeg711arm.zip").then(async r=>{const fs=require("fs");fs.writeFileSync("/tmp/f.zip",Buffer.from(await r.arrayBuffer()))})'
cd /tmp && unzip -o f.zip && mv ffmpeg ~/.local/bin/ffmpeg && chmod +x ~/.local/bin/ffmpeg
```

For higher version: change `ffmpeg711arm.zip` to current build (check osxexperts.net).

**Hero-loop transcode preset that worked for ssquare:**
```
ffmpeg -i src.mp4 -c:v libx264 -crf 26 -preset slow -movflags +faststart -pix_fmt yuv420p -an out.mp4
```
5.4 MB → 1.8 MB at visually-equivalent quality, faststart preserved (verify moov@offset 32).
