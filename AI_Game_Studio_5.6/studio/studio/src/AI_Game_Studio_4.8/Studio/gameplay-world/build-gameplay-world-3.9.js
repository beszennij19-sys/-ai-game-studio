export function buildGameplayWorld(blueprint = {}, worldPlan = {}, npcs = [], quests = [], projectId = "PROJECT-UNSET") {
  const worldId = worldPlan.worldId || `WORLD-${projectId}`;
  const locations = worldPlan?.worldPlan?.locations || [];
  const npcList = Array.isArray(npcs) ? npcs : (npcs?.characters || npcs?.npcs || []);
  const questList = Array.isArray(quests) ? quests : (quests?.quests || []);

  return {
    version: "3.9",
    projectId,
    worldId,
    gameplayWorld: {
      locations: locations.map(l => ({
        id: l.id,
        systems: ["npc_spawns", "resources", "quest_triggers", "encounters"],
        resourceNodes: l.resourceNodes || [],
        pointsOfInterest: l.pointsOfInterest || []
      })),
      npcs: npcList.map((n, i) => ({
        id: n.id || n.characterId || `NPC-${i+1}`,
        name: n.name || `NPC ${i+1}`,
        role: n.role || "NPC",
        schedule: ["idle", "patrol", "interact"],
        reactions: ["player_near", "quest_progress", "world_event"]
      })),
      quests: questList.map((q, i) => ({
        id: q.id || q.questId || `QUEST-${i+1}`,
        title: q.title || q.name || `Quest ${i+1}`,
        triggers: ["location_enter", "npc_interact", "resource_collect", "event_complete"],
        rewards: q.rewards || {}
      })),
      events: [
        { id: "world_event_ambient", type: "ambient", trigger: "timer", effects: ["spawn_ambient_activity"] },
        { id: "world_event_location", type: "location", trigger: "location_enter", effects: ["activate_location_events"] }
      ],
      encounters: [
        { id: "encounter_default", type: "dynamic", conditions: ["player_in_location"], effects: ["select_encounter"] }
      ]
    },
    runtimeBindings: {
      player: ["movement", "interaction", "health", "inventory"],
      world: ["locations", "events", "resources", "navigation"],
      ai: ["npc_state", "encounters", "reactions"],
      progression: ["quests", "rewards", "save"]
    }
  };
}
