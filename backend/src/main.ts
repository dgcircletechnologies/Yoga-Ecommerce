import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('port');
  const corsOrigin = config.getOrThrow<string>('corsOrigin');

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Yoga API')
    .setDescription('Yoga e-commerce API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/v1/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.listen(port);
  console.log(`Yoga API listening on http://localhost:${port}/api/v1`);
}
await bootstrap();
