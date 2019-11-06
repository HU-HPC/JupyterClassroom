import * as express from "express";
import * as sqlite from "sqlite";
import * as uuid4 from "uuid/v1"
import {LabPlugin} from "./plugins/plugin";
import {DockerPlugin} from "./plugins/docker";

export const api = express.Router();

let labPlugin: LabPlugin;
labPlugin = new DockerPlugin();

async function start() {
  const db = await sqlite.open(":memory:");
  await db.migrate({});
  
  // create a new Lab
  api.post("/labs", async (req, res) => {
    const lab_id = uuid4();
    await db.run("INSERT INTO labs VALUES (?)", lab_id);
    res.json({
      id: lab_id,
    });
  });
  
  // start a Lab
  api.post("/labs/:id/start", async (req, res) => {
    const lab_id = req.params["id"];
    const db_res = await db.get("SELECT * FROM labs WHERE lab_id=?", lab_id);
    
    await labPlugin.startContainer(lab_id);
    
    res.sendStatus(204);
  });
  
  // start a Lab
  api.post("/labs/:id/stop", async (req, res) => {
    const lab_id = req.params["id"];
    const db_res = await db.get("SELECT * FROM labs WHERE lab_id=?", lab_id);
    
    await labPlugin.stopContainer(lab_id);
  
    res.sendStatus(204);
  });
  
  // fork a Lab
  api.post("/labs/:id/fork", async (req, res) => {
  
  });
}

start();
