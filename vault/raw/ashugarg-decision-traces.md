# Why decision traces will reshape B2B the way behavioral data reshaped B2C
> Source: https://x.com/ashugarg/status/2039745286483128449
> Author: Ashu Garg, Foundation Capital
> Date: 2026-04-02
> Tags: #context-graph #decision-traces #enterprise-ai #moat #write-path

---

## Core Thesis
Consumer platforms (Netflix, Meta, Amazon, TikTok, Google) built trillion-dollar empires on a compounding loop: every user interaction became a signal -> system learned -> product improved -> more interactions.

Enterprise software never had this loop because B2B decisions were multiplayer negotiations harder to observe.

The next compounding asset in B2B is **decision traces** - the reasoning layer between event and outcome.

## What Changed
1. Work lives on instrumentable surfaces (threads, docs, tickets, approvals)
2. LLMs make unstructured data computable
3. Agents force judgment explicit via approvals/edits/overrides

## Write Path vs Read Path
- Salesforce/Snowflake = read path (ETL after decisions)
- Agent platforms = write path (capture decisions as they happen)

## Relevance to Our Stack
- Paperclip 451-agent orchestration = decision trace layer for TallyAI
- Knowledge base + wiki-linter + MOC = personal/org context graph
- Long-term: merge write and read paths so agents write directly into context graph
- TallyAI moat = accumulated decision traces of Indian SME accounting problem-solving

