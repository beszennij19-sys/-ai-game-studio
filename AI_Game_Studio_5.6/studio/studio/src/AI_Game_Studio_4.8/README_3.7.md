# AI Game Studio 3.7 — AI Character Pipeline

3.7 adds a complete, provider-neutral character production pipeline:

1. Character concept job
2. 3D model job (GLB-ready)
3. Materials/textures job
4. Humanoid rig job
5. Animation clip jobs
6. Unity prefab manifest/import preparation

## Project isolation
All character outputs are scoped by ProjectID and CharacterID:
`Generated/<ProjectID>/Characters/<CharacterID>/`

## Backend
New endpoints:
- `POST /api/projects/:id/characters/:characterId/jobs`
- `GET /api/character-jobs/:jobId`

The provider adapter is intentionally separate. It creates durable jobs and can be connected to a real 3D/rig/animation provider without exposing API keys to the client.

## Unity
`AI Game Studio → 3.7 → Prepare Character Pipeline`

This prepares the project-specific generated-asset area. The Unity Editor is still required to import generated model files, configure humanoid rigging/animations and finalize a prefab.

## Important
3.7 does not pretend that rigging/animation generation is already available from a single provider. The pipeline is real and executable at the job/orchestration layer; actual model/rig/animation generation depends on the connected providers.
