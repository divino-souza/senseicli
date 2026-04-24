import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createEmptyState } from "../workspace/logic.js";
import { WorkspaceState } from "../core/types.js";

export class WorkspaceStore {
  private readonly baseDir: string;
  private readonly stateFile: string;

  constructor(baseDir?: string) {
    this.baseDir =
      baseDir ??
      process.env.SENSEICLI_HOME ??
      path.join(process.cwd(), ".senseicli");
    this.stateFile = path.join(this.baseDir, "workspaces.json");
  }

  async load(): Promise<WorkspaceState> {
    try {
      const content = await readFile(this.stateFile, "utf-8");
      return JSON.parse(content) as WorkspaceState;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return createEmptyState();
      }

      throw error;
    }
  }

  async save(state: WorkspaceState): Promise<void> {
    await mkdir(this.baseDir, { recursive: true });
    await writeFile(this.stateFile, JSON.stringify(state, null, 2), "utf-8");
  }

  getStateFile(): string {
    return this.stateFile;
  }
}
