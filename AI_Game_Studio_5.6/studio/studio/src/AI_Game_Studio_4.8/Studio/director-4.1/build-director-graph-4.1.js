export function buildDirectorGraph(blueprint = {}, projectId = "PROJECT-UNSET") {
  const story = blueprint.story || {};
  const quests = Array.isArray(story.keyQuests) ? story.keyQuests : [];
  const chapters = Array.isArray(story.chapters) ? story.chapters : [];
  const locations = Array.isArray(blueprint.world?.locations) ? blueprint.world.locations : [];

  return {
    version: "4.1",
    projectId,
    startNode: chapters[0]?.id || "chapter_1",
    nodes: [
      ...chapters.map((c, i) => ({ id: c.id || `chapter_${i+1}`, type: "story", title: c.title || c.name || `Chapter ${i+1}` })),
      ...quests.map((q, i) => ({ id: q.id || `quest_${i+1}`, type: "quest", title: q.title || q.name || `Quest ${i+1}` })),
      ...locations.map((l, i) => ({ id: l.id || `location_${i+1}`, type: "location", title: l.name || `Location ${i+1}` }))
    ],
    rules: [
      { trigger: "quest_complete", effects: [{ type: "reward", reward: { type: "coins", amount: 100 } }] },
      { trigger: "quest_complete", effects: [{ type: "story", id: quests[1]?.id || chapters[1]?.id || "chapter_2" }] },
      { trigger: "event", id: "world_event_location", effects: [{ type: "consequence", value: "location_event_active" }] },
      { trigger: "flag", id: "player_choice", effects: [{ type: "consequence", value: "story_branch_recorded" }] }
    ]
  };
}
