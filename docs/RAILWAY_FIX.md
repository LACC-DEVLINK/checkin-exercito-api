# 🔧 Como Corrigir o Deploy no Railway

## ❌ Erro Atual
```
Variável de ambiente não encontrada: DATABASE_URL
```

## ✅ Solução Passo a Passo

### 1. Adicionar PostgreSQL

1. Entre no seu projeto no Railway: https://railway.app/project/seu-projeto
2. Clique em **"+ New"** 
3. Selecione **"Database"**
4. Escolha **"Add PostgreSQL"**
5. Aguarde a criação (leva ~30 segundos)

### 2. Conectar o Banco ao Serviço

1. Clique no seu **serviço da API** (web-production-4cfce)
2. Vá na aba **"Variables"**
3. Clique em **"+ New Variable"**
4. Clique em **"Add Reference"**
5. Selecione o banco PostgreSQL
6. Escolha **"DATABASE_URL"**
7. Clique em **"Add"**

### 3. Adicionar Outras Variáveis de Ambiente

Ainda na aba **"Variables"**, adicione manualmente:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=seu-segredo-super-forte-aqui-mude-isso
CORS_ORIGIN=*
```

**⚠️ IMPORTANTE**: Gere um JWT_SECRET forte:
```bash
# No seu terminal local, execute:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Cole o resultado no JWT_SECRET.

### 4. Configurar o Build Command

1. No serviço da API, vá em **"Settings"**
2. Em **"Build Command"**, coloque:
```bash
npm install && npx prisma generate && npm run build
```

3. Em **"Start Command"**, coloque:
```bash
npx prisma migrate deploy && npm run start:prod
```

### 5. Fazer Redeploy

1. Vá na aba **"Deployments"**
2. Clique nos **"..."** do último deploy
3. Clique em **"Redeploy"**
4. Aguarde o build (leva ~2-3 minutos)

### 6. Testar

Após o deploy bem-sucedido:

```bash
# Testar se a API está no ar
curl https://web-production-4cfce.up.railway.app

# Testar Swagger
# Abra no navegador:
https://web-production-4cfce.up.railway.app/api/docs

# Testar login
curl -X POST https://web-production-4cfce.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exercito.mil.br","password":"admin123"}'
```

### 7. Popular o Banco (IMPORTANTE!)

Após o deploy, você precisa criar os usuários iniciais:

**Opção 1: Via Railway CLI**
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Fazer login
railway login

# Conectar ao projeto
railway link

# Executar seed
railway run node prisma/seed.js
```

**Opção 2: Criar endpoint temporário**

Adicione isso no `auth.controller.ts` (APENAS para primeiro deploy):

```typescript
@Public()
@Post('seed')
async seed() {
  // Criar admin
  await this.usersService.create({
    name: 'Administrador',
    email: 'admin@exercito.mil.br',
    password: 'admin123',
    role: 'ADMIN',
    isActive: true,
  });
  return { message: 'Usuários criados' };
}
```

Depois chame:
```bash
curl -X POST https://web-production-4cfce.up.railway.app/auth/seed
```

**⚠️ REMOVA esse endpoint depois!**

## ✅ Checklist Final

- [ ] PostgreSQL adicionado ao projeto
- [ ] DATABASE_URL configurada (referência)
- [ ] NODE_ENV=production
- [ ] PORT=3000
- [ ] JWT_SECRET gerado e configurado
- [ ] Build Command atualizado
- [ ] Start Command atualizado
- [ ] Redeploy realizado
- [ ] Deploy bem-sucedido (logs sem erro)
- [ ] Swagger acessível
- [ ] Usuários populados no banco
- [ ] Login funcionando

## 🔍 Ver Logs

Para ver o que está acontecendo:

1. No Railway, clique no serviço
2. Vá em **"Deployments"**
3. Clique no último deploy
4. Veja os **"Logs"** em tempo real

## 📞 Ainda com problema?

Envie print dos logs e das variáveis de ambiente configuradas.
