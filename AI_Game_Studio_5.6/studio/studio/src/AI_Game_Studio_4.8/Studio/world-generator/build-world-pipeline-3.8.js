export function buildWorldPipeline(blueprint = {}, projectId = "PROJECT-UNSET") {
  const locations = Array.isArray(blueprint?.world?.locations)
    ? blueprint.world.locations
    : (Array.isArray(blueprint?.locations) ? blueprint.locations : []);

  const worldId = `WORLD-${String(projectId).replace(/[^A-Za-z0-9_-]/g, "_")}`;
  const root = `Generated/${projectId}/World/${worldId}`;

  return {
    version: "3.8",
    projectId,
    worldId,
    root,
    worldPlan: {
      title: blueprint.title || "Generated World",
      visualStyle: blueprint.visualStyle || "realistic",
      scale: blueprint.scale || "small",
      camera: blueprint.camera || "third-person",
      locations: locations.map((l, i) => ({
        id: String(l.id || `LOC-${i+1}`).replace(/[^A-Za-z0-9_-]/g, "_"),
        name: l.name || `Location ${i+1}`,
        type: l.type || "area",
        description: l.description || "",
        environment: ["terrain", "vegetation", "architecture", "props"],
        traversal: ["paths", "roads", "spawn_points"],
        pointsOfInterest: l.pointsOfInterest || [],
        resourceNodes: l.resources || []
      }))
    },
    sceneManifest: {
      terrain: true,
      lighting: true,
      sky: true,
      navigation: true,
      locations: locations.map((l, i) => ({
        locationId: String(l.id || `LOC-${i+1}`).replace(/[^A-Za-z0-9_-]/g, "_"),
        prefabGroup: `Location_${i+1}`,
        status: "planned"
      }))
    }
  };
}
