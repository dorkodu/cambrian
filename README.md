# Cambrian

> A decentralized digital garden protocol for the age of AI companions

[![License](https://img.shields.io/badge/license-MIT%2FApache--2.0-blue?label=License)](./LICENSE)

---

## What is Cambrian?

Cambrian is a **local-first, decentralized protocol** for building personal knowledge graphs:

- 🌱 **Digital Garden** — Zettelkasten/evergreen note-taking
- 🔗 **Knowledge Graph** — Bi-directional wiki-links
- 📱 **Local-First** — Offline-capable, syncs when online
- 🌐 **Decentralized** — Nostr-inspired relay architecture
- 🤖 **AI-Native** — Memory layer for AI companions

---

## Project Structure

```
cambrian/
├── app/            # Client application (React/Vite)
├── cli/            # Command-line interface
├── design/         # Protocol specifications (CIPs)
├── docs/           # Documentation
├── inspiration/    # Reference materials
├── node/           # Network node/relay (Bun/Postgres)
├── sdk/            # TypeScript SDK
└── www/            # Project website
```

---

## Codebases

| Folder | Description | Stack |
|--------|-------------|-------|
| `sdk/` | Isomorphic TypeScript SDK | TypeScript |
| `app/` | Client application | React, Vite, shadcn/ui, Zustand, Dexie |
| `node/` | Network node/relay | Bun, Postgres |
| `cli/` | Command-line tool | TypeScript, Bun |
| `www/` | Project website | Vite, static |

---

## Documentation

| Document | Description |
|----------|-------------|
| [Plan](./docs/plan.md) | Roadmap and deliverables |
| [Architecture](./docs/architecture.md) | System design |
| [Constitution](./docs/constitution.md) | Vision and principles |

---

## Protocol Specs

| Spec | Title |
|------|-------|
| [CIP-01](./design/cip-01-core.md) | Core Protocol & Event Structure |
| [CIP-02](./design/cip-02-notes.md) | Note Events & Content Format |

---

## Status

🚧 **Day 0** — Protocol design and specification phase

## License

MIT + Apache-2.0 dual license
