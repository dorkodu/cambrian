# Agent Guidelines for Cambrian Development

> Guidelines for AI agents assisting with Cambrian development

---

## Project Context

**Cambrian** is a decentralized digital garden protocol.

### Deliverables

1. **Protocol Specifications** (`/specs`) — CIPs defining the protocol
2. **TypeScript SDK** (`/packages/sdk`) — Isomorphic library
3. **Client App** (`/apps/client`) — React/Vite web app
4. **Node** (`/apps/node`) — Bun/Postgres relay server
5. **CLI** (`/apps/cli`) — Command-line tool

### Key Documents

| Document | Purpose |
|----------|---------|
| [plan.md](./plan.md) | Roadmap and deliverables |
| [architecture.md](./architecture.md) | System design |
| [constitution.md](./constitution.md) | Vision and principles |

### Specs to Know

| Spec | Description |
|------|-------------|
| [CIP-01](../specs/cip-01-core.md) | Event structure, signatures |
| [CIP-02](../specs/cip-02-notes.md) | Note format, wiki-links |

---

## Development Standards

### TypeScript

```typescript
// ✅ Explicit types for public APIs
export function createNote(content: string, options: NoteOptions): Note { }

// ✅ Discriminated unions for state
type SyncState = 
  | { status: 'idle' }
  | { status: 'syncing'; progress: number }
  | { status: 'error'; error: Error }

// ✅ Result types for fallible operations
type Result<T, E = Error> = 
  | { ok: true; value: T } 
  | { ok: false; error: E }
```

### Local-First Pattern

```typescript
// ✅ Operations must work offline
async function saveNote(note: Note): Promise<Result<Note>> {
  // 1. Save locally first (always works)
  await localStore.save(note);
  
  // 2. Queue for sync (non-blocking)
  syncQueue.enqueue({ type: 'note-saved', note });
  
  return { ok: true, value: note };
}
```

### Content Addressing

```typescript
// ✅ Notes are content-addressed
interface NoteVersion {
  cid: string;           // Content hash
  parent: string | null; // Previous version
  content: NoteContent;
  signature: string;
}
```

---

## Stack Reference

| Component | Technology |
|-----------|------------|
| Package Manager | pnpm |
| Build | Turbo + tsup |
| Testing | Vitest |
| Client | React 19, Vite, shadcn/ui, Tailwind |
| State | Zustand |
| Client Storage | Dexie (IndexedDB) |
| Node Runtime | Bun |
| Node Database | Postgres |
| Crypto | @noble/secp256k1 |

---

## Common Commands

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Type check
pnpm typecheck

# Build all packages
pnpm build

# Run client dev server
pnpm --filter @cambrian/client dev

# Run node
pnpm --filter @cambrian/node start
```

---

## When In Doubt

1. **Offline-first** — Must work without network
2. **Own your data** — Export always possible
3. **Check the specs** — CIPs are the source of truth
4. **Check constitution** — For philosophical guidance

---

*This document evolves with the project.*
