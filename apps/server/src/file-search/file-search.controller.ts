import {
  Body,
  Controller,
  DefaultValuePipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FileSearchService } from './file-search.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { SearchFileDto } from './dto/search-file.dto';

@Controller('file-search')
export class FileSearchController {
  constructor(private readonly fileSearchService: FileSearchService) {}

  // file-search.controller.ts
  @Post()
  async search(@CurrentUser('sub') userId: string, @Body() dto: SearchFileDto) {
    return this.fileSearchService.search(
      userId,
      dto.workspaceId,
      dto.keyword,
      dto.searchType || 'case-insensitive',
      dto.searchIn || 'content',
    );
  }
}
