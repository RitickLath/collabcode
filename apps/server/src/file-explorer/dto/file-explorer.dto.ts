import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export enum EntryType {
  FILE = 'FILE',
  DIRECTORY = 'DIRECTORY',
}

export class CreateEntryDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsEnum(EntryType, {
    message: 'type must be either FILE or DIRECTORY',
  })
  type: EntryType;

  @IsOptional()
  @IsString()
  content?: string;
}

export class UpdateContentDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  content: string;
}

export class RenameEntryDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[^\\/]+$/, {
    message:
      'newName must be a single file or folder name without path separators',
  })
  newName: string;
}

export class GetContentQueryDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}

export class DeleteEntryQueryDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}
