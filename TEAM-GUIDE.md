# 👥 Guia para Novos Membros da Equipe

Bem-vindo ao projeto CheckIn Exército! 🎉

---

## 📋 Checklist de Onboarding

### ✅ Pré-requisitos (Instale primeiro)

- [ ] Node.js 18+ instalado
- [ ] Docker Desktop instalado e rodando
- [ ] Git configurado
- [ ] Editor de código (recomendado: VS Code)
- [ ] Acesso ao repositório Git

### ✅ Setup Inicial (Primeira vez)

- [ ] Clone o repositório
- [ ] Execute `npm install`
- [ ] Copie `.env.example` para `.env`
- [ ] Edite o `.env` com suas configurações locais
- [ ] Execute `npm run dev:db:up`
- [ ] Execute `npm run dev:migrate`
- [ ] Execute `npm run dev:seed`
- [ ] Execute `npm run start:dev`
- [ ] Acesse `http://localhost:3000` e veja se funciona

---

## 🎯 Workflow de Trabalho

### 1. Antes de começar a trabalhar

```bash
# 1. Atualize sua branch
git pull origin main

# 2. Crie uma branch para sua feature
git checkout -b feature/nome-da-feature

# 3. Suba o ambiente local
npm run dev:full
```

### 2. Durante o desenvolvimento

```bash
# Aplicação já está rodando com hot-reload
# Apenas edite os arquivos e teste

# Se precisar ver os dados:
npm run dev:studio
```

### 3. Antes de fazer commit

```bash
# 1. Verifique o código
npm run lint

# 2. Execute os testes
npm run test

# 3. Veja o que mudou
git status
```

### 4. Fazendo commit

```bash
# 1. Adicione os arquivos
git add .

# 2. Commit com mensagem descritiva
git commit -m "feat: adiciona funcionalidade X"

# 3. Push para sua branch
git push origin feature/nome-da-feature
```

### 5. Criando Pull Request

1. Vá até o GitHub/GitLab
2. Crie um Pull Request da sua branch para `main`
3. Descreva o que foi feito
4. Aguarde review da equipe

---

## 📝 Padrões de Commit

Use commits semânticos:

```bash
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
refactor: refatoração de código
test: adição de testes
chore: tarefas de manutenção
```

**Exemplos:**
```bash
git commit -m "feat: adiciona endpoint de check-in em massa"
git commit -m "fix: corrige validação de CPF no cadastro"
git commit -m "docs: atualiza README com novos comandos"
```

---

## 🗂️ Estrutura de Pastas

```
src/
├── modules/          # Módulos funcionais da aplicação
│   ├── auth/         # 🔐 Autenticação e autorização
│   ├── checkin/      # ✅ Check-in de participantes
│   └── users/        # 👥 Gestão de usuários
├── common/           # 🔧 Utilitários compartilhados
│   ├── dto.ts        # Data Transfer Objects base
│   └── prisma.service.ts  # Serviço do Prisma
└── main.ts           # 🚀 Entry point da aplicação
```

### Onde adicionar novo código?

- **Novo endpoint:** `src/modules/<modulo>/`
- **Nova entidade:** `prisma/schema.prisma`
- **Utilitário:** `src/common/`
- **Guard/Interceptor:** `src/modules/auth/guards/`

---

## 🧪 Testando Localmente

### Testar endpoints da API

Use o Thunder Client (VS Code) ou Postman:

```bash
# Login de exemplo
POST http://localhost:3000/auth/login
{
  "username": "admin",
  "password": "senha123"
}
```

Veja usuários de teste em: `docs/USUARIOS_TESTE.md`

### Testar banco de dados

```bash
# Abre interface gráfica
npm run dev:studio
```

---

## 🔍 Debugging

### No VS Code

1. Adicione breakpoints no código (clique na margem esquerda)
2. Execute `npm run start:debug`
3. No VS Code: `F5` ou "Run > Start Debugging"

### Console Logs

```typescript
console.log('Debug:', variavel);
// Aparece no terminal onde rodou start:dev
```

---

## 🆘 Problemas Comuns

### "Port 3000 already in use"

Já tem algo rodando na porta 3000:

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Ou mude a porta no .env
PORT=3001
```

### "Cannot connect to database"

```bash
# Verifique se o Docker está rodando
docker ps

# Reinicie o banco
npm run dev:db:down
npm run dev:db:up
```

### "Module not found"

```bash
npm install
```

### "Prisma Client not found"

```bash
npm run prisma:generate
```

### Banco desatualizado

```bash
npm run dev:migrate
```

---

## 🎓 Recursos de Aprendizado

### NestJS
- [Documentação Oficial](https://docs.nestjs.com/)
- [NestJS Crash Course](https://www.youtube.com/watch?v=GHTA143_b-s)

### Prisma
- [Documentação Oficial](https://www.prisma.io/docs/)
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 💡 Dicas Úteis

### VS Code Extensions Recomendadas

- **Prisma** - Syntax highlighting para schema.prisma
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Thunder Client** - Testar APIs
- **Docker** - Gerenciar containers

### Atalhos Úteis

```bash
# Ver logs do banco de dados
npm run docker:logs

# Resetar tudo e começar de novo
npm run dev:db:reset

# Formatar código
npm run format

# Ver erros de lint
npm run lint
```

---

## 🤝 Pedindo Ajuda

### Antes de perguntar:

1. ✅ Leu este guia?
2. ✅ Leu o `QUICKSTART.md`?
3. ✅ Tentou buscar no Google?
4. ✅ Verificou os logs de erro?

### Como perguntar:

```
❌ "Não funciona"

✅ "Erro ao executar npm run start:dev:
   [mensagem de erro completa aqui]
   
   O que eu já tentei:
   - npm install
   - reiniciar Docker
   
   Sistema: Ubuntu 22.04
   Node: v18.17.0"
```

---

## 📞 Contatos da Equipe

| Nome | Função | Contato |
|------|--------|---------|
| [Nome] | Tech Lead | @usuario |
| [Nome] | Backend Dev | @usuario |
| [Nome] | Frontend Dev | @usuario |

---

## 📚 Documentação Adicional

- [Guia Completo de Setup](./SETUP-DEV.md)
- [Início Rápido](./QUICKSTART.md)
- [Sistema de Autenticação](./docs/AUTH_SYSTEM.md)
- [Usuários de Teste](./docs/USUARIOS_TESTE.md)

---

**Boa sorte e bom código! 🚀**
