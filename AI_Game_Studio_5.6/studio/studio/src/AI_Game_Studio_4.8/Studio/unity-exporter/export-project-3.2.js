import fs from "node:fs";
import path from "node:path";

const input = process.argv[2] || "../data/Blueprint.json";
const out = process.argv[3] || "../../UnityProject";

const blueprint = JSON.parse(fs.readFileSync(path.resolve(input), "utf8"));
const id = blueprint.projectId || ("PROJECT-" + Date.now());

const safe = s => String(s ?? "").replace(/[<>:"/\\|?*]/g, "_");
const root = path.resolve(out);
const dataRoot = path.join(root, "Assets", "AIStudio", "Data");

fs.mkdirSync(dataRoot, {recursive:true});

const derived = {
  Blueprint: {...blueprint, projectId:id, version:"3.2.0"},
  Gameplay: {
    projectId:id,
    playerMode: blueprint.playerMode || "solo",
    networking: blueprint.networking || "offline",
    systems: blueprint.systems || []
  },
  World: {...(blueprint.world || {}), projectId:id},
  NPCs: {
    projectId:id,
    npcs:(blueprint.story?.characters || []).map((c,i)=>({
      id:"npc_"+(i+1), name:c.name || ("NPC "+(i+1)), role:c.role || "character"
    }))
  },
  Quests: {
    projectId:id,
    quests: blueprint.story?.keyQuests || []
  },
  QuestGraph: {
    projectId:id,
    nodes: blueprint.story?.chapters || [],
    edges:[]
  },
  UIDesign: {
    projectId:id,
    profile:String(blueprint.genre || "adventure").toLowerCase(),
    mobileFirst:true
  },
  ControlScheme: {
    projectId:id,
    mobile:["joystick","look","action","interact"],
    desktop:["WASD","mouse","Space","E"]
  }
};

for (const [name, value] of Object.entries(derived)) {
  fs.writeFileSync(path.join(dataRoot, name + ".json"),
    JSON.stringify(value, null, 2), "utf8");
}

const manifest = {
  pipelineVersion:"3.2",
  projectId:id,
  source:"Blueprint.json",
  unityDataRoot:"Assets/AIStudio/Data",
  generatedFiles:Object.keys(derived).map(n=>"Assets/AIStudio/Data/"+n+".json"),
  status:"exported",
  isolation:{projectId:id, doNotMixProjects:true}
};
fs.writeFileSync(path.join(dataRoot,"UnityExportManifest.json"),
  JSON.stringify(manifest,null,2),"utf8");

console.log(JSON.stringify({ok:true, projectId:id, output:root, files:manifest.generatedFiles},null,2));
