# AI Game Studio 4.7 — Production Deployment

4.7 turns the 4.6 Web Studio into a deployable production package.

## Included
- Node/Express production server with secure headers and configurable CORS.
- PostgreSQL-backed accounts/projects/build queue.
- Persistent worker container.
- Caddy reverse proxy with automatic HTTPS for a real domain.
- Docker Compose production stack.
- `env.production.example` with required secrets.
- Backup script for PostgreSQL and generated project artifacts.
- Smoke test script for health/auth endpoints.
- GitHub Actions CI for syntax checks and Docker build validation.
- PWA manifest/service worker for a phone-friendly installable web shell.

## Public deployment
The package is deployment-ready, but it is not already hosted on the internet. You still need:
1. A Linux VPS/server with Docker.
2. A domain whose DNS A/AAAA record points to the server.
3. `OPENAI_API_KEY` and other provider keys you choose to connect.
4. Strong production secrets in `.env`.

Then run:
```bash
cd Studio/deploy
cp env.production.example .env
# edit .env
./deploy.sh
```

Caddy will request and renew HTTPS automatically once the domain resolves to the server and ports 80/443 are reachable.

## Architecture
Browser/iPhone → Caddy HTTPS → Studio API/Web → PostgreSQL
                                  ↘ persistent build worker

The build worker processes queued builds and writes project-scoped artifacts under `Studio/generated/<ProjectID>/`.

## Important
4.7 does not claim to produce a compiled IPA/APK/EXE by itself. Unity and platform signing/build credentials remain required for those final artifacts.
