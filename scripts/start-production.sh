#!/bin/bash
set -e

echo "🚀 Iniciando aplicação em produção..."
echo "📡 DATABASE_URL: ${DATABASE_URL:0:40}..."
echo ""

echo "⏳ Aguardando banco de dados (30 segundos)..."
sleep 30

echo "🔄 Executando migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migrations falharam, mas continuando..."
}

echo "🌱 Executando seed..."
node prisma/seed.js || {
  echo "⚠️  Seed falhou, mas continuando..."
}

echo ""
echo "🎯 Iniciando servidor NestJS..."
exec npm run start:prod
