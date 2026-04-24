import { access } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { WorkspaceStore } from "../storage/workspace-store.js";
import { WorkspaceError } from "../core/errors.js";
import { DeclaredRelationshipScope, WorkspaceState } from "../core/types.js";
import {
  addProject,
  addRelationship,
  createWorkspace,
  getCurrentWorkspace,
  removeProject,
  selectWorkspace,
  updateContextNote,
} from "./logic.js";

export class WorkspaceService {
  constructor(private readonly store: WorkspaceStore) {}

  async createWorkspace(name: string): Promise<WorkspaceState> {
    const state = await this.store.load();
    const nextState = createWorkspace(state, name, nowIso());
    await this.store.save(nextState);
    return nextState;
  }

  async listWorkspaces(): Promise<WorkspaceState> {
    return this.store.load();
  }

  async selectWorkspace(name: string): Promise<WorkspaceState> {
    const state = await this.store.load();
    const nextState = selectWorkspace(state, name);
    await this.store.save(nextState);
    return nextState;
  }

  async addProject(name: string, projectPath: string): Promise<WorkspaceState> {
    await ensureProjectPathExists(projectPath);
    const state = await this.store.load();
    const nextState = addProject(state, { name, path: projectPath }, nowIso());
    await this.store.save(nextState);
    return nextState;
  }

  async removeProject(name: string): Promise<WorkspaceState> {
    const state = await this.store.load();
    const nextState = removeProject(state, name, nowIso());
    await this.store.save(nextState);
    return nextState;
  }

  async addRelationship(
    description: string,
    scope: DeclaredRelationshipScope,
    sourceProject: string | null,
    targetProject: string | null,
  ): Promise<WorkspaceState> {
    const state = await this.store.load();
    const nextState = addRelationship(
      state,
      {
        id: randomUUID(),
        description,
        scope,
        sourceProject,
        targetProject,
      },
      nowIso(),
    );
    await this.store.save(nextState);
    return nextState;
  }

  async updateContext(content: string): Promise<WorkspaceState> {
    const state = await this.store.load();
    const nextState = updateContextNote(state, content, nowIso());
    await this.store.save(nextState);
    return nextState;
  }

  async getCurrentWorkspaceSummary() {
    const state = await this.store.load();
    return getCurrentWorkspace(state);
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

async function ensureProjectPathExists(projectPath: string): Promise<void> {
  try {
    await access(projectPath);
  } catch {
    throw new WorkspaceError(
      `Caminho do projeto nao encontrado: '${projectPath}'.`,
    );
  }
}
