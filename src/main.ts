import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração global de validação
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('CheckIn Exército API')
    .setDescription(`
API para sistema de checkin do exército brasileiro

## Como Autenticar

1. **Faça login**: Use o endpoint POST /auth/login com email e senha
2. **Copie o token**: Da resposta, copie apenas o valor de "accessToken"
3. **Autorize**: Clique no botão "Authorize" acima
4. **Cole o token**: No campo "Value", cole o token (SEM "Bearer")
5. **Pronto**: Agora você pode usar todas as rotas protegidas!

## Usuários de Teste
- **ADMIN**: admin@exercito.mil.br / admin123
- **SUPERVISOR**: supervisor@exercito.mil.br / supervisor123
- **OPERATOR**: operator@exercito.mil.br / operator123
    `)
    .setVersion('1.0')
    .addTag('Autenticação', 'Endpoints de autenticação e autorização')
    .addTag('Usuários', 'Gerenciamento de usuários do sistema')
    .addTag('Check-in', 'Operações de check-in')
    .addTag('QR Codes', 'Geração e gerenciamento de QR codes')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Digite o token JWT (obtido no login)',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // CORS
  app.enableCors();

  // Usa a porta do ambiente (Railway) ou 3000 local
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Aplicação rodando na porta: ${port}`);
  console.log(`📚 Swagger disponível em: http://localhost:${port}/api/docs`);
}

void bootstrap();
