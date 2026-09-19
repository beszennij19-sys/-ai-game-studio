export function buildCharacterPipeline(blueprint = {}, npcs = {}, projectId = "PROJECT-UNSET") {
  const characters = Array.isArray(npcs) ? npcs : (Array.isArray(npcs?.characters) ? npcs.characters : []);
  return {
    version: "3.7",
    projectId,
    root: `Generated/${projectId}/Characters`,
    jobs: characters.map((c, i) => {
      const id = String(c.id || c.characterId || `CHAR-${i + 1}`).replace(/[^a-zA-Z0-9_-]/g, "_");
      const name = c.name || c.title || `Character ${i + 1}`;
      return {
        characterId: id,
        name,
        role: c.role || "NPC",
        concept: { status: "queued", prompt: `Game character concept: ${name}. Role: ${c.role || "NPC"}.` },
        model: { status: "queued", format: "glb", provider: "meshy-compatible" },
        materials: { status: "queued", maps: ["baseColor","normal","roughness","metallic"] },
        rig: { status: "queued", type: "humanoid" },
        animations: { status: "queued", clips: ["idle","walk","run","interact"] },
        unityPrefab: { status: "pending", path: `Assets/AIStudio/Generated/${projectId}/Characters/${id}/${id}.prefab` }
      };
    })
  };
}
