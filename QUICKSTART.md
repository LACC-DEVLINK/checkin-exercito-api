# ⚡ Guia Rápido - Desenvolvimento Local vs Produção

## 🎯 Resumo

Este projeto está configurado para trabalhar com **ambientes separados**:
- **LOCAL**: Banco de dados no Docker, dados de teste
- **PRODUÇÃO**: Banco na nuvem (Railway), dados reais

---

## 🚀 Setup Inicial (Faça uma vez)

### Opção 1: Setup Automático (Recomendado)

```bash
./setup-dev.sh
```

### Opção 2: Setup Manual

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env
cp .env.example .env

# 3. Editar .env com suas configurações
nano .env  # ou code .env

# 4. Subir banco local
npm run dev:db:up

# 5. Executar migrations
npm run dev:migrate

# 6. Popular com dados de teste
npm run dev:seed
```

---

## 💻 Workflow Diário de Desenvolvimento

### 1️⃣ Iniciar o Ambiente

```bash
# Opção A: Tudo de uma vez
npm run dev:full

# Opção B: Passo a passo
npm run dev:db:up      # Sobe banco
npm run start:dev      # Inicia app
```

### 2️⃣ Desenvolver

- Edite os arquivos
- A aplicação recarrega automaticamente
- Teste localmente em `http://localhost:3000`

### 3️⃣ Visualizar Dados (Opcional)

```bash
npm run dev:studio
# Acesse: http://localhost:5555
```

### 4️⃣ Parar o Ambiente

```bash
npm run dev:db:down
# Ou apenas Ctrl+C na aplicação
```

---

## 📤 Enviar para Produção

### 1️⃣ Commitar Mudanças

```bash
# Verificar o que mudou
git status

# Adicionar arquivos (NUNCA adicione .env!)
git add .

# Commit com mensagem descritiva
git commit -m "feat: implementa nova funcionalidade X"
```

### 2️⃣ Push para Repositório

```bash
# Push para sua branch
git push origin sua-branch

# Ou direto para main (se tiver permissão)
git push origin main
```

### 3️⃣ Railway Faz o Deploy Automaticamente! 🎉

O Railway detecta o push e:
- ✅ Faz build da aplicação
- ✅ Executa as migrations de produção
- ✅ Inicia a aplicação
- ✅ Disponibiliza no domínio de produção

---

## 🔒 Regras de Ouro

### ✅ PODE FAZER

- ✅ Commitar código (.ts, .js, etc)
- ✅ Commitar migrations
- ✅ Commitar .env.example
- ✅ Testar à vontade localmente
- ✅ Resetar banco local quando quiser

### ❌ NUNCA FAÇA

- ❌ Commitar arquivo .env
- ❌ Commitar senhas ou credenciais
- ❌ Conectar no banco de produção localmente
- ❌ Testar em produção
- ❌ Fazer push direto sem testar

---

## 🆘 Problemas Comuns

### Porta 5432 em uso

```bash
sudo systemctl stop postgresql
# Ou reinicie o Docker
```

### Erro de conexão com banco

```bash
# Verifique se o Docker está rodando
docker ps

# Reinicie o banco
npm run dev:db:down
npm run dev:db:up
```

### Banco não tem tabelas

```bash
npm run dev:migrate
```

### Quero recomeçar do zero

```bash
npm run dev:db:reset
```

---

## 📊 Diferenças Entre Ambientes

| Item | LOCAL | PRODUÇÃO |
|------|-------|----------|
| **Banco de Dados** | Docker (localhost) | Railway (nuvem) |
| **Arquivo Config** | `.env` | Variáveis no Railway |
| **Dados** | Teste/Mock | Reais |
| **Porta** | 3000 | Definida pelo Railway |
| **Hot Reload** | ✅ Sim | ❌ Não |
| **Pode Resetar** | ✅ Sim | ❌ NUNCA! |

---

## 🎓 Comandos Essenciais

```bash
# DESENVOLVIMENTO LOCAL
npm run dev:full          # Inicia tudo
npm run start:dev         # Apenas a aplicação
npm run dev:studio        # Interface do banco
npm run dev:db:reset      # Resetar banco local

# PRODUÇÃO (no servidor)
npm run start:prod        # Inicia em produção
npm run prisma:migrate:deploy  # Migrations em produção
```

---

## 📚 Mais Informações

- Guia completo: `SETUP-DEV.md`
- Autenticação: `docs/AUTH_SYSTEM.md`
- Usuários de teste: `docs/USUARIOS_TESTE.md`

---

**💡 Dica:** Adicione este arquivo aos favoritos!
