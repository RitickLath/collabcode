import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  CreateWorkspaceDto,
  GetWorkspacesQueryDto,
  SendWorkspaceInviteDto,
  AcceptWorkspaceInviteDto,
} from './dto/workspace.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  /**
   * Retrieve all workspaces accessible to the authenticated user,
   * supporting pagination, sorting, and optional search filters.
   */
  @Get()
  async getAllWorkspaces(
    @CurrentUser('sub') userId: string,
    @Query() query: GetWorkspacesQueryDto,
  ) {
    return this.workspaceService.getAllWorkspaces(userId, query);
  }

  /**
   * Accept a workspace invitation using an invitation token.
   * Adds the authenticated user as a member of the workspace.
   */
  @Post('invites/accept')
  async acceptInvite(
    @Body() dto: AcceptWorkspaceInviteDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.acceptInvite(dto.token, userId);
  }

  /**
   * Retrieve detailed information for a specific workspace by ID,
   * verifying user membership and access permissions.
   */
  @Get(':id')
  async getWorkspaceById(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.getWorkspaceById(id, userId);
  }

  /**
   * Create a new workspace.
   * Dispatches to template or git provisioning based on the provided payload type or fields.
   */
  @Post()
  async createWorkspace(
    @Body() dto: CreateWorkspaceDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.createWorkspace(dto, userId);
  }

  /**
   * Send an invitation email to a user to collaborate on the workspace.
   */
  @Post(':id/invites')
  async sendInvite(
    @Param('id') workspaceId: string,
    @Body() dto: SendWorkspaceInviteDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.sendInvite(workspaceId, dto, userId);
  }

  /**
   * List all active/pending invitations for a specific workspace.
   */
  @Get(':id/invites')
  async getInvites(
    @Param('id') workspaceId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.getInvites(workspaceId, userId);
  }

  /**
   * Revoke or delete a pending workspace invitation by its invite ID.
   */
  @Delete(':id/invites/:inviteId')
  async revokeInvite(
    @Param('id') workspaceId: string,
    @Param('inviteId') inviteId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.revokeInvite(workspaceId, inviteId, userId);
  }

  /**
   * Remove a collaborator or member from the workspace.
   */
  @Delete(':id/members/:memberId')
  async removeMember(
    @Param('id') workspaceId: string,
    @Param('memberId') memberId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.removeMember(workspaceId, memberId, userId);
  }
}
