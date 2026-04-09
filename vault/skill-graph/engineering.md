---
name: engineering
description: Architecture patterns, API design, database operations, and backend infrastructure — the core software engineering graph
type: moc
---

# Engineering

Core software engineering patterns and infrastructure. For language-specific patterns, see [[languages]] MOC.

## Architecture & Design

[[api-design]] — REST API design patterns: resource naming, status codes, pagination, versioning. [[backend-patterns]] — backend architecture, microservices, and API development.

[[coding-standards]] — universal coding standards across all languages. [[coding-debugger]] — systematic debugging with root cause analysis first.

## Databases

[[postgres-patterns]] — PostgreSQL query optimization, schema design, indexing, and performance tuning. [[clickhouse-io]] — ClickHouse analytics patterns for OLAP workloads.

[[database-migrations]] — migration best practices for safe schema changes. [[jpa-patterns]] — JPA/Hibernate entity design and relationship patterns.

## Infrastructure

[[docker-patterns]] — Docker and Docker Compose for local development and containerization. [[deployment-patterns]] — deployment workflows, CI/CD pipelines, and container orchestration.

[[devcontainer-setup]] — creates devcontainers with Claude Code and language-specific tooling. [[seatbelt-sandboxer]] — macOS Seatbelt sandbox configurations.

## AI / ML Engineering

[[cost-aware-llm-pipeline]] — cost optimization for LLM API usage: model routing, caching, prompt compression. [[claude-api]] — Anthropic Claude API patterns for Python and TypeScript.

[[mcp-server-patterns]] — build MCP servers with custom tools, resources, and prompts. [[enterprise-agent-ops]] — operate long-lived agent workloads with observability.

## Patterns

[[content-hash-cache-pattern]] — cache expensive file processing using SHA-256 hashes. [[iterative-retrieval]] — progressively refine context retrieval for complex problems.

[[regex-vs-llm-structured-text]] — decision framework for choosing regex vs LLM for text parsing.

## Related

- [[languages]] MOC for framework-specific patterns
- [[testing]] MOC for TDD and verification
- [[security]] MOC for secure development
- [[deployment-patterns]] + [[docker-patterns]] for deployment and infrastructure
