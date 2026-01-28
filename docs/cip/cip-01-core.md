# CIP-01: Core Protocol & Event Structure

> **Status:** 🔲 Draft  
> **Created:** 2026-01-26

---

## Abstract

This CIP defines the foundational data structures and protocols for Cambrian. It establishes how events are formatted, signed, and transmitted between clients and nodes.

---

## Motivation

Cambrian needs a simple, extensible event format that:
- Is compatible with Nostr infrastructure where beneficial
- Supports content-addressed, immutable data
- Enables offline-first operations with eventual sync
- Provides cryptographic authenticity

---

## Specification

### 1. Event Structure

Every piece of data in Cambrian is an **Event**. Events are JSON objects with the following structure:

```typescript
interface CambrianEvent {
  id: string;           // SHA-256 hash of serialized event (hex)
  pubkey: string;       // Author's public key (hex)
  created_at: number;   // Unix timestamp (seconds)
  kind: number;         // Event type identifier
  tags: string[][];     // Metadata tags
  content: string;      // Event payload (usually JSON)
  sig: string;          // Schnorr signature (hex)
}
```

### 2. Event ID Calculation

The event `id` is computed as:

```
id = sha256(serialize(event_without_id_and_sig))
```

Serialization format (UTF-8 JSON, no whitespace):

```json
[0,"<pubkey>",<created_at>,<kind>,<tags>,"<content>"]
```

### 3. Signatures

Events MUST be signed using Schnorr signatures over secp256k1 (same as Nostr/Bitcoin):

```
sig = schnorr_sign(private_key, id)
```

### 4. Event Kinds

Cambrian reserves the following event kind ranges:

| Kind | Description |
|------|-------------|
| 30078 | Note (parameterized replaceable) |
| 30079 | Link between notes |
| 30080 | Garden metadata |
| 30081 | Collection |
| 30082 | Address book entry |
| 30090 | Sync checkpoint |

### 5. Common Tags

| Tag | Format | Description |
|-----|--------|-------------|
| `d` | `["d", "<identifier>"]` | Unique identifier for replaceable events |
| `p` | `["p", "<pubkey>"]` | Reference to another user |
| `e` | `["e", "<event_id>"]` | Reference to another event |
| `t` | `["t", "<tag>"]` | Hashtag/label |
| `cid` | `["cid", "<content_hash>"]` | Content address hash |
| `parent` | `["parent", "<cid>"]` | Previous version's content hash |

### 6. Content Addressing

In addition to event IDs, Cambrian uses content addressing for note content:

```typescript
// Content ID (CID) calculation
cid = base58btc(sha256(content))
```

This enables:
- Deduplication of identical content
- Immutable references to specific versions
- Future IPFS compatibility

### 7. Replaceable Events

Events with kinds 30000-39999 are **parameterized replaceable**:
- Identified by `kind` + `pubkey` + `d` tag
- Newer events (higher `created_at`) replace older ones
- Nodes SHOULD only store the latest version

---

## Client Requirements

Clients MUST:
- Generate valid event IDs using the specified algorithm
- Sign events with the user's private key
- Verify signatures before trusting events

Clients SHOULD:
- Store events locally before attempting sync
- Handle events in any order (eventual consistency)

---

## Node Requirements

Nodes MUST:
- Validate event ID matches content hash
- Validate signature before storing
- Reject malformed events

Nodes SHOULD:
- Index events by kind, pubkey, and d-tag
- Support efficient queries by tag

---

## Examples

### Minimal Valid Event

```json
{
  "id": "4e2c...",
  "pubkey": "a1b2...",
  "created_at": 1706234400,
  "kind": 30078,
  "tags": [
    ["d", "my-first-note"]
  ],
  "content": "{\"title\":\"Hello\",\"body\":\"# Hello World\"}",
  "sig": "9f8e..."
}
```

---

## Security Considerations

- Private keys MUST never be transmitted
- Event IDs prevent content tampering
- Signatures prove authorship

---

## References

- [Nostr NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [BIP-340 Schnorr Signatures](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)
- [Multiformats CID](https://github.com/multiformats/cid)
