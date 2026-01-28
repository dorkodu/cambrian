# CIP-02: Note Events & Content Format

> **Status:** 🔲 Draft  
> **Created:** 2026-01-26  
> **Requires:** CIP-01

---

## Abstract

This CIP defines the event format for notes — the atomic unit of knowledge in Cambrian gardens.

---

## Motivation

Notes are the core building block of a digital garden. They need to:
- Support rich text (Markdown)
- Enable wiki-style linking
- Maintain version history
- Be parseable by humans and AI

---

## Specification

### 1. Note Event (Kind 30078)

Notes use kind `30078` (parameterized replaceable).

```typescript
interface NoteEvent extends CambrianEvent {
  kind: 30078;
  tags: [
    ["d", string],           // Note slug/identifier
    ["title", string],       // Human-readable title
    ["cid", string],         // Content hash
    ["parent", string]?,     // Previous version CID
    ["t", string][],         // Tags/labels
    ["published", string]?,  // ISO timestamp for public notes
  ];
  content: string;           // JSON-encoded NoteContent
}
```

### 2. Note Content Structure

The `content` field contains JSON-encoded note data:

```typescript
interface NoteContent {
  // Required
  body: string;              // Markdown content
  
  // Optional
  title?: string;            // Explicit title (else from first heading)
  summary?: string;          // AI-generated or manual summary
  
  // Metadata
  wordCount?: number;
  readingTime?: number;      // Minutes
  
  // AI Context
  aiContext?: {
    topics?: string[];       // Extracted topics
    entities?: string[];     // Named entities
    sentiment?: string;      // Overall sentiment
  };
}
```

### 3. Markdown Extensions

Cambrian Markdown supports standard CommonMark plus:

#### Wiki Links

```markdown
See my thoughts on [[cats]]
Reference specific note [[pets/cats]]
Link with alias [[cats|feline friends]]
```

Parsed as:
```typescript
interface WikiLink {
  target: string;      // "cats" or "pets/cats"
  alias?: string;      // "feline friends"
}
```

#### Block References

```markdown
Reference a specific block ![[note-id#^block-id]]
```

#### Transclusion

```markdown
Embed another note's content:
![[other-note]]
```

### 4. Note Identifier (d-tag)

The `d` tag uniquely identifies a note within an author's garden:

- MUST be URL-safe: `[a-z0-9-_/]+`
- SHOULD be human-readable
- MAY use paths for organization: `projects/cambrian/ideas`

Examples:
- `daily-2026-01-26`
- `books/thinking-fast-and-slow`
- `recipes/chocolate-cake`

### 5. Version History

Notes maintain history through content addressing:

```
note-v1 (cid: abc123, parent: null)
    ↓
note-v2 (cid: def456, parent: abc123)
    ↓
note-v3 (cid: ghi789, parent: def456)  ← current
```

Clients SHOULD:
- Store the version chain locally
- Allow viewing previous versions
- Support diff between versions

### 6. Note Lifecycle

```
┌──────────┐
│  DRAFT   │ ← Not synced, local only
└────┬─────┘
     │ save
     ▼
┌──────────┐
│  LOCAL   │ ← Saved locally, pending sync
└────┬─────┘
     │ sync
     ▼
┌──────────┐
│  SYNCED  │ ← Published to nodes
└────┬─────┘
     │ publish (add "published" tag)
     ▼
┌──────────┐
│  PUBLIC  │ ← Discoverable by others
└──────────┘
```

---

## Examples

### Basic Note Event

```json
{
  "id": "a1b2c3...",
  "pubkey": "d4e5f6...",
  "created_at": 1706234400,
  "kind": 30078,
  "tags": [
    ["d", "my-first-garden-note"],
    ["title", "My First Note"],
    ["cid", "QmXyz..."],
    ["t", "getting-started"],
    ["t", "meta"]
  ],
  "content": "{\"body\":\"# My First Note\\n\\nThis is my first note in Cambrian!\\n\\nI should link to [[other-ideas]] later.\"}",
  "sig": "..."
}
```

### Note with Version History

```json
{
  "kind": 30078,
  "tags": [
    ["d", "evolving-thought"],
    ["title", "An Evolving Thought"],
    ["cid", "Qm789..."],
    ["parent", "Qm456..."],
    ["t", "philosophy"]
  ],
  "content": "{\"body\":\"# An Evolving Thought\\n\\nUpdated with new insights...\"}"
}
```

---

## AI Considerations

Notes SHOULD include AI-friendly metadata:

```json
{
  "aiContext": {
    "topics": ["productivity", "note-taking", "knowledge-management"],
    "entities": ["Cambrian", "Zettelkasten", "Luhmann"],
    "sentiment": "positive"
  }
}
```

This enables:
- Better semantic search
- Contextual AI suggestions
- Knowledge graph analysis

---

## Client Requirements

Clients MUST:
- Parse wiki-links from Markdown body
- Generate CIDs for content
- Maintain local version history

Clients SHOULD:
- Extract title from first heading if not explicit
- Calculate word count and reading time
- Generate AI context on save

---

## References

- [CommonMark Spec](https://commonmark.org/)
- [Obsidian Wiki Links](https://help.obsidian.md/Linking+notes+and+files/Internal+links)
- [CIP-01: Core Protocol](./cip-01-core.md)
