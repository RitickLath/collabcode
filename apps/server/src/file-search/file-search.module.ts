import { Module } from '@nestjs/common';
import { FileSearchService } from './file-search.service';
import { FileSearchController } from './file-search.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FileSearchController],
  providers: [FileSearchService],
})
export class FileSearchModule {}
