import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

// Polyfill BigInt serialization for Express / JSON.stringify
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 4000;
  const env = configService.get<string>('NODE_ENV') ?? 'development';

  app.use(cookieParser());

  const clientUrl =
    configService.get<string>('CLIENT_URL') ?? 'http://localhost:3000';

  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
  Logger.log(
    `Application running on http://localhost:${port} in [${env}] mode,}`,
    'Bootstrap',
  );
}
bootstrap();
