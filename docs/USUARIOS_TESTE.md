# 👥 Usuários de Teste

## Credenciais

### 🔴 ADMIN
- **Email:** admin@exercito.mil.br
- **Senha:** admin123
- **Permissões:** Acesso total ao sistema

### 🟡 SUPERVISOR
- **Email:** supervisor@exercito.mil.br
- **Senha:** supervisor123
- **Permissões:** Gerenciar operadores, check-ins, relatórios

### 🟢 OPERATOR
- **Email:** operator@exercito.mil.br
- **Senha:** operator123
- **Permissões:** Check-in, visualizar QR codes

## 🔄 Recriar Usuários

Para limpar o banco e recriar os usuários:

```bash
node prisma/seed.js
```

## 🧪 Testar no Swagger

1. Acesse: http://localhost:3000/api/docs
2. Faça login com uma das credenciais acima
3. Copie o `accessToken`
4. Clique em **Authorize** 🔓
5. Cole o token
6. Teste as rotas
