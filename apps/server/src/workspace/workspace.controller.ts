import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  CreateWorkspaceTemplateDto,
  CreateWorkspaceGitDto,
  GetWorkspacesQueryDto,
} from './workspace.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  async getAllWorkspaces(
    @CurrentUser('sub') userId: string,
    @Query() query: GetWorkspacesQueryDto,
  ) {
    return this.workspaceService.getAllWorkspaces(userId, query);
  }

  @Get(':id')
  async getWorkspaceById(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.getWorkspaceById(id, userId);
  }

  @Post()
  async createWithTemplate(
    @Body() dto: CreateWorkspaceTemplateDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.createWithTemplate(dto, userId);
  }

  @Post('git')
  async createWithGit(
    @Body() dto: CreateWorkspaceGitDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.createWithGit(dto, userId);
  }
}
