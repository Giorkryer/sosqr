#!/bin/bash
set -e

rm -f /app/tmp/pids/server.pid

if [ "$1" = "bin/rails" ] || [ "$1" = "rails" ]; then
  if [ -n "$DATABASE_URL" ]; then
    echo "==> Verificando e aplicando migrations com rails db:prepare..."
    bundle exec rails db:prepare
  fi
fi

exec "$@"