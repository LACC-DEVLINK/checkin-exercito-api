# 🧪 Como Testar a API em Produção

## 🌐 URL da API
```
https://web-production-4cfce.up.railway.app
```

## 📚 Swagger (Documentação Interativa)
```
https://web-production-4cfce.up.railway.app/api/docs
```

---

## ✅ Testes Rápidos

### 1. **Verificar se está online**
```bash
curl https://web-production-4cfce.up.railway.app
```

**Resposta esperada:**
```
Hello World!
```

### 2. **Testar Login (Admin)**
```bash
curl -X POST https://web-production-4cfce.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@exercito.mil.br",
    "password": "admin123"
  }'
```

**Resposta esperada:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

### 3. **Testar Rota Protegida (Profile)**
```bash
# Primeiro, salve o token em uma variável
TOKEN="seu_token_aqui"

# Depois teste o profile
curl -X GET https://web-production-4cfce.up.railway.app/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta esperada:**
```json
{
  "id": 1,
  "email": "admin@exercito.mil.br",
  "role": "ADMIN"
}
```

### 4. **Listar Usuários**
```bash
curl -X GET https://web-production-4cfce.up.railway.app/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🖥️ Testar via Swagger (Recomendado)

### Passo 1: Acessar Swagger
Abra no navegador:
```
https://web-production-4cfce.up.railway.app/api/docs
```

### Passo 2: Fazer Login
1. Localize o endpoint **POST /auth/login**
2. Clique em **"Try it out"**
3. Cole no body:
```json
{
  "email": "admin@exercito.mil.br",
  "password": "admin123"
}
```
4. Clique em **"Execute"**
5. Copie o **accessToken** da resposta

### Passo 3: Autorizar
1. Clique no botão **"Authorize"** 🔓 (topo da página)
2. Cole o token (sem "Bearer")
3. Clique em **"Authorize"**
4. Clique em **"Close"**

### Passo 4: Testar Rotas
Agora você pode testar qualquer rota protegida:
- GET `/auth/profile` - Ver seu perfil
- GET `/users` - Listar usuários
- POST `/users` - Criar usuário
- etc...

---

## 👥 Usuários de Teste

| Role | Email | Senha |
|------|-------|-------|
| **ADMIN** | admin@exercito.mil.br | admin123 |
| **SUPERVISOR** | supervisor@exercito.mil.br | supervisor123 |
| **OPERATOR** | operator@exercito.mil.br | operator123 |

---

## 🔍 Verificações de Saúde

### 1. **API está respondendo?**
```bash
curl https://web-production-4cfce.up.railway.app
```

### 2. **Swagger está acessível?**
```bash
curl https://web-production-4cfce.up.railway.app/api/docs
```

### 3. **Login funciona?**
```bash
curl -X POST https://web-production-4cfce.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exercito.mil.br","password":"admin123"}' \
  | jq .
```

### 4. **Banco de dados está conectado?**
```bash
# Se o login funcionar, o banco está OK
# Teste criar um usuário (como ADMIN)
```

---

## 🐛 Resolução de Problemas

### ❌ Erro 500 - Internal Server Error
**Causa:** Banco de dados não configurado ou variáveis de ambiente faltando

**Solução:**
1. Verifique se o PostgreSQL foi adicionado no Railway
2. Verifique se `DATABASE_URL` está configurada
3. Execute as migrations: `npm run prisma:migrate`

### ❌ Erro 401 - Unauthorized
**Causa:** Token inválido ou não enviado

**Solução:**
1. Faça login novamente
2. Copie o novo token
3. Certifique-se de incluir "Bearer " antes do token

### ❌ Erro 404 - Not Found
**Causa:** Rota não existe ou URL errada

**Solução:**
1. Verifique a URL base: `https://web-production-4cfce.up.railway.app`
2. Verifique o endpoint no Swagger

### ❌ API não responde
**Causa:** Deploy falhou ou serviço está dormindo (improvável no Railway)

**Solução:**
1. Verifique os logs no Railway
2. Verifique se o deploy foi bem-sucedido
3. Aguarde alguns segundos e tente novamente

---

## 📱 Para o Frontend

### Base URL
```typescript
const API_BASE_URL = 'https://web-production-4cfce.up.railway.app';
```

### Exemplo de Integração (React/Next.js)
```typescript
// config/api.ts
export const API_CONFIG = {
  baseURL: 'https://web-production-4cfce.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// services/auth.service.ts
export const authService = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_CONFIG.baseURL}/auth/profile`, {
      headers: {
        ...API_CONFIG.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
```

### Exemplo com Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-production-4cfce.up.railway.app',
  timeout: 10000,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 🎯 Checklist de Testes

- [ ] API responde na URL base
- [ ] Swagger está acessível
- [ ] Login com ADMIN funciona
- [ ] Login com SUPERVISOR funciona
- [ ] Login com OPERATOR funciona
- [ ] GET `/auth/profile` retorna dados do usuário
- [ ] GET `/users` lista todos os usuários (ADMIN)
- [ ] POST `/users` cria novo usuário (ADMIN)
- [ ] PATCH `/users/:id` atualiza usuário
- [ ] DELETE `/users/:id` deleta usuário (ADMIN)
- [ ] Token expira após 1 hora
- [ ] Refresh token funciona

---

## 📊 Endpoints Disponíveis

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/refresh` - Renovar token
- `GET /auth/profile` - Perfil do usuário (protegido)
- `POST /auth/logout` - Logout (protegido)

### Usuários
- `GET /users` - Listar usuários (protegido)
- `POST /users` - Criar usuário (ADMIN)
- `GET /users/:id` - Buscar usuário (protegido)
- `PATCH /users/:id` - Atualizar usuário (protegido)
- `DELETE /users/:id` - Deletar usuário (ADMIN)
- `PATCH /users/:id/restore` - Restaurar usuário (ADMIN)
- `PATCH /users/:id/role` - Alterar role (ADMIN)
- `PATCH /users/:id/toggle-active` - Ativar/desativar (ADMIN/SUPERVISOR)

---

## 💡 Dicas

1. **Use o Swagger** para testes rápidos - é mais fácil
2. **Salve o token** - ele expira em 1 hora
3. **Use Postman/Insomnia** se preferir ferramentas desktop
4. **Monitore os logs** no Railway para debug
5. **CORS está habilitado** - pode testar de qualquer frontend

---

## 🔗 Links Úteis

- **API Base:** https://web-production-4cfce.up.railway.app
- **Swagger:** https://web-production-4cfce.up.railway.app/api/docs
- **Railway Dashboard:** https://railway.app/dashboard

---

**Última atualização:** 18/10/2025
