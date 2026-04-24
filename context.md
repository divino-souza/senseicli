# Contexto do Projeto

## Visao Geral

`senseicli` e uma CLI orquestradora de agentes para trabalhar com multiplos
projetos no mesmo workspace. A proposta principal e evitar que o operador vire
entregador manual de contexto entre agente mestre, subagentes e projetos
relacionados.

O produto deve permitir que o agente mestre:

- entenda relacoes entre projetos do mesmo workspace
- preserve contexto por run
- repasse contexto e achados entre subagentes
- consolide impacto entre projetos
- proponha plano antes de executar mudancas cross-project
- permita retomada de runs dentro da politica de retencao

## Direcao de Produto

O projeto foi definido com estas premissas centrais:

- CLI-first
- provider-agnostic
- persistencia estruturada por run
- foco em MVP sem over-engineering
- multiplos projetos por workspace
- subagentes com contrato estruturado
- aprovacao antes de executar impacto entre projetos

## Fonte de Verdade Atual

Os arquivos mais importantes no momento sao:

- `AGENTS.md`
- `.specify/memory/constitution.md`
- `specs/001-multi-project-orchestration/spec.md`
- `specs/001-multi-project-orchestration/decomposition.md`

## Estado Atual da Modelagem

A `spec 001` funciona como spec mae da capability de orquestracao multiprojeto.
Ela cobre:

- mapa de relacoes do workspace
- run persistida com modo e escopo
- snapshot inicial do workspace
- retomada de run
- retencao com limpeza automatica e manual
- contrato de resposta de subagente
- `confidence` por achado
- `failure reason`
- resposta bruta como artefato inspecionavel
- contexto de bootstrap por projeto
- prioridade de contexto
- eventos persistidos
- arbitragem de esclarecimentos
- diagnostico de run
- consolidacao de impacto
- aprovacao antes de execucao

## Decisoes Ja Fechadas

- O workspace e uma colecao de projetos com mapa de relacoes.
- Relacoes podem ser declaradas manualmente ou inferidas por analise.
- Quando houver conflito, a relacao declarada prevalece e a inferida fica
  sinalizada para revisao.
- O sistema deve persistir estado operacional por run.
- O operador deve poder retomar runs reais enquanto estiverem dentro da
  retencao.
- A politica padrao de retencao combina limpeza automatica com limpeza manual.
- O estado operacional nao deve depender de Markdown como fonte de verdade.
- Respostas de subagentes devem gerar resumo estruturado e podem ter resposta
  bruta persistida separadamente.
- O operador deve conseguir inspecionar o bruto sob demanda.
- `insufficient_context` nao e sucesso; deve explicar o que falta e por que isso
  bloqueia a analise.
- Apenas runs interrompidas ou encerradas sem erro estrutural podem ser
  retomadas como continuacao real.
- Se um projeto impactado ficar indisponivel, ele deve ser marcado como
  bloqueado ou indisponivel e a run segue com os demais quando ainda houver
  valor.

## Decomposicao Atual

As proximas specs filhas previstas sao:

1. `Workspace Registry And Relationship Map`
2. `Run Lifecycle And Persistence`
3. `Run Retention And Cleanup`
4. `Run Diagnostics And Inspection`
5. `Subagent Response Contract`
6. `Project Context Bootstrap`
7. `Event Model And Run Ordering`
8. `Clarification Arbitration`
9. `Relationship Inference And Workspace Analysis`
10. `Impact Detection And Consolidation`
11. `Approval Flow And Execution Gate`
12. `Human-Readable Export`

## Ordem Recomendada de Evolucao

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

## Como Retomar em Nova Sessao

Ao iniciar uma nova sessao:

1. Ler `context.md`
2. Ler `.specify/memory/constitution.md`
3. Ler `specs/001-multi-project-orchestration/spec.md`
4. Ler `specs/001-multi-project-orchestration/decomposition.md`
5. Confirmar qual spec filha sera aberta ou continuada

## Proximo Passo Recomendado

Abrir a primeira spec filha da decomposicao:

- `Workspace Registry And Relationship Map`

