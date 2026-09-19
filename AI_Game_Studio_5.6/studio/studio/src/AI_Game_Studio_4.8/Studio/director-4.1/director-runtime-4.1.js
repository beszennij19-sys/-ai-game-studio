export class AIGameDirector41 {
  constructor(projectId, graph = {}) {
    this.projectId = projectId;
    this.graph = graph;
    this.state = {
      storyNode: graph.startNode || null,
      activeQuests: [],
      completedQuests: [],
      activeEvents: [],
      consequences: [],
      rewards: [],
      flags: {}
    };
  }

  _assertProject(projectId) {
    if (projectId && projectId !== this.projectId) throw new Error("Project isolation violation");
  }

  startStory(nodeId) {
    this.state.storyNode = nodeId;
    return this.resolve("story_start", nodeId);
  }

  acceptQuest(questId) {
    if (!questId) return [];
    if (!this.state.activeQuests.includes(questId) && !this.state.completedQuests.includes(questId)) {
      this.state.activeQuests.push(questId);
    }
    return this.resolve("quest_accept", questId);
  }

  completeQuest(questId) {
    this.state.activeQuests = this.state.activeQuests.filter(x => x !== questId);
    if (!this.state.completedQuests.includes(questId)) this.state.completedQuests.push(questId);
    return this.resolve("quest_complete", questId);
  }

  triggerEvent(eventId) {
    if (!this.state.activeEvents.includes(eventId)) this.state.activeEvents.push(eventId);
    return this.resolve("event", eventId);
  }

  setFlag(key, value = true) {
    this.state.flags[key] = value;
    return this.resolve("flag", key);
  }

  resolve(trigger, id) {
    const rules = Array.isArray(this.graph.rules) ? this.graph.rules : [];
    const fired = [];
    for (const rule of rules) {
      if (rule.trigger === trigger && (!rule.id || rule.id === id)) {
        for (const effect of (rule.effects || [])) {
          if (effect.type === "quest_accept") this.acceptQuest(effect.id);
          else if (effect.type === "quest_complete") this.completeQuest(effect.id);
          else if (effect.type === "event") this.triggerEvent(effect.id);
          else if (effect.type === "flag") this.state.flags[effect.key] = effect.value;
          else if (effect.type === "reward") this.state.rewards.push(effect.reward);
          else if (effect.type === "consequence") this.state.consequences.push(effect.value);
          else if (effect.type === "story") this.state.storyNode = effect.id;
          fired.push(effect);
        }
      }
    }
    return fired;
  }

  snapshot() {
    return JSON.stringify({
      version: "4.1",
      projectId: this.projectId,
      state: this.state
    });
  }

  restore(serialized) {
    const data = JSON.parse(serialized);
    this._assertProject(data.projectId);
    this.state = data.state;
  }
}
