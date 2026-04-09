---
name: fuzzing
description: Coverage-guided fuzzing tools, harness writing, and crash analysis across C/C++, Rust, Python, and Ruby
type: moc
---

# Fuzzing

Fuzzing finds bugs that static analysis misses by generating random inputs at scale. This graph covers tools, harness writing, and analysis.

## By Language

**C/C++** — the most mature fuzzing ecosystem:
- [[libfuzzer]] — LLVM's built-in coverage-guided fuzzer (simplest to start)
- [[aflpp]] — AFL++ fork with better performance and mutators
- [[libafl]] — modular fuzzing library for building custom fuzzers
- [[address-sanitizer]] — detects memory errors during fuzzing (essential companion)

**Rust:**
- [[cargo-fuzz]] — the de facto Rust fuzzer using libFuzzer under the hood

**Python:**
- [[atheris]] — coverage-guided Python fuzzer based on libFuzzer

**Ruby:**
- [[ruzzy]] — coverage-guided Ruby fuzzer by Trail of Bits

## Writing Harnesses

[[harness-writing]] covers techniques for writing effective fuzzing harnesses across all languages. The harness is where most of the work lives — good harnesses find bugs, bad harnesses waste cycles.

[[fuzzing-dictionary]] guides building domain-specific token dictionaries that help fuzzers find interesting inputs faster.

[[fuzzing-obstacles]] documents techniques for patching code to overcome fuzzing blockers — checksums, magic bytes, complex state machines.

## Analysis & Coverage

[[coverage-analysis]] measures code exercised during fuzzing. Use it to identify unreached code paths and improve harness quality.

## Infrastructure

[[ossfuzz]] provides free continuous fuzzing for open-source projects — integration setup, build configurations, and ClusterFuzz dashboard.

## Related

- [[security]] MOC for vulnerability detection beyond fuzzing
- [[testing-handbook-generator]] extracts fuzzing guidance from Trail of Bits' handbook
