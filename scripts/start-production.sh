#!/bin/bash
# Não sair em caso de erro
set +e

echo "🚀 Iniciando aplicação CheckIn Exército..."
echo "📅 Data: $(date)"
echo ""

# Verificar se DATABASE_URL existe
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL não configurado!"
  exit 1
fi

echo "📡 DATABASE_URL: ${DATABASE_URL:0:40}..."
echo ""

# Garantir que Prisma Client está gerado
echo "🔧 Gerando Prisma Client..."
npx prisma generate
echo ""

# Aguardar banco de dados
echo "⏳ Aguardando PostgreSQL ficar disponível (60 segundos)..."
sleep 60
echo ""

# Executar migrations com retry
echo "🔄 Executando migrations..."
MAX_RETRIES=5
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if npx prisma migrate deploy 2>&1; then
    echo "✅ Migrations executadas com sucesso!"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "⚠️  Tentativa $RETRY_COUNT falhou. Aguardando 10s..."
      sleep 10
    else
      echo "⚠️  Migrations falharam após $MAX_RETRIES tentativas"
      echo "⚠️  Continuando mesmo assim..."
    fi
  fi
done
echo ""

# Executar seed
echo "🌱 Executando seed..."
node prisma/seed.js 2>&1 || echo "⚠️  Seed pulado (usuários já podem existir)"
echo ""

echo "🎯 Iniciando servidor NestJS..."
echo "🌐 Aguardando na porta ${PORT:-3000}..."
echo ""

# Voltar a sair em caso de erro para o servidor
set -e
exec npm run start:prod
