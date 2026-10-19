import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 4000;
  const env = configService.get<string>('NODE_ENV') ?? 'development';

  await app.listen(port);
  Logger.log(
    `Application running on http://localhost:${port} in [${env}] mode`,
    'Bootstrap',
  );
}
bootstrap();
