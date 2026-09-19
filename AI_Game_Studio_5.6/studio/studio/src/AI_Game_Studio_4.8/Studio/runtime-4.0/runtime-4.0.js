export class AIGameRuntime40 {
  constructor(projectId, config = {}) {
    this.projectId = projectId;
    this.config = config;
    this.state = {
      health: 100,
      maxHealth: 100,
      coins: 0,
      inventory: [],
      activeQuest: null,
      completedQuests: [],
      activeEvents: [],
      player: { x: 0, y: 0, z: 0 },
      world: { location: null },
      camera: { yaw: 0, pitch: 0 },
      startedAt: Date.now()
    };
    this.listeners = new Set();
  }

  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit() { for (const fn of this.listeners) fn(this.state); }

  damage(amount) {
    this.state.health = Math.max(0, this.state.health - Math.max(0, amount));
    this.emit();
  }

  heal(amount) {
    this.state.health = Math.min(this.state.maxHealth, this.state.health + Math.max(0, amount));
    this.emit();
  }

  addItem(item) {
    if (item) this.state.inventory.push(item);
    this.emit();
  }

  setQuest(questId) {
    this.state.activeQuest = questId;
    this.emit();
  }

  completeQuest(questId, reward = 0) {
    if (questId && !this.state.completedQuests.includes(questId)) {
      this.state.completedQuests.push(questId);
      this.state.coins += Number(reward) || 0;
      if (this.state.activeQuest === questId) this.state.activeQuest = null;
    }
    this.emit();
  }

  activateEvent(eventId) {
    if (eventId && !this.state.activeEvents.includes(eventId)) {
      this.state.activeEvents.push(eventId);
    }
    this.emit();
  }

  setLocation(locationId) {
    this.state.world.location = locationId;
    this.emit();
  }

  move(x, y, z) {
    this.state.player = { x, y, z };
    this.emit();
  }

  save() {
    return JSON.stringify({ version: "4.0", projectId: this.projectId, state: this.state });
  }

  load(serialized) {
    const data = JSON.parse(serialized);
    if (data.projectId !== this.projectId) throw new Error("Project isolation violation");
    this.state = data.state;
    this.emit();
  }
}
