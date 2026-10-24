import { ForbiddenException, Injectable } from '@nestjs/common';
import path from 'path';
import { execAsync } from 'src/common/utils/exec';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FileSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchFile(userId: string, workspaceId: string, fileName: string) {
    if (!fileName || !fileName.trim()) {
      return { success: true, files: [] };
    }

    const userWorkspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: { where: { userId } },
      },
    });

    if (
      !userWorkspace ||
      (userWorkspace.ownerId !== userId && userWorkspace.members.length === 0)
    ) {
      throw new ForbiddenException(
        'Workspace not found or User is not authorized',
      );
    }

    const fileDirPath = path.join(
      process.cwd(),
      'code-runner-workspaces',
      userWorkspace.id,
    );

    // Escape special characters in file name
    const escapedName = fileName.replace(/(["\\$`*?])/g, '\\$1');

    try {
      // Case-insensitive filename search excluding build/deps, capped at 100 matches
      const { stdout } = await execAsync(
        `find . -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/.next/*' -not -path '*/dist/*' -not -path '*/.turbo/*' -iname "*${escapedName}*" -type f | head -n 100`,
        { cwd: fileDirPath, maxBuffer: 10 * 1024 * 1024 },
      );

      const files = stdout
        .split('\n')
        .filter(Boolean)
        .map((filePath) => ({
          path: path.posix.join(workspaceId, filePath.replace(/^\.\//, '')),
        }));

      return { success: true, files };
    } catch (error: any) {
      return { success: true, files: [] };
    }
  }

  async searchContent(
    userId: string,
    workspaceId: string,
    keyword: string,
    searchType: string,
  ) {
    if (!keyword || !keyword.trim()) {
      return { success: true, files: [] };
    }

    const userWorkspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: {
          where: {
            userId,
          },
        },
      },
    });

    if (
      !userWorkspace ||
      (userWorkspace.ownerId !== userId && userWorkspace.members.length === 0)
    ) {
      throw new ForbiddenException(
        'Workspace not found or User is not authorized',
      );
    }

    const fileDirPath = path.join(
      process.cwd(),
      'code-runner-workspaces',
      userWorkspace.id,
    );

    const caseFlag = searchType === 'case-insensitive' ? '-i' : '';

    // Escape special characters in keyword
    const escapedKeyword = keyword.replace(/(["\\$`])/g, '\\$1');

    try {
      // Case-insensitive content search excluding build/deps, capped at 250 matches
      const { stdout } = await execAsync(
        `grep -rnI ${caseFlag} --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=dist --exclude-dir=.turbo --exclude="*.lock" --exclude="package-lock.json" "${escapedKeyword}" . | head -n 250`,
        { cwd: fileDirPath, maxBuffer: 10 * 1024 * 1024 },
      );

      const files = stdout
        .split('\n') // Split the output by newline to get individual lines
        .filter(Boolean) // Filter out empty lines
        .map((line) => {
          // Map each line to a file object
          const firstColon = line.indexOf(':');
          const secondColon = line.indexOf(':', firstColon + 1);

          if (firstColon === -1 || secondColon === -1) return null;

          const relativePath = line.slice(0, firstColon).replace(/^\.\//, '');

          const fullPath = path.posix.join(workspaceId, relativePath);

          const lineNumber = parseInt(
            line.slice(firstColon + 1, secondColon),
            10,
          );
          const content = line.slice(secondColon + 1).trim();

          return {
            path: fullPath,
            lineNumber,
            content,
          };
        })
        .filter(Boolean);

      return { success: true, files };
    } catch (error: any) {
      // Exit code 1 means grep found 0 matches
      if (error?.code === 1 || error?.status === 1) {
        return { success: true, files: [] };
      }
      console.error('Search content error:', error);
      return { success: false, files: [], error: error?.message };
    }
  }

  async search(
    userId: string,
    workspaceId: string,
    keyword: string,
    searchType: string,
    searchIn: string,
  ) {
    if (searchIn === 'filename') {
      return this.searchFile(userId, workspaceId, keyword);
    } else {
      return this.searchContent(userId, workspaceId, keyword, searchType);
    }
  }
}
