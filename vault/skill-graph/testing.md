---
name: testing
description: TDD workflows, verification loops, E2E testing, property-based testing, and quality assurance across all languages
type: moc
---

# Testing

Test-driven development methodology, verification patterns, and quality assurance. Language-specific testing skills are in [[languages]] MOC.

## TDD Workflow

[[test-driven-development]] — the canonical write-tests-first methodology. [[tdd-workflow]] — enforces RED → GREEN → REFACTOR cycle with coverage gates.

The workflow: write a failing test → implement minimal code to pass → refactor → verify 80%+ coverage.

## Verification

[[verification-loop]] — comprehensive verification system for Claude Code sessions. [[verification-before-completion]] — mandatory check before claiming work is done.

[[spec-to-code-compliance]] — verifies code implements exactly what documentation specifies. [[eval-harness]] — formal evaluation framework for measuring session quality.

## E2E Testing

[[e2e-testing]] — Playwright patterns, Page Object Model, configuration. Covers critical user flows and visual regression.

## Advanced Testing

[[property-based-testing]] — generate random inputs to find edge cases (cross-language guidance). [[ai-regression-testing]] — regression strategies for AI-assisted development.

[[testing-handbook-generator]] — extracts testing guidance from Trail of Bits' handbook for your specific project.

## Language-Specific Testing

Each language has its own testing skill — see [[languages]] MOC:
- Python: [[python-testing]] (pytest)
- Go: [[golang-testing]] (table-driven tests)
- Rust: [[rust-testing]] (cargo test)
- Kotlin: [[kotlin-testing]] (Kotest, MockK)
- Spring: [[springboot-tdd]] (JUnit 5, Mockito)
- Django: [[django-tdd]] (pytest-django)
- Laravel: [[laravel-tdd]] (PHPUnit, Pest)
- C++: [[cpp-testing]] (GoogleTest)
- Perl: [[perl-testing]] (Test2::V0)

## Verification Loops (Framework-Specific)

These run build + lint + test as a single gate:
- [[django-verification]]
- [[laravel-verification]]
- [[springboot-verification]]

## Related

- [[workflow]] MOC for the full development pipeline
- [[security]] MOC — security testing overlaps here
- [[fuzzing]] MOC — fuzz testing for crash discovery
