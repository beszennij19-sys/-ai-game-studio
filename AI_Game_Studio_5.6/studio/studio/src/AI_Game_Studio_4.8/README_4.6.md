# AI Game Studio 4.6 — Web Studio + Auth + Persistent Build Queue

4.6 adds real account authentication, PostgreSQL support, persistent builds and a separate worker to the 4.5 phone-first studio.

## Added
- Email/password registration and login with bcrypt hashing.
- JWT sessions and server-side ownership checks.
- PostgreSQL schema/migration, with JSON fallback for local development.
- Persistent build queue; queued/running jobs survive web-server restarts.
- Worker process that executes the existing complete-game pipeline and persists results.
- Mobile-first 4.6 Web Studio.
- Dockerfile + Docker Compose for PostgreSQL, web server and worker.

## Local JSON mode
```bash
cd Studio/backend
cp env.4.6.example .env
# leave DATABASE_URL empty for JSON mode
npm install
npm start
```
Open `http://localhost:8787`.

## PostgreSQL
Set DATABASE_URL, then:
```bash
cd Studio/backend
npm install
npm run migrate
npm start
```
Run the worker separately:
```bash
npm run worker
```

## Docker
```bash
docker compose -f Studio/deploy/docker-compose.yml up --build
```

## Important
4.6 is a deployable service package, not a public hosted domain. Public launch still requires a hosting provider, DNS/HTTPS, production secrets, backups and monitoring. Unity/iOS/Android compilation still requires configured Unity CI and platform signing credentials.
