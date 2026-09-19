# AI Game Studio 3.2 — Automatic Unity Export

3.2 делает следующий шаг: после получения Blueprint проект можно автоматически разложить в Unity-ready Data.

## Один сценарий
Описание игры → AI Blueprint → производные данные → Unity Data → стартовая сцена.

### Unity
Меню:
`AI Game Studio → 3.2 → Export Complete Unity Project`
`AI Game Studio → 3.2 → Build Complete Starter Scene`
`AI Game Studio → 3.2 → Build Everything`

### CLI exporter
В `Studio/unity-exporter/export-project-3.2.js` есть детерминированный экспорт Blueprint в:
- Gameplay.json
- World.json
- NPCs.json
- Quests.json
- QuestGraph.json
- UIDesign.json
- ControlScheme.json
- UnityExportManifest.json

### Ограничение
Это автоматический экспорт данных и Unity-ready структуры. Unity Editor всё ещё должен реально импортировать/собрать проект. Полный cloud build будет отдельным этапом.
