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
    .setTitle('Checkin Exército API')
    .setDescription('API para sistema de checkin do exército')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação')
    .addTag('users', 'Usuários')
    .addTag('checkin', 'Check-in')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
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

  await app.listen(3000);
  
  console.log(`🚀 Aplicação rodando em: http://localhost:3000`);
  console.log(`📚 Swagger disponível em: http://localhost:3000/api/docs`);
}

void bootstrap();
