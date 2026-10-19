import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { registerAsDatabaseConfig } from 'src/config/database.config';

@Module({
  imports: [ConfigModule.forFeature(registerAsDatabaseConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
