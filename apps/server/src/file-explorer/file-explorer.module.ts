import { Module } from '@nestjs/common';
import { FileExplorerController } from './file-explorer.controller';
import { FileExplorerService } from './file-explorer.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FileExplorerController],
  providers: [FileExplorerService],
  exports: [FileExplorerService],
})
export class FileExplorerModule {}
