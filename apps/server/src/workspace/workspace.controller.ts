import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  GetWorkspacesQueryDto,
  SendWorkspaceInviteDto,
  AcceptWorkspaceInviteDto,
  RejectWorkspaceInviteDto,
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
   * Retrieve all pending workspace invitations for the authenticated user.
   */
  @Get('invites/my-invites')
  async getMyPendingInvites(@CurrentUser('email') userEmail: string) {
    return this.workspaceService.getMyPendingInvites(userEmail);
  }

  /**
   * Accept a workspace invitation using an invitation token.
   * Adds the authenticated user as a member of the workspace.
   */
  @Post('invites/accept')
  async acceptInvite(
    @Body() dto: AcceptWorkspaceInviteDto,
    @CurrentUser('sub') acceptorId: string,
    @CurrentUser('email') acceptorEmail: string,
  ) {
    return this.workspaceService.acceptInvite(
      dto.token,
      acceptorId,
      acceptorEmail,
    );
  }

  /**
   * Reject a workspace invitation using an invitation token.
   */
  @Post('invites/reject')
  async rejectInvite(
    @Body() dto: RejectWorkspaceInviteDto,
    @CurrentUser('email') acceptorEmail: string,
  ) {
    return this.workspaceService.rejectInvite(dto.token, acceptorEmail);
  }

  /**
   * Retrieve detailed information for a specific workspace by ID,
   * verifying user membership and access permissions.
   */
  @Get(':id')
  async getWorkspaceById(
    @Param('id', ParseUUIDPipe) id: string,
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

  @Patch(':id')
  async updateWorkspace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkspaceDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.updateWorkspace(id, dto, userId);
  }

  @Delete(':id')
  async deleteWorkspace(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.deleteWorkspace(id, userId);
  }

  /**
   * Send an invitation email to a user to collaborate on the workspace.
   */
  @Post(':id/invites')
  async sendInvite(
    @Param('id', ParseUUIDPipe) workspaceId: string,
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
    @Param('id', ParseUUIDPipe) workspaceId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.getInvites(workspaceId, userId);
  }

  /**
   * Revoke or delete a pending workspace invitation by its invite ID.
   */
  @Delete(':id/invites/:inviteId')
  async revokeInvite(
    @Param('id', ParseUUIDPipe) workspaceId: string,
    @Param('inviteId', ParseUUIDPipe) inviteId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.revokeInvite(workspaceId, inviteId, userId);
  }

  /**
   * Remove a collaborator or member from the workspace.
   */
  @Delete(':id/members/:memberId')
  async removeMember(
    @Param('id', ParseUUIDPipe) workspaceId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.workspaceService.removeMember(workspaceId, memberId, userId);
  }
}
