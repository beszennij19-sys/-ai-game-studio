export function deriveProject(blueprint) {
  const id = blueprint.projectId;
  return {
    projectId: id,
    version: "3.1.0",
    Blueprint: blueprint,
    Gameplay: {
      systems: blueprint.systems || [],
      playerMode: blueprint.playerMode,
      networking: blueprint.networking
    },
    World: blueprint.world || {locations:[],resources:[],events:[]},
    NPCs: {npcs: (blueprint.story?.characters || []).map((c,i)=>({
      id: `npc_${i+1}`, name: c.name || `NPC ${i+1}`, role: c.role || "character"
    }))},
    Quests: {quests: blueprint.story?.keyQuests || []},
    QuestGraph: {nodes: blueprint.story?.chapters || [], edges: []},
    UIDesign: {profile: blueprint.genre || "adventure", mobileFirst: true},
    ControlScheme: {mobile:["joystick","look","action","interact"], desktop:["WASD","mouse","Space","E"]},
    UnityExportManifest: {
      projectId:id,
      target:["WebGL","Windows","Android","iOS"],
      dataRoot:"Assets/AIStudio/Data"
    }
  };
}
