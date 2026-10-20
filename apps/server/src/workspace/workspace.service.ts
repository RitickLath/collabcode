import { Injectable } from '@nestjs/common';
import {
  CreateWorkspaceTemplateDto,
  CreateWorkspaceGitDto,
  GetWorkspacesQueryDto,
} from './workspace.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { getMockWorkspaces } from 'src/common/mock/workspace.mock';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

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
