import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { WorkspaceProcessor } from './queue/workspace.processor';
import { WorkspaceQueue } from './queue/workspace.queue';
import { WORKSPACE_QUEUE_NAME } from './dto/workspace.types';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    BullModule.registerQueue({
      name: WORKSPACE_QUEUE_NAME,
    }),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceQueue, WorkspaceProcessor],
})
export class WorkspaceModule {}
