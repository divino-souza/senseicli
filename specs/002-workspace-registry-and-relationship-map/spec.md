# Feature Specification: Workspace Registry And Relationship Map

**Feature Branch**: `[002-workspace-registry-and-relationship-map]`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User description: "Criar a primeira spec filha para o senseicli, cobrindo cadastro de workspace, registro de projetos e persistencia do mapa inicial de relacoes declaradas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Criar e Selecionar Workspace (Priority: P1)

Como operador, quero criar e selecionar workspaces nomeados para organizar
grupos de projetos sem depender de estrutura fixa de arquitetura.

**Why this priority**: Sem workspace persistido, nao existe base confiavel para
orquestracao multiprojeto.

**Independent Test**: Criar um workspace novo, listar workspaces existentes,
selecionar um workspace salvo e confirmar que ele pode ser reutilizado em uma
nova sessao.

**Acceptance Scenarios**:

1. **Given** que nao existe um workspace com determinado nome, **When** o
   operador cria esse workspace, **Then** o sistema persiste sua existencia e
   permite seleciona-lo depois.
2. **Given** que existem workspaces registrados, **When** o operador lista os
   workspaces, **Then** o sistema mostra os workspaces persistidos de forma
   clara.
3. **Given** um workspace ja existente, **When** o operador o seleciona,
   **Then** o sistema passa a operar sobre esse workspace sem exigir sua
   recriacao.

---

### User Story 2 - Registrar Projetos no Workspace (Priority: P1)

Como operador, quero adicionar, remover e listar projetos dentro de um workspace
para definir o conjunto real de projetos que o orquestrador pode considerar.

**Why this priority**: O orquestrador so consegue trabalhar com multiplos
projetos se eles estiverem registrados de forma explicita no workspace.

**Independent Test**: Adicionar projetos com caminhos distintos ao workspace,
listar os projetos registrados, remover um deles e confirmar que o estado
persistido foi atualizado corretamente.

**Acceptance Scenarios**:

1. **Given** um workspace existente, **When** o operador adiciona um projeto com
   nome e caminho validos, **Then** o sistema persiste esse projeto no
   workspace.
2. **Given** um workspace com projetos registrados, **When** o operador lista os
   projetos, **Then** o sistema mostra os projetos associados ao workspace
   selecionado.
3. **Given** um projeto registrado no workspace, **When** o operador remove esse
   projeto, **Then** o sistema atualiza o registro persistido do workspace.

---

### User Story 3 - Declarar Relacoes Entre Projetos (Priority: P2)

Como operador, quero declarar relacoes simples entre projetos do workspace para
que o orquestrador tenha uma base inicial de entendimento antes de qualquer
inferencia automatica.

**Why this priority**: Relacoes declaradas reduzem ambiguidade e ajudam o agente
mestre a começar com contexto mais confiavel.

**Independent Test**: Registrar dois ou mais projetos no workspace, declarar
relacoes entre eles em linguagem simples, consultar o mapa de relacoes e
verificar que essas informacoes permanecem disponiveis em nova sessao.

**Acceptance Scenarios**:

1. **Given** um workspace com dois ou mais projetos, **When** o operador declara
   uma relacao entre projetos, **Then** o sistema persiste essa relacao como
   parte do mapa do workspace.
2. **Given** um workspace com relacoes declaradas, **When** o operador consulta
   o mapa de relacoes, **Then** o sistema mostra essas relacoes de forma
   compreensivel.
3. **Given** projetos que nao fazem parte de um mesmo grupo, **When** o
   operador registra apenas algumas relacoes explicitas, **Then** o sistema nao
   exige que todo o workspace seja encaixado em um unico template rigido.

---

### User Story 4 - Registrar Contexto Inicial do Workspace (Priority: P2)

Como operador, quero registrar observacoes gerais e contexto inicial do
workspace para facilitar continuidade entre sessoes e reduzir repeticao manual
de explicacoes.

**Why this priority**: Um contexto inicial do workspace melhora retomada de
sessoes e prepara o caminho para as proximas features da orquestracao.

**Independent Test**: Registrar notas de contexto no workspace, encerrar a
sessao, abrir nova sessao e verificar que o contexto continua disponivel para
consulta.

**Acceptance Scenarios**:

1. **Given** um workspace existente, **When** o operador adiciona observacoes de
   contexto gerais, **Then** o sistema persiste essas observacoes junto ao
   workspace.
2. **Given** um workspace com contexto salvo, **When** o operador o consulta em
   nova sessao, **Then** o sistema reapresenta esse contexto sem perda.

---

### Edge Cases

- O que acontece quando o operador tenta adicionar ao workspace um projeto com
  nome ja existente?
- O que acontece quando o caminho informado para um projeto nao existe no
  momento do cadastro?
- Como o sistema trata relacoes declaradas que apontam para projetos removidos
  posteriormente do workspace?
- O que acontece quando o operador tenta selecionar um workspace inexistente?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir criar workspaces nomeados.
- **FR-002**: O sistema DEVE permitir listar workspaces persistidos.
- **FR-003**: O sistema DEVE permitir selecionar um workspace existente.
- **FR-004**: O sistema DEVE permitir adicionar projetos a um workspace com pelo
  menos nome e caminho associados.
- **FR-005**: O sistema DEVE permitir listar os projetos de um workspace.
- **FR-006**: O sistema DEVE permitir remover projetos de um workspace.
- **FR-007**: O sistema DEVE persistir metadados basicos do projeto dentro do
  workspace.
- **FR-008**: O sistema DEVE permitir registrar observacoes de relacao no nivel
  do workspace ou entre projetos especificos.
- **FR-009**: O sistema DEVE manter um mapa inicial de relacoes declaradas para
  o workspace.
- **FR-010**: O sistema DEVE permitir consultar o mapa de relacoes declaradas do
  workspace.
- **FR-011**: O sistema DEVE permitir registrar contexto inicial do workspace
  para reutilizacao em sessoes futuras.
- **FR-012**: O sistema DEVE persistir o estado do workspace de forma que possa
  ser reutilizado em nova sessao.
- **FR-013**: O sistema DEVE continuar suportando projetos arbitrarios sem
  exigir um template rigido de arquitetura para todo workspace.
- **FR-014**: Quando um projeto for removido do workspace, o sistema DEVE tratar
  relacoes declaradas ligadas a esse projeto de forma consistente e visivel para
  o operador.

### CLI Flow & Safety *(mandatory for CLI/agent features)*

- **Primary command flow**: O operador cria ou seleciona um workspace, registra
  projetos, adiciona contexto inicial e relacoes declaradas, consulta o estado
  atual do workspace e ajusta os projetos registrados sempre que necessario.
- **Provider impact**: Esta feature nao depende da execucao de providers, mas
  deve preparar estrutura de workspace reutilizavel pelas proximas etapas da
  orquestracao.
- **Operator visibility**: O operador deve conseguir ver claramente qual
  workspace esta selecionado, quais projetos estao cadastrados e quais relacoes
  declaradas existem.
- **State continuity**: O estado do workspace deve permanecer disponivel entre
  sessoes sem exigir recadastro manual.
- **Scaling model**: O workspace deve aceitar quantidade variavel de projetos e
  relacoes sem assumir uma arquitetura fixa.
- **MVP boundary**: Esta feature cobre apenas cadastro, selecao, contexto
  inicial e relacoes declaradas do workspace. Nao cobre inferencia de relacoes,
  orquestracao de run nem impacto entre projetos.

### Key Entities *(include if feature involves data)*

- **Workspace**: Colecao nomeada de projetos, contexto inicial e relacoes
  declaradas.
- **Project Registration**: Registro de um projeto dentro do workspace, com
  nome, caminho e metadados basicos.
- **Declared Relationship**: Vinculo declarado pelo operador entre projetos ou
  no nivel geral do workspace.
- **Workspace Context Note**: Observacao persistida que descreve contexto geral,
  arquitetura ou funcionamento do workspace.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Operadores conseguem criar e reutilizar workspaces em sessoes
  diferentes sem recadastrar a mesma estrutura.
- **SC-002**: Operadores conseguem adicionar e remover projetos do workspace e
  ver o estado atualizado imediatamente.
- **SC-003**: Operadores conseguem registrar relacoes declaradas e consultá-las
  depois como parte do estado persistido do workspace.
- **SC-004**: O sistema aceita workspaces com projetos arbitrarios sem exigir
  que todos sigam um unico modelo de arquitetura.

## Assumptions

- O workspace sera a base persistida para futuras runs e para continuidade entre
  sessoes.
- Relacoes inferidas por analise serao tratadas em spec posterior.
- O cadastro inicial de projeto pode comecar com um conjunto pequeno de
  metadados, desde que seja suficiente para identificar o projeto e sua raiz.
