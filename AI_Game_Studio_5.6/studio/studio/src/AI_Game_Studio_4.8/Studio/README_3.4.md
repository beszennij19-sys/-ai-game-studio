# 3.4 Real AI Asset Generation

3.4 adds a real image-generation path while keeping API credentials server-side.

### API
`POST /api/assets/:projectId/generate-image`

JSON body:
```json
{"jobId":"ASSET-0001","name":"key_art","prompt":"...","size":"1536x1024","quality":"medium"}
```

The response returns the generated file path relative to the Studio root. Files are stored in `Studio/generated-assets/<ProjectID>/`.

### Unity
Use `AI Game Studio → 3.4 → Import Generated Asset Pack` after generation. The editor utility copies generated PNG files into the Unity project and refreshes the AssetDatabase.
