# Changelog

## 2026-04-23

### Definicao inicial do produto

- Criada a constituicao do projeto para o `senseicli`
- Definidos principios de:
  - orquestracao agnostica a provider
  - UX orientada a CLI
  - continuidade por estado persistido
  - execucao segura de agentes
  - simplicidade orientada a MVP
- Adicionadas regras de artefatos em portugues
- Adicionada exigencia de changelog por feature concluida
- Definida stack padrao do projeto como TypeScript/Node.js
- Definida exigencia de testes unitarios basicos para features importantes do
  fluxo principal

### Modelagem da feature principal

- Criada a spec mae `001-multi-project-orchestration`
- Definido workspace como colecao de projetos com mapa de relacoes
- Definidas relacoes declaradas e inferidas, com prevalencia da declarada em
  caso de conflito
- Definidos run mode e run scope
- Definido snapshot inicial do workspace
- Definida retomada de run dentro da politica de retencao
- Definida politica padrao com limpeza automatica e limpeza manual disponivel

### Contrato e operacao do orquestrador

- Definido contrato estruturado minimo para respostas de subagente
- Adicionado `confidence` por achado
- Adicionado motivo formal para bloqueio ou falha
- Definido tratamento de `insufficient_context` com explicacao objetiva da
  lacuna
- Definida persistencia separada entre resumo operacional e resposta bruta
- Definida inspecao sob demanda de artefatos brutos
- Definido contexto configuravel por projeto com prioridade de uso
- Definido registro de decisoes relevantes do agente mestre
- Definido diagnostico de run para status, bloqueios, pendencias e proximos
  passos

### Impacto entre projetos

- Definida consolidacao de impacto pelo agente mestre antes de qualquer
  execucao cross-project
- Definida politica inicial de aprovacao antes de executar
- Definido comportamento para projeto impactado indisponivel: marcar bloqueio,
  sinalizar impacto e seguir com os demais quando ainda houver valor

### Planejamento incremental

- Criado documento de decomposicao da spec mae em specs filhas menores
- Definida estrategia de validacao incremental por etapa
- Definida ordem recomendada de evolucao do MVP
