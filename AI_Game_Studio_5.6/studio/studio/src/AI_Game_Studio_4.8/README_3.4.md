# AI Game Studio 3.4 — Real AI Asset Generation

3.4 upgrades the 3.3 asset specification layer with a real server-side image-generation adapter.

## What is real
- `POST /api/assets/:projectId/generate-image` calls the OpenAI Images API when `OPENAI_API_KEY` is configured.
- Default image model: `gpt-image-2` (override with `IMAGE_MODEL`).
- PNG results are saved under `Studio/generated-assets/<ProjectID>/` so projects cannot overwrite each other by default.
- Every generated result carries a Project ID and Asset Job ID.
- The existing 3.3 AssetJobs/AssetManifest remain the source of generation jobs.

## What is not yet real
- This release does **not** create production-ready GLB/FBX characters or animations.
- Audio and VFX remain provider adapters/specifications.
- Unity import is prepared through the generated asset folder and editor utility; Unity Editor/build still has to run somewhere (local or CI/cloud).

## Run
1. `cd Studio/backend`
2. `npm install`
3. Copy `env.example` to `.env` and set `OPENAI_API_KEY`.
4. `npm start`

The server is intentionally the only place where the API key is used. Do not put the key in the mobile/web client.
