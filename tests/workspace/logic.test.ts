import { describe, expect, it } from "vitest";
import {
  addProject,
  addRelationship,
  createEmptyState,
  createWorkspace,
  removeProject,
  selectWorkspace,
  updateContextNote,
} from "../../src/workspace/logic.js";
import { WorkspaceError } from "../../src/core/errors.js";

describe("workspace logic", () => {
  it("cria e seleciona workspace", () => {
    const state = createWorkspace(createEmptyState(), "meu-workspace", "2026-04-23T00:00:00.000Z");
    expect(state.currentWorkspace).toBe("meu-workspace");
    expect(state.workspaces).toHaveLength(1);
  });

  it("nao permite criar workspace duplicado", () => {
    const state = createWorkspace(createEmptyState(), "meu-workspace", "2026-04-23T00:00:00.000Z");
    expect(() =>
      createWorkspace(state, "meu-workspace", "2026-04-23T00:00:00.000Z"),
    ).toThrow(WorkspaceError);
  });

  it("adiciona e remove projeto do workspace atual", () => {
    let state = createWorkspace(createEmptyState(), "meu-workspace", "2026-04-23T00:00:00.000Z");
    state = addProject(state, { name: "api-backend", path: "c:/repo/api-backend" }, "2026-04-23T00:00:00.000Z");
    expect(state.workspaces[0]?.projects).toHaveLength(1);

    state = removeProject(state, "api-backend", "2026-04-23T00:00:00.000Z");
    expect(state.workspaces[0]?.projects).toHaveLength(0);
  });

  it("remove relacoes associadas quando projeto e removido", () => {
    let state = createWorkspace(createEmptyState(), "meu-workspace", "2026-04-23T00:00:00.000Z");
    state = addProject(state, { name: "api-backend", path: "c:/repo/api-backend" }, "2026-04-23T00:00:00.000Z");
    state = addProject(state, { name: "web-frontend", path: "c:/repo/web-frontend" }, "2026-04-23T00:00:00.000Z");
    state = addRelationship(
      state,
      {
        id: "rel-1",
        description: "frontend consome backend",
        scope: "project",
        sourceProject: "web-frontend",
        targetProject: "api-backend",
      },
      "2026-04-23T00:00:00.000Z",
    );

    state = removeProject(state, "api-backend", "2026-04-23T00:00:00.000Z");
    expect(state.workspaces[0]?.relationships).toHaveLength(0);
  });

  it("atualiza contexto do workspace atual", () => {
    let state = createWorkspace(createEmptyState(), "meu-workspace", "2026-04-23T00:00:00.000Z");
    state = updateContextNote(state, "workspace de teste", "2026-04-23T00:00:00.000Z");
    expect(state.workspaces[0]?.contextNote?.content).toBe("workspace de teste");
  });

  it("seleciona workspace existente", () => {
    let state = createWorkspace(createEmptyState(), "um", "2026-04-23T00:00:00.000Z");
    state = createWorkspace(state, "dois", "2026-04-23T00:00:00.000Z");
    state = selectWorkspace(state, "um");
    expect(state.currentWorkspace).toBe("um");
  });
});
