# Cambrian Architecture

> System architecture overview for the Cambrian protocol

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Web Client │  │Mobile (PWA) │  │     CLI     │              │
│  │   (React)   │  │   (React)   │  │    (Bun)    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          │                                       │
│              ┌───────────▼───────────┐                           │
│              │    @cambrian/sdk      │                           │
│              │  (Isomorphic TS SDK)  │                           │
│              └───────────┬───────────┘                           │
│                          │                                       │
│         ┌────────────────┼────────────────┐                      │
│         │                │                │                      │
│   ┌─────▼─────┐   ┌──────▼──────┐  ┌──────▼──────┐              │
│   │  Storage  │   │    Sync     │  │   Crypto    │              │
│   │  (Dexie)  │   │   Engine    │  │  (Keys/Sig) │              │
│   └───────────┘   └──────┬──────┘  └─────────────┘              │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │ WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       CAMBRIAN NETWORK                          │
│                                                                 │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │   Node A    │  │   Node B    │  │   Node C    │            │
│   │  (Self-host)│  │ (Community) │  │  (Backup)   │            │
│   │             │  │             │  │             │            │
│   │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │            │
│   │ │Postgres │ │  │ │Postgres │ │  │ │Postgres │ │            │
│   │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
│          ↑                ↑                ↑                    │
│          └────────────────┼────────────────┘                    │
│                     Relay Protocol                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. SDK (`/sdk`)

The core library, isomorphic TypeScript.

```
sdk/
├── src/
│   ├── core/
│   │   ├── event.ts        # Event structure, serialization
│   │   ├── note.ts         # Note operations
│   │   ├── link.ts         # Link management  
│   │   ├── garden.ts       # Garden container
│   │   └── identity.ts     # Key management
│   │
│   ├── crypto/
│   │   ├── keys.ts         # Ed25519/secp256k1 keypairs
│   │   ├── sign.ts         # Schnorr signatures
│   │   └── hash.ts         # SHA-256, CID generation
│   │
│   ├── storage/
│   │   ├── interface.ts    # Storage provider interface
│   │   ├── dexie.ts        # Browser IndexedDB
│   │   ├── postgres.ts     # Node Postgres
│   │   └── memory.ts       # In-memory (testing)
│   │
│   ├── sync/
│   │   ├── engine.ts       # Sync orchestration
│   │   ├── client.ts       # WebSocket relay client
│   │   ├── queue.ts        # Outbound sync queue
│   │   └── merge.ts        # Conflict resolution
│   │
│   ├── parser/
│   │   ├── markdown.ts     # Markdown parsing
│   │   └── wikilink.ts     # Wiki-link extraction
│   │
│   └── index.ts            # Public API
│
├── package.json
└── tsconfig.json
```

### 2. Client App (`/app`)

React-based web application.

```
app/
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── editor/         # Note editor
│   │   ├── graph/          # Graph visualization
│   │   └── layout/         # App layout
│   │
│   ├── routes/
│   │   ├── index.tsx       # Home/dashboard
│   │   ├── note.$id.tsx    # Note view/edit
│   │   ├── graph.tsx       # Graph explorer
│   │   └── settings.tsx    # Settings
│   │
│   ├── stores/
│   │   ├── garden.ts       # Garden state (Zustand)
│   │   ├── sync.ts         # Sync state
│   │   └── ui.ts           # UI state
│   │
│   ├── lib/
│   │   ├── sdk.ts          # SDK initialization
│   │   ├── storage.ts      # Dexie setup
│   │   └── utils.ts        # Utilities
│   │
│   └── main.tsx
│
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### 3. Node (`/node`)

Bun-based relay/node server.

```
node/
├── src/
│   ├── server/
│   │   ├── ws.ts           # WebSocket server
│   │   ├── handlers.ts     # Message handlers
│   │   └── filters.ts      # Event filtering
│   │
│   ├── storage/
│   │   ├── postgres.ts     # Postgres operations
│   │   ├── schema.sql      # Database schema
│   │   └── migrations/     # Schema migrations
│   │
│   ├── config.ts           # Node configuration
│   └── index.ts            # Entry point
│
├── Dockerfile
└── package.json
```

### 4. CLI (`/cli`)

Command-line interface tool.

```
cli/
├── src/
│   ├── commands/
│   │   ├── init.ts
│   │   ├── note.ts
│   │   ├── sync.ts
│   │   ├── export.ts
│   │   └── identity.ts
│   │
│   ├── lib/
│   │   ├── config.ts       # CLI config (~/.cambrian)
│   │   └── output.ts       # Terminal output helpers
│   │
│   └── index.ts            # CLI entry
│
└── package.json
```

---

## Data Flow

### Creating a Note

```
1. User types in editor
           │
           ▼
2. Note content saved to Zustand store
           │
           ▼
3. SDK creates NoteEvent
   - Generates CID from content
   - Sets parent CID (if edit)
   - Signs with user's key
           │
           ▼
4. Event written to Dexie (IndexedDB)
           │
           ▼
5. Event queued for sync
           │
           ▼
6. Sync engine publishes to connected nodes
           │
           ▼
7. Nodes validate and store event
```

### Syncing from Nodes

```
1. Client connects to node via WebSocket
           │
           ▼
2. Client sends subscription filters
   - Filter by pubkey, kinds, since
           │
           ▼
3. Node sends matching events
           │
           ▼
4. SDK validates signatures
           │
           ▼
5. Events merged into local store
   - Check for conflicts
   - Apply CRDT merge rules
           │
           ▼
6. Zustand store updated
           │
           ▼
7. React components re-render
```

---

## Conflict Resolution Strategy

```
Case 1: Same note edited on two devices
        
  Device A                    Device B
     │                            │
  edit v1 → v2a                edit v1 → v2b  
     │                            │
     └──────────┬─────────────────┘
                │
           both sync
                │
                ▼
        ┌───────────────┐
        │ Conflict Check │
        └───────┬───────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
 Merge?     LWW?      Ask User?
    │           │           │
    └───────────┴───────────┘
                │
            Resolved v3
```

**Default strategy:** Last-Write-Wins (LWW) with merge attempt for non-conflicting changes.

---

## Security Model

```
┌─────────────────────────────────────────┐
│           User's Private Key            │
│  (Never leaves device, stored in        │
│   secure storage or password-derived)   │
└───────────────────┬─────────────────────┘
                    │
                    ▼ signs
          ┌─────────────────┐
          │    Events       │ ← All events signed by author
          └─────────────────┘
                    │
                    ▼ verified by
          ┌─────────────────┐
          │  Nodes/Clients  │ ← Anyone can verify
          └─────────────────┘
```

- **Authentication**: Signature verification (no passwords)
- **Authorization**: Event pubkey = author (self-sovereign)
- **Privacy**: Private notes encrypted with NIP-44
- **Integrity**: Event IDs are content hashes

---

## Technology Choices

| Component | Choice | Rationale |
|-----------|--------|-----------|
| SDK Language | TypeScript | Full-stack, type safety |
| Client Framework | React | Ecosystem, hiring |
| Client State | Zustand | Simple, TypeScript-native |
| Client Storage | Dexie | Best IndexedDB DX |
| Client UI | shadcn/ui | Composable, Tailwind |
| Node Runtime | Bun | Fast, native TS, WebSocket |
| Node Database | Postgres | Reliable, JSON support |
| Protocol Layer | Nostr-inspired | Interop potential, simple |

---

*This document is updated as architecture evolves.*
