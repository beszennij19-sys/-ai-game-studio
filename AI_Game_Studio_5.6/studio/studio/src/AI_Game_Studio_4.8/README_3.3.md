# AI Game Studio 3.3 — AI Asset Generator

3.3 adds a structured AI Asset Layer between the Blueprint/World data and the Unity project.

## What it does
- Creates project-isolated asset jobs with unique Job IDs.
- Produces generation specifications for key art, player character, locations, props, NPCs, UI, audio and VFX.
- Keeps all generated asset paths under `Assets/AIStudio/Generated/<ProjectID>/`.
- Adds a Unity menu: `AI Game Studio → 3.3 → Generate Asset Pack`.
- Preserves provider-neutral job metadata so external image/3D/audio/VFX providers can be connected later.

## Important
This release does **not** claim to generate real 3D models, textures, animation clips, music or sound files by itself. It generates structured jobs/specifications and prepares isolated Unity folders. Real asset generation requires an actual generation provider/API and an import adapter.

## CLI
From the package root:
`node Studio/asset-generator/generate-assets-3.3.js .`

The output is written to `Studio/data/assets/AssetManifest.json` and `AssetJobs.json`.
