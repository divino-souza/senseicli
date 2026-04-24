# Tasks: Workspace Registry And Relationship Map

**Input**: Design documents from `/specs/002-workspace-registry-and-relationship-map/`
**Prerequisites**: plan.md, spec.md

**Tests**: Incluir testes para validar o fluxo minimo do MVP desta feature e a
persistencia entre sessoes.

**Organization**: As tarefas estao agrupadas para permitir entrega incremental e
validacao cedo.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependencias)
- **[Story]**: Historia associada, quando aplicavel

## Phase 1: Setup

**Purpose**: Preparar a base para a feature de workspace

- [ ] T001 Criar estrutura base do modulo de workspace em `src/workspace/`
- [ ] T002 Mapear comandos de CLI necessarios para workspace em `src/cli/`
- [ ] T003 [P] Definir contratos de dados iniciais de workspace em `src/core/`

---

## Phase 2: Foundational

**Purpose**: Construir a base persistida e os fluxos centrais

- [ ] T004 Implementar persistencia local de workspace em `src/storage/`
- [ ] T005 Implementar criacao e listagem de workspace
- [ ] T006 Implementar selecao de workspace atual
- [ ] T007 [P] Implementar cadastro e listagem de projetos por workspace
- [ ] T008 [P] Implementar remocao de projetos e tratamento consistente das relacoes afetadas
- [ ] T009 Implementar contexto inicial persistido do workspace
- [ ] T010 Implementar registro e consulta de relacoes declaradas

**Checkpoint**: Ao fim desta fase, o sistema deve conseguir manter workspaces
persistidos com projetos, contexto inicial e relacoes declaradas.

---

## Phase 3: User Story 1 - Criar e Selecionar Workspace (Priority: P1)

**Goal**: Permitir criar, listar e selecionar workspaces reutilizaveis

**Independent Test**: Criar um workspace, encerrar o processo, iniciar de novo e
selecionar o mesmo workspace com sucesso.

- [ ] T011 [US1] Adicionar comando de criacao de workspace na CLI
- [ ] T012 [US1] Adicionar comando de listagem de workspaces na CLI
- [ ] T013 [US1] Adicionar comando de selecao de workspace na CLI
- [ ] T014 [P] [US1] Criar teste de integracao para criacao, listagem e selecao de workspace

---

## Phase 4: User Story 2 - Registrar Projetos no Workspace (Priority: P1)

**Goal**: Permitir adicionar, listar e remover projetos dentro do workspace

**Independent Test**: Registrar dois projetos, listar ambos, remover um e
confirmar o estado final persistido.

- [ ] T015 [US2] Adicionar comando para registrar projeto em workspace
- [ ] T016 [US2] Adicionar comando para listar projetos do workspace atual
- [ ] T017 [US2] Adicionar comando para remover projeto do workspace
- [ ] T018 [P] [US2] Criar teste de integracao para adicionar, listar e remover projetos

---

## Phase 5: User Story 3 - Declarar Relacoes Entre Projetos (Priority: P2)

**Goal**: Permitir registrar e consultar relacoes declaradas entre projetos

**Independent Test**: Registrar uma relacao declarada entre dois projetos e
confirmar que ela continua disponivel em nova sessao.

- [ ] T019 [US3] Adicionar comando para registrar relacao declarada
- [ ] T020 [US3] Adicionar comando para consultar mapa de relacoes declaradas
- [ ] T021 [P] [US3] Criar teste para persistencia de relacoes declaradas

---

## Phase 6: User Story 4 - Registrar Contexto Inicial do Workspace (Priority: P2)

**Goal**: Permitir registrar contexto inicial reutilizavel do workspace

**Independent Test**: Salvar uma nota de contexto do workspace e confirmar sua
consulta em nova sessao.

- [ ] T022 [US4] Adicionar comando para atualizar contexto inicial do workspace
- [ ] T023 [US4] Adicionar comando para consultar contexto inicial do workspace
- [ ] T024 [P] [US4] Criar teste para persistencia do contexto inicial

---

## Phase 7: Polish & Validation

**Purpose**: Consolidar o MVP desta feature

- [ ] T025 Validar comportamento quando projeto removido participa de relacao declarada
- [ ] T026 Revisar mensagens de CLI para clareza operacional
- [ ] T027 Atualizar `CHANGELOG.md` ao concluir a feature
- [ ] T028 Executar verificacao manual do fluxo completo de workspace

---

## Dependencies & Execution Order

- Setup antes de Foundational
- Foundational bloqueia as historias de usuario
- US1 e US2 devem vir antes de US3 e US4
- Polish acontece depois das historias principais

## Implementation Strategy

### MVP First

1. Setup
2. Foundational
3. US1
4. US2
5. Validar persistencia basica
6. US3
7. US4
8. Polish

### Validation Points

- Depois de T010: validar persistencia basica do workspace
- Depois de T014 e T018: validar fluxo principal da CLI
- Depois de T021 e T024: validar continuidade entre sessoes
- Depois de T028: confirmar que a feature esta pronta para servir de base para a proxima spec
