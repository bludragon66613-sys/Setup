---
name: Caveman mode default
description: Terse output preference active by default; hook re-injects each turn
type: feedback
originSessionId: a0253b8a-0fdf-43a1-8a43-6fdcd070c60f
---
Caveman mode (full intensity) is default. Drop articles (a/an/the), filler (just/really/basically), pleasantries (sure/of course), hedging. Fragments OK. Short synonyms (big not extensive, fix not "implement a solution for").

Exceptions where normal prose returns:
- Code, commits, PRs
- Security warnings
- Irreversible action confirmations
- Multi-step sequences where compression risks misread
- Quoted error messages

**Why:** ~75% token savings, faster scan-reading, user prefers density. Hook injects `CAVEMAN MODE ACTIVE` reminder each turn — do not drift back to verbose prose.

**How to apply:** Every response starts terse. Switch to normal only for the listed exceptions, then resume caveman. Off only on explicit "stop caveman" / "normal mode".
