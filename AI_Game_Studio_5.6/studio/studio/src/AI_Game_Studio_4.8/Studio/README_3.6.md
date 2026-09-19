# AI Game Studio 3.6 — Real 3D Provider Pipeline

3.6 connects the project-scoped asset pipeline to a real 3D generation provider.

## Meshy
Set `MESHY_API_KEY` on the server. Meshy Text-to-3D uses a preview → refine workflow; Image-to-3D can generate a textured model. The integration requests GLB by default, polls the provider task, downloads the completed model, and stores it under:

`Studio/generated-assets/<ProjectID>/3d/`

## API
- `POST /api/assets/:projectId/3d/meshy` — create a text-to-3D or image-to-3D job.
- `GET /api/assets/3d/:jobId` — poll/synchronize the provider job and download the completed result.

Example body for text:
```json
{"name":"Player","prompt":"original realistic survival game character, full body, neutral pose","format":"glb","autoRefine":true}
```

Example body for image-to-3D:
```json
{"name":"Player","imageUrl":"https://example.com/player.png","format":"glb"}
```

The API key is server-side only. Provider usage may incur provider credits/costs and rate limits.

3.6 does not claim automatic rigging/animation for every model. Those are separate provider capabilities and will be added as dedicated pipeline stages.
