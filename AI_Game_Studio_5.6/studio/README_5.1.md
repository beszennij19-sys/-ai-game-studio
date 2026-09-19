# AI Game Studio 5.1 — Launch

This release packages the previous engine/studio layers into a launch-oriented web entry point.

## Local

Run `node studio/launch-5.1/server-5.1.mjs` from the project root, then open `http://localhost:8080`.

## Production

Use `studio/deploy-5.1/docker-compose.yml` behind Caddy. Replace the example domain and set a strong POSTGRES_PASSWORD. Connect the real 4.2–5.0 generation/build backends and production secrets before public launch.

## Important

This package is deployment-ready scaffolding, not a hosted public service. A real domain, server, credentials, OpenAI key, database, and (for Unity builds) Unity CI/license credentials are still required.
