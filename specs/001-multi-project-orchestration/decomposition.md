# Multi-Project Orchestration Decomposition

Este documento quebra a feature principal em specs menores de implementacao que
podem ser planejadas, implementadas e validadas em etapas, sem perder a direcao
de produto definida em `spec.md`.

## Decomposition Strategy

A feature principal permanece como guarda-chuva no nivel do produto. A
implementacao deve avancar em fatias menores, cada uma com valor verificavel e
com possibilidade de teste antes da etapa seguinte.

## Proposed Implementation Specs

### 1. Workspace Registry And Relationship Map

**Goal**: Permitir que operadores criem ou selecionem workspaces, registrem
projetos arbitrarios, declarem relacoes basicas e persistam um mapa inicial de
relacoes.

**Why first**: Todo comportamento multiprojeto depende de um modelo duravel de
workspace e de uma fonte basica de relacoes declaradas.

**Scope**:
- criar/selecionar workspace
- adicionar/remover/listar projetos
- armazenar metadados basicos de projeto
- aceitar observacoes de relacao no nivel do workspace e do projeto
- persistir o mapa de relacoes declaradas

**Out of scope**:
- relacoes inferidas por analise
- orquestracao de runs
- bootstrap de subagentes

### 2. Run Lifecycle And Persistence

**Goal**: Criar e persistir runs com objetivo, modo, escopo, snapshot inicial do
workspace e estado minimo para continuidade.

**Why second**: O orquestrador precisa de uma sessao persistida antes de lidar
com subagentes, impacto ou aprovacao.

**Scope**:
- criar run
- registrar modo e escopo
- registrar snapshot inicial do workspace
- persistir estado principal da run
- fechar e retomar runs elegiveis

**Out of scope**:
- limpeza automatica
- diagnostico detalhado
- impacto entre projetos

### 3. Run Retention And Cleanup

**Goal**: Aplicar politica padrao de retencao com limpeza automatica e limpeza
manual disponivel.

**Why later**: A run primeiro precisa existir de forma confiavel; depois a
retencao pode ser tratada como comportamento operacional separado.

**Scope**:
- expirar runs e artefatos por politica
- manter limpeza manual disponivel
- diferenciar o que permanece retomavel do que apenas continua consultavel

**Out of scope**:
- logica principal de orquestracao
- exportacao humana

### 4. Run Diagnostics And Inspection

**Goal**: Permitir que o operador inspecione o estado de uma run, seus bloqueios,
pendencias, respostas recebidas e proximos passos esperados.

**Why early**: Sem diagnostico, o desenvolvimento e o uso real do orquestrador
ficam opacos.

**Scope**:
- ver status geral da run
- ver projetos envolvidos
- ver bloqueios e pendencias
- ver respostas recebidas
- ver artefatos brutos sob demanda

**Out of scope**:
- exportacao final em markdown
- inferencia de relacoes

### 5. Subagent Response Contract

**Goal**: Padronizar entradas e saidas de subagentes para que o agente mestre
consiga interpretar resultados de forma confiavel.

**Why early**: Sem contrato, o mestre vira repassador de texto e perde
capacidade de continuidade.

**Scope**:
- definir campos minimos de resposta
- classificar `completed`, `insufficient_context`, `failed`
- registrar `confidence`
- registrar `failure reason`
- separar resumo operacional de resposta bruta

**Out of scope**:
- arbitragem de perguntas
- logica de impacto entre projetos

### 6. Project Context Bootstrap

**Goal**: Carregar contexto configuravel por projeto no bootstrap do subagente,
com prioridade simples de uso.

**Why early**: Isso reduz pedidos repetidos de contexto e melhora a qualidade da
analise desde o inicio.

**Scope**:
- configurar arquivos de contexto por projeto
- classificar contexto como obrigatorio, complementar ou sob demanda
- carregar contexto no bootstrap
- registrar se o contexto foi carregado, ausente ou incompleto

**Out of scope**:
- inferencia de relacoes
- impacto entre projetos

### 7. Event Model And Run Ordering

**Goal**: Definir eventos persistidos e a ordenacao basica do fluxo entre mestre
e subagentes.

**Why before arbitration**: A arbitragem de perguntas depende de um modelo de
eventos e de uma ordem estavel de processamento.

**Scope**:
- modelo de evento da run
- ordenacao basica de processamento
- relacionamento entre evento, run, subagente e decisao do mestre
- persistencia de historico de eventos

**Out of scope**:
- estrategia de follow-up complexa
- aprovacao de mudancas

### 8. Clarification Arbitration

**Goal**: Garantir que pedidos de esclarecimento sejam resolvidos de forma
mediada pelo agente mestre e serializada para o operador.

**Why after event model**: A arbitragem precisa de eventos e estado persistido
para funcionar bem.

**Scope**:
- uma pergunta pendente ao operador por vez
- ordem de resolucao de falta de contexto
- follow-up para subagente baseado em estado existente
- impedir subagente de perguntar diretamente ao operador

**Out of scope**:
- deteccao de impacto
- execucao entre projetos

### 9. Relationship Inference And Workspace Analysis

**Goal**: Inferir relacoes provaveis entre projetos quando elas nao forem
declaradas explicitamente.

**Why later**: A inferencia deve ser adicionada sobre uma base ja estavel de
workspace, run e contrato de resposta.

**Scope**:
- inferir relacoes possiveis entre projetos
- marcar relacoes inferidas versus declaradas
- registrar confianca da inferencia
- sinalizar conflitos para revisao

**Out of scope**:
- mudancas de implementacao entre projetos
- aprovacao de execucao

### 10. Impact Detection And Consolidation

**Goal**: Detectar impacto provavel em outros projetos e consolidar a analise no
agente mestre.

**Why after foundation**: Esta e a primeira fatia de maior valor do produto, mas
precisa de run, contrato, eventos e arbitragem funcionando.

**Scope**:
- detectar projetos possivelmente impactados
- solicitar follow-up a projetos relevantes
- consolidar impacto no agente mestre
- continuar a run mesmo com projeto bloqueado quando ainda houver valor

**Out of scope**:
- aprovacao formal do operador
- execucao automatica

### 11. Approval Flow And Execution Gate

**Goal**: Colocar a aprovacao do operador entre a analise consolidada de impacto
e qualquer mudanca entre projetos.

**Why later**: O produto primeiro precisa conseguir analisar e consolidar
impacto com qualidade.

**Scope**:
- apresentar plano proposto
- registrar decisao do operador
- bloquear execucao sem aprovacao quando o modo exigir
- persistir decisao do mestre e aprovacao

**Out of scope**:
- execucao totalmente automatica

### 12. Human-Readable Export

**Goal**: Permitir exportacao de resultados de run em Markdown como artefato
derivado.

**Why last**: E util, mas nao deve conduzir a arquitetura da orquestracao.

**Scope**:
- exportar resumo da run sob demanda
- incluir projetos, achados, bloqueios, impacto e decisao final
- indicar se houve retomada ou aprovacao

**Out of scope**:
- persistencia de estado operacional
- arbitragem da run

## Recommended Delivery Order

1. Workspace Registry And Relationship Map
2. Run Lifecycle And Persistence
3. Subagent Response Contract
4. Project Context Bootstrap
5. Event Model And Run Ordering
6. Clarification Arbitration
7. Run Diagnostics And Inspection
8. Impact Detection And Consolidation
9. Approval Flow And Execution Gate
10. Run Retention And Cleanup
11. Relationship Inference And Workspace Analysis
12. Human-Readable Export

## MVP Cut

O menor MVP crivel deve incluir:

- Workspace Registry And Relationship Map
- Run Lifecycle And Persistence
- Subagent Response Contract
- Project Context Bootstrap
- Event Model And Run Ordering
- Clarification Arbitration
- Run Diagnostics And Inspection
- uma primeira versao de Impact Detection And Consolidation

Approval flow, retention refinada, inferencia mais forte e exportacao rica podem
entrar depois que o nucleo estiver estavel.

## Incremental Validation Strategy

Sim, deve ser possivel testar conforme evolui. Essa decomposicao foi organizada
para permitir validacao progressiva a cada etapa.

### Como testar passo a passo

- Após `Workspace Registry And Relationship Map`:
  validar criacao de workspace, cadastro de projetos e persistencia de relacoes
  declaradas.
- Após `Run Lifecycle And Persistence`:
  validar criacao de run, snapshot inicial, retomada elegivel e persistencia do
  modo e escopo.
- Após `Subagent Response Contract`:
  validar se o sistema aceita e persiste respostas estruturadas, incluindo
  status, confidence e failure reason.
- Após `Project Context Bootstrap`:
  validar carregamento e prioridade do contexto por projeto.
- Após `Event Model And Run Ordering`:
  validar se eventos ficam persistidos e ordenados de forma consistente.
- Após `Clarification Arbitration`:
  validar se apenas uma pergunta chega ao operador por vez e se o mestre tenta
  resolver contexto antes de escalar.
- Após `Run Diagnostics And Inspection`:
  validar se o operador consegue entender por que a run esta parada, bloqueada
  ou aguardando.
- Após `Impact Detection And Consolidation`:
  validar o fluxo exemplo de backend, frontend e worker com consolidacao pelo
  mestre.

### Recomendacao pratica

Cada spec filha deve nascer com:
- um fluxo minimo demonstravel
- um criterio de validacao observavel
- um comando ou caminho simples de verificacao manual

Isso permite evoluir o orquestrador com teste funcional incremental, em vez de
esperar tudo ficar pronto para validar no fim.
