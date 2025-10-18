#!/bin/bash

# Script para popular o banco de dados em produção
# Uso: ./scripts/seed-production.sh <DATABASE_URL>

if [ -z "$1" ]; then
  echo "❌ Erro: DATABASE_URL não fornecida"
  echo "Uso: ./scripts/seed-production.sh 'postgresql://user:pass@host:port/db'"
  exit 1
fi

export DATABASE_URL="$1"

echo "🌱 Populando banco de dados em produção..."
echo ""

node prisma/seed.js

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Banco populado com sucesso!"
  echo ""
  echo "👥 Usuários criados:"
  echo "   ADMIN: admin@exercito.mil.br / admin123"
  echo "   SUPERVISOR: supervisor@exercito.mil.br / supervisor123"
  echo "   OPERATOR: operator@exercito.mil.br / operator123"
else
  echo ""
  echo "❌ Erro ao popular banco"
  exit 1
fi
