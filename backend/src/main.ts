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
  app
    .getHttpAdapter()
    .get('/health', (_req: unknown, res: { status: (code: number) => { send: (body: unknown) => void } }) => {
      res.status(200).send({ status: 'ok' });
    });

  const rawOrigins = [
    corsOrigin,
    config.get<string>('mail.adminUrl'),
  ]
    .filter(Boolean)
    .flatMap((value) => value!.split(','))
    .map((value) => value.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  const allowedOrigins = new Set<string>();
  for (const entry of rawOrigins) {
    allowedOrigins.add(entry);
    try {
      const parsed = new URL(entry);
      const baseHost = parsed.hostname.replace(/^www\./, '');
      const hosts = [baseHost, `www.${baseHost}`];
      const protocols = ['http:', 'https:'];
      for (const protocol of protocols) {
        for (const host of hosts) {
          allowedOrigins.add(`${protocol}//${host}`);
          if (parsed.port) {
            allowedOrigins.add(`${protocol}//${host}:${parsed.port}`);
          }
        }
      }
    } catch {
      // Keep raw entry if it is not a full URL
    }
  }

  app.enableCors({
    origin: Array.from(allowedOrigins),
    credentials: true,
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

  await app.listen(port, '0.0.0.0');
  console.log(`Yoga API listening on http://0.0.0.0:${port}/api/v1`);
}
await bootstrap();
