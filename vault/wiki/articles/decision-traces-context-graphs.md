# Decision Traces and Context Graphs

> Source: [[raw/ashugarg-decision-traces|Ashugarg Decision Traces]]
> Author: Ashu Garg, Foundation Capital
> Date: 2026-04-02

---

## Summary
B2C platforms built moats by instrumenting **behavioral traces**. Enterprise never had this because B2B decisions were multiplayer negotiations across sales/legal/finance/ops.

The new compounding asset is **decision traces**: the reasoning layer between event and outcome. Structured and connected, this becomes a **context graph**.

Three shifts: instrumentable surfaces, LLMs making unstructured data computable, agents forcing judgment explicit.

**Architectural key**: Winners sit in the **write path** (capturing decisions as they happen), not the read path (ETL after).

## Relevance to Our Stack
- **Paperclip**: 451-agent orchestration produces structured reasoning artifacts
- **Context graphs**: Our knowledge-base + wiki-linter + MOC is the personal/org version
- **Write vs read**: Paperclip is write path. Knowledge base is read path. Long-term: merge them.
- **Moat**: TallyAI moat = accumulated decision traces of Indian SME accounting problem-solving

---

See also: [[Karpathy's LLM Knowledge Bases]], [[claude-obsidian-memory-stack]]

