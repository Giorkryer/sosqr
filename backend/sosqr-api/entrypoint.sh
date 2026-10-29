#!/bin/bash
set -e

# Remove PID residual se houver
rm -f /app/tmp/pids/server.pid

# Executa migrações pendentes com timeout de 15s para NUNCA travar o boot do servidor
if [ -n "$DATABASE_URL" ]; then
  echo "==> Verificando migrações pendentes no Supabase com rails db:migrate..."
  timeout 15s bundle exec rails db:migrate || echo "==> Aviso: db:migrate finalizou ou excedeu 15s. Prosseguindo com o boot do Puma..."
else
  echo "==> AVISO: DATABASE_URL nao definida nas variaveis de ambiente!"
fi

echo "==> Inicializando Puma na porta ${PORT:-3000}..."
exec "$@"