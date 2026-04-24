export type DeclaredRelationshipScope = "workspace" | "project";

export interface ProjectRegistration {
  name: string;
  path: string;
}

export interface DeclaredRelationship {
  id: string;
  sourceProject: string | null;
  targetProject: string | null;
  description: string;
  scope: DeclaredRelationshipScope;
  createdAt: string;
}

export interface WorkspaceContextNote {
  content: string;
  updatedAt: string;
}

export interface WorkspaceRecord {
  name: string;
  createdAt: string;
  updatedAt: string;
  projects: ProjectRegistration[];
  relationships: DeclaredRelationship[];
  contextNote: WorkspaceContextNote | null;
}

export interface WorkspaceState {
  currentWorkspace: string | null;
  workspaces: WorkspaceRecord[];
}
