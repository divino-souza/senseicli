# Implementation Plan: Workspace Registry And Relationship Map

**Branch**: `[002-workspace-registry-and-relationship-map]` | **Date**: 2026-04-23 | **Spec**: [spec.md](C:/dev/utilitarios_divino/iasensei/senseicli/specs/002-workspace-registry-and-relationship-map/spec.md)
**Input**: Feature specification from `/specs/002-workspace-registry-and-relationship-map/spec.md`

## Summary

Implementar a base persistida de workspace do `senseicli`, permitindo criar e
selecionar workspaces, registrar projetos arbitrarios, manter contexto inicial e
persistir relacoes declaradas. Esta etapa nao executa orquestracao de run; ela
prepara a fundacao de dados e fluxo de CLI para as proximas specs.

## Technical Context

**Language/Version**: TypeScript em runtime Node.js  
**Primary Dependencies**: CLI atual do projeto, camada de persistencia local do projeto  
**Storage**: Persistencia local estruturada para workspaces  
**Testing**: Testes unitarios basicos para regras centrais da feature + testes de integracao do projeto + verificacao manual de comandos  
**Target Platform**: CLI local em ambiente de desenvolvimento  
**Project Type**: CLI  
**Performance Goals**: Operacoes de cadastro e consulta de workspace devem ser imediatas para uso local  
**Constraints**: Sem over-engineering; manter a modelagem simples e evolutiva  
**Scale/Scope**: Multiplos workspaces, cada um com quantidade variavel de projetos e relacoes declaradas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Provider boundaries nao sao relevantes diretamente nesta feature e nao devem
  ser acopladas ao registro de workspace.
- O fluxo de CLI precisa ser claro para criar, selecionar, listar e alterar
  workspaces e projetos.
- O MVP desta feature esta limitado ao cadastro persistido de workspace,
  projetos, contexto inicial e relacoes declaradas.
- Nao ha execucao de agentes nesta etapa, mas o design deve preparar dados
  reutilizaveis para futuras runs.
- Qualquer abstração adicional deve ser justificada por necessidade imediata da
  persistencia e do fluxo de CLI.

## Project Structure

### Documentation (this feature)

```text
specs/002-workspace-registry-and-relationship-map/
├── plan.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── cli/
├── core/
├── workspace/
└── storage/

tests/
├── integration/
└── unit/
```

**Structure Decision**: Esta feature deve concentrar a logica de cadastro e
consulta de workspace em um modulo dedicado, com interface de CLI separada da
persistencia local.

## Phase 0: Research

### Goals

- Confirmar a estrutura atual da CLI para encaixar os comandos de workspace
- Confirmar onde a persistencia local do projeto deve residir
- Confirmar como representar workspace, projeto, contexto inicial e relacoes
  declaradas de forma simples

### Output

- Decisao sobre modelo inicial de dados do workspace
- Decisao sobre comandos minimos da CLI para esta feature

## Phase 1: Design

### Data Model

- Workspace
- Registro de projeto
- Relacao declarada
- Nota de contexto do workspace

### CLI Flows

- criar workspace
- listar workspaces
- selecionar workspace
- adicionar projeto
- listar projetos
- remover projeto
- registrar relacao declarada
- consultar mapa de relacoes
- atualizar contexto inicial

### Validation Approach

- Validar persistencia entre sessoes
- Validar comportamento de relacoes quando projeto e removido
- Validar que o workspace aceita projetos arbitrarios sem template rigido
- Validar com testes unitarios basicos as regras centrais de workspace e mapa de relacoes
- Evitar nesta etapa integracoes reais com providers externos, subprocessos
  complexos ou testes end-to-end amplos que nao sejam necessarios para validar
  a feature atual

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Nenhuma no momento | N/A | N/A |
