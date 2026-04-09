---
name: security
description: Security scanning, vulnerability detection, audit preparation, and secure development workflows — from code review to production hardening
type: moc
---

# Security

The security graph covers everything from writing secure code to auditing existing systems. Start from your current task and follow the links.

## Writing Secure Code

When building new features, start with [[security-review]] — it covers OWASP top 10 during development. For framework-specific security patterns:
- [[django-security]] for Django authn/authz and CSRF
- [[laravel-security]] for Laravel validation and middleware
- [[springboot-security]] for Spring Security configuration
- [[perl-security]] for taint mode and input validation

[[insecure-defaults]] catches fail-open configurations, hardcoded secrets, and weak crypto before they ship. [[guidelines-advisor]] provides smart contract development best practices from Trail of Bits.

## Static Analysis

[[semgrep]] runs parallel static analysis scans across your codebase. When the built-in rules aren't enough:
- [[semgrep-rule-creator]] writes custom detection rules for your patterns
- [[semgrep-rule-variant-creator]] ports existing rules across languages

[[codeql]] provides GitHub's semantic code analysis for deeper queries. [[sarif-parsing]] processes output from both into actionable findings.

## Audit & Review

Preparing for a formal security review? [[audit-prep-assistant]] walks you through Trail of Bits' checklist. [[audit-context-building]] enables line-by-line analysis for building detailed findings.

[[code-maturity-assessor]] scores codebase maturity across 9 categories. [[differential-review]] focuses on security-critical code changes in PRs.

[[fp-check]] eliminates false positives — verify suspected bugs before filing. [[variant-analysis]] finds similar vulnerabilities across the codebase after confirming one.

## Specialized Detection

- [[sharp-edges]] — finds error-prone APIs and dangerous defaults
- [[constant-time-analysis]] and [[constant-time-testing]] — detect timing side-channels in crypto code
- [[zeroize-audit]] — finds missing zeroization of sensitive data
- [[wycheproof]] — test vectors for validating cryptographic implementations
- [[yara-rule-authoring]] — detection rules for malware and suspicious patterns
- [[supply-chain-risk-auditor]] — identifies risky dependencies

## Blockchain Security

See [[blockchain]] MOC for smart contract vulnerability scanners.

## Tools

- [[burpsuite-project-parser]] — search and explore Burp Suite project files
- [[firebase-apk-scanner]] — scan Android APKs for Firebase misconfigurations
- [[sentry-code-review]] — analyze bugs from Sentry error monitoring

## Workflow

[[secure-workflow-guide]] ties it all together — Trail of Bits' 5-step secure development workflow. [[agentic-actions-auditor]] audits GitHub Actions for security vulnerabilities in CI/CD.
