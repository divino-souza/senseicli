<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
  - template principle 1 -> I. Provider-Agnostic Orchestration
  - template principle 2 -> II. CLI-First User Experience
  - template principle 3 -> III. Testable MVP Delivery
  - template principle 4 -> IV. Safe Agent Execution
  - template principle 5 -> V. Simple by Default
- Added principles:
  - VI. Continuity Over Conversation
- Added rules:
  - Portuguese-first artifact content
  - Changelog required for completed features
- Added sections:
  - Delivery Constraints
  - Development Workflow
- Removed sections: none
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
- Follow-up TODOs:
  - none
-->
# senseicli Constitution

## Core Principles

### I. Provider-Agnostic Orchestration
Every feature MUST preserve `senseicli` as a CLI orchestrator that can work with
multiple agent providers such as Codex CLI, Claude Code, Gemini CLI, and future
integrations. Provider-specific code MUST be isolated behind explicit adapter
boundaries. Core flows, domain logic, and user-facing commands MUST NOT depend
on a single provider implementation unless the spec explicitly defines that
limitation.

Rationale: the product value is orchestration across providers, not tight
coupling to one agent runtime.

### II. CLI-First User Experience
All user-facing capabilities MUST be designed first for terminal usage. Commands,
arguments, prompts, streaming output, exit codes, and error messages MUST be
predictable, scriptable, and understandable by a human operator. Features that
cannot be explained as a clear CLI flow are not ready for implementation.

Rationale: `senseicli` succeeds or fails on terminal ergonomics and operational
clarity.

### III. Testable MVP Delivery
Work MUST favor the smallest vertical slice that proves value end-to-end. Each
spec MUST define an MVP path, and each plan MUST identify what is intentionally
out of scope. Tests MUST cover critical behavior, adapters, and regressions that
would break the promised user flow, but the project MUST avoid speculative test
matrices for functionality not yet in scope.

Rationale: disciplined MVP delivery keeps quality high without slowing the
project with premature breadth.

### IV. Safe Agent Execution
Any feature that invokes agents, shells, tools, or external providers MUST make
execution boundaries explicit. The system MUST surface permissions, failures,
provider selection, and irreversible actions clearly to the operator. Silent
fallbacks, hidden side effects, and ambiguous destructive behavior are not
allowed.

Rationale: orchestration software must be trustworthy before it can be powerful.

### V. Simple by Default
Designs MUST prefer direct solutions, small abstractions, and minimal moving
parts. New layers, frameworks, or generalized extension points MUST be justified
by an immediate product need appearing in the current spec or plan. Reusable
interfaces are encouraged only when they reduce near-term complexity or protect
the provider-agnostic core.

Rationale: this is an MVP, and over-engineering is a delivery risk.

### VI. Continuity Over Conversation
The orchestrator MUST preserve explicit run state across the master agent and
all subagents. Prompts, discovered context, pending questions, partial findings,
handoff payloads, and final summaries MUST be stored in a structured form that
can be reused across iterations. A subagent response that only asks for more
context is not a successful completion if the required context already exists in
run state. Re-entry after interruption or retry MUST resume from persisted state
rather than restarting the conversation from scratch.

Rationale: orchestration quality depends on deterministic continuity, not on an
LLM implicitly remembering prior turns.

## Delivery Constraints

The project MUST optimize for a maintainable MVP:

- Features MUST state what problem they solve for the operator running the CLI.
- TypeScript em Node.js e a stack padrao do projeto para implementacao da CLI e
  de sua logica de orquestracao, salvo excecao futura explicitamente aprovada.
- Plans MUST distinguish core orchestration logic from provider adapters and UX
  concerns.
- Features involving multiple projects MUST define how run state, per-project
  findings, and consolidated synthesis are persisted between iterations.
- Specs, plans, tasks, checklists, and changelog entries MUST be written in
  Portuguese for all descriptive content. Template section titles may remain in
  English when inherited from tooling, but the substantive content produced for
  this project MUST be in Portuguese.
- Operational state MUST be persisted per run in a structured store that supports
  incremental updates, retrieval by run/agent/event, and controlled retention.
- Respostas de subagentes MUST gerar pelo menos um resumo estruturado para uso
  operacional do orquestrador. Respostas completas MAY ser persistidas como
  artefatos inspecionaveis da run, separados do resumo operacional, com politica
  propria de retencao.
- Human-readable exports MAY be generated on demand, but they MUST be treated as
  derived artifacts rather than the source of truth for orchestration state.
- Non-essential persistence, plugin systems, background daemons, or distributed
  coordination MUST be excluded unless the current feature cannot work without
  them.
- Observability MUST be practical: enough structured logs, statuses, and errors
  to debug real usage, without building a full platform before there is demand.
- Documentation for each feature MUST include the expected command flow and at
  least one concrete usage example when the feature changes CLI behavior.
- Designs for multi-project orchestration MUST support multiple projects in the
  same workspace through stable orchestration contracts and state management.
  Implementations MUST avoid assumptions tied to a fixed number of agents or
  projects.
- Run retention and cleanup MUST be explicit. Completed, failed, and abandoned
  runs MAY be retained temporarily for resume, inspection, or export, but the
  system MUST provide expiration or cleanup behavior to avoid unbounded growth.
- The project MUST maintain a changelog that reflects the current delivered
  state. Each completed feature MUST add a changelog entry summarizing what was
  delivered, relevant behavioral changes, and any notable follow-up constraints.
- Features importantes do fluxo principal MUST incluir testes unitarios basicos
  para proteger comportamento essencial e reduzir regressao durante a evolucao
  do MVP.
- O MVP MUST priorizar testes de regras centrais, persistencia local, contratos,
  eventos e fluxos minimos de CLI. Integracoes reais com providers externos,
  comportamento completo de subprocessos complexos e testes end-to-end amplos
  DEVEM ser adiados ate que a base do projeto esteja estavel.

## Development Workflow

- `speckit-constitution` MUST be established before major feature planning.
- `speckit-specify` MUST define user value, provider impact, CLI flow, MVP scope,
  and safety considerations.
- `speckit-plan` MUST include a constitution check covering provider boundaries,
  CLI UX, MVP scope, execution safety, and state continuity.
- `speckit-tasks` MUST organize work so the MVP path can be built and validated
  without waiting for speculative enhancements.
- Ao iniciar a implementacao de uma feature, o trabalho MUST ocorrer em uma
  branch dedicada com nome alinhado ao nome da implementacao ou da feature
  ativa.
- Feature completion MUST include a changelog update before the work is treated
  as done.
- Multi-project features MUST define:
  - the run-state model
  - the handoff contract between master and subagents
  - the criteria for `completed`, `failed`, and `insufficient_context`
  - how orchestration handles multiple projects based on workspace input
- Reviews MUST reject changes that add abstractions, dependencies, or runtime
  complexity without a spec-backed reason.
- When a feature intentionally breaks one of these principles, the plan MUST
  record the exception and justify why a simpler approach was insufficient.

## Governance

This constitution overrides local habits and default template assumptions when
they conflict. Every spec, plan, task list, and implementation review MUST check
for compliance with these principles.

Amendments MUST be explicit, documented in this file, and versioned using
semantic versioning:

- MAJOR: removes or redefines a governing principle
- MINOR: adds a principle or materially expands project rules
- PATCH: clarifies wording without changing expected behavior

Compliance review expectations:

- Specs MUST define CLI user value, MVP scope, and relevant safety boundaries.
- Plans MUST document adapter boundaries, run-state continuity, and reject
  unnecessary architecture.
- Tasks MUST preserve incremental delivery, avoid speculative infrastructure,
  and include persistence/handoff work when agent coordination is in scope.
- Implementacoes centrais em TypeScript/Node.js MUST incluir cobertura unitaria
  basica para regras de negocio e fluxos criticos que possam ser validados sem
  depender de providers externos.
- A estrategia de teste do MVP MUST evitar acoplamento precoce a providers
  externos ou fluxos end-to-end extensos quando testes locais menores ja forem
  suficientes para validar a etapa atual.
- Implementations MUST surface errors and destructive behavior clearly.
- Orchestration flows MUST not treat context-seeking replies as successful
  project analysis outputs.
- Implementacoes MUST permitir inspecao sob demanda de artefatos relevantes da
  run quando respostas brutas de subagentes forem persistidas.
- Multi-project execution MUST remain valid as the number of workspace projects
  changes.
- Closed runs MUST remain inspectable according to retention policy rather than
  being discarded immediately by default.
- Delivered features MUST be traceable through changelog entries written in
  Portuguese.
- O inicio da implementacao deve trocar para a branch da feature, mas MUST NOT
  implicar commit automatico.

**Version**: 1.1.0 | **Ratified**: 2026-04-23 | **Last Amended**: 2026-04-23
