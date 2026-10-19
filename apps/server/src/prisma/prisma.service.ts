import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { ConfigType } from '@nestjs/config';
import { registerAsDatabaseConfig } from 'src/config/database.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(registerAsDatabaseConfig.KEY)
    config: ConfigType<typeof registerAsDatabaseConfig>,
  ) {
    const adapter = new PrismaPg({
      connectionString: config.uri,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
