# ADR-0014: Thalamic Gating — Pre-execution Workspace Priming

**Status:** Proposed  
**Date:** 2026-05-16  
**Deciders:** Afsin, Claude  
**Prerequisites:** ADR-0003 (Awareness Redesign), ADR-0006 (Capability-Based Orchestration)

---

## Context

The Planner's `GetExecutionPlan` currently injects the **complete registered agent list** into its system prompt on every call — every agent's ID and full `Description`, every time, regardless of what the request is. This creates two compounding problems:

1. **Sensory overload:** The Planner must scan and reason about every agent in the registry to draft each plan, even when the request maps to a small capability domain. Token cost and hallucination risk scale with list size.

2. **Implicit routing coupling:** Because the Planner sees agent IDs, it is tempted to name specific agents in step queries. This short-circuits the Gatekeeper's autonomous Interview/Auction selection — a soft violation of the Zero-Hardcode Rule extended to the prompt layer.

The biological analogue is the **Thalamus**: all sensory input passes through it before reaching the cortex. The Thalamus does not forward raw sensory streams — it filters, labels, and routes only the signals relevant to the cortex's current task. If the Thalamus forwarded everything, the cortex would be overwhelmed by sensory noise.

This ADR replaces the raw agent dump with a structured capability cluster map — the Thalamus filters, the Planner (Cortex) reasons on the filtered signal.

---

## Decision

### 1. Schema: `Capabilities []string` on `AgentDefinition`

```go
type AgentDefinition struct {
    ID              string       `json:"ID"`
    Name            string       `json:"Name"`
    Description     string       `json:"Description"`
    Runtime         AgentRuntime `json:"Runtime"`
    ExecPath        string       `json:"ExecPath"`
    Dir             string       `json:"Dir"`
    A2AEndpoint     string       `json:"a2a_endpoint,omitempty"`
    SourceHash      string       `json:"source_hash,omitempty"`
    ManifestVersion string       `json:"manifest_version,omitempty"`
    Provisional     bool         `json:"provisional,omitempty"`
    Trait           AgentTrait   `json:"trait,omitempty"`
    Capabilities    []string     `json:"capabilities,omitempty"` // ADR-0014
}
```

Agents declare which capability domains they serve. An agent may belong to multiple clusters. The field is `omitempty` — existing agent configs require no immediate update; uncategorized agents fall into a fallback bucket.

**Example agent config entries:**
```json
{"ID": "ocr-agent",    "Capabilities": ["vision", "text-extraction"]}
{"ID": "summarizer",   "Capabilities": ["text"]}
{"ID": "sql-agent",    "Capabilities": ["data", "query"]}
{"ID": "code-reviewer","Capabilities": ["code", "text"]}
```

### 2. `buildCapabilityCluster` — Private Helper in `planner.go`

A pure function. No dependencies beyond the agent slice. Replaces the `agentsDescriptions` builder loop. Testable in isolation.

```go
func buildCapabilityCluster(agents []domain.AgentDefinition) string {
    clusters := map[string][]string{}
    var uncategorized []domain.AgentDefinition

    for _, a := range agents {
        if a.Trait == domain.TraitModel {
            continue // models handled separately by the existing modelsDescriptions block
        }
        if len(a.Capabilities) == 0 {
            uncategorized = append(uncategorized, a)
            continue
        }
        for _, cap := range a.Capabilities {
            clusters[cap] = append(clusters[cap], a.ID)
        }
    }

    var sb strings.Builder
    sb.WriteString("CAPABILITY CLUSTERS (active agents grouped by domain):\n")

    // deterministic output order
    keys := make([]string, 0, len(clusters))
    for k := range clusters { keys = append(keys, k) }
    sort.Strings(keys)

    for _, k := range keys {
        sb.WriteString(fmt.Sprintf("- %s: %s\n", k, strings.Join(clusters[k], ", ")))
    }
    for _, a := range uncategorized {
        sb.WriteString(fmt.Sprintf("- (uncategorized): %s — %q\n", a.ID, a.Description))
    }
    return sb.String()
}
```

### 3. System Prompt Change: Full Replacement of Agent Dump

The `AVAILABLE AGENTS` section in `GetExecutionPlan` is replaced by the cluster block. The `AVAILABLE MODELS` section is **unchanged** — model selection (`recommended_model`) is a legitimate Planner decision based on cost/quality tradeoffs and is not agent-to-task routing.

**Before (current):**
```
AVAILABLE AGENTS:
1. ocr-agent
   AGENT_DESCRIPTION: Extracts text from images using OCR...
2. summarizer
   AGENT_DESCRIPTION: Summarises long documents into key points...
...
```

**After (ADR-0014):**
```
CAPABILITY CLUSTERS (active agents grouped by domain):
- code: code-reviewer, linter-agent
- data: csv-processor, sql-agent
- text: summarizer, translator
- vision: image-analyzer, ocr-agent, screenshot-agent
- (uncategorized): file-writer — "Generic file writer for local filesystem operations"
```

The Planner writes natural-language step queries against capability domains. The Gatekeeper resolves which specific agent wins via Interview/Auction — as it always has.

### 4. Prompt Instruction Update

The `STRICT DECISION RULES` section already contains: *"Describe what the step needs in natural language. The runtime will discover the right agent automatically."* This instruction is correct and requires no change.

A clarifying line is added:
```
- You may reference a specific agent ID from the capability clusters if the task is
  unambiguously domain-specific, but prefer capability-level descriptions.
  The runtime's Gatekeeper always makes the final agent selection via competitive auction.
```

---

## What This Does Not Change

- **Auction mechanism** — Gatekeeper, Interview, Auctioneer are untouched. The Planner's query is still matched to agents via semantic Interview scoring.
- **Zero-Hardcode Rule** — No routing logic moves into Go. The cluster map is a display transformation of registry data, not a routing decision.
- **Model routing** — `AVAILABLE MODELS` section and `recommended_model` field are unchanged. Model selection is infrastructure choice, not agent-to-task routing.
- **TraitTool / TraitModel handling** — `buildCapabilityCluster` skips TraitModel agents (handled by models section). TraitTool agents are included in clusters normally.

---

## Rejected Alternatives

| Alternative | Reason Rejected |
|-------------|-----------------|
| LLM tool-calling (InquiryHandler intercepts mid-generation) | Requires multi-turn `Generate()` loop, streaming support, new tool-intercept layer — disproportionate complexity for the benefit |
| Group by `Trait` only (cognitive / tool / model) | Three coarse buckets provide no meaningful domain signal to the Planner |
| Keyword heuristic on `Description` | Fragile, non-deterministic, breaks on description phrasing changes |
| Supplement (cluster + full list) | Keeps the sensory overload problem; cosmetic change only |

---

## Implementation File Map

| File | Change |
|------|--------|
| `internal/domain/agent.go` | Add `Capabilities []string` to `AgentDefinition` |
| `internal/awareness/planner.go` | Add `buildCapabilityCluster` helper; replace `agentsDescriptions` block with cluster call; add clarifying instruction line |
| `configs/config.json` | Add `capabilities` arrays to existing agent entries |

---

## Relationship to Self-Reflective Awareness Plan

This ADR implements **Phase 2 (Thalamic Gating)** of the Self-Reflective Awareness plan (`plans/Self Reflective Awareness.md`). Phase 1 (InquiryHandler / tool-calling) was deferred in favour of this simpler pre-planning enrichment approach — same filtering benefit, no multi-turn generation loop required.

**Phase 3 (Neural Plasticity — learning from failures)** is not addressed here. It will be covered in a future ADR once ADR-0013's `SemanticCheckpointError` data is available as a training signal.

---

## Relationship to GWT

Global Workspace Theory's Thalamus analogy is precise here: the Thalamus does not suppress information arbitrarily — it **labels and routes** signals so the Cortex receives structured input, not raw sensory noise. `buildCapabilityCluster` is that labelling step: it transforms a flat registry list into a domain-structured map. The Planner (Cortex) receives capability vocabulary, not agent documentation.
