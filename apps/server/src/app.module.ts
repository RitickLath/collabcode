import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guard/authGuard';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './redis/redis.module';
import { registerAsDatabaseConfig } from './config/database.config';
import { registerAsRedisConfig } from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [registerAsDatabaseConfig, registerAsRedisConfig],
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}.local`,
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local',
        '.env',
      ],
    }),
    RedisModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL');
        if (redisUrl) {
          const parsed = new URL(redisUrl);
          return {
            connection: {
              host: parsed.hostname,
              port: parseInt(parsed.port || '6379', 10),
              password: parsed.password || undefined,
              username: parsed.username || undefined,
            },
          };
        }
        return {
          connection: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            password: configService.get<string>('REDIS_PASSWORD') || undefined,
          },
        };
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    UserModule,
    WorkspaceModule,
    FileExplorerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
