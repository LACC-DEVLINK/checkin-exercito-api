<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# CheckIn Exército API

API para sistema de check-in do exército desenvolvida com [NestJS](https://github.com/nestjs/nest) framework TypeScript.

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

## Guia Rápido - Rodar Localmente

### 1. Clone o projeto

```bash
git clone https://github.com/LACC-DEVLINK/checkin-exercito-api.git
cd checkin-exercito-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Suba o banco de dados local

```bash
docker-compose -f docker-compose.dev.yml up db -d
```

Aguarde cerca de 10 segundos para o banco inicializar.

### 4. Configure o arquivo .env

```bash
cp .env.example .env
```

O arquivo `.env` já vem configurado para desenvolvimento local. Não precisa alterar nada.

### 5. Gere o Prisma Client

```bash
npx prisma generate
```

### 6. Execute as migrations

```bash
npx prisma migrate deploy
```

### 7. (Opcional) Popule com dados de teste

```bash
npm run seed
```

### 8. Inicie a aplicação

```bash
npm run start:dev
```

A API estará rodando em: **http://localhost:3000**

## Comandos Úteis

```bash
# Ver o banco de dados no navegador
npx prisma studio

# Parar o banco de dados
docker-compose -f docker-compose.dev.yml down

# Resetar o banco (apaga tudo)
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up db -d
npx prisma migrate deploy
```

## Ambientes

Este projeto trabalha com 2 ambientes separados:

**LOCAL (Desenvolvimento):**
- Banco PostgreSQL no Docker
- Variáveis de ambiente no arquivo `.env` (não commitado)
- Dados de teste isolados

**PRODUÇÃO:**
- Banco PostgreSQL na nuvem (Railway)
- Variáveis configuradas no servidor
- Deploy automático via Git

**IMPORTANTE:** Nunca conecte no banco de produção localmente.

## Executar Testes

```bash
# testes unitários
npm run test

# testes end-to-end
npm run test:e2e

# cobertura de testes
npm run test:cov
```

## Executar Testes

```bash
# testes unitários
npm run test

# testes end-to-end
npm run test:e2e

# cobertura de testes
npm run test:cov
```

## Serviços Disponíveis

- **API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (execute `npx prisma studio`)
- **PostgreSQL Local**: localhost:5432

## Rotas Principais da API

- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário
- `GET /users` - Listar usuários
- `POST /checkin` - Realizar check-in
- `GET /checkin/history` - Histórico de check-ins

## Problemas Comuns

**Erro: "Cannot find module '@prisma/client'"**
```bash
npx prisma generate
```

**Banco não conecta:**
```bash
docker-compose -f docker-compose.dev.yml restart db
```

**Porta 5432 em uso:**
```bash
sudo systemctl stop postgresql
```

**Porta 3000 em uso:**
```bash
sudo lsof -t -i:3000 | xargs kill -9
```

## Segurança

**NUNCA COMMITE:**
- Arquivo `.env`
- Credenciais de banco de dados
- Chaves JWT ou API

**PODE COMMITAR:**
- `.env.example` (sem valores reais)
- Código da aplicação
- Migrations
- Documentação

## Documentação Adicional

- [Guia de Desenvolvimento Completo](SETUP-DEV.md)
- [Sistema de Autenticação](docs/AUTH_SYSTEM.md)
- [Usuários de Teste](docs/USUARIOS_TESTE.md)

## Deploy para Produção

1. Configure as variáveis de ambiente no Railway
2. Faça push para a branch principal:
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```
3. O Railway fará o deploy automaticamente


