# Cambrian Improvement Proposals (CIPs)

This directory contains the official specifications for the Cambrian protocol.

## What are CIPs?

CIPs (Cambrian Improvement Proposals) define how Cambrian clients and nodes should behave. They are inspired by Nostr's NIPs but tailored for knowledge graph use cases.

## Status Legend

| Status | Meaning |
|--------|---------|
| 🔲 Draft | Initial proposal, under development |
| 🟡 Review | Ready for community review |
| 🟢 Final | Accepted and stable |
| ⚫ Deprecated | No longer recommended |

## Core Specifications

| CIP | Title | Status |
|-----|-------|--------|
| [01](./cip-01-core.md) | Core Protocol & Event Structure | 🔲 Draft |
| [02](./cip-02-notes.md) | Note Events & Content Format | 🔲 Draft |
| [03](./cip-03-links.md) | Link Events & Graph Structure | 🔲 Draft |
| [04](./cip-04-garden.md) | Garden Metadata & Identity | 🔲 Draft |
| [05](./cip-05-sync.md) | Sync Protocol & Conflict Resolution | 🔲 Draft |
| [06](./cip-06-encryption.md) | Encryption & Private Notes | 🔲 Draft |
| [07](./cip-07-ai.md) | AI Context Export | 🔲 Draft |

## Event Kinds

Reserved event kind ranges for Cambrian:

| Range | Purpose |
|-------|---------|
| 30078-30099 | Core note and garden events |
| 30100-30149 | Sync and replication events |
| 30150-30199 | Extension events |

## Implementation Requirements

- **MUST** — Absolute requirement
- **SHOULD** — Recommended but not required  
- **MAY** — Optional feature

## Contributing

1. Create a new CIP file following the template
2. Open a PR with your proposal
3. Gather feedback and iterate
4. Move to Final when consensus is reached
