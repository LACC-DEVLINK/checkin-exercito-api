# Sistema de Autenticação JWT

## Implementação Completa

Sistema JWT funcional com autenticação baseada em tokens de acesso e renovação.

## Estrutura de Arquivos

```
src/modules/auth/
├── auth.module.ts              # Módulo principal de autenticação
├── auth.service.ts             # Lógica de negócio
├── auth.controller.ts          # Endpoints HTTP
├── index.ts                    # Exports centralizados
├── decorators/
│   ├── current-user.decorator.ts   # Obter usuário da requisição
│   └── public.decorator.ts         # Marcar rotas públicas
├── dto/
│   └── auth.dto.ts             # DTOs de autenticação
├── guards/
│   ├── jwt-auth.guard.ts       # Proteção de rotas com JWT
│   └── local-auth.guard.ts     # Validação de login
└── strategies/
    ├── jwt.strategy.ts         # Estratégia JWT do Passport
    └── local.strategy.ts       # Estratégia Local do Passport
```

## Endpoints Disponíveis

### POST /auth/login
Realiza login com email e senha.

**Request:**
```json
{
  "email": "admin@exercito.mil.br",
  "password": "senha123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

### POST /auth/refresh
Renova o token de acesso usando o refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

### GET /auth/profile
Retorna dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "id": 1,
  "email": "admin@exercito.mil.br",
  "role": "ADMIN"
}
```

### POST /auth/logout
Invalida a sessão atual (frontend deve remover tokens).

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

## Proteção de Rotas

### Proteger uma rota (padrão)
```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth';

@Controller('exemplo')
export class ExemploController {
  @UseGuards(JwtAuthGuard)
  @Get()
  rotaProtegida() {
    return 'Acesso autorizado!';
  }
}
```

### Rota pública (sem autenticação)
```typescript
import { Controller, Get } from '@nestjs/common';
import { Public } from '@modules/auth';

@Controller('exemplo')
export class ExemploController {
  @Public()
  @Get('publico')
  rotaPublica() {
    return 'Acesso público!';
  }
}
```

### Obter usuário autenticado
```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser } from '@modules/auth';

@Controller('exemplo')
export class ExemploController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  meusDados(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
```

### Tokens
- **Access Token**: Expira em 1 hora
- **Refresh Token**: Expira em 7 dias

## Uso no Frontend

### Login
```javascript
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@exercito.mil.br',
    password: 'senha123'
  })
});

const { accessToken, refreshToken } = await response.json();

// Salvar tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
```

### Requisição Autenticada
```javascript
const token = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const userData = await response.json();
```

### Renovar Token
```javascript
const refreshToken = localStorage.getItem('refreshToken');

const response = await fetch('http://localhost:3000/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});

const { accessToken: newToken } = await response.json();
localStorage.setItem('accessToken', newToken);
```

## Fluxo de Autenticação

```
1. Login
   └─> POST /auth/login
       └─> Valida credenciais
           └─> Gera access token + refresh token
               └─> Retorna tokens

2. Acesso a Rota Protegida
   └─> GET /rota-protegida
       └─> Verifica token JWT
           └─> Valida usuário
               └─> Permite acesso

3. Token Expirado
   └─> POST /auth/refresh
       └─> Valida refresh token
           └─> Gera novos tokens
               └─> Retorna novos tokens

4. Logout
   └─> POST /auth/logout
       └─> Frontend remove tokens
```

## Checklist de Validação

- [x] Dependências instaladas
- [x] AuthService implementado
- [x] AuthController implementado
- [x] AuthModule configurado
- [x] LocalStrategy criada
- [x] JwtStrategy criada
- [x] Guards implementados
- [x] Decorators criados
- [x] DTOs definidos
- [x] JWT_SECRET configurado
- [x] Integração com UsersService

## Testes Manuais

### 1. Testar Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exercito.mil.br","password":"senha123"}'
```

### 2. Testar Profile
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 3. Testar Refresh
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"SEU_REFRESH_TOKEN_AQUI"}'
```

## Segurança

- ✅ Senhas hasheadas com bcrypt (12 rounds)
- ✅ Tokens JWT com expiração
- ✅ Validação de usuário ativo
- ✅ Verificação de credenciais
- ✅ Proteção contra tokens inválidos
- ✅ Renovação segura de tokens

