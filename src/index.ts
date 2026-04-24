#!/usr/bin/env node
import { Command } from "commander";
import { WorkspaceError } from "./core/errors.js";
import { WorkspaceStore } from "./storage/workspace-store.js";
import { WorkspaceService } from "./workspace/service.js";
import {
  formatWorkspaceDetails,
  formatWorkspaceList,
} from "./cli/formatters.js";

const program = new Command();
const service = new WorkspaceService(new WorkspaceStore());

program
  .name("senseicli")
  .description("CLI orquestradora de agentes com suporte a workspace multiprojeto")
  .version("0.1.0");

const workspaceCommand = program.command("workspace").description("Gerencia workspaces e projetos");

workspaceCommand
  .command("create")
  .argument("<name>", "Nome do workspace")
  .action(async (name: string) => {
    const state = await service.createWorkspace(name);
    console.log(`Workspace '${name}' criado e selecionado.`);
    console.log(formatWorkspaceList(state));
  });

workspaceCommand
  .command("list")
  .action(async () => {
    const state = await service.listWorkspaces();
    console.log(formatWorkspaceList(state));
  });

workspaceCommand
  .command("show")
  .action(async () => {
    const workspace = await service.getCurrentWorkspaceSummary();
    console.log(formatWorkspaceDetails(workspace));
  });

workspaceCommand
  .command("select")
  .argument("<name>", "Nome do workspace")
  .action(async (name: string) => {
    await service.selectWorkspace(name);
    console.log(`Workspace '${name}' selecionado.`);
  });

workspaceCommand
  .command("project:add")
  .argument("<name>", "Nome do projeto")
  .argument("<path>", "Caminho do projeto")
  .action(async (name: string, projectPath: string) => {
    await service.addProject(name, projectPath);
    console.log(`Projeto '${name}' adicionado ao workspace atual.`);
  });

workspaceCommand
  .command("project:list")
  .action(async () => {
    const workspace = await service.getCurrentWorkspaceSummary();
    if (workspace.projects.length === 0) {
      console.log(`Workspace '${workspace.name}' nao possui projetos.`);
      return;
    }

    console.log(`Projetos do workspace '${workspace.name}':`);
    for (const project of workspace.projects) {
      console.log(`- ${project.name}: ${project.path}`);
    }
  });

workspaceCommand
  .command("project:remove")
  .argument("<name>", "Nome do projeto")
  .action(async (name: string) => {
    await service.removeProject(name);
    console.log(`Projeto '${name}' removido do workspace atual.`);
  });

workspaceCommand
  .command("context:set")
  .argument("<content>", "Contexto inicial do workspace")
  .action(async (content: string) => {
    await service.updateContext(content);
    console.log("Contexto inicial do workspace atualizado.");
  });

workspaceCommand
  .command("context:get")
  .action(async () => {
    const workspace = await service.getCurrentWorkspaceSummary();
    if (!workspace.contextNote) {
      console.log(`Workspace '${workspace.name}' nao possui contexto inicial.`);
      return;
    }

    console.log(workspace.contextNote.content);
  });

workspaceCommand
  .command("relationship:add")
  .requiredOption("--description <description>", "Descricao da relacao")
  .option("--scope <scope>", "Escopo da relacao: workspace ou project", "workspace")
  .option("--source <sourceProject>", "Projeto de origem")
  .option("--target <targetProject>", "Projeto de destino")
  .action(
    async (options: {
      description: string;
      scope: "workspace" | "project";
      source?: string;
      target?: string;
    }) => {
      await service.addRelationship(
        options.description,
        options.scope,
        options.source ?? null,
        options.target ?? null,
      );
      console.log("Relacao declarada registrada.");
    },
  );

workspaceCommand
  .command("relationship:list")
  .action(async () => {
    const workspace = await service.getCurrentWorkspaceSummary();
    if (workspace.relationships.length === 0) {
      console.log(`Workspace '${workspace.name}' nao possui relacoes declaradas.`);
      return;
    }

    console.log(`Relacoes do workspace '${workspace.name}':`);
    for (const relationship of workspace.relationships) {
      const pair =
        relationship.sourceProject || relationship.targetProject
          ? `${relationship.sourceProject ?? "*"} -> ${relationship.targetProject ?? "*"}`
          : "workspace";
      console.log(`- [${relationship.scope}] ${pair}: ${relationship.description}`);
    }
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  if (error instanceof WorkspaceError) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  console.error("Erro inesperado:", error);
  process.exitCode = 1;
});
