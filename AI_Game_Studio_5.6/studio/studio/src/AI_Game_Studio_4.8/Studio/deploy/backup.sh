#!/bin/sh
set -eu
cd "$(dirname "$0")"
[ -f .env ] || { echo "Missing .env"; exit 1; }
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="backup-$STAMP"
mkdir -p "$OUT"
docker compose --env-file .env exec -T db pg_dump -U "${POSTGRES_USER:-aigame}" -d "${POSTGRES_DB:-aigamestudio}" > "$OUT/database.sql"
docker run --rm -v "$(docker volume ls -q | grep aigame-generated | head -1):/src:ro" -v "$PWD/$OUT:/dst" alpine sh -c 'cd /src && tar czf /dst/generated.tar.gz .'
echo "Backup written to $OUT"
