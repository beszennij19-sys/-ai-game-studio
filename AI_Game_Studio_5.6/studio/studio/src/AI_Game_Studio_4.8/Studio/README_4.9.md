# AI Game Studio 4.9 — AI Gameplay Compiler

4.9 compiles each project's Blueprint into data-driven gameplay rules and feeds those rules into the Web Preview.

The preview can instantiate the relevant subset of movement, camera, health, combat/enemies, inventory/pickups, quests/dialogue flags, crafting/building flags, vehicles, save and mobile controls. It is no longer a single fixed demo configuration.

API: `POST /api/projects/:id/compile-gameplay` compiles the isolated project's Blueprint.

This is a browser gameplay compiler/preview layer. It does not claim to generate final photorealistic 3D assets, native APK/IPA or replace Unity for commercial builds.
