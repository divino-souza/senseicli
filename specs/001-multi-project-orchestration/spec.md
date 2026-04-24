# Feature Specification: Multi-Project Orchestration

**Feature Branch**: `[001-multi-project-orchestration]`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User description: "Criar uma orquestracao multi-projeto para o senseicli, com agente mestre e subagentes capazes de operar sobre multiplos projetos no mesmo workspace, preservar contexto por run, retomar execucoes, analisar impactos entre projetos e usar arquivos base de contexto por projeto."

## Clarifications

### Session 2026-04-23

- Q: Qual politica de retencao deve ser o padrao do produto para runs encerradas e artefatos de resposta bruta? -> A: Padrao com limpeza automatica e limpeza manual disponivel.
- Q: Quando relacoes inferidas entrarem em conflito com relacoes declaradas do workspace, qual regra deve valer? -> A: Relacoes inferidas apenas complementam; conflitos ficam sinalizados para revisao.
- Q: Quando um subagente devolver `insufficient_context`, qual nivel minimo de explicacao ele deve fornecer? -> A: Informar o que faltou e por que isso bloqueia a analise.
- Q: Quais tipos de run devem poder ser retomados como continuacao real? -> A: Apenas runs interrompidas ou encerradas sem erro estrutural podem ser retomadas.
- Q: Se um projeto impactado ficar indisponivel durante uma run ativa, qual deve ser o comportamento padrao do orquestrador? -> A: O projeto fica marcado como bloqueado ou indisponivel, o impacto e sinalizado, e a run segue com os demais.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Analisar Relacoes do Workspace (Priority: P1)

Como operador, quero que o orquestrador entenda como os projetos do mesmo
workspace se relacionam para que eu nao precise repetir manualmente o mesmo
contexto arquitetural sempre que pedir uma analise entre projetos.

**Why this priority**: Sem entendimento de relacoes, o orquestrador nao consegue
coordenar trabalho entre projetos nem raciocinar com confianca sobre propagacao
de impacto.

**Independent Test**: Adicionar multiplos projetos relacionados ou nao em um
workspace, informar observacoes opcionais sobre relacoes, solicitar uma analise
entre projetos e verificar que o sistema produz um mapa coerente de relacoes sem
exigir entrega repetida de contexto manual.

**Acceptance Scenarios**:

1. **Given** um workspace com multiplos projetos e observacoes de relacao
   fornecidas pelo usuario, **When** o operador inicia uma run de orquestracao,
   **Then** o agente mestre usa essas observacoes como contexto principal do
   workspace para a run.
2. **Given** um workspace com projetos, mas sem relacoes declaradas,
   **When** o operador solicita uma analise do workspace, **Then** o
   orquestrador pode executar analise para inferir relacoes possiveis e registrar
   essas relacoes como contexto inferido, sem exigir um template arquitetural
   predefinido.
3. **Given** um workspace em que alguns projetos sao declarados explicitamente
   como um grupo coeso, **When** uma run comeca, **Then** o orquestrador
   respeita essa estrutura explicita sem impedir a existencia de outros projetos
   nao relacionados no mesmo workspace.

---

### User Story 2 - Preservar Contexto da Run Entre Mestre e Subagentes (Priority: P1)

Como operador, quero que o agente mestre preserve e reutilize o contexto da run
entre interacoes com subagentes para que cada etapa avance sobre achados
anteriores em vez de me pedir repetidamente contexto que o sistema ja possui.

**Why this priority**: Continuidade persistente e obrigatoria para uma
orquestracao multiagente confiavel e ataca diretamente a falha anterior de perda
de contexto e ciclos de pedido de esclarecimento.

**Independent Test**: Iniciar uma run com multiplos projetos, deixar um
subagente produzir achados parciais, disparar follow-up para outro subagente,
interromper a run, retomá-la e verificar que prompts anteriores, achados e itens
pendentes continuam disponiveis e reutilizaveis.

**Acceptance Scenarios**:

1. **Given** uma run com agente mestre e multiplos subagentes, **When** um
   subagente retorna achados, **Then** esses achados sao persistidos como estado
   estruturado da run e ficam disponiveis para o agente mestre e para futuros
   follow-ups de subagentes.
2. **Given** uma run iniciada em um workspace com varios projetos, **When** a
   run e criada, **Then** o sistema registra um snapshot inicial do workspace
   com os projetos, relacoes conhecidas e contexto carregado naquele momento.
3. **Given** uma run interrompida apos progresso parcial, **When** o operador a
   retoma dentro do limite de retencao, **Then** o orquestrador continua a partir
   do estado persistido em vez de reiniciar com uma conversa vazia.
4. **Given** um subagente que pede mais contexto, **When** o contexto exigido ja
   existe no estado da run ou do workspace, **Then** o agente mestre resolve a
   necessidade sem pedir ao operador que repita essa informacao.
5. **Given** um subagente ou provider que nao consegue concluir sua parte,
   **When** o resultado da etapa e registrado, **Then** o sistema persiste nao
   apenas o status, mas tambem um motivo formal de bloqueio ou falha para apoiar
   debug, sintese e continuidade.
6. **Given** uma run iniciada com um objetivo especifico, **When** o agente
   mestre decide quais proximos passos executar, **Then** essas decisoes ficam
   registradas com escopo, justificativa e relacao com o modo da run.

---

### User Story 3 - Coordenar Revisao de Impacto Antes de Mudancas Entre Projetos (Priority: P2)

Como operador, quero que o agente mestre analise o impacto provavel em outros
projetos e proponha uma ordem de execucao antes de realizar mudancas entre
projetos, para que eu mantenha o controle sem perder os beneficios da
orquestracao automatizada.

**Why this priority**: O produto precisa reduzir trabalho manual de coordenacao
sem realizar mudancas silenciosas ou arriscadas em outros projetos.

**Independent Test**: Informar uma mudanca em um projeto, deixar o orquestrador
analisar o impacto no workspace e verificar que ele propoe projetos afetados e
uma ordem de mudanca para aprovacao antes de despachar trabalho de implementacao.

**Acceptance Scenarios**:

1. **Given** uma run em que um projeto mudou, **When** o agente mestre detecta
   impacto possivel em outros projetos, **Then** ele consolida os achados e
   propoe um plano para aprovacao do operador antes de disparar mudancas
   subsequentes.
2. **Given** multiplos projetos potencialmente impactados, **When** a analise de
   impacto termina, **Then** o orquestrador analisa primeiro todos os impactados
   e so depois propoe um plano consolidado com ordem de execucao.
3. **Given** evidencia insuficiente de impacto, **When** o agente mestre nao
   consegue decidir com confianca, **Then** ele escala uma aprovacao ou pedido de
   esclarecimento objetivo em vez de assumir que a mudanca em outros projetos e
   necessaria.

---

### User Story 4 - Inicializar Subagentes com Arquivos de Contexto do Projeto (Priority: P2)

Como operador, quero que cada projeto possa definir arquivos opcionais de
contexto carregados automaticamente para o subagente correspondente, para que o
agente comece com orientacao de arquitetura e dominio especifica daquele
projeto.

**Why this priority**: Contexto de bootstrap por projeto reduz deriva,
ambiguidade e explicacoes repetitivas em fluxos de analise e execucao guiados
por LLM.

**Independent Test**: Configurar um ou mais arquivos de contexto para um
projeto, iniciar uma run envolvendo esse projeto e verificar que o subagente usa
esses arquivos no bootstrap e registra se havia contexto explicito ou nao.

**Acceptance Scenarios**:

1. **Given** um projeto com arquivos de contexto configurados, **When** um
   subagente inicia para esse projeto, **Then** ele carrega esses arquivos antes
   de executar analise ou acao.
2. **Given** um projeto sem arquivos de contexto configurados, **When** um
   subagente inicia, **Then** ele segue normalmente, mas registra que nao havia
   contexto de bootstrap explicito para aquele projeto.
3. **Given** um workspace com convencoes diferentes de arquivos de contexto
   entre projetos, **When** o operador configura listas especificas por projeto,
   **Then** cada subagente carrega apenas os arquivos definidos para o seu
   proprio projeto.

---

### Edge Cases

- O que acontece quando observacoes declaradas sobre relacoes do workspace
  entram em conflito com relacoes inferidas por analise?
- Conflitos entre relacoes declaradas e inferidas devem preservar a relacao
  declarada e ficar visiveis para revisao.
- Como o sistema trata uma resposta de subagente que traz resumo, mas nao traz
  evidencia utilizavel?
- Quando um subagente retornar `insufficient_context`, ele deve informar qual
  contexto faltou e por que a ausencia disso bloqueia a analise.
- O que acontece quando um projeto impactado fica indisponivel, ausente ou e
  removido do workspace durante uma run ativa?
- Se um projeto impactado ficar indisponivel durante a run, ele deve ser
  marcado como bloqueado ou indisponivel, o impacto deve ser sinalizado, e a
  run deve seguir com os demais projetos quando isso ainda gerar valor.
- Como o orquestrador se comporta quando uma run retida expira antes de o
  operador retomá-la?
- O que acontece quando multiplos subagentes pedem esclarecimento no mesmo ciclo
  da run?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE permitir que um workspace contenha multiplos
  projetos arbitrarios sem exigir um template fixo de arquitetura.
- **FR-002**: O sistema DEVE permitir que o operador declare relacoes do
  workspace em orientacoes simples no nivel do projeto ou do workspace.
- **FR-003**: O sistema DEVE ser capaz de iniciar analise para inferir relacoes
  entre projetos quando a orientacao explicita estiver ausente ou incompleta.
- **FR-004**: O sistema DEVE manter um mapa estruturado de relacoes do workspace
  que possa conter tanto relacoes declaradas quanto relacoes inferidas.
- **FR-004A**: Quando houver conflito entre relacoes declaradas e relacoes
  inferidas, o sistema DEVE preservar a relacao declarada e sinalizar o
  conflito para revisao do operador.
- **FR-005**: O sistema DEVE criar e persistir estado estruturado para cada run,
  incluindo objetivo, selecao de projetos, contexto mestre, estado dos
  subagentes, achados, perguntas pendentes e progresso da sintese.
- **FR-005A**: O sistema DEVE registrar um snapshot inicial do workspace ao
  iniciar a run, incluindo projetos presentes, relacoes conhecidas e contexto
  de bootstrap carregado naquele momento.
- **FR-005B**: O sistema DEVE registrar um modo de execucao para cada run,
  compatível com pelo menos analisar, planejar ou executar.
- **FR-005C**: O sistema DEVE registrar escopo explicito para cada run,
  incluindo quais projetos ou grupos estao dentro do objetivo atual e se a run
  cobre apenas analise, proposta de mudanca ou execucao.
- **FR-005D**: O sistema DEVE persistir decisoes relevantes do agente mestre,
  incluindo justificativa minima para despachos, consolidacoes de impacto,
  escalonamentos para aprovacao e interrupcoes de fluxo.
- **FR-006**: O sistema DEVE permitir que uma run fechada ou interrompida seja
  retomada como continuacao real enquanto o estado retido ainda estiver
  disponivel.
- **FR-006A**: Apenas runs interrompidas ou encerradas sem erro estrutural
  DEVEM ser elegiveis para retomada como continuacao real.
- **FR-007**: O sistema DEVE aplicar regras de retencao e limpeza para que o
  estado das runs nao se acumule indefinidamente.
- **FR-007A**: A politica padrao DEVE aplicar limpeza automatica por retencao a
  runs encerradas e artefatos associados, mantendo opcao de limpeza manual pelo
  operador.
- **FR-008**: O sistema DEVE garantir que os subagentes se comuniquem por meio
  do orquestrador e do agente mestre, e nao fazendo perguntas diretamente ao
  operador.
- **FR-009**: O sistema DEVE classificar resultados de subagentes com pelo menos
  `completed`, `insufficient_context` ou `failed`.
- **FR-009A**: O sistema DEVE permitir registrar um motivo formal para bloqueio
  ou falha associado ao resultado de uma etapa, incluindo casos equivalentes a
  falta de contexto do workspace, projeto indisponivel, ausencia de evidencia,
  erro de provider e bloqueio por permissao.
- **FR-010**: O sistema DEVE exigir que cada resposta de subagente inclua
  resumo, evidencia de suporte e status.
- **FR-010D**: O sistema DEVE permitir que cada achado relevante de subagente
  inclua um nivel simples de confianca, com valores equivalentes a alto, medio
  ou baixo.
- **FR-010A**: O sistema DEVE persistir um resumo estruturado da resposta de
  cada subagente para uso operacional do agente mestre e continuidade da run.
- **FR-010B**: O sistema DEVE permitir que a resposta completa de um subagente
  seja persistida como artefato inspecionavel da run, separada do resumo
  operacional.
- **FR-010C**: Quando a resposta completa for persistida, o sistema DEVE manter
  referencia entre resumo operacional e artefato bruto correspondente.
- **FR-011**: O sistema DEVE tratar uma resposta que pede contexto como
  `insufficient_context`, e nao como uma analise concluida.
- **FR-011A**: Quando um subagente retornar `insufficient_context`, a resposta
  DEVE informar objetivamente qual contexto faltou e por que essa ausencia
  bloqueia a analise.
- **FR-012**: Quando um subagente reportar falta de contexto, o agente mestre
  DEVE primeiro tentar resolver a lacuna usando estado persistido da run e
  contexto do workspace antes de consultar outros subagentes ou perguntar ao
  operador.
- **FR-013**: Quando o agente mestre nao conseguir resolver a lacuna a partir do
  estado da run, ele DEVE tentar em seguida inspecao do workspace, analise de
  projetos relacionados ou follow-up com subagentes relevantes antes de
  perguntar ao operador.
- **FR-014**: O sistema DEVE serializar pedidos de esclarecimento voltados ao
  operador para evitar perguntas sobrepostas vindas de multiplos subagentes ao
  mesmo tempo.
- **FR-015**: O agente mestre DEVE consolidar a analise de projetos impactados
  antes de propor um plano de execucao entre projetos.
- **FR-015A**: Se um projeto impactado ficar indisponivel durante a run, o
  sistema DEVE marcá-lo como bloqueado ou indisponivel, sinalizar o impacto
  dessa indisponibilidade e continuar a run com os demais projetos quando isso
  nao comprometer o restante do fluxo.
- **FR-016**: A politica padrao do MVP para mudancas entre projetos DEVE ser
  aprovacao antes da execucao, em que o agente mestre propoe um plano antes que
  a implementacao siga para projetos impactados.
- **FR-017**: O sistema DEVE suportar arquivos opcionais de contexto por projeto
  carregados automaticamente ao iniciar um subagente para aquele projeto.
- **FR-018**: O sistema DEVE permitir que operadores configurem quais arquivos
  contam como contexto de bootstrap para cada projeto.
- **FR-019**: O sistema DEVE registrar se o contexto de bootstrap foi carregado,
  estava ausente ou estava incompleto em cada invocacao de subagente.
- **FR-019A**: O sistema DEVE permitir classificar contexto de projeto por
  prioridade de uso, distinguindo pelo menos contexto obrigatorio,
  complementar e sob demanda.
- **FR-020**: O sistema DEVE permitir exportacoes legiveis por humanos sob
  demanda, sem tratar essas exportacoes como fonte de verdade do estado da run.
- **FR-020A**: O sistema DEVE permitir ao operador consultar sob demanda o
  conteudo bruto persistido de respostas de subagentes durante a vigencia da
  retencao da run ou do artefato.
- **FR-020B**: O sistema DEVE fornecer uma forma de diagnostico da run para que
  o operador visualize status geral, bloqueios, projetos envolvidos, pendencias,
  respostas recebidas e proximos passos esperados.
- **FR-021**: O sistema DEVE manter o comportamento de orquestracao
  multiprojeto valido conforme o numero de projetos do workspace muda.
- **FR-022**: O sistema DEVE permitir que um agrupamento arquitetural explicito
  seja declarado para alguns projetos sem exigir que todo workspace use o mesmo
  modelo de agrupamento.

### CLI Flow & Safety *(mandatory for CLI/agent features)*

- **Primary command flow**: O operador cria ou seleciona um workspace, registra
  ou atualiza projetos, adiciona opcionalmente observacoes sobre relacoes do
  workspace e arquivos de contexto por projeto, inicia uma run com objetivo em
  linguagem natural, escolhe ou confirma o modo da run e seu escopo, revisa a
  analise consolidada do agente mestre e os proximos passos propostos, consulta
  diagnosticos quando necessario, e aprova ou recusa a execucao entre projetos
  quando houver impacto identificado.
- **Provider impact**: A feature deve permanecer agnostica a provider. Adaptadores
  podem variar na forma de executar agentes, mas o estado da run, o contrato dos
  subagentes e o fluxo de orquestracao devem permanecer consistentes entre
  providers.
- **Operator visibility**: O operador deve enxergar criacao da run, selecao de
  projetos, status de subagentes, achados de impacto, necessidades de
  esclarecimento, pontos de aprovacao, status de retomada, status de retencao e
  resultado final em um fluxo de terminal claro. Qualquer acao destrutiva ou
  entre projetos deve ficar visivel antes da execucao. Quando houver resposta
  bruta persistida de subagente, o operador deve conseguir inspecionar esse
  conteudo sob demanda. O operador tambem deve conseguir diagnosticar por que a
  run esta parada, bloqueada ou aguardando alguma decisao.
- **State continuity**: O orquestrador persiste o estado da run entre agente
  mestre e subagentes, incluindo prompts anteriores, contexto descoberto,
  achados por projeto, perguntas pendentes, historico de eventos, estado de
  aprovacao, sintese e snapshot inicial do workspace. Uma run retomada continua
  a partir desse estado
  persistido enquanto a retencao permitir.
- **Scaling model**: A feature suporta multiplos projetos e subagentes no mesmo
  workspace sem suposicoes de quantidade fixa. As regras de coordenacao devem
  permanecer as mesmas com poucos ou muitos projetos.
- **MVP boundary**: O MVP cobre mapeamento de workspace multiprojeto,
  persistencia e retomada de runs, coordenacao de impacto com aprovacao antes da
  execucao e arquivos configuraveis de contexto por projeto. Politicas futuras,
  como execucao totalmente automatica, podem ser adicionadas depois.

### Key Entities *(include if feature involves data)*

- **Workspace**: Colecao nomeada de projetos com relacoes declaradas opcionais,
  relacoes inferidas e configuracoes de orquestracao.
- **Project**: Membro do workspace com identidade propria, raiz no filesystem,
  metadados opcionais de agrupamento, configuracao opcional de arquivos de
  contexto e entradas para execucao via provider.
- **Relationship Map**: Representacao estruturada dos vinculos declarados e
  inferidos entre projetos do mesmo workspace.
- **Run**: Sessao persistida de orquestracao contendo objetivo do usuario,
  projetos selecionados, status atual, contexto acumulado, historico de eventos,
  estado de aprovacao, modo de execucao, escopo explicito e progresso da
  sintese.
- **Workspace Snapshot**: Registro do estado inicial observado do workspace no
  momento de criacao da run, incluindo projetos presentes, relacoes conhecidas e
  contexto base carregado.
- **Subagent Task**: Unidade de trabalho delegada, ligada a um projeto e a uma
  run, com contexto atribuido, status, achados, nivel de confianca, motivo
  formal de bloqueio ou falha e follow-up pendente.
- **Run Event**: Evento persistido emitido pelo orquestrador, agente mestre ou
  subagente para representar achados, necessidades de esclarecimento,
  aprovacoes, erros ou mudancas de status.
- **Master Decision Record**: Registro persistido de uma decisao relevante do
  agente mestre, com justificativa minima, contexto utilizado e efeito esperado
  na run.
- **Agent Response Artifact**: Artefato opcional ligado a uma run e a um
  subagente, contendo a resposta completa persistida para auditoria, reprocesso
  ou inspecao manual.
- **Bootstrap Context Config**: Configuracao por projeto que descreve quais
  arquivos devem ser carregados antes de o subagente iniciar seu trabalho e com
  qual prioridade de uso.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em um workspace com multiplos projetos, operadores conseguem
  iniciar uma run entre projetos sem precisar reexplicar manualmente relacoes do
  workspace que ja foram declaradas antes.
- **SC-002**: Em pelo menos 90% das runs retomadas dentro do limite de retencao,
  o orquestrador continua a partir do contexto salvo sem pedir que o operador
  repita informacoes que ja foram registradas.
- **SC-002A**: Em runs retomadas dentro do limite de retencao, o sistema ainda
  consegue identificar quais projetos e relacoes existiam no inicio da run por
  meio do snapshot persistido do workspace.
- **SC-003**: Quando subagentes encontram lacunas de contexto, o orquestrador
  resolve ou reduz essas lacunas internamente antes de perguntar ao operador,
  reduzindo entrega repetida de contexto na mesma run.
- **SC-003A**: Quando uma etapa falhar ou ficar bloqueada, o operador consegue
  identificar no estado da run um motivo formal suficiente para entender o
  bloqueio sem depender apenas de texto livre.
- **SC-003B**: O operador consegue diagnosticar o estado de uma run ativa ou
  bloqueada sem precisar inspecionar manualmente o armazenamento interno da
  aplicacao.
- **SC-004**: Em cenarios de mudanca entre projetos, o sistema apresenta uma
  revisao consolidada de impacto e um plano para aprovacao antes de iniciar
  implementacao em projetos dependentes.
- **SC-005**: Operadores conseguem configurar arquivos de contexto por projeto e
  perceber que esses arquivos influenciaram o bootstrap dos subagentes dos
  projetos selecionados.
- **SC-006**: Quando um subagente produzir uma resposta extensa, o operador
  consegue consultar o resumo operacional e, quando retido, abrir o conteudo
  bruto correspondente sem interromper a continuidade da run.
- **SC-007**: Runs encerradas e artefatos associados expiram automaticamente
  pela politica padrao de retencao, sem impedir que o operador execute limpeza
  manual quando desejar.
- **SC-008**: Quando um projeto impactado ficar indisponivel durante uma run, o
  sistema sinaliza o bloqueio claramente e continua a orquestracao com os
  projetos restantes sempre que isso ainda gerar valor para o operador.

## Assumptions

- Operadores podem conhecer previamente relacoes entre projetos e descreve-las
  em orientacoes simples do workspace, mas o sistema tambem precisa funcionar
  quando essas relacoes forem apenas parcialmente conhecidas.
- Relacoes inferidas complementam o mapa do workspace, mas nao substituem
  automaticamente relacoes declaradas pelo operador quando houver conflito.
- Nem toda mudanca em um projeto afeta outros projetos; avaliacao de impacto e
  uma tarefa contextual de orquestracao, nao uma tabela fixa de regras.
- Respostas classificadas como `insufficient_context` continuam uteis para a run
  apenas se explicarem de forma objetiva a lacuna e seu impacto na analise.
- O MVP pode usar um mecanismo local estruturado de persistencia para estado de
  run, mas a tecnologia exata de armazenamento e uma decisao de implementacao,
  nao uma exigencia de produto.
- Niveis de confianca em achados de subagente ajudam o agente mestre a
  diferenciar evidencias fortes de hipoteses, mas no MVP nao precisam de escala
  numerica detalhada.
- O modo da run orienta o comportamento esperado do agente mestre desde o
  inicio, mesmo que o MVP implemente apenas parte dos modos previstos.
- O escopo explicito da run reduz risco de o agente mestre agir fora do limite
  esperado pelo operador.
- Contexto de projeto nem sempre precisa ser carregado integralmente no
  bootstrap; priorizacao simples de contexto ajuda a manter o fluxo eficiente no
  MVP.
- O resumo operacional e a resposta bruta de subagente podem ter politicas de
  retencao diferentes, desde que a continuidade da run nao dependa
  exclusivamente do artefato bruto.
- A politica padrao de retencao combina expiracao automatica com capacidade de
  limpeza manual acionada pelo operador.
- Runs so permanecem retomaveis enquanto ainda estiverem dentro da politica de
  retencao e limpeza.
- Runs encerradas com erro estrutural nao entram na politica padrao de retomada
  como continuacao real.
- Projetos impactados podem ficar indisponiveis durante uma run, e isso nao
  precisa invalidar toda a orquestracao se ainda houver valor em seguir com os
  demais projetos.
- Projetos podem expor arquivos uteis de arquitetura ou contexto, como
  `context.md`, mas nomes e quantidades variam por projeto e precisam ser
  configuraveis.
