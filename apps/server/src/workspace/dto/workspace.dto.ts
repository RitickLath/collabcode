import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProjectTemplate } from 'generated/prisma/client';

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

  @IsEnum(ProjectTemplate, {
    message: `framework must be one of: ${Object.values(ProjectTemplate).join(', ')}`,
  })
  framework: ProjectTemplate;

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

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEnum(['TEMPLATE', 'GIT'], {
    message: 'type must be either TEMPLATE or GIT',
  })
  type?: 'TEMPLATE' | 'GIT';

  @IsOptional()
  @IsEnum(ProjectTemplate, {
    message: `framework must be one of: ${Object.values(ProjectTemplate).join(', ')}`,
  })
  framework?: ProjectTemplate;

  @IsOptional()
  @IsString()
  gitUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class SendWorkspaceInviteDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsEnum(['EDITOR', 'VIEWER'], {
    message: 'role must be either EDITOR or VIEWER',
  })
  role?: 'EDITOR' | 'VIEWER';
}

export class AcceptWorkspaceInviteDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
