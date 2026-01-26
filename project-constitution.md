# Cambrian: Project Constitution

> *A decentralized digital garden protocol for the age of AI companions*

---

## Vision Statement

**Cambrian** is a protocol and application for building **personal knowledge graphs** that are:
- **Local-first & offline-capable** — your thoughts belong on your device first
- **Decentralized & censorship-resistant** — built on Nostr for survivability
- **AI-native & agentic-ready** — designed as a memory layer for AI companions
- **Interoperable & portable** — credible exit, your data travels with you

We are building **tools for thought** that empower humans and their AI companions to think together.

---

## Core Philosophy

### 1. Knowledge as Garden, Not Filing Cabinet

Inspired by Zettelkasten, Evergreen Notes, and Digital Gardens:
- **Atomic notes**: Small, focused thoughts that grow connections over time
- **Bi-directional links**: Notes reference each other, forming a living graph
- **Evergreen cultivation**: Notes evolve and mature, not just accumulate
- **Emergence over organization**: Let structure emerge from connections

### 2. Local-First, Network-Optional

```
┌─────────────────────────────────────────────┐
│            Your Device (Primary)             │
│  ┌─────────────────────────────────────────┐ │
│  │    Local SQLite / IndexedDB Store       │ │
│  │    (Full ownership, always available)   │ │
│  └─────────────────────────────────────────┘ │
│                     ↓↑                       │
│              Sync Engine                     │
│          (Conflict-free merge)               │
└─────────────────────────────────────────────┘
                      ↓↑
        ┌─────────────────────────────┐
        │   Nostr Relays (Optional)   │
        │   (Distribution & backup)   │
        └─────────────────────────────┘
```

- Works fully offline
- Syncs when network available
- No server required for core functionality
- Relays are for distribution, not dependency

### 3. Self-Sovereign Identity

- **Own your keys** — cryptographic identity you control
- **Own your data** — portable, exportable, yours forever
- **Own your graph** — social connections stored locally

### 4. AI as Thought Partner

Cambrian is designed to be the **memory layer** for AI companions:
- Structured for semantic retrieval
- Rich metadata for context
- Version history for temporal awareness
- Permission model for AI access levels

---

## Technical Principles

### Protocol Layer

| Principle | Implementation |
|-----------|----------------|
| **Content Addressing** | Every note version has a unique hash (CID-like) |
| **Immutable History** | Git-like revision chain, space-efficient deltas |
| **Cryptographic Auth** | Ed25519 keypairs, signed events |
| **Decentralized Naming** | Petname system for human-readable references |
| **Conflict-Free Sync** | CRDT-inspired merge strategies |

### Network Layer (Nostr-Based)

| Aspect | Approach |
|--------|----------|
| **Transport** | Nostr relays with custom NIPs |
| **Event Kinds** | Custom kinds for garden events (notes, links, metadata) |
| **Relay Strategy** | Preferred relays + fallbacks, relay hints for discovery |
| **Encryption** | NIP-04/NIP-44 for private notes, cleartext for public gardens |

### Data Model

```
Garden (Root)
├── Notes (Atomic thoughts)
│   ├── content: Markdown + extensions
│   ├── metadata: timestamps, tags, AI context
│   ├── links: bi-directional references
│   └── history: version chain
├── Collections (Curated groupings)
├── Address Book (Petnames → pubkeys)
└── Settings (Preferences, AI permissions)
```

### Stack

| Layer | Technology |
|-------|------------|
| **Language** | TypeScript (full-stack) |
| **Client Runtime** | Browser, Electron/Tauri, React Native |
| **Storage** | SQLite (native), IndexedDB (web) |
| **Network** | Nostr protocol, WebSocket relays |
| **Sync** | Custom CRDT-inspired sync protocol |
| **AI Integration** | Structured context export, MCP support |

---

## Design Values

### From Noosphere, Adapted

> *"Unstoppable tools for thinking together"*

1. **Credible Exit** — You can always leave with your data
2. **Evolvability** — Protocol designed for extension
3. **Permissionless** — No gatekeepers for participation
4. **Subsidiarity** — Governance at the smallest practical level
5. **Pluralism** — Support many ways of thinking and organizing

### Cambrian-Specific

6. **AI Symbiosis** — First-class support for AI companions
7. **Agentic Readiness** — Structured for autonomous AI actions
8. **Progressive Disclosure** — Simple to start, powerful to master
9. **Interoperability** — Play well with existing tools

---

## What We Are NOT Building

- ❌ A centralized note-taking SaaS
- ❌ A blockchain-based system
- ❌ A social network (though gardens can be shared)
- ❌ A replacement for all note apps (we're opinionated)
- ❌ An AI that owns your thoughts

---

## Success Metrics

1. **Independence** — App works indefinitely without any server
2. **Portability** — Full export in open formats always available
3. **Resilience** — Data survives company failures, relay outages
4. **Utility** — AI companions can meaningfully use the knowledge
5. **Simplicity** — Non-technical users can participate

---

## Inspirations & Acknowledgments

- **Noosphere** — Protocol design, content addressing, principles
- **Zettelkasten** — Atomic notes, linking methodology
- **Obsidian/Logseq** — Local-first knowledge tools
- **Roam Research** — Block-level linking, bi-directional links
- **Nostr** — Decentralized protocol, censorship resistance
- **IPFS/IPLD** — Content addressing concepts
- **CRDTs** — Conflict-free collaboration

---

## License

This project will be released under **MIT + Apache-2.0** dual license.

---

*Cambrian: Where thoughts evolve.*
