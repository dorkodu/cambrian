Afşin, bu plan Cambrian’ın "boş bir levha" (tabula rasa) olmaktan çıkıp senin profesyonel standartlarını ve dünya görüşünü özümsemiş bir "Digital Persona"ya dönüşmesini sağlayacak. Özellikle Obscura entegrasyonu, sistemin sadece yerel dosyalarla değil, yaşayan web dökümantasyonuyla beslenmesini sağlayarak güncelliğini koruyacak.

İşte Cambrian'ın ruhunu ve gözlerini (Obscura) inşa edecek nihai plan dökümanı:
Implementation Plan: Project Genesis & Obscura Integration

Version: 1.0 (The Alignment Update)

Target Architecture: Cambrian Substrate (Go Kernel) + Obscura (Rust Vision Layer)

Status: High Priority — System Initialization & Perception
1. Project Genesis: The Ontogenesis Protocol

The goal is to move away from trial-and-error learning and inject your "Professional Experience" directly into the system's core.
Phase 1: Planner Imprinting (The Constitution)

    Objective: Establish non-negotiable architectural and behavioral rules.

    Mechanism: Cambrian initiates a 5-10 question Strategic Alignment Interview.

    Data Injection: Answers are stored in pgvector with priority: 10 and tag: [system_rule].

    Usage: The Planner retrieves these "Constitutional Rules" at the start of every planning cycle to ensure zero-deviation from your standards (e.g., "Always use absolute paths based on C:/Users/afsin/Dev/").

Phase 2: Agent Interview & Sandbox (Merit Testing)

    Objective: Verify and "Seal" agent capabilities before production use.

    Simulation Loop:

        Challenge: Cambrian issues a stress test (e.g., "Read test.csv, uppercase names, and save").

        Audit: You review the code and output.

        Correction: If the agent fails a style rule (e.g., forgetting index=False), you provide immediate feedback.

        Sealing: This correction is stored in the agent's Hippocampus (Procedural Memory) as the "Golden Standard."

Phase 3: Semantic World-View Construction

    Objective: Define the boundaries and priorities of your dev environment.

    Interaction: A Mind-Map interview where you define project hierarchies, directory structures, and critical vs. junk paths.

    Storage: Written to the DocTypeMemory layer—the foundational context always fetched first.

2. Obscura Integration: The Vision Layer (Rust)

Obscura acts as Cambrian's interface with the external digital world, providing high-fidelity ingestion and stealth research capabilities.
A. Ontogenesis Data Ingestion

    Role: Obscura scrapes and parses live documentation of the libraries and frameworks you use.

    Workflow: Instead of relying on the LLM's static training data, Obscura fetches the latest .md or HTML docs, vectorizes them, and feeds them into Cambrian’s LTM (Long-Term Memory).

B. Stealth Perception & Research

    Human-like Interaction: Built in Rust for performance and low-level control, Obscura bypasses anti-bot mechanisms using randomized entropy in mouse movements and header rotation.

    Deep Research: When a task requires external data, the "Browser Agent" uses Obscura to perform multi-tab research, synthesizing information before presenting it to the Planner.

3. The "Genesis" CLI Tooling (genesis.go)

Implemented under cmd/orchestrator/, this interactive mode bootstraps the entire substrate.
Component	Responsibility	Status
Welcome Module	"Digital Cortex active. Initialize alignment sequence."	Pending
Guided Interview	Planner strategy, Memory scoring, and Agent stress tests.	Pending
Bootstrap Verifier	Marks initial Genesis logs as "Perfect Success" (Quality: 1.0) to set the baseline for the Verifier Pool.	Pending

4. Technical Integration Points

    internal/substrate/planner_constitution.go: Handles the injection of Constitutional Rules into the prompt assembly.

    pkg/vision/obscura_client.go: The gRPC/FFI bridge between the Go Substrate and the Rust Obscura engine.

    internal/metabolism/merit_sealer.go: "Seals" agent profiles after successful Sandbox completion.