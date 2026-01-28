# Cambrian: AI Agent Kickstart Prompt

> Use this prompt to onboard AI agents to the Cambrian project

---

## The Prompt

```markdown
# Cambrian Development Context

You are assisting with **Cambrian**, a decentralized digital garden protocol. Here is your essential context:

## What is Cambrian?

Cambrian is a **local-first, AI-native digital garden** built on Nostr. Think of it as:
- Personal knowledge graph (like Obsidian/Roam) 
- That syncs over Nostr relays (decentralized)
- Designed as a memory layer for AI companions

## Core Concepts

### 1. Digital Garden Philosophy
- **Atomic Notes**: Small, focused thoughts (Zettelkasten-style)
- **Bi-directional Links**: Notes reference each other, forming a knowledge graph
- **Evergreen**: Notes evolve over time, they're cultivated not just stored
- **Public/Private**: Some notes are shared, others stay local

### 2. Technical Architecture

```
User's Device (SOURCE OF TRUTH)
├── Local Store (SQLite/IndexedDB)
│   ├── Notes with version history
│   ├── Links between notes
│   └── Sync queue
└── Sync Engine
    └── Publishes to → Nostr Relays (DISTRIBUTION ONLY)
```

### 3. Key Technical Choices
- **Language**: Full-stack TypeScript
- **Storage**: SQLite (native), IndexedDB (web)
- **Network**: Nostr protocol with custom event kinds
- **Sync**: CRDT-inspired conflict resolution
- **Identity**: Ed25519 keypairs (self-sovereign)

## Important Principles

1. **Offline-First**: Everything works without network
2. **Own Your Data**: Full export, credible exit always possible
3. **AI-Friendly**: Structured for semantic retrieval
4. **Nostr-Based**: Uses relays for sync, not as primary storage

## Event Kinds (Nostr)

| Kind | Description |
|------|-------------|
| 30078 | Note content (parameterized replaceable) |
| 30079 | Link between notes |
| 30080 | Garden metadata |

## Current Project Status

This is a **Day 0 project**. We are:
- [ ] Defining protocol specifications
- [ ] Setting up monorepo structure
- [ ] Building core data models
- [ ] Implementing local storage layer
- [ ] Creating sync engine
- [ ] Building reference client

## How to Help

When assisting with Cambrian:

1. **Read First**: Check `project-constitution.md` for philosophy, `agent.md` for code standards
2. **Local-First**: Every operation must work offline
3. **TypeScript**: Use strict types, prefer composition
4. **Test Sync**: Consider what happens with simultaneous edits
5. **Think AI**: Would an AI companion understand this data structure?

## Tech Stack Details

```json
{
  "runtime": "Node.js 20+ / Bun",
  "packageManager": "pnpm",
  "framework": "React (client), Hono (if needed)",
  "database": "better-sqlite3 / Dexie",
  "nostr": "nostr-tools",
  "testing": "Vitest",
  "build": "tsup / Vite"
}
```

## Relevant Nostr NIPs

- **NIP-01**: Basic protocol, event structure
- **NIP-23**: Long-form content (kind:30023)
- **NIP-27**: Text note references
- **NIP-32**: Labeling
- **NIP-51**: Lists
- **NIP-78**: Application-specific data

## Links to Reference

- Noosphere: `../noosphere/design/` (inspiration, not direct use)
- Nostr NIPs: https://github.com/nostr-protocol/nips
- Local-First: https://www.inkandswitch.com/local-first/
```

---

## Extended Context (For Deep Dives)

### Data Model Deep Dive

```typescript
// Core Note Structure
interface Note {
  id: string;           // Locally generated UUID
  cid: string;          // Content hash (for content addressing)
  pubkey: string;       // Author's public key
  
  content: string;      // Markdown content
  title?: string;       // Optional title (extracted or explicit)
  
  tags: string[];       // User tags
  links: Link[];        // Outgoing links
  backlinks: string[];  // Computed from incoming links
  
  createdAt: number;    // Unix timestamp
  updatedAt: number;
  
  syncState: SyncState;
  versions: NoteVersion[];
}

interface Link {
  targetNoteId: string;
  type: 'reference' | 'embed' | 'related';
  context?: string;     // Surrounding text for AI context
}

interface NoteVersion {
  cid: string;
  parentCid: string | null;
  content: string;
  timestamp: number;
  signature: string;
}
```

### Sync State Machine

```
┌─────────┐
│  LOCAL  │ ← Note created/edited
└────┬────┘
     │ queue for sync
     ▼
┌─────────┐
│ PENDING │ ← In sync queue
└────┬────┘
     │ connect to relay
     ▼
┌─────────┐
│ SYNCING │ ← Publishing to relays
└────┬────┘
     │ success / conflict
     ▼
┌─────────┐     ┌──────────┐
│ SYNCED  │ or  │ CONFLICT │
└─────────┘     └────┬─────┘
                     │ resolve
                     ▼
               ┌─────────┐
               │ SYNCED  │
               └─────────┘
```

### Garden Structure

```typescript
interface Garden {
  id: string;
  pubkey: string;
  name: string;
  description?: string;
  
  // Local data
  notes: Map<string, Note>;
  collections: Collection[];
  addressBook: Map<string, AddressEntry>;  // petnames
  
  // Sync metadata
  lastSynced: number;
  preferredRelays: string[];
  
  // AI settings
  aiAccess: AIAccessLevel;
  contextExportRules: ContextRule[];
}

type AIAccessLevel = 
  | 'full'      // AI can read all notes
  | 'tagged'    // AI only reads notes with #ai-visible
  | 'none'      // No AI access
```

---

## Questions to Clarify with User

When starting work, consider asking about:

1. **Priority**: Start with core protocol or reference app?
2. **Nostr Relay**: Use existing relays or build custom?
3. **Encryption**: NIP-04 or NIP-44 for private notes?
4. **AI Integration**: MCP? Function calling? RAG?
5. **Mobile**: React Native or PWA first?
6. **Identity**: Default key storage strategy?

---

## Quick Start Commands

```bash
# Clone and setup
cd ~/Code/cambrian
pnpm install

# Create package structure
mkdir -p packages/{core,client,sync,relay,app}

# Initialize TypeScript
pnpm create turbo@latest .

# Add dependencies
pnpm add -w typescript vitest
pnpm add -w nostr-tools better-sqlite3 dexie
```

---

*Use this prompt to get any AI agent up to speed on Cambrian development.*
