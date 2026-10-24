import { IsOptional, IsString } from 'class-validator';

// dto/search-file.dto.ts
export class SearchFileDto {
  @IsString()
  workspaceId: string;

  @IsString()
  keyword: string;

  @IsString()
  @IsOptional()
  searchType?: 'case-sensitive' | 'case-insensitive';

  @IsString()
  @IsOptional()
  searchIn?: 'filename' | 'content';
}
