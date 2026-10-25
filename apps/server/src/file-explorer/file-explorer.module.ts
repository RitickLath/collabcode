import { Module } from '@nestjs/common';
import { FileExplorerController } from './file-explorer.controller';
import { FileExplorerService } from './file-explorer.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [FileExplorerController],
  providers: [FileExplorerService],
  exports: [FileExplorerService],
})
export class FileExplorerModule {}
