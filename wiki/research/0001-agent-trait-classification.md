# Agent Trait Classification: Tool-Agent vs. Cognitive Agent

Instead of introducing a new struct for deterministic tools, we added a `Trait AgentTrait` field to the existing `AgentDefinition`. `TraitTool` marks agents that provide static, high-confidence bids for atomic tasks and bypass the Interview process. `TraitCognitive` marks standard LLM agents that require the full three-layer Gatekeeper pipeline.

**Why:** The Zero-Hardcode Rule forbids `if tool { callTool() } else { callAgent() }`. By treating tools as first-class agents with a trait flag, the Auctioneer routes to them through the same bidding pipeline as cognitive agents — no branching logic in the Substrate. Tool-Agents simply bid `Confidence=1.0` instantly when the task matches their manifest capability, out-competing cognitive agents on both speed and merit.

**Considered Options:**
- **Separate `ToolDefinition` struct** — Rejected: duplicates registry code, breaks the "everything is an agent" philosophy.
- **New `RuntimeTool` enum** — Rejected: a tool is still a Python script or binary; runtime type is orthogonal to bidding behaviour.

**Consequences:**
- Tool-Agents skip Interview (born Active, `Provisional=false`).
- Gatekeeper Layer 2 is bypassed for `TraitTool` agents because they have no cognitive fingerprint.
- Auction Pane in the TUI renders Tool-Agent bids in Electric Blue (lipgloss.Color("12")) to distinguish them from cognitive agents.
- Static Merit values (TrustScore=1.0, SuccessRate=1.0, Latency=5ms) are injected at registration time for Tool-Agents instead of being computed by `ProfileAggregator`.
