# Implementation Plan: Tiered Failure Resilience & DAG Replanning (v1.0)

**Version:** 1.0 (The Resilience Update)  
**Target Architecture:** Cambrian Substrate (Go Kernel)  
**Status:** Design Ready — Strategic Migration  
**Prerequisite:** ADR-0001 (Symbiotic TUI), SelfHealing v1.1 (harness/), DAGExecutor v1.0

---

## 1. Executive Summary

The current DAG Executor enforces **cancel-on-first-error**: when any step fails (even after `SelfHealer` consumes all 3 retries), the entire plan aborts and all partial results are lost. This is fundamentally incompatible with the Hermes replanning philosophy and wastes expensive agent work on long multi-step plans.

This plan introduces a **three-tier failure model**:
1. **Intra-step** — SelfHealing retries (already implemented in `harness/`)
2. **Inter-step fallback** — Try runner-up auction candidates before giving up
3. **Plan-level replan** — Pause the DAG, call the Planner with error context + partial results, hot-swap the remaining plan, and resume execution

The DAG Executor gains `Pause/Resume/HotSwap` semantics, partial result preservation becomes mandatory, and the TUI (from ADR-0001) gains visibility into "Replanning…" states.

---

## 2. The Problem in Detail

### 2.1 Current Behaviour

```
Step 1 ✅  Step 2 ✅  Step 3 ✅  Step 4 ❌ (SelfHealing exhausts)
→ cancel() fires
→ Steps 5-10 never run
→ Partial context from steps 1-3 discarded
→ User sees: "plan failed at step 4"
```

### 2.2 Why This Is Wrong

- **Hermes replanning expects adaptation**: A fixed plan cannot respond to runtime tool failures, agent crashes, or unexpected data shapes.
- **Auction ranking is wasted**: The Gatekeeper produces a ranked candidate list (top 3–5). The Auctioneer selects #1. If #1 fails after retries, #2 and #3 are never attempted — even though they passed Declaration and Merit.
- **LLM calls are expensive**: Steps 1-3 may have consumed LLM inference, vector DB queries, and agent cold-starts. Throwing this away is wasteful.
- **TUI UX is broken**: The user sees 4 green checkmarks snap to a red X. With Symbiotic TUI (ADR-0001), this real-time collapse is visually jarring.

### 2.3 Gap Analysis

| Capability | Current | Needed |
|---|---|---|
| Intra-step retry | ✅ SelfHealer (3 attempts) | — |
| Candidate fallback | ❌ No | ✅ Try #2, #3 from Gatekeeper |
| Partial result return | ❌ Discarded | ✅ Always returned |
| Plan replanning | ❌ No | ✅ Planner called with error context |
| DAG hot-swap | ❌ No | ✅ Pause → replan → resume |
| User visibility | ❌ Error only | ✅ "Replanning…" + reasoning stream |

---

## 3. Component Architecture

### A. ReplanHandler Interface (`internal/substrate/replan.go`)

Decouples the DAG Executor from the concrete Planner to avoid import cycles and enable testing.

```go
// ReplanHandler is called by the DAGExecutor when a step exhausts all
// intra-step retries and inter-step fallback candidates.
type ReplanHandler interface {
    // Replan receives the failed step index, the error that caused failure,
    // the partial master context accumulated so far, and the original plan.
    // It returns a new ExecutionPlan for the *remaining* work, or nil to
    // signal that replanning is impossible and the DAG should abort.
    Replan(
        ctx context.Context,
        failedStep int,
        err error,
        partialContext map[string]string,
        originalPlan *domain.ExecutionPlan,
    ) (*domain.ExecutionPlan, error)
}
```

### B. DAGExecutor v2 (`internal/substrate/dag_executor.go`)

The Executor gains three new operational modes beyond `cancel()`:

| State | Meaning | Trigger |
|---|---|---|
| **Running** | Normal parallel dispatch | Default |
| **Paused** | No new dispatch; in-flight goroutines finish current work | `StepTypeIntervention` or replan request |
| **Resuming** | A new plan has been hot-swapped; dispatch continues from next topological position | ReplanHandler returns a plan |
| **Cancelled** | Hard abort; WaitGroup drain; return error | User cancellation or max replan attempts exceeded |

**Hot-swap rules:**
- The new plan's step indices are **remapped** to continue from the failed step's position.
- The `masterContext` is preserved in full — the new plan sees all predecessor outputs.
- Steps already completed are marked `completed` and never re-dispatched.
- A replan counter increments; if it exceeds `MaxReplanAttempts` (default 2), the DAG aborts.

### C. Inter-Step Fallback (`internal/metabolism/auctioneer.go`)

Before calling `ReplanHandler`, the Auctioneer attempts runner-up candidates:

```
1. ConductAuction returns ranked proposals [P1, P2, P3, P4, P5]
2. Execute P1 (winner)
3. P1 fails after SelfHealing exhausts
4. Attempt P2 (runner-up) with same task + error context
5. P2 fails → Attempt P3
6. P3 fails → Call ReplanHandler
```

**Fallback injection:** The runner-up's `Handoff.Context` receives `_fallback_reason` with the previous winner's error. This enables the runner-up to learn from the failure (e.g., "previous agent failed due to encoding error — I will use UTF-8 explicitly").

### D. Partial Result Contract

`DAGExecutor.Execute` changes its return signature conceptually:

```go
// Result carries partial outputs even on failure.
type Result struct {
    Context       map[string]string // all accumulated step_{i}_result keys
    FinalResult   string            // step_{n}_result if plan completed
    FailedStep    int               // -1 if success
    LastError     error             // nil if success
    ReplanCount   int               // how many replans occurred
    IsPartial     bool              // true if plan did not complete
}
```

On success: `Result{FailedStep: -1, IsPartial: false}`  
On failure: `Result{FailedStep: 4, IsPartial: true, Context: {...}}`

The TUI uses `IsPartial` to render: *"Plan incomplete. 4 of 10 steps succeeded. Final error: …"*

### E. Planner Replan Prompt

When `ReplanHandler.Replan` is called, it delegates to the Planner with a specialised prompt:

```
REPLANNING REQUEST

Original request: {user_input}
Failed step: {step_index} — {step_query}
Error: {error_message}
Partial results so far:
- step_0_result: ...
- step_1_result: ...

Please produce a revised plan for the REMAINING work.
Constraints:
- Do NOT re-include steps that already succeeded.
- Avoid the tool/agent that failed: {failed_agent_id}
- Consider using alternative tools: {runner_up_tools}
- The new plan's step 0 corresponds to the original plan's step {failed_step}.
```

The Planner returns a new `ExecutionPlan` with `Subject: "Replan: {original_subject}"`.

---

## 4. Implementation Steps

### Phase 1: DAGExecutor Pause/Resume Infrastructure
- [ ] Add `paused bool` and `pauseCond *sync.Cond` to `DAGExecutor`
- [ ] Add `HotSwap(newPlan *ExecutionPlan)` method
- [ ] Modify `dispatch()` to check `paused` before launching goroutines
- [ ] Add `ReplanCount` and `MaxReplanAttempts` to `ExecutionConfig`
- [ ] Update `Execute` to return `Result` instead of `(map[string]string, error)`
- [ ] Unit tests: pause mid-flight, hot-swap plan, verify remapping

### Phase 2: Inter-Step Fallback in Auctioneer
- [ ] Modify `Auctioneer.Execute` to retain runner-up proposals (ranked list)
- [ ] Add `fallbackExecute(ctx, runnerUp, task, handoff)` helper
- [ ] Inject `_fallback_reason` into runner-up Handoff context
- [ ] Add `FallbackEnabled bool` to `ExecutionConfig` (default true)
- [ ] Integration test: P1 fails → P2 succeeds → plan continues

### Phase 3: ReplanHandler + Planner Integration
- [ ] Create `internal/substrate/replan.go` with interface definition
- [ ] Implement `PlannerReplanHandler` in `internal/awareness/` (wraps Planner)
- [ ] Build replan system prompt with partial context injection
- [ ] Wire `ReplanHandler` into `Server.Execute` via dependency injection
- [ ] Add `replan_count` metric to ProfileAggregator (track replan frequency per agent)

### Phase 4: Partial Result Preservation
- [ ] Ensure `masterContext` is always returned, even on `firstErr != nil`
- [ ] Add `finalResultKey` fallback: if plan aborts, set to last successful step's result
- [ ] Update `Server.Execute` to build `Result` struct
- [ ] Update gRPC response: `Execute` returns `Handoff` with `_partial_plan=true` metadata
- [ ] TUI: render partial results as "incomplete but actionable"

### Phase 5: TUI Integration (ADR-0001 follow-up)
- [ ] Add `ReplanningState` to Bubble Tea model
- [ ] Cortex pane: show Planner reasoning during replan
- [ ] Execution pane: grey out failed step, show fallback attempts
- [ ] Status pane: display "Replan 1/2" badge
- [ ] Ctrl+I during replan: cancel replanning and abort

---

## 5. Security & Homeostasis (Guardrails)

- **Max replan ceiling**: `MaxReplanAttempts = 2` prevents infinite replan loops. Each replan consumes an LLM call — we must bound cost.
- **Fallback candidate limit**: Only top-3 candidates are eligible for fallback. Lower-ranked agents are too unreliable.
- **Poisoned memory on replan failure**: If replanning exhausts, the system calls `MemoryAgent.IngestNegativeEdge` with the aggregate error trace. This prevents the Planner from suggesting the same failed approach in future plans.
- **Context bloat guard**: Partial context passed to the Planner is capped at 50KB. If exceeded, older step results are summarised by the LLM before injection.

---

## 6. Comparison: v0.4.0 (Current) vs v1.0 (This Plan)

| Feature | v0.4.0 | v1.0 (Resilience Update) |
|---|---|---|
| Step failure | Cancel entire plan | Retry → Fallback → Replan → Abort |
| Partial results | Lost | Preserved and returned |
| Runner-up candidates | Never used | Attempted before replan |
| Plan adaptivity | None | Hot-swap remaining steps |
| TUI UX | Snap to red | "Replanning…" with reasoning |
| User intervention | None (post-failure only) | Ctrl+I during replan to cancel |
| Cost on failure | Wasted (steps 1-N discarded) | Bounded (2 replans max) |

---

## 7. Success Metrics

- **Autonomous Recovery Rate**: >60% of step failures are resolved without user intervention (via fallback or replan).
- **Partial Utilisation**: 100% of Execute calls return partial context, even on failure.
- **Replan Cost**: Average additional latency per replan < 5 seconds (local LLM).
- **False Replan**: <5% of replans produce a plan that fails again on the same step (tracked via `replan_count` in TaskEvent).

---

## 8. Integration with Existing Systems

| System | Interaction |
|---|---|
| **SelfHealer** | No changes. SelfHealing remains the first line of defence. Only when `HealingExhaustedError` propagates out does the new tiered logic activate. |
| **Gatekeeper** | No changes. Fallback candidates come from the already-produced `ScoredCandidate` list. |
| **Auctioneer** | Gains `fallbackExecute` path. No changes to `ConductAuction` or `callAgent`. |
| **Planner** | Gains a new prompt template for replanning. No changes to normal planning. |
| **DAGExecutor** | Major change: pause/resume/hot-swap. Cancel-on-first-error becomes the final fallback, not the default. |
| **TUI (ADR-0001)** | Gains `ReplanningState` rendering. Cortex pane subscribes to replan reasoning. |
| **ProfileAggregator** | Gains `replan_count` metric per agent. Agents that trigger frequent replans get penalised in Merit ranking. |

---

## 9. Codebase Integration Points

| Path | Responsibility |
|---|---|
| `internal/substrate/dag_executor.go` | Pause/resume/hot-swap logic; Result struct return |
| `internal/substrate/replan.go` | `ReplanHandler` interface definition |
| `internal/metabolism/auctioneer.go` | Runner-up fallback execution |
| `internal/awareness/planner.go` | Replan prompt template + `ReplanHandler` implementation |
| `internal/substrate/server.go` | Wire `ReplanHandler` into `DAGExecutor`; build `Result` → gRPC response |
| `internal/config/config.go` | `MaxReplanAttempts`, `FallbackEnabled`, `MaxPartialContextBytes` |
| `internal/domain/plan.go` | `Result` struct (or `domain.ExecutionResult`) |
| `internal/service/memory_agent.go` | `IngestNegativeEdge` call on ultimate replan failure |

---

## Instructions for Code Assistant

- **DAGExecutor Logic:** In `dag_executor.go`, replace the immediate `cancel()` on first error with a pause → fallback → replan decision tree. Use `sync.Cond` for pause coordination. Ensure the `WaitGroup` drain still prevents goroutine leaks on all paths.
- **Auctioneer Logic:** In `auctioneer.go`, modify `Execute` to store the top-3 proposals in a slice. On failure of the winner, iterate through runners-up with `_fallback_reason` injected.
- **Planner Logic:** In `planner.go`, add `Replan(ctx, failedStep, err, partialContext, originalPlan)` method. Build the replan prompt using the template in §3E.
- **Server Logic:** In `server.go`, update the `Execute` gRPC handler to return partial results with `_partial_plan=true` in the Handoff metadata on incomplete execution.
- **Config Logic:** In `config.go`, add the three new fields with safe defaults: `MaxReplanAttempts=2`, `FallbackEnabled=true`, `MaxPartialContextBytes=51200`.
