#!/usr/bin/env node
/**
 * Script para aguardar o banco de dados PostgreSQL estar disponível
 * Alternativa ao wait-for-db.sh para ambientes sem bash
 */

const { Client } = require('pg');

const MAX_ATTEMPTS = 30;
const RETRY_DELAY = 2000; // 2 segundos

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    return true;
  } catch (error) {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        // Ignorar erro ao fechar conexão falha
      }
    }
    throw error;
  }
}

async function waitForDatabase() {
  console.log('🔍 Aguardando banco de dados ficar disponível...');
  console.log(`📡 DATABASE_URL: ${process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')}`);
  console.log('');

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(`⏳ Tentativa ${attempt}/${MAX_ATTEMPTS}...`);

    try {
      await testConnection();
      console.log('✅ Banco de dados está pronto!');
      console.log('🎉 Conexão estabelecida com sucesso!');
      console.log('');
      return true;
    } catch (error) {
      console.log(`❌ Ainda não disponível: ${error.message}`);

      if (attempt < MAX_ATTEMPTS) {
        console.log(`⏸️  Aguardando ${RETRY_DELAY / 1000} segundos antes de tentar novamente...`);
        console.log('');
        await sleep(RETRY_DELAY);
      }
    }
  }

  throw new Error(
    `❌ Não foi possível conectar ao banco de dados após ${MAX_ATTEMPTS} tentativas (${(MAX_ATTEMPTS * RETRY_DELAY) / 1000} segundos)`
  );
}

// Executar
waitForDatabase()
  .then(() => {
    console.log('✅ Pronto para executar migrations!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('');
    console.error('🔴 ERRO FATAL:');
    console.error(error.message);
    console.error('');
    console.error('💡 Possíveis causas:');
    console.error('   1. PostgreSQL não está rodando no Railway');
    console.error('   2. DATABASE_URL está incorreta');
    console.error('   3. Private networking não está configurado');
    console.error('   4. Firewall bloqueando conexão');
    console.error('');
    console.error('🔧 Soluções:');
    console.error('   1. Verificar logs do PostgreSQL no Railway');
    console.error('   2. Confirmar DATABASE_URL nas variáveis');
    console.error('   3. Verificar Private Networking no projeto');
    console.error('');
    process.exit(1);
  });
