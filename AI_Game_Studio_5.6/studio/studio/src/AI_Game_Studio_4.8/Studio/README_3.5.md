# AI Game Studio 3.5 — 3D Asset Pipeline

3.5 turns the 3.3/3.4 asset layer into a provider-neutral production pipeline. Blueprint, World and NPC data become project-scoped asset jobs for characters, environments, props, materials, animations, UI and audio.

## Included
- `Studio/asset-pipeline/build-3.5.js` creates `AssetPipelineManifest.json`.
- Every job has a unique Asset Job ID and Project ID.
- `UnityProject/Assets/AIStudio/Generated/<ProjectID>/...` keeps assets isolated.
- Unity menu creates the project-scoped folder structure.
- Backend helper queues asset jobs without mixing projects.

## Important
This package does **not** pretend to contain a universal 3D model/animation/audio generator. GLB/FBX/WAV generation depends on a connected provider. 3.5 defines the pipeline and import boundary so providers can be plugged in next.
