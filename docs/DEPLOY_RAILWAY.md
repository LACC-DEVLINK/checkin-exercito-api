# 🚀 Deploy no Railway - Guia Completo

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app)
- Repositório no GitHub
- Branch `main` com código atualizado

## 🎯 Passo a Passo

### 1. Criar Conta no Railway

1. Acesse https://railway.app
2. Clique em **"Start a New Project"**
3. Conecte sua conta do GitHub

### 2. Criar Novo Projeto

1. No Railway, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha o repositório: `checkin-exercito-api`
4. Selecione a branch: `main`

### 3. Adicionar PostgreSQL

1. No projeto, clique em **"+ New"**
2. Selecione **"Database"**
3. Escolha **"PostgreSQL"**
4. Railway vai criar automaticamente e configurar `DATABASE_URL`

### 4. Configurar Variáveis de Ambiente

No projeto Railway, vá em **Settings → Variables** e adicione:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=seu-secret-super-seguro-aqui-mude-isso
JWT_EXPIRES_IN=1h
CORS_ORIGIN=*
APP_NAME=CheckIn Exército API
APP_VERSION=1.0.0
QR_SECRET_KEY=sua-chave-qr-super-segura-aqui
```

**⚠️ IMPORTANTE:**
- `DATABASE_URL` é configurado automaticamente pelo Railway
- Gere um JWT_SECRET forte: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Gere um QR_SECRET_KEY forte também

### 5. Configurar Deploy Automático

O Railway já configura deploy automático! Cada push na `main` vai fazer deploy automaticamente.

**Ações automáticas:**
- ✅ Build da aplicação
- ✅ Migração do banco (Prisma)
- ✅ Inicialização do servidor
- ✅ SSL/HTTPS automático

### 6. Executar Seed (Criar Usuários Iniciais)

Depois do primeiro deploy:

1. No Railway, vá em **seu serviço → Settings → Deploy**
2. Na seção **Custom Start Command**, adicione temporariamente:
   ```bash
   node prisma/seed.js && npm run start:prod
   ```
3. Depois que rodar uma vez, volte para:
   ```bash
   npm run start:prod
   ```

**OU** execute manualmente via Railway CLI:

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Executar seed
railway run node prisma/seed.js
```

### 7. Acessar a API

Após o deploy, o Railway fornecerá uma URL pública:

```
https://seu-app.up.railway.app
```

**Endpoints:**
- API: `https://seu-app.up.railway.app`
- Swagger: `https://seu-app.up.railway.app/api/docs`
- Health: `https://seu-app.up.railway.app` (GET /)

### 8. Monitoramento

Railway fornece:
- ✅ Logs em tempo real
- ✅ Métricas de uso (CPU, RAM)
- ✅ Histórico de deploys
- ✅ Rollback fácil

## 🔄 Workflow de Deploy

```
1. Código alterado localmente
   ↓
2. git push origin main
   ↓
3. Railway detecta o push
   ↓
4. Build automático
   ↓
5. Testes (se configurados)
   ↓
6. Migração do banco
   ↓
7. Deploy da nova versão
   ↓
8. API atualizada!
```

## 🌐 Configurar Domínio Customizado (Opcional)

1. No Railway, vá em **Settings → Domains**
2. Adicione seu domínio: `api.seudominio.com`
3. Configure DNS conforme instruções do Railway
4. SSL é configurado automaticamente!

## 📊 Custos

Railway oferece:
- **$5 grátis/mês** para todos os usuários
- **$0.000231/GB-hour** para RAM
- **$0.000463/vCPU-hour** para CPU

**Estimativa para API:**
- ~$5-10/mês para tráfego baixo/médio
- Inclui PostgreSQL

## 🔒 Segurança

### Variáveis Sensíveis

✅ **Fazer:**
- Usar variáveis de ambiente
- Gerar secrets fortes
- Atualizar regularmente

❌ **Não fazer:**
- Commitar secrets no código
- Usar valores padrão
- Compartilhar secrets

### CORS

Para produção, configure CORS específico:

```env
CORS_ORIGIN=https://seu-frontend.com,https://www.seu-frontend.com
```

## 🐛 Troubleshooting

### Deploy Falhou

1. Verifique os logs no Railway
2. Certifique-se que todas as variáveis estão configuradas
3. Verifique se o build passa localmente: `npm run build`

### Banco não conecta

1. Verifique se PostgreSQL está rodando no Railway
2. Confirme que `DATABASE_URL` está configurado
3. Teste a conexão localmente com a URL do Railway

### Migrations não rodaram

Execute manualmente:
```bash
railway run npx prisma migrate deploy
```

## 📝 Checklist Pós-Deploy

- [ ] API está acessível
- [ ] Swagger está funcionando
- [ ] Login funciona
- [ ] Banco de dados conectado
- [ ] Usuários de teste criados (seed)
- [ ] CORS configurado
- [ ] Variáveis de ambiente corretas
- [ ] SSL/HTTPS ativo
- [ ] Logs sem erros

## 🎉 Pronto!

Sua API está hospedada e com deploy automático!

**URL da API:** Será fornecida pelo Railway  
**Swagger:** `https://sua-url.railway.app/api/docs`

## 🔗 Links Úteis

- [Railway Docs](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Prisma + Railway](https://docs.railway.app/guides/prisma)
- [NestJS + Railway](https://docs.railway.app/guides/nestjs)

---

**Problemas?** Verifique os logs do Railway ou abra uma issue!
