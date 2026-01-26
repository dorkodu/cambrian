# Agent Guidelines for Cambrian Development

> Guidelines for AI agents assisting with Cambrian development

---

## Project Context

**Cambrian** is a decentralized digital garden protocol built with:
- Full-stack TypeScript
- Local-first architecture (SQLite/IndexedDB)
- Nostr for decentralized distribution
- AI-native design patterns

## Core Directories

```
cambrian/
├── docs/              # Documentation & specifications
├── packages/          # Monorepo packages
│   ├── core/          # Protocol core (data models, sync, crypto)
│   ├── client/        # Client SDK for apps
│   ├── relay/         # Custom Nostr relay implementation
│   ├── app/           # Reference application
│   └── shared/        # Shared utilities
├── specs/             # Protocol specifications
└── examples/          # Usage examples
```

---

## Development Principles

### 1. TypeScript Standards

```typescript
// ✅ Prefer explicit types over inference for public APIs
export function createNote(content: string, options: NoteOptions): Note { }

// ✅ Use discriminated unions for state
type SyncState = 
  | { status: 'idle' }
  | { status: 'syncing'; progress: number }
  | { status: 'error'; error: Error }

// ✅ Prefer composition over inheritance
interface Note extends Timestamped, Identifiable, Linkable { }

// ✅ Use Result types for operations that can fail
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }
```

### 2. Local-First Patterns

```typescript
// ✅ All operations must work offline first
async function saveNote(note: Note): Promise<Result<Note>> {
  // 1. Save to local store (always works)
  await localStore.save(note);
  
  // 2. Queue for sync (doesn't block)
  syncQueue.enqueue({ type: 'note-saved', note });
  
  // 3. Return immediately
  return { ok: true, value: note };
}

// ✅ Sync is eventual, not blocking
sync.on('conflict', (local, remote) => {
  // CRDT-merge or prompt user
});
```

### 3. Content Addressing

```typescript
// ✅ All content is addressable by hash
interface ContentAddressable {
  readonly cid: string;  // Content ID (hash of content)
  readonly content: unknown;
}

// ✅ Note versions form an immutable chain
interface NoteVersion {
  cid: string;
  parent: string | null;  // Previous version's CID
  content: NoteContent;
  signature: string;      // Author's signature
}
```

### 4. Nostr Integration

```typescript
// ✅ Use custom event kinds for Cambrian data
const CAMBRIAN_NOTE_KIND = 30078;  // Parameterized replaceable
const CAMBRIAN_LINK_KIND = 30079;
const CAMBRIAN_GARDEN_META = 30080;

// ✅ Events are signed Nostr events
interface CambrianEvent extends NostrEvent {
  kind: number;
  tags: string[][];  // NIP-compliant tags
  content: string;   // JSON-encoded payload
}
```

---

## Code Quality Standards

### Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @cambrian/core test

# Run with coverage
pnpm test:coverage
```

**Expectations:**
- Unit tests for all public APIs
- Integration tests for sync scenarios
- Property-based tests for CRDT logic

### Linting & Formatting

```bash
# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm typecheck
```

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(core): add conflict resolution for note merges
fix(sync): handle relay disconnect gracefully
docs: update protocol specification
test(client): add offline sync integration tests
```

---

## Architecture Decisions

### ADR-001: SQLite for Native, IndexedDB for Web
- Native apps use SQLite via better-sqlite3
- Web uses IndexedDB via Dexie
- Shared abstraction layer (`StorageProvider`)

### ADR-002: Nostr as Transport, Not Storage
- Nostr relays are for distribution
- Local storage is source of truth
- Relay data is replicated, not primary

### ADR-003: CID-Compatible Hashing
- Use sha256 for content hashing
- Encode as base58btc (like IPFS CIDs)
- Enables future IPFS interop

### ADR-004: CRDT-Inspired Sync
- Last-write-wins for simple conflicts
- Custom merge for structured data
- User resolution for semantic conflicts

---

## Key APIs to Know

### Note Operations
```typescript
import { createNote, updateNote, linkNotes } from '@cambrian/core';

const note = createNote({
  content: '# My Thought\n\nThis is important.',
  tags: ['idea', 'research'],
});

const updated = updateNote(note, {
  content: note.content + '\n\nAdded more context.',
});

linkNotes(noteA, noteB, { type: 'references' });
```

### Sync Operations
```typescript
import { SyncEngine } from '@cambrian/sync';

const sync = new SyncEngine({
  storage: localStore,
  relays: ['wss://relay.cambrian.network'],
});

sync.start();
sync.on('synced', (stats) => console.log('Synced:', stats));
```

### AI Context Export
```typescript
import { exportContext } from '@cambrian/core';

// Export notes for AI consumption
const context = exportContext(garden, {
  format: 'markdown',
  includeLinks: true,
  maxTokens: 4000,
});
```

---

## Common Tasks

### Adding a New Event Kind
1. Define kind constant in `packages/core/src/events/kinds.ts`
2. Add TypeScript interface in `packages/core/src/events/types.ts`
3. Implement serializer in `packages/core/src/events/serializers.ts`
4. Add to relay filter in `packages/relay/src/filters.ts`
5. Write tests for round-trip serialization

### Implementing a New Sync Strategy
1. Create strategy in `packages/sync/src/strategies/`
2. Implement `SyncStrategy` interface
3. Register in strategy factory
4. Add integration tests with mock relays

### Adding Client Features
1. Add API in `packages/client/src/api/`
2. Expose through main client interface
3. Add React hook if applicable
4. Document in `packages/client/README.md`

---

## Reference Links

- [Nostr NIPs](https://github.com/nostr-protocol/nips)
- [Noosphere Design](../noosphere/design/)
- [CRDT Resources](https://crdt.tech)
- [Local-First Software](https://www.inkandswitch.com/local-first/)

---

## When In Doubt

1. **Prioritize offline functionality** — If it doesn't work offline, reconsider
2. **Keep data portable** — Can the user export and leave?
3. **Think about AI** — Would an AI agent understand this data?
4. **Test sync edge cases** — What if two devices edit simultaneously?
5. **Follow the constitution** — Reference `project-constitution.md`

---

*This document evolves with the project. Update as patterns emerge.*
