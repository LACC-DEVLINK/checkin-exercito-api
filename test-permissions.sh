#!/bin/bash

echo "🧪 Teste de Autenticação e Permissões"
echo "======================================"
echo ""

API_URL="http://localhost:3000"

# Fazer login
echo "1️⃣  Fazendo login como admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exercito.mil.br","password":"admin123"}')

echo "Resposta do login:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extrair token
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Erro: Token não obtido"
  exit 1
fi

echo "Token obtido: ${ACCESS_TOKEN:0:50}..."
echo ""

# Verificar perfil
echo "2️⃣  Verificando perfil..."
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/auth/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Perfil do usuário:"
echo "$PROFILE_RESPONSE" | jq '.'
echo ""

# Tentar listar usuários
echo "3️⃣  Tentando listar usuários..."
USERS_RESPONSE=$(curl -s -X GET "$API_URL/users" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Resposta:"
echo "$USERS_RESPONSE" | jq '.'
echo ""

# Tentar criar usuário
echo "4️⃣  Tentando criar usuário (apenas ADMIN)..."
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/users" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@exercito.mil.br",
    "password": "senha123",
    "role": "OPERATOR"
  }')

echo "Resposta:"
echo "$CREATE_RESPONSE" | jq '.'
echo ""

echo "======================================"
echo "✅ Testes concluídos!"
