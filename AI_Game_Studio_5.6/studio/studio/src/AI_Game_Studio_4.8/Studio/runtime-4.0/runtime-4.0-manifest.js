export function buildRuntimeManifest(blueprint = {}, projectId = "PROJECT-UNSET") {
  return {
    version: "4.0",
    projectId,
    modules: {
      player: { movement: true, interaction: true, health: true },
      camera: { look: true, mobileGesture: true },
      controls: { desktop: true, touch: true, gamepadReady: true },
      world: { locations: true, navigation: true, events: true },
      npc: { states: ["idle","patrol","follow","chase","flee"], reactions: true },
      quests: { branching: true, triggers: true, rewards: true },
      inventory: { items: true, persistence: true },
      save: { projectScoped: true, versioned: true },
      hud: { health: true, objective: true, inventory: true }
    },
    targets: blueprint.buildTargets || ["WebGL", "Android", "iOS", "Windows"]
  };
}
