#!/bin/bash
set -e

rm -f /app/tmp/pids/server.pid

if [ -n "$DATABASE_URL" ]; then
  echo "==> Verificando e aplicando migrations no Supabase com rails db:prepare..."
  bundle exec rails db:prepare || echo "==> Aviso: db:prepare encontrou um aviso ou tabela existente. Continuando boot do servidor..."
else
  echo "==> AVISO CRITICO: DATABASE_URL nao esta definida nas variaveis de ambiente!"
fi

exec "$@"