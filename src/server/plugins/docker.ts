import * as Docker from "dockerode";
import {ContainerInspectInfo} from "dockerode";
import {LabPlugin} from "./plugin";

const docker = new Docker();

export class DockerPlugin implements LabPlugin {
  async startContainer(id: string): Promise<void> {
    const container_id = "jupyterclassroom_" + id;
    
    let container = docker.getContainer(container_id);
    let container_info: ContainerInspectInfo;
    
    try {
      container_info = await container.inspect();
    } catch (e) {
      if (e.statusCode == 404) {
        container = await docker.createContainer({
          name: container_id,
          Image: "nginx",
        });
        container_info = await container.inspect();
      } else {
        throw e;
      }
    }
    
    if (!container_info.State.Running) {
      await container.start();
    }
  }
  
  async stopContainer(id: string): Promise<void> {
    const container_id = "jupyterclassroom_" + id;
    const container = docker.getContainer(container_id);
    
    try {
      await container.stop();
      await container.remove();
    } catch (e) {
      if (e.statusCode == 404) {
        // no-op
      } else {
        throw e;
      }
    }
  }
}
