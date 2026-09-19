# AI Game Studio 4.4 — Web Studio

4.4 adds the mobile-first web product layer on top of the 4.3 pipeline.

Flow: idea → isolated Project ID → Blueprint → complete builder → artifact manifest.

Run from `Studio/backend`: `npm install`, then `node server-4.4.mjs`.

Real OpenAI generation requires `OPENAI_API_KEY`. Without it, a local fallback Blueprint is used.

This package does not itself provide a public internet URL or magically compile signed iOS/Android builds. Public deployment, Unity CI credentials, and platform signing remain infrastructure steps.
