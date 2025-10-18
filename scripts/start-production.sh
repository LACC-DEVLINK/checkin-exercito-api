#!/bin/bash
set -e

echo "🚀 Iniciando aplicação em produção..."
echo "📡 DATABASE_URL configurado: ${DATABASE_URL:0:30}..."
echo ""

# Gerar Prisma Client (necessário antes de qualquer operação)
echo "🔧 Gerando Prisma Client..."
npx prisma generate
echo "✅ Prisma Client gerado!"
echo ""

# Aguardar 10 segundos para o banco de dados estar pronto
echo "⏳ Aguardando banco de dados inicializar..."
sleep 10

# Tentar conectar ao banco com retry
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "🔄 Tentativa $((RETRY_COUNT + 1))/$MAX_RETRIES: Executando migrations..."
  
  if npx prisma migrate deploy; then
    echo "✅ Migrations executadas com sucesso!"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "⚠️  Falha na migration. Aguardando 5 segundos antes de tentar novamente..."
      sleep 5
    else
      echo "❌ Falha após $MAX_RETRIES tentativas. Abortando..."
      exit 1
    fi
  fi
done

echo ""
echo "🌱 Executando seed (se necessário)..."
node prisma/seed.js || echo "⚠️  Seed falhou ou foi pulado (pode ser que usuários já existam)"

echo ""
echo "🎯 Iniciando servidor NestJS..."
exec npm run start:prod
