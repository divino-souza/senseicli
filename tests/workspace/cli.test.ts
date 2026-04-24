import { mkdtemp, mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { execa } from "execa";

const tempDirs: string[] = [];

async function createTempRepo(): Promise<string> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "senseicli-"));
  tempDirs.push(dir);
  return dir;
}

async function runCli(
  repoDir: string,
  stateDir: string,
  args: string[],
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const result = await execa(
    "node",
    ["--import", "tsx", "src/index.ts", ...args],
    {
      cwd: repoDir,
      env: {
        SENSEICLI_HOME: stateDir,
      },
      reject: false,
    },
  );

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode ?? 0,
  };
}

describe("workspace cli", () => {
  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  it("cria, lista e seleciona workspace", async () => {
    const repoDir = process.cwd();
    const stateDir = await createTempRepo();
    const resultCreate = await runCli(repoDir, stateDir, ["workspace", "create", "demo"]);
    expect(resultCreate.exitCode).toBe(0);
    expect(resultCreate.stdout).toContain("Workspace 'demo' criado e selecionado.");

    const resultList = await runCli(repoDir, stateDir, ["workspace", "list"]);
    expect(resultList.stdout).toContain("demo");

    const resultShow = await runCli(repoDir, stateDir, ["workspace", "show"]);
    expect(resultShow.stdout).toContain("Workspace: demo");
  });

  it("adiciona projeto valido e registra contexto e relacao", async () => {
    const repoDir = process.cwd();
    const stateDir = await createTempRepo();
    const projectDir = await createTempRepo();
    await mkdir(path.join(projectDir, "api-backend"));
    await mkdir(path.join(projectDir, "web-frontend"));

    await runCli(repoDir, stateDir, ["workspace", "create", "demo-2"]);

    const addBackend = await runCli(repoDir, stateDir, [
      "workspace",
      "project:add",
      "api-backend",
      path.join(projectDir, "api-backend"),
    ]);
    expect(addBackend.exitCode).toBe(0);

    const addFrontend = await runCli(repoDir, stateDir, [
      "workspace",
      "project:add",
      "web-frontend",
      path.join(projectDir, "web-frontend"),
    ]);
    expect(addFrontend.exitCode).toBe(0);

    const setContext = await runCli(repoDir, stateDir, [
      "workspace",
      "context:set",
      "workspace de teste",
    ]);
    expect(setContext.exitCode).toBe(0);

    const addRelationship = await runCli(repoDir, stateDir, [
      "workspace",
      "relationship:add",
      "--scope",
      "project",
      "--source",
      "web-frontend",
      "--target",
      "api-backend",
      "--description",
      "frontend consome backend",
    ]);
    expect(addRelationship.exitCode).toBe(0);

    const show = await runCli(repoDir, stateDir, ["workspace", "show"]);
    expect(show.stdout).toContain("Projetos: 2");
    expect(show.stdout).toContain("Relacoes declaradas: 1");
    expect(show.stdout).toContain("Contexto inicial: configurado");
  });

  it("falha ao adicionar projeto com caminho inexistente", async () => {
    const repoDir = process.cwd();
    const stateDir = await createTempRepo();
    await runCli(repoDir, stateDir, ["workspace", "create", "demo-3"]);

    const result = await runCli(repoDir, stateDir, [
      "workspace",
      "project:add",
      "api-backend",
      path.join(repoDir, "caminho-inexistente"),
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Caminho do projeto nao encontrado");
  });
});
