import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DockerService } from './docker.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/auth/decorators/current-user.decorator';

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  /**
   * Ensure container exists and is running for a workspace (spins up if needed)
   */
  @Post('workspaces/:workspaceId/init')
  @HttpCode(HttpStatus.OK)
  async initWorkspaceContainer(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return await this.dockerService.getOrCreateWorkspaceContainer(
      workspaceId,
      user?.sub,
    );
  }

  /**
   * Get the current status and health of a workspace container
   */
  @Get('workspaces/:workspaceId/status')
  async getContainerStatus(@Param('workspaceId') workspaceId: string) {
    return await this.dockerService.getContainerStatus(workspaceId);
  }

  /**
   * Gracefully stop a running workspace container
   */
  @Post('workspaces/:workspaceId/stop')
  @HttpCode(HttpStatus.OK)
  async stopContainer(@Param('workspaceId') workspaceId: string) {
    return await this.dockerService.stopContainer(workspaceId);
  }
}
