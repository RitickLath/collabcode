import { Module } from '@nestjs/common';
import { DockerController } from './docker.controller';
import { DockerService } from './docker.service';
import { DockerGateway } from './docker.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DockerController],
  providers: [DockerService, DockerGateway],
})
export class DockerModule {}
