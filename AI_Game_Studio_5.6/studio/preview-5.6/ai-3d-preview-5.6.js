export function build3DPreview(blueprint = {}) {
  const genre = String(blueprint.genre || '').toLowerCase();
  const systems = Array.isArray(blueprint.systems) ? blueprint.systems : [];
  const names = systems.map(s => typeof s === 'string' ? s : s.name).filter(Boolean);
  const has = (...words) => words.some(w => (genre + ' ' + names.join(' ')).toLowerCase().includes(w));
  return {
    version: '5.6', camera: blueprint.camera || (has('fps','shooter') ? 'first-person' : 'third-person'),
    world: { locations: blueprint.world?.locations || [], resources: blueprint.world?.resources || [], events: blueprint.world?.events || [] },
    entities: {
      enemies: has('combat','enemy','shooter','survival') ? 3 : 0,
      resources: has('resource','survival','craft') ? 8 : 2,
      npcs: Array.isArray(blueprint.story?.characters) ? blueprint.story.characters.length : 0,
      questMarkers: Array.isArray(blueprint.story?.keyQuests) ? blueprint.story.keyQuests.length : 0
    },
    mechanics: { combat: has('combat','shooter'), crafting: has('craft'), building: has('build'), hunger: has('hunger','survival'), dialogue: has('dialogue','story','rpg') }
  };
}
