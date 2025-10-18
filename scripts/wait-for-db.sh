#!/bin/bash
# Script para aguardar o banco de dados estar pronto antes de rodar migrations

echo "🔍 Aguardando banco de dados ficar disponível..."

# Extrair host e porta do DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

echo "📡 Testando conexão: $DB_HOST:$DB_PORT"

max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  attempt=$((attempt + 1))
  echo "⏳ Tentativa $attempt/$max_attempts..."
  
  # Tentar conectar usando node e pg
  if node -e "
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    client.connect()
      .then(() => {
        console.log('✅ Banco de dados está pronto!');
        client.end();
        process.exit(0);
      })
      .catch((err) => {
        console.log('❌ Ainda não disponível:', err.message);
        process.exit(1);
      });
  " 2>/dev/null; then
    echo "🎉 Conexão estabelecida com sucesso!"
    exit 0
  fi
  
  if [ $attempt -lt $max_attempts ]; then
    echo "⏸️  Aguardando 2 segundos antes de tentar novamente..."
    sleep 2
  fi
done

echo "❌ Não foi possível conectar ao banco de dados após $max_attempts tentativas"
echo "🔧 Verifique se o serviço PostgreSQL está rodando no Railway"
exit 1
