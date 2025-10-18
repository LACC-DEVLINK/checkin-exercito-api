#!/bin/bash

echo "🧪 Teste Completo de Autenticação"
echo "=================================="
echo ""

API_URL="http://localhost:3000"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Testando LOGIN...${NC}"
LOGIN_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exercito.mil.br","password":"admin123"}')

HTTP_STATUS=$(echo "$LOGIN_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$LOGIN_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ Login bem-sucedido (200)${NC}"
    echo "$BODY" | jq '.'
    
    ACCESS_TOKEN=$(echo "$BODY" | jq -r '.accessToken')
    echo ""
    echo -e "${YELLOW}Token para copiar:${NC}"
    echo "$ACCESS_TOKEN"
    echo ""
else
    echo -e "${RED}✗ Erro no login (Status: $HTTP_STATUS)${NC}"
    echo "$BODY" | jq '.'
    exit 1
fi

echo ""
echo -e "${YELLOW}2. Testando GET /auth/profile (rota protegida)...${NC}"
PROFILE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$API_URL/auth/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

HTTP_STATUS=$(echo "$PROFILE_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$PROFILE_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ Profile obtido com sucesso (200)${NC}"
    echo "$BODY" | jq '.'
else
    echo -e "${RED}✗ Erro ao obter profile (Status: $HTTP_STATUS)${NC}"
    echo "$BODY" | jq '.'
fi

echo ""
echo -e "${YELLOW}3. Testando GET /users (rota protegida com permissão)...${NC}"
USERS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$API_URL/users" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

HTTP_STATUS=$(echo "$USERS_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$USERS_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ Usuários listados com sucesso (200)${NC}"
    echo "$BODY" | jq '.'
else
    echo -e "${RED}✗ Erro ao listar usuários (Status: $HTTP_STATUS)${NC}"
    echo "$BODY" | jq '.'
fi

echo ""
echo -e "${YELLOW}4. Testando POST /users (criar usuário - apenas ADMIN)...${NC}"
CREATE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/users" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Usuário",
    "email": "teste'$(date +%s)'@exercito.mil.br",
    "password": "senha123",
    "role": "OPERATOR"
  }')

HTTP_STATUS=$(echo "$CREATE_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$CREATE_RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" -eq 201 ]; then
    echo -e "${GREEN}✓ Usuário criado com sucesso (201)${NC}"
    echo "$BODY" | jq '.'
else
    echo -e "${RED}✗ Erro ao criar usuário (Status: $HTTP_STATUS)${NC}"
    echo "$BODY" | jq '.'
fi

echo ""
echo "=================================="
echo -e "${GREEN}✓ Testes concluídos!${NC}"
echo ""
echo "📝 Para usar no Swagger:"
echo "1. Abra: http://localhost:3000/api/docs"
echo "2. Faça login em POST /auth/login"
echo "3. Copie APENAS o accessToken (sem aspas, sem Bearer)"
echo "4. Clique no botão 'Authorize' no topo da página"
echo "5. Cole o token no campo"
echo "6. Clique em 'Authorize' e depois 'Close'"
echo "7. Agora todas as rotas devem funcionar!"
