export interface LabPlugin {
  startContainer(id: string): Promise<void>;
  stopContainer(id: string): Promise<void>;
}
