# AI Game Studio 4.3 — Cloud Build Orchestrator

4.3 moves the project from local export preparation toward an actual CI/cloud build pipeline.

## New
- Cloud build job IDs and project isolation.
- Generated GitHub Actions workflow using game-ci/unity-builder.
- Unity batch/CI preparation script.
- Build target manifest for WebGL / Android / iOS / Windows.
- Backend endpoints: `/api/projects/:id/cloud-build`, `/api/cloud-builds/:buildId`.
- Mobile-friendly cloud-build page.
- Unity Editor menu: `AI Game Studio → 4.3 → Prepare Cloud Build`.

## Important
This package **does not pretend to compile a Unity game inside this ZIP**. Actual compilation needs a CI runner, Unity licensing, and platform signing credentials. iOS requires Apple signing assets; Android requires a keystore; Windows/WebGL require the corresponding Unity target modules.

Once CI credentials are configured, the generated workflow can run the Unity build remotely and upload artifacts.
