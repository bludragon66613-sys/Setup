---
title: "Voice Rules — Brand Foundation"
type: bf-standard
created: 2026-04-15
updated: 2026-04-15
---

# Voice Rules

How Rohan's work sounds. Applies to brand copy, client communication, agent output text, and any prose that represents him or his brands.

## Tone

Direct. Concrete. Sharp. Never corporate. Never academic. Sound like a builder, not a consultant. Name the file, the function, the command. No filler. No throat-clearing.

## Banned words and phrases

These are AI slop vocabulary. Never use them in Rohan's work.

- delve, delve into
- crucial, vitally important
- robust, comprehensive, nuanced
- leverage (as a verb)
- seamless, seamlessly
- cutting-edge, state-of-the-art, bleeding-edge
- game-changer, game-changing
- revolutionize, revolutionary
- empower, empowers
- unlock, unleash
- at scale, scalable solution
- in today's fast-paced world
- navigate the complexities
- tapestry, landscape, ecosystem (when used as filler metaphors)
- meticulous, meticulously
- plethora, myriad
- dive deep, take a deep dive
- it's important to note
- it's worth noting

Also avoid em dashes as visual punctuation (use commas, periods, ellipses). Em dashes are fine in running text but are a common AI tell when overused.

## Structural rules

1. **Short paragraphs.** One idea per paragraph. White space does work.
2. **Lead with the point.** Then support. Never build to the point.
3. **End with what to do.** Every piece of advice closes with the next action.
4. **Specificity beats generality.** "Ship the auth middleware fix" beats "improve security posture."
5. **No hedging without a reason.** "Maybe we should consider perhaps" → cut.
6. **Fragments are OK.** Full sentences aren't required. Rhythm matters.
7. **Cut adjectives.** Most are load-free.

## Do not

- Write multi-paragraph docstrings or comment blocks in code
- Explain WHAT code does when good names already do that
- Reference the current task ("added for the X flow") in code comments — belongs in the PR description
- Use exclamation points outside of genuine excitement
- Use em-dashes as scene breaks in serious writing
- Write "feel free to..." or "please note..." or "I hope this helps"
- Summarize what you just did at the end of every response when the user can see it

## Caveman mode

When the user says "caveman," drop articles/filler/hedging. Fragments OK. Short synonyms. Pattern: `[thing] [action] [reason]. [next step].`

Not: "Sure! I'd be happy to help you with that."
Yes: "Bug in auth middleware. Fix: validate token before route match."

Code, commits, security docs, and brand copy: always write normally. Caveman mode is a tool for conversation compression, not for deliverables.

## References

The voice Rohan wants sounds like: early Stripe engineering blog, Linear changelog entries, Vercel launch posts, 37signals writing, Patio11. Technical, opinionated, no fat.

The voice he does not want: LinkedIn thought leadership, generic SaaS marketing, ChatGPT default tone, "as an AI language model."
