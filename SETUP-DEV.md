# CheckIn Exército API - Guia de Desenvolvimento

API desenvolvida com NestJS + TypeScript + Prisma + PostgreSQL.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Setup Inicial](#setup-inicial)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Deploy para Produção](#deploy-para-produção)
- [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose
- Git

---

## Setup Inicial

Este projeto trabalha com 2 ambientes separados:

**LOCAL (Desenvolvimento):**
- Banco de dados PostgreSQL rodando no Docker
- Variáveis de ambiente no arquivo `.env` (não commitado)
- Dados de teste isolados

**PRODUÇÃO:**
- Banco de dados PostgreSQL na nuvem (Railway)
- Variáveis configuradas no servidor
- Deploy automático via Git

IMPORTANTE: Você NUNCA conecta no banco de produção localmente.

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd checkin-exercito-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
# Copia o arquivo de exemplo para .env
cp .env.example .env
```

Edite o arquivo `.env` e ajuste as variáveis conforme necessário:

```bash
# Exemplo para desenvolvimento local
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/checkin_exercito_db?schema=public"
JWT_SECRET=seu-segredo-local
```

### 4. Suba o banco de dados local

```bash
# Sobe apenas o PostgreSQL no Docker
npm run dev:db:up
```

### 5. Execute as migrations

```bash
# Cria as tabelas no banco de dados
npm run dev:migrate
```

### 6. (Opcional) Popule o banco com dados de teste

```bash
# Insere dados iniciais para testes
npm run dev:seed
```

### 7. Inicie a aplicação

```bash
# Modo desenvolvimento com hot-reload
npm run start:dev
```

Pronto! Acesse: `http://localhost:3000`

---

## Desenvolvimento Local

### Workflow Completo

Subir tudo de uma vez (banco + migrations + seed + app):

```bash
npm run dev:full
```

### Workflow Passo a Passo

```bash
# 1. Suba o banco de dados
npm run dev:db:up

# 2. Execute as migrations
npm run dev:migrate

# 3. (Opcional) Popule com dados de teste
npm run dev:seed

# 4. Inicie a aplicação
npm run start:dev
```

### Visualizar o Banco de Dados

```bash
# Abre o Prisma Studio
npm run dev:studio
```

Acesse: `http://localhost:5555`

### Resetar o Banco de Dados

```bash
# ATENÇÃO: Isso apaga TODOS os dados locais
npm run dev:db:reset
```

### Comandos Úteis

### Banco de Dados Local

| Comando | Descrição |
|---------|-----------|
| `npm run dev:db:up` | Sobe o PostgreSQL no Docker |
| `npm run dev:db:down` | Para o PostgreSQL |
| `npm run dev:db:reset` | Reseta o banco (apaga tudo) |
| `npm run dev:studio` | Abre o Prisma Studio |

### Migrations

| Comando | Descrição |
|---------|-----------|
| `npm run dev:migrate` | Executa migrations no desenvolvimento |
| `npm run prisma:generate` | Gera o Prisma Client |

### Seeds

| Comando | Descrição |
|---------|-----------|
| `npm run dev:seed` | Popula o banco com dados de teste |

### Execução da Aplicação

| Comando | Descrição |
|---------|-----------|
| `npm run start:dev` | Inicia em modo desenvolvimento (hot-reload) |
| `npm run start:debug` | Inicia em modo debug |
| `npm run build` | Compila o projeto |
| `npm run start:prod` | Inicia em modo produção |

### Testes

| Comando | Descrição |
|---------|-----------|
| `npm run test` | Executa testes unitários |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:cov` | Executa testes com cobertura |
| `npm run test:e2e` | Executa testes end-to-end |

### Docker

| Comando | Descrição |
|---------|-----------|
| `npm run docker:dev` | Sobe toda aplicação no Docker |
| `npm run docker:build` | Faz build da imagem Docker |
| `npm run docker:logs` | Visualiza logs do Docker |
| `npm run docker:shell` | Acessa o shell do container |

---

## Deploy para Produção

### 1. Configure as variáveis no Railway

No painel do Railway, adicione as seguintes variáveis de ambiente:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=<fornecido-pelo-railway>
JWT_SECRET=<seu-segredo-forte>
JWT_EXPIRES_IN=1h
CORS_ORIGIN=https://seu-frontend.com
QR_SECRET_KEY=<sua-chave-forte>
```

### 2. Faça o push para produção

```bash
# 1. Commitar suas mudanças
git add .
git commit -m "feat: nova funcionalidade"

# 2. Push para a branch principal
git push origin main
```

O Railway fará o deploy automaticamente.

### 3. (Se necessário) Execute migrations manualmente

```bash
# No Railway, execute:
npm run prisma:migrate:deploy
```

---

## Estrutura do Projeto

```
checkin-exercito-api/
├── .env                     # Variáveis locais (NÃO commitado)
├── .env.example             # Template de variáveis (commitado)
├── .env.docker              # Variáveis para Docker
├── .gitignore               # Arquivos ignorados pelo Git
├── docker-compose.dev.yml   # Config Docker para desenvolvimento
├── package.json             # Dependências e scripts
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   ├── seed.ts              # Dados de teste
│   └── migrations/          # Histórico de migrations
├── src/
│   ├── main.ts              # Entry point da aplicação
│   ├── app.module.ts        # Módulo principal
│   ├── modules/             # Módulos da aplicação
│   │   ├── auth/            # Autenticação e autorização
│   │   ├── checkin/         # Check-in de participantes
│   │   └── users/           # Gestão de usuários
│   └── common/              # Utilitários e configurações
└── docs/                    # Documentação adicional
```

---

## 🔒 Segurança

### ⚠️ NUNCA COMMITE:

- ❌ Arquivo `.env`
- ❌ Credenciais de banco de dados
- ❌ Chaves JWT ou API
- ❌ Senhas

### ✅ PODE COMMITAR:

- ✅ `.env.example` (sem valores reais)
- ✅ Código da aplicação
- ✅ Migrations
- ✅ Documentação

---

## 🆘 Troubleshooting

### Erro: "Port 5432 already in use"

Já existe um PostgreSQL rodando. Pare-o:

```bash
# Linux/Mac
sudo systemctl stop postgresql

# Ou use outra porta no docker-compose.dev.yml
ports:
  - "5433:5432"
```

### Erro: "Cannot find module '@prisma/client'"

Gere o Prisma Client:

```bash
npm run prisma:generate
```

