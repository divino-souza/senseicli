import { WorkspaceError } from "../core/errors.js";
import {
  DeclaredRelationship,
  ProjectRegistration,
  WorkspaceRecord,
  WorkspaceState,
} from "../core/types.js";

export function createEmptyState(): WorkspaceState {
  return {
    currentWorkspace: null,
    workspaces: [],
  };
}

export function createWorkspace(
  state: WorkspaceState,
  name: string,
  now: string,
): WorkspaceState {
  if (state.workspaces.some((workspace) => workspace.name === name)) {
    throw new WorkspaceError(`Workspace '${name}' ja existe.`);
  }

  return {
    ...state,
    currentWorkspace: name,
    workspaces: [
      ...state.workspaces,
      {
        name,
        createdAt: now,
        updatedAt: now,
        projects: [],
        relationships: [],
        contextNote: null,
      },
    ],
  };
}

export function selectWorkspace(
  state: WorkspaceState,
  name: string,
): WorkspaceState {
  if (!state.workspaces.some((workspace) => workspace.name === name)) {
    throw new WorkspaceError(`Workspace '${name}' nao encontrado.`);
  }

  return {
    ...state,
    currentWorkspace: name,
  };
}

export function getCurrentWorkspace(state: WorkspaceState): WorkspaceRecord {
  if (!state.currentWorkspace) {
    throw new WorkspaceError("Nenhum workspace selecionado.");
  }

  const workspace = state.workspaces.find(
    (item) => item.name === state.currentWorkspace,
  );

  if (!workspace) {
    throw new WorkspaceError(
      `Workspace atual '${state.currentWorkspace}' nao encontrado.`,
    );
  }

  return workspace;
}

function updateCurrentWorkspace(
  state: WorkspaceState,
  updater: (workspace: WorkspaceRecord) => WorkspaceRecord,
): WorkspaceState {
  const currentWorkspace = getCurrentWorkspace(state);

  return {
    ...state,
    workspaces: state.workspaces.map((workspace) =>
      workspace.name === currentWorkspace.name ? updater(currentWorkspace) : workspace,
    ),
  };
}

export function addProject(
  state: WorkspaceState,
  project: ProjectRegistration,
  now: string,
): WorkspaceState {
  return updateCurrentWorkspace(state, (workspace) => {
    if (workspace.projects.some((item) => item.name === project.name)) {
      throw new WorkspaceError(
        `Projeto '${project.name}' ja existe no workspace '${workspace.name}'.`,
      );
    }

    return {
      ...workspace,
      updatedAt: now,
      projects: [...workspace.projects, project],
    };
  });
}

export function removeProject(
  state: WorkspaceState,
  projectName: string,
  now: string,
): WorkspaceState {
  return updateCurrentWorkspace(state, (workspace) => {
    const exists = workspace.projects.some((item) => item.name === projectName);

    if (!exists) {
      throw new WorkspaceError(
        `Projeto '${projectName}' nao encontrado no workspace '${workspace.name}'.`,
      );
    }

    const relationships = workspace.relationships.filter(
      (item) =>
        item.sourceProject !== projectName && item.targetProject !== projectName,
    );

    return {
      ...workspace,
      updatedAt: now,
      projects: workspace.projects.filter((item) => item.name !== projectName),
      relationships,
    };
  });
}

export function addRelationship(
  state: WorkspaceState,
  relationship: Omit<DeclaredRelationship, "createdAt">,
  now: string,
): WorkspaceState {
  return updateCurrentWorkspace(state, (workspace) => {
    validateRelationshipProjects(workspace, relationship.sourceProject);
    validateRelationshipProjects(workspace, relationship.targetProject);

    return {
      ...workspace,
      updatedAt: now,
      relationships: [
        ...workspace.relationships,
        {
          ...relationship,
          createdAt: now,
        },
      ],
    };
  });
}

function validateRelationshipProjects(
  workspace: WorkspaceRecord,
  projectName: string | null,
): void {
  if (!projectName) {
    return;
  }

  if (!workspace.projects.some((item) => item.name === projectName)) {
    throw new WorkspaceError(
      `Projeto '${projectName}' nao encontrado para relacao declarada.`,
    );
  }
}

export function updateContextNote(
  state: WorkspaceState,
  content: string,
  now: string,
): WorkspaceState {
  return updateCurrentWorkspace(state, (workspace) => ({
    ...workspace,
    updatedAt: now,
    contextNote: {
      content,
      updatedAt: now,
    },
  }));
}
