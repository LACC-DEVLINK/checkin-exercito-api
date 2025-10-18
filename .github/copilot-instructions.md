## Objetivo rápido
Seja produtivo neste repositório NestJS + Prisma: priorize segurança das migrations, respeite as validações do domínio e siga os scripts em `package.json` para builds, testes e containers.

## Arquitetura (big picture)
- Aplicação NestJS modular. Módulos principais estão em `src/modules/*` (ex.: `src/modules/military`).
- A camada de persistência usa Prisma: `src/common/prisma.service.ts` fornece o client e hooks de lifecycle.
- Controllers expõem rotas REST (ex.: `src/modules/military/military.controller.ts`) e delegam lógica para services (`services/*.ts`).
- Validações e regras de negócio ficam em services específicos (ex.: `military-validation.service.ts`).

## Fluxos importantes e convenções do projeto
- Use os scripts npm definidos em `package.json` (ex.: `npm run start:dev`, `npm run prisma:migrate`, `npm run test:e2e`).
- Banco e infra locais são orquestrados por `docker-compose.yml` / `docker-compose.dev.yml`. Para ambiente dev prefira `npm run docker:dev` ou `npm run docker:up`.
- Migrations: rodar `npm run prisma:migrate` ou `npx prisma migrate dev` depois que o DB estiver disponível (via Docker). `prisma:studio` abre o Studio.
- Prisma logs estão habilitados no `PrismaService` (query/info/warn/error). Evite duplicar conexões do client — injete `PrismaService` em módulos/providers.

## Padrões de código e práticas observadas
- Controllers: métodos simples que chamam services; DTOs não estão fortemente tipados em todos os lugares (muitos `any`). Ao adicionar tipos, siga o padrão de DTOs em `src/modules/*/dto`.
- Exceptions customizadas seguem `Nest` (`NotFoundException`, `BadRequestException`) — veja `src/modules/military/exceptions/military.exceptions.ts`.
- Uploads: usa interceptor `FileInterceptor` (ex.: `POST /military/:id/photo` no `military.controller.ts`). Implementações de storage ficam em `FileUploadService`.

## Comandos úteis e exemplos reais
- Instalar dependências: `npm install`.
- Subir infra dev: `npm run docker:up` ou `npm run docker:dev`.
- Executar migrations: `npm run prisma:migrate` (ou `npx prisma migrate dev`).
- Executar App em dev: `npm run start:dev`.
- Entrar no container dev: `npm run docker:shell`.
- Rodar e2e: `npm run test:e2e` (conf. em `test/jest-e2e.json`).

## Onde alterar coisas com segurança
- Alterações no schema Prisma devem vir com nova migration (use `prisma migrate`).
- Para adicionar providers globais/injetáveis, atualize o módulo correspondente em `src/modules/*/*module.ts`.
- Evite alterar `PrismaService` sem entender `onModuleInit`/`onModuleDestroy` (responsável por conectar/desconectar e hooks de shutdown).

## Erros comuns e como diagnosticar
- Conexão DB: verifique containers (`docker-compose ps`), credenciais no `.env` e logs (`npm run docker:logs`).
- Migrations falhando: confirme versão do Prisma (`package.json`) e que o container Postgres está escutando na porta correta.
- Testes e build: se `tsconfig-paths` ou `ts-node` causarem problemas, use os scripts predefinidos em `package.json` que já carregam os registradores necessários.

## Exemplos de mudanças pequenas seguras
- Adicionar novo endpoint: criar DTO em `src/modules/<x>/dto`, service method em `services/`, e chamar do controller.
- Adicionar validação: criar/usar `*ValidationService` existente no mesmo módulo.

## Referências rápidas (arquivos-chave)
- `README.md` (root) — comandos iniciais e infra.
- `package.json` — scripts importantes.
- `src/common/prisma.service.ts` — lifecycle do Prisma.
- `src/modules/military/military.controller.ts` e `src/modules/military/services/military.service.ts` — exemplo padrão controller→service→prisma.
- `src/modules/military/exceptions/military.exceptions.ts` — padrão de exceções.

Se algo estiver incompleto ou você preferir formato diferente, diga o que quer ver ajustado. Vou iterar rapidamente.
