import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateWorkspaceTemplateDto,
  CreateWorkspaceGitDto,
  GetWorkspacesQueryDto,
  SendWorkspaceInviteDto,
} from './dto/workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getMockWorkspaces } from 'src/common/mock/workspace.mock';
import { ConfigService } from '@nestjs/config';
import { Prisma } from 'generated/prisma/client';
import { WorkspaceQueue } from './queue/workspace.queue';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly workspaceQueue: WorkspaceQueue,
  ) {}

  /**
   * Retrieves paginated workspaces where the user is either the owner or an assigned member.
   * Supports role filtering ('all' | 'owner' | 'member'), search query, and pagination metadata.
   */
  async getAllWorkspaces(userId: string, query?: GetWorkspacesQueryDto) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query?.limit) || 6));
    const skip = (page - 1) * limit;

    // Build role filter based on requested role
    let whereClause: any;
    switch (query?.role) {
      case 'owner':
        whereClause = { ownerId: userId };
        break;

      case 'member':
        whereClause = {
          ownerId: { not: userId },
          members: { some: { userId } },
        };
        break;

      case 'all':
      default:
        whereClause = {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        };
        break;
    }

    // Append search condition if provided
    if (query?.search?.trim()) {
      const search = query.search.trim();
      whereClause = {
        AND: [
          whereClause,
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { framework: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
        ],
      };
    }

    const [total, workspaces] = await Promise.all([
      this.prisma.workspace.count({ where: whereClause }),
      this.prisma.workspace.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take: limit,
      }),
    ]);

    // In non-production environments: return central mock data if database has no records yet
    if (
      process.env.NODE_ENV !== 'production' &&
      (!workspaces || workspaces.length === 0)
    ) {
      return getMockWorkspaces(userId, {
        page,
        limit,
        role: query?.role,
        search: query?.search,
      });
    }

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: workspaces,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Fetches a workspace by ID if the requesting user is either its owner or an assigned member.
   * Also includes full profile details (id, username, email) for all workspace members.
   */
  async getWorkspaceById(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return workspace;
  }

  /**
   * Creates a new workspace initialized with a predefined framework template.
   * Handles unique slug enforcement and queues a BullMQ job to provision project files to S3.
   */
  async createWithTemplate(dto: CreateWorkspaceTemplateDto, userId: string) {
    let workspace;
    try {
      workspace = await this.prisma.workspace.create({
        data: {
          ownerId: userId,
          name: dto.name,
          description: dto.description,
          framework: dto.framework,
          slug: dto.name,
          s3Bucket: this.configService.get('S3_BUCKET_WORKSPACE') || '',
          s3Prefix: `workspaces/${userId}/${dto.name}/`,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'Workspace with this name already exists',
        );
      }
      throw error;
    }

    // OFFLOAD THE PROJECT CREATION PART TO BULLMQ
    const jobPayload = {
      workspaceId: workspace.id,
      userId,
      name: workspace.name,
      framework: dto.framework,
      s3Bucket: workspace.s3Bucket,
      s3Prefix: workspace.s3Prefix,
    };

    try {
      await this.workspaceQueue.addTemplateWorkspaceJob(jobPayload);
    } catch (queueError) {
      // If queuing fails, mark workspace as ERROR so it doesn't hang in CREATING forever
      await this.prisma.workspace.update({
        where: { id: workspace.id },
        data: { status: 'ERROR' },
      });
      throw queueError;
    }

    return {
      message: 'Workspace created',
      data: {
        id: workspace.id,
        workspaceStatus: workspace.status,
        createdAt: workspace.createdAt,
        framework: workspace.framework,
        name: workspace.name,
        description: workspace.description,
      },
    };
  }

  /**
   * Creates a new workspace cloned from a remote Git repository.
   * Handles unique slug enforcement and queues a BullMQ job to clone the repository and sync to S3.
   */
  async createWithGit(dto: CreateWorkspaceGitDto, userId: string) {
    let workspace;
    try {
      workspace = await this.prisma.workspace.create({
        data: {
          ownerId: userId,
          name: dto.name,
          description: dto.description,
          gitUrl: dto.gitUrl,
          slug: dto.name,
          s3Bucket: this.configService.get('S3_BUCKET_WORKSPACE') || '',
          s3Prefix: `workspaces/${userId}/${dto.name}/`,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'Workspace with this name already exists',
        );
      }
      throw error;
    }

    // OFFLOAD THE GIT CLONE & SYNC TASK TO BULLMQ
    const jobPayload = {
      workspaceId: workspace.id,
      userId,
      name: workspace.name,
      gitUrl: dto.gitUrl,
      s3Bucket: workspace.s3Bucket,
      s3Prefix: workspace.s3Prefix,
    };

    try {
      await this.workspaceQueue.addGitWorkspaceJob(jobPayload);
    } catch (queueError) {
      await this.prisma.workspace.update({
        where: { id: workspace.id },
        data: { status: 'ERROR' },
      });
      throw queueError;
    }

    return {
      message: 'Git workspace created',
      data: {
        id: workspace.id,
        workspaceStatus: workspace.status,
        createdAt: workspace.createdAt,
        name: workspace.name,
        gitUrl: workspace.gitUrl,
        description: workspace.description,
      },
    };
  }

  /**
   * Accepts a workspace invitation via token and adds the user as a member.
   */
  async acceptInvite(token: string, userId: string) {
    // TODO: Validate token, check expiry, create WorkspaceMember and update invite status
    return {
      message: 'Invite accepted successfully',
    };
  }

  /**
   * Creates a pending invitation and emails the invite link to the recipient.
   */
  async sendInvite(
    workspaceId: string,
    dto: SendWorkspaceInviteDto,
    userId: string,
  ) {
    // TODO: Verify userId is OWNER/EDITOR, create WorkspaceInvite, and dispatch email
    return {
      message: 'Invite sent successfully',
    };
  }

  /**
   * Lists all active/pending invitations for a given workspace.
   */
  async getInvites(workspaceId: string, userId: string) {
    // TODO: Fetch pending invites for workspace if user is member
    return [];
  }

  /**
   * Revokes or cancels a pending workspace invitation.
   */
  async revokeInvite(workspaceId: string, inviteId: string, userId: string) {
    // TODO: Delete or mark invite CANCELLED
    return {
      message: 'Invite revoked successfully',
    };
  }

  /**
   * Removes a member from the workspace.
   */
  async removeMember(workspaceId: string, memberId: string, userId: string) {
    // TODO: Remove WorkspaceMember record verifying permissions
    return {
      message: 'Member removed successfully',
    };
  }
}
