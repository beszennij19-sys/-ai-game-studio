# AI Game Studio 4.2 — Complete Game Builder

4.2 объединяет предыдущие стадии в один оркестратор: Project → Blueprint → Gameplay → World → NPC/Characters → Quests/Story → AI Asset Jobs → Gameplay World → Unified Runtime → AI Director → Unity Export → Validation.

## Что реально делает
- создаёт изолированный build с ProjectID + BuildID;
- сохраняет BUILD_MANIFEST.json и результаты стадий;
- даёт backend endpoint `POST /api/projects/:id/build`;
- добавляет веб-страницу `Studio/web/builder-4.2.html`;
- сохраняет предыдущие 4.1 модули.

## Важно
Это автоматический генератор/оркестратор проекта и Unity export skeleton. Он НЕ утверждает, что Unity Editor сам был запущен и что готовый APK/IPA/EXE уже скомпилирован. Для финального бинарного билда нужен Unity Editor или CI/cloud build.
