import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MilitaryModule } from './modules/military/military.module'; // 👈 importa o novo módulo
import { PrismaService } from './common/prisma.service';

@Global()
@Module({
  imports: [
    UsersModule,
    MilitaryModule, // 👈 registra o módulo aqui
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
