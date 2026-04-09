---
name: blockchain
description: Smart contract vulnerability scanning across Solana, Ethereum/Cairo, Cosmos, Substrate, Algorand, and TON chains
type: moc
---

# Blockchain

Chain-specific vulnerability scanners and smart contract development guidance. Each scanner targets the critical vulnerabilities unique to its chain's execution model.

## Vulnerability Scanners

**EVM / StarkNet:**
- [[cairo-vulnerability-scanner]] — 6 critical Cairo/StarkNet vulnerabilities

**Solana:**
- [[solana-vulnerability-scanner]] — 6 critical Solana program vulnerabilities (missing signer checks, PDA validation, etc.)

**Cosmos:**
- [[cosmos-vulnerability-scanner]] — 9 consensus-critical vulnerabilities in Cosmos SDK chains

**Substrate / Polkadot:**
- [[substrate-vulnerability-scanner]] — 7 critical pallet vulnerabilities

**Algorand:**
- [[algorand-vulnerability-scanner]] — 11 common Algorand contract vulnerabilities

**TON:**
- [[ton-vulnerability-scanner]] — 3 critical TON smart contract vulnerabilities

## Development Guidance

[[guidelines-advisor]] provides smart contract best practices based on Trail of Bits' building-secure-contracts guidelines.

[[token-integration-analyzer]] analyzes token integration patterns and implementation risks — essential when integrating external tokens.

[[entry-point-analyzer]] identifies state-changing functions in contract codebases — the attack surface map.

## Related

- [[security]] MOC for general security practices
- [[fuzzing]] MOC — fuzzing is increasingly used for smart contract testing
