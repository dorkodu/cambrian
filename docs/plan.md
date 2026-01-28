# Cambrian Project Plan

> A decentralized digital garden protocol for the age of AI companions

---

## Project Deliverables

### 1. Protocol Specification (`/design`)
A formal specification like Nostr NIPs — clear, versioned, implementable.

| Spec | Description | Status |
|------|-------------|--------|
| CIP-01 | Core Protocol & Event Structure | 🔲 Draft |
| CIP-02 | Note Events & Content Format | 🔲 Draft |
| CIP-03 | Link Events & Graph Structure | 🔲 Draft |
| CIP-04 | Garden Metadata & Identity | 🔲 Draft |
| CIP-05 | Sync Protocol & Conflict Resolution | 🔲 Draft |
| CIP-06 | Encryption & Private Notes | 🔲 Draft |
| CIP-07 | AI Context Export | 🔲 Draft |

---

### 2. TypeScript SDK (`/sdk`)
Full-stack isomorphic library for clients and nodes.

```
sdk/
├── src/
│   ├── core/       # Data models, crypto, content addressing
│   ├── storage/    # Storage adapters (Dexie, Postgres)
│   ├── sync/       # Sync engine, relay client
│   └── index.ts    # Unified exports
├── package.json
└── tsconfig.json
```

**Capabilities:**
- Create, edit, link notes
- Manage gardens and identity
- Sync with nodes/relays
- Export AI context
- Works in browser + Node.js + Bun

---

### 3. Client App (`/app`)
The product — a daily-use digital garden application.

**Stack:**
- Vite + React 19
- shadcn/ui + Tailwind CSS
- Zustand (state management)
- Dexie (IndexedDB)
- TanStack Router

**Core Features:**
- [ ] Note editor with Markdown + wiki-links
- [ ] Graph visualization
- [ ] Full-text search
- [ ] Offline-first with sync indicator
- [ ] Public/private notes
- [ ] AI context export
- [ ] Settings & relay management

---

### 4. Node Implementation (`/node`)
Self-hostable network node (relay architecture).

**Stack:**
- Bun runtime
- Postgres (persistent storage)
- File system (blob storage)
- WebSocket server

**Capabilities:**
- Receive and store events
- Filter and query events
- Relay events to subscribers
- Optional: wrap existing Nostr relay

---

### 5. CLI Tool (`/cli`)
Command-line interface for full protocol interaction.

```bash
cambrian init              # Initialize local garden
cambrian note create       # Create a note
cambrian note list         # List notes
cambrian note link         # Link two notes
cambrian sync              # Sync with nodes
cambrian export            # Export garden
cambrian identity          # Manage keys
cambrian relay add/remove  # Manage relays
```

---

### 6. Website (`/www`)
Project website and documentation site.

---

## Repository Structure

```
cambrian/
├── app/            # Client application (React/Vite)
├── cli/            # Command-line interface
├── design/         # Protocol specifications (CIPs)
├── docs/           # Documentation
├── inspiration/    # Reference materials
├── node/           # Network node/relay (Bun/Postgres)
├── sdk/            # TypeScript SDK
├── www/            # Project website
├── package.json    # Workspace root
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Development Phases

### Phase 1: Foundation (Current)
- [x] Project vision & constitution
- [x] Initial planning documents
- [ ] Protocol specification drafts (CIP-01 to CIP-03)
- [ ] Monorepo setup with pnpm + turbo
- [ ] SDK core data models

### Phase 2: Core SDK
- [ ] Storage abstraction layer
- [ ] Content addressing implementation
- [ ] Note CRUD operations
- [ ] Linking system
- [ ] Basic sync protocol

### Phase 3: Node & Sync
- [ ] Node WebSocket server
- [ ] Event storage in Postgres
- [ ] Sync engine implementation
- [ ] CLI basic commands

### Phase 4: Client App
- [ ] UI component library setup
- [ ] Note editor
- [ ] Graph view
- [ ] Search
- [ ] Sync integration

### Phase 5: Polish & AI
- [ ] AI context export
- [ ] Encryption (private notes)
- [ ] Mobile PWA optimization
- [ ] Documentation site (www)

---

## Tech Stack Summary

| Component | Technology |
|-----------|------------|
| Language | TypeScript (strict) |
| Package Manager | pnpm |
| Build System | Turbo + tsup |
| Testing | Vitest |
| Client Framework | React 19 + Vite |
| Client UI | shadcn/ui + Tailwind |
| Client State | Zustand |
| Client Storage | Dexie (IndexedDB) |
| Node Runtime | Bun |
| Node Database | Postgres |
| Protocol Base | Nostr-inspired events |
| Identity | Ed25519 keypairs |

---

*Last updated: 2026-01-27*
