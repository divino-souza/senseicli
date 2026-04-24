import { WorkspaceRecord, WorkspaceState } from "../core/types.js";

export function formatWorkspaceList(state: WorkspaceState): string {
  if (state.workspaces.length === 0) {
    return "Nenhum workspace cadastrado.";
  }

  return state.workspaces
    .map((workspace) => {
      const marker = workspace.name === state.currentWorkspace ? "*" : "-";
      return `${marker} ${workspace.name} (${workspace.projects.length} projeto(s))`;
    })
    .join("\n");
}

export function formatWorkspaceDetails(workspace: WorkspaceRecord): string {
  const lines: string[] = [];

  lines.push(`Workspace: ${workspace.name}`);
  lines.push(`Projetos: ${workspace.projects.length}`);
  lines.push(`Relacoes declaradas: ${workspace.relationships.length}`);
  lines.push(
    `Contexto inicial: ${workspace.contextNote ? "configurado" : "nao configurado"}`,
  );

  if (workspace.projects.length > 0) {
    lines.push("");
    lines.push("Projetos registrados:");
    for (const project of workspace.projects) {
      lines.push(`- ${project.name}: ${project.path}`);
    }
  }

  if (workspace.relationships.length > 0) {
    lines.push("");
    lines.push("Relacoes declaradas:");
    for (const relationship of workspace.relationships) {
      const pair =
        relationship.sourceProject || relationship.targetProject
          ? `${relationship.sourceProject ?? "*"} -> ${relationship.targetProject ?? "*"}`
          : "workspace";
      lines.push(`- [${relationship.scope}] ${pair}: ${relationship.description}`);
    }
  }

  return lines.join("\n");
}
