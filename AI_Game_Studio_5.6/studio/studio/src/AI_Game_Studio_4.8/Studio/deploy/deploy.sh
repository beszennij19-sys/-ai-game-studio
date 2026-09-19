#!/bin/sh
set -eu
cd "$(dirname "$0")"
if [ ! -f .env ]; then echo "Missing Studio/deploy/.env. Copy env.production.example to .env and edit it."; exit 1; fi
DOMAIN_VALUE=$(grep '^DOMAIN=' .env | cut -d= -f2-)
if [ -z "$DOMAIN_VALUE" ]; then echo "DOMAIN is required"; exit 1; fi
echo "Building and starting AI Game Studio for $DOMAIN_VALUE..."
docker compose --env-file .env up -d --build
echo "Waiting for readiness..."
for i in $(seq 1 30); do
  if docker compose --env-file .env exec -T studio node -e "fetch('http://127.0.0.1:8787/api/ready').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then
    echo "AI Game Studio is ready. Open https://$DOMAIN_VALUE"
    exit 0
  fi
  sleep 2
done
echo "Services started, but readiness check timed out. Run: docker compose --env-file .env ps"
exit 1
