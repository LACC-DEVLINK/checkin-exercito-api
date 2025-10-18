# 🚀 Deploy Rápido - Railway

## ⚡ Setup Rápido (5 minutos)

### 1. Criar Projeto no Railway
- Acesse https://railway.app
- **New Project** → **Deploy from GitHub**
- Selecione este repositório
- Branch: `main`

### 2. Adicionar PostgreSQL
- No projeto: **+ New** → **Database** → **PostgreSQL**
- Railway configura `DATABASE_URL` automaticamente

### 3. Configurar Variáveis

Vá em **Variables** e adicione:

```bash
NODE_ENV=production
JWT_SECRET=<gerar-secret-forte>
QR_SECRET_KEY=<gerar-secret-forte>
CORS_ORIGIN=*
```

**Gerar secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Deploy!
- Railway faz deploy automático
- Aguarde ~2-3 minutos

### 5. Criar Usuários (Seed)

Via Railway CLI:
```bash
npm install -g @railway/cli
railway login
railway link
railway run node prisma/seed.js
```

## ✅ Pronto!

**API:** `https://seu-app.up.railway.app`  
**Swagger:** `https://seu-app.up.railway.app/api/docs`

## 🔄 Deploy Automático

Cada `git push origin main` = novo deploy automático!

## 📱 Credenciais de Teste

- **ADMIN:** admin@exercito.mil.br / admin123
- **SUPERVISOR:** supervisor@exercito.mil.br / supervisor123
- **OPERATOR:** operator@exercito.mil.br / operator123

---

**Problemas?** Veja [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)
