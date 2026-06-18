import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { urlencoded, json } from 'express';
import { httpsOptions } from './common/https/httpsOptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: httpsOptions,
  });
  const corsOrigins = (
    process.env.CORS_ORIGINS?.split(',')?.map((origin) => origin.trim()).filter(Boolean) ??
    ["http://localhost:8080", "http://0.0.0.0:5173", "http://localhost:5173", "https://127.0.0.1:5173"]
  )
  app.enableCors(corsOrigins);
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const sessionCookieName = process.env.SESSION_COOKIE_NAME ?? 'idp_session';
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Identity Nest API')
    .setDescription('Admin + OAuth/OIDC endpoints for the Identity Nest IdP.')
    .setVersion('0.0.1')
    .addCookieAuth(
      sessionCookieName,
      { type: 'apiKey', in: 'cookie', name: sessionCookieName },
      sessionCookieName,
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'token' },
      'initial-access-token',
    )
    .addTag('clients', 'Admin: register and manage OAuth/OIDC clients')
    .addTag('users', 'Admin: manage user accounts')
    .addTag('tenants', 'Admin: manage tenants')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs/openapi.json',
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
