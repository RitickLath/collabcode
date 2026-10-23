import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateWorkspaceTemplateDto,
  CreateWorkspaceGitDto,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  GetWorkspacesQueryDto,
  SendWorkspaceInviteDto,
} from './dto/workspace.dto';
import { ProjectTemplate } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { getMockWorkspaces } from 'src/common/mock/workspace.mock';
import { ConfigService } from '@nestjs/config';
import { Prisma } from 'generated/prisma/client';
import { WorkspaceQueue } from './queue/workspace.queue';
import { getProjectPath } from 'src/common/utils/projectPath';
import * as fs from 'fs/promises';
import { MailQueue } from 'src/mail/queue/mail.queue';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly workspaceQueue: WorkspaceQueue,
    private readonly mailQueue: MailQueue,
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
   * Unified workspace creation entry point.
   * Delegates to template or git provisioning based on dto.type or payload shape.
   */
  async createWorkspace(dto: CreateWorkspaceDto, userId: string) {
    if (dto.type === 'GIT' || dto.gitUrl) {
      if (!dto.gitUrl) {
        throw new BadRequestException(
          'gitUrl is required for GIT workspace creation',
        );
      }
      return this.createWithGit(
        {
          name: dto.name,
          gitUrl: dto.gitUrl,
          description: dto.description,
        },
        userId,
      );
    }

    // Default to template creation
    return this.createWithTemplate(
      {
        name: dto.name,
        framework: dto.framework || ProjectTemplate.REACT,
        description: dto.description,
      },
      userId,
    );
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
   * Deletes a workspace by ID.
   * Enforces that only the workspace owner can delete it.
   * Cascades deletion across database relations, cleans up local project files on disk,
   * and offloads remote S3 asset cleanup to BullMQ.
   */
  async deleteWorkspace(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can delete the workspace');
    }

    await this.prisma.workspace.delete({
      where: { id: workspaceId },
    });

    // Clean up local project files on disk
    try {
      const projectDir = getProjectPath(workspaceId);
      await fs.rm(projectDir, { recursive: true, force: true });
      this.logger.log(
        `Cleaned up local directory for workspace: ${workspaceId}`,
      );
    } catch (fsError) {
      this.logger.warn(
        `Failed to delete local project directory for workspace ${workspaceId}: ${fsError.message}`,
      );
    }

    // Offload remote S3 object cleanup to BullMQ
    await this.workspaceQueue.addS3CleanUpJob({
      workspaceId,
      s3Bucket: workspace.s3Bucket,
      s3Prefix: workspace.s3Prefix,
    });

    return {
      message: 'Workspace deleted',
      data: {
        id: workspaceId,
      },
    };
  }

  /**
   * Updates workspace properties (name, description, visibility).
   * Enforces that only the owner can modify the workspace.
   */
  async updateWorkspace(
    workspaceId: string,
    dto: UpdateWorkspaceDto,
    userId: string,
  ) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can update the workspace');
    }

    try {
      const updated = await this.prisma.workspace.update({
        where: { id: workspaceId },
        data: {
          ...(dto.name && { name: dto.name, slug: dto.name }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.visibility && { visibility: dto.visibility }),
        },
      });

      return {
        message: 'Workspace updated',
        data: updated,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'A workspace with this name already exists for your account',
        );
      }
      throw error;
    }
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
  async acceptInvite(token: string, acceptorId: string, acceptorEmail: string) {
    const invite = await this.prisma.workspaceInvite.findUnique({
      where: {
        token,
      },
      include: {
        workspace: {
          select: {
            id: true,
            ownerId: true,
          },
        },
      },
    });

    if (!invite || invite.email.toLowerCase() !== acceptorEmail.toLowerCase()) {
      throw new NotFoundException('Invalid invitation');
    }

    if (invite.workspace.ownerId === acceptorId) {
      throw new BadRequestException(
        'You cannot accept an invite to your own workspace',
      );
    }

    if (invite.status === 'ACCEPTED') {
      throw new BadRequestException('Invite already accepted');
    }

    if (invite.status === 'CANCELLED') {
      throw new BadRequestException('Invite has been cancelled');
    }

    if (invite.status === 'EXPIRED' || new Date() > invite.expiresAt) {
      if (invite.status !== 'EXPIRED') {
        await this.prisma.workspaceInvite.update({
          where: { id: invite.id },
          data: { status: 'EXPIRED' },
        });
      }
      throw new BadRequestException('Invite has expired');
    }

    // Atomic transaction: Add member and update invite status
    await this.prisma.$transaction(async (tx) => {
      // Check if user is already a member
      const existingMember = await tx.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: invite.workspaceId,
            userId: acceptorId,
          },
        },
      });

      if (!existingMember) {
        await tx.workspaceMember.create({
          data: {
            workspaceId: invite.workspaceId,
            userId: acceptorId,
            role: invite.role,
          },
        });
      }

      await tx.workspaceInvite.update({
        where: {
          id: invite.id,
        },
        data: {
          status: 'ACCEPTED',
        },
      });
    });

    return {
      message: 'Invite accepted successfully',
      workspaceId: invite.workspaceId,
      role: invite.role,
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
    // 1. Check if user has permission to send invite (Is Owner)
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: { where: { user: { email: dto.email } } },
        invites: { where: { email: dto.email, status: 'PENDING' } },
        owner: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can send invites');
    }

    if (workspace.owner.email == dto.email) {
      throw new BadRequestException(
        'You cannot invite yourself to the workspace',
      );
    }

    if (workspace.members.length > 0) {
      throw new BadRequestException(
        'User is already a member of the workspace',
      );
    }

    if (workspace.invites.length > 0) {
      throw new BadRequestException('User is already invited to the workspace');
    }

    const token = crypto.randomUUID();

    const invite = await this.prisma.workspaceInvite.create({
      data: {
        workspaceId,
        email: dto.email,
        role: dto.role,
        token: token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    if (!invite) {
      throw new InternalServerErrorException('Failed to create invite');
    }

    // Send mail using bullmq
    await this.mailQueue.queueInviteEmail(
      dto.email,
      token,
      workspace.name,
      workspace.owner.username,
      dto.role || 'VIEWER',
    );

    return {
      message: 'Invite sent successfully',
    };
  }

  /**
   * Lists all active/pending invitations for a given workspace.
   */
  async getInvites(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        invites: {
          where: { status: 'PENDING' },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to view invites of this workspace',
      );
    }

    return workspace.invites;
  }

  /**
   * Revokes or cancels a pending workspace invitation.
   */
  async revokeInvite(workspaceId: string, inviteId: string, userId: string) {
    const invite = await this.prisma.workspaceInvite.findUnique({
      where: {
        id: inviteId,
      },
      include: {
        workspace: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (invite?.workspace.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.workspaceId !== workspaceId) {
      throw new BadRequestException('Invalid invite');
    }

    if (
      invite.status === 'ACCEPTED' ||
      invite.status === 'CANCELLED' ||
      invite.status === 'EXPIRED'
    ) {
      throw new BadRequestException(
        `Invite has already been ${invite.status.toLocaleLowerCase()}`,
      );
    }

    await this.prisma.workspaceInvite.update({
      where: {
        id: inviteId,
      },
      data: {
        status: 'CANCELLED',
      },
    });

    return {
      message: 'Invite revoked successfully',
    };
  }

  /**
   * Removes a member from the workspace.
   */
  async removeMember(workspaceId: string, memberId: string, userId: string) {
    const workspaceMember = await this.prisma.workspaceMember.findUnique({
      where: {
        id: memberId,
        workspaceId: workspaceId,
      },
      include: {
        workspace: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!workspaceMember) {
      throw new NotFoundException('Member not found');
    }

    if (workspaceMember?.workspace.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    if (workspaceMember.userId === userId) {
      throw new BadRequestException(
        'You cannot remove yourself from the workspace',
      );
    }

    await this.prisma.workspaceMember.delete({
      where: {
        id: memberId,
      },
    });

    return {
      message: 'Member removed successfully',
    };
  }
}
