import { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
  interface PrismaClient {
    // Extensão temporária: declara a propriedade `military` para evitar erros TS
    // Depois de rodar `npx prisma generate` o client real terá esses métodos tipados.
    military: any;
  }
}