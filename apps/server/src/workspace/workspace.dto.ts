import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class GetWorkspacesQueryDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;

  @IsOptional()
  @IsEnum(['all', 'owner', 'member'], {
    message: 'role must be either all, owner, or member',
  })
  role?: 'all' | 'owner' | 'member';

  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateWorkspaceTemplateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  framework: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateWorkspaceGitDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  gitUrl: string;

  @IsOptional()
  @IsString()
  description?: string;
}
