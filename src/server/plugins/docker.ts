import * as Docker from "dockerode";
import {ContainerInspectInfo} from "dockerode";
import {LabPlugin} from "./plugin";

const DOMAIN = process.env.DOMAIN;
if (!DOMAIN) throw new Error("missing DOMAIN env variable");

const docker = new Docker();

export class DockerPlugin implements LabPlugin {
  async startContainer(id: string): Promise<void> {
    const container_id = "juypterclassroom_" + id;
    
    let container = docker.getContainer(container_id);
    let container_info: ContainerInspectInfo;
    
    try {
      container_info = await container.inspect();
    } catch (e) {
      if (e.statusCode == 404) {
        const labels = {};
        labels["traefik.enable"] = "true";
        const prefix_routers = "traefik.http.routers.jc_lab_" + id;
        const prefix_services = "traefik.http.services.jc_lab_" + id;
        labels[prefix_routers + ".rule"] =
          "Host(`" + DOMAIN + "`) && PathPrefix(`/_lab-instance/" + id + "`)";
        labels[prefix_routers + ".tls.certresolver"] = "myhttpchallenge";
        labels[prefix_services + ".loadbalancer.server.port"] = "80";
        
        container = await docker.createContainer({
          name: container_id,
          Image: "nginx",
          Labels: labels,
        });
        container_info = await container.inspect();
        
        let network = docker.getNetwork("juypterclassroom_default");
        await network.connect({
          Container: container_id,
        });
      } else {
        throw e;
      }
    }
    
    if (!container_info.State.Running) {
      await container.start();
    }
    
    // TODO wait until container can be hit
  }
  
  async stopContainer(id: string): Promise<void> {
    const container_id = "juypterclassroom_" + id;
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
