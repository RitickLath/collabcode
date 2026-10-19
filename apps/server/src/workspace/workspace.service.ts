import { Injectable } from '@nestjs/common';
import {
  CreateWorkspaceTemplateDto,
  CreateWorkspaceGitDto,
} from './workspace.dto';

@Injectable()
export class WorkspaceService {
  async getAllWorkspaces(userId: string) {
    return [];
  }

  async getWorkspaceById(id: string, userId: string) {
    return null;
  }

  async createWithTemplate(dto: CreateWorkspaceTemplateDto, userId: string) {
    return {
      message: 'Workspace created',
    };
  }

  async createWithGit(dto: CreateWorkspaceGitDto, userId: string) {
    return {
      message: 'Git workspace creation initiated',
    };
  }
}
