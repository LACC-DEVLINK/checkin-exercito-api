#!/bin/bash

# ========================================
# Script de Setup - Ambiente de Desenvolvimento
# CheckIn Exército API
# ========================================

echo ""
echo "🚀 Configurando ambiente de desenvolvimento..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar se .env já existe
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env já existe!${NC}"
    read -p "Deseja sobrescrevê-lo? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${GREEN}✅ Mantendo arquivo .env existente${NC}"
    else
        cp .env.example .env
        echo -e "${GREEN}✅ Arquivo .env criado!${NC}"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado!${NC}"
fi

echo ""
echo -e "${YELLOW}📝 IMPORTANTE: Edite o arquivo .env com suas credenciais${NC}"
echo ""

# 2. Perguntar se deseja instalar dependências
read -p "Deseja instalar as dependências do projeto? (S/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo ""
    echo "📦 Instalando dependências..."
    npm install
    echo -e "${GREEN}✅ Dependências instaladas!${NC}"
fi

# 3. Perguntar se deseja subir o banco de dados
echo ""
read -p "Deseja subir o banco de dados local? (S/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo ""
    echo "🐳 Iniciando PostgreSQL no Docker..."
    docker-compose -f docker-compose.dev.yml up -d postgres
    echo -e "${GREEN}✅ Banco de dados iniciado!${NC}"
    
    echo ""
    echo "⏳ Aguardando 5 segundos para o banco inicializar..."
    sleep 5
    
    # 4. Executar migrations
    echo ""
    echo "🔄 Executando migrations..."
    npm run dev:migrate
    
    # 5. Perguntar se deseja popular com dados de teste
    echo ""
    read -p "Deseja popular o banco com dados de teste? (S/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        echo ""
        echo "🌱 Populando banco de dados..."
        npm run dev:seed
        echo -e "${GREEN}✅ Banco populado com sucesso!${NC}"
    fi
fi

echo ""
echo "=================================="
echo -e "${GREEN}✨ Setup concluído!${NC}"
echo "=================================="
echo ""
echo "📚 Próximos passos:"
echo ""
echo "1. Edite o arquivo .env com suas configurações"
echo "2. Execute: npm run start:dev"
echo "3. Acesse: http://localhost:3000"
echo ""
echo "🔍 Comandos úteis:"
echo "  - npm run dev:studio     # Abrir Prisma Studio"
echo "  - npm run dev:db:down    # Parar banco de dados"
echo "  - npm run dev:db:reset   # Resetar banco de dados"
echo ""
echo "📖 Veja SETUP-DEV.md para mais informações"
echo ""
