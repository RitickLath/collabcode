import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateEntryDto,
  RenameEntryDto,
  UpdateContentDto,
} from './dto/file-explorer.dto';
import dirTree from 'directory-tree';
import { getProjectPath } from 'src/common/utils/projectPath';
import * as fs from 'fs/promises';
import * as path from 'path';
import { resolveSafeWorkspacePath } from './utils/path-security.util';

@Injectable()
export class FileExplorerService {
  private readonly logger = new Logger(FileExplorerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the workspace directory tree, filtering out build/git folders.
   * Ensures the user has workspace access before scanning disk.
   */
  async getFileTree(workspaceId: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const projectPath = getProjectPath(workspaceId);

    const tree = dirTree(projectPath, {
      exclude: [/node_modules/, /\.git/, /\.next/, /\.turbo/, /dist/],
    });

    if (!tree) {
      return {
        name: workspaceId,
        path: workspaceId,
        type: 'directory',
        children: [],
      };
    }

    // sanitize the tree to remove absolute paths (stripping off host path and prefixing with workspaceId)
    return this.sanitizeTree(tree, projectPath, workspaceId);
  }

  /**
   * Get File Content
   * Reads raw UTF-8 content of a file within the workspace.
   */
  async getFileContent(workspaceId: string, filePath: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const projectPath = getProjectPath(workspaceId);
    const safePath = resolveSafeWorkspacePath(projectPath, filePath);

    try {
      const stats = await fs.stat(safePath);
      if (stats.isDirectory()) {
        throw new BadRequestException(
          'Specified path is a directory, not a file',
        );
      }

      const content = await fs.readFile(safePath, 'utf-8');
      const ext = path.extname(filePath);
      const name = path.basename(filePath);
      return { path: filePath, name, extension: ext, content };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File not found: ${filePath}`);
      }
      throw error;
    }
  }

  /**
   * Create Entry
   * Creates a file or directory at the requested relative path.
   */
  async createEntry(workspaceId: string, dto: CreateEntryDto, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const projectPath = getProjectPath(workspaceId);
    const safePath = resolveSafeWorkspacePath(projectPath, dto.path);

    // guard: parent folder exists and is a directory
    const parentFolder = path.dirname(safePath);
    try {
      const parentStat = await fs.stat(parentFolder);
      if (!parentStat.isDirectory()) {
        throw new BadRequestException(
          `Parent path "${path.dirname(dto.path)}" is not a directory`,
        );
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new BadRequestException(
          `Parent folder "${path.dirname(dto.path)}" does not exist`,
        );
      }
      throw error;
    }

    try {
      // guard: entry with same name doesn't already exist
      await fs.stat(safePath);
      throw new BadRequestException(
        `An entry with name "${path.basename(dto.path)}" already exists in this folder`,
      );
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    if (dto.type === 'DIRECTORY') {
      await fs.mkdir(safePath);
    } else {
      await fs.writeFile(safePath, dto.content || '', 'utf-8');
    }

    return { message: 'Entry created', path: dto.path };
  }

  /**
   * Update File Content
   * Writes updated code content to an existing file.
   */
  async updateFileContent(
    workspaceId: string,
    dto: UpdateContentDto,
    userId: string,
  ) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const projectPath = getProjectPath(workspaceId);
    const safePath = resolveSafeWorkspacePath(projectPath, dto.path);

    try {
      const stats = await fs.stat(safePath);
      if (stats.isDirectory()) {
        throw new BadRequestException(
          `Cannot write content: "${dto.path}" is a directory`,
        );
      }
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`File not found: ${dto.path}`);
      }
      throw error;
    }

    await fs.writeFile(safePath, dto.content ?? '', 'utf-8');

    return { message: 'Content saved', path: dto.path };
  }

  /**
   * Rename File/Folder
   * Renames an existing file or directory strictly within its current parent folder.
   */
  async renameEntry(workspaceId: string, dto: RenameEntryDto, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const projectPath = getProjectPath(workspaceId);

    // resolve safe paths for old and new paths and return new relative path for client
    const { safeOldPath, safeNewPath, newRelativePath, trimmedNewName } =
      this.resolveRenamePaths(projectPath, dto.path, dto.newName);

    try {
      await fs.stat(safeOldPath);

      try {
        await fs.access(safeNewPath);
        throw new BadRequestException(
          `An entry with name "${trimmedNewName}" already exists in this folder`,
        );
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      await fs.rename(safeOldPath, safeNewPath);

      return {
        message: 'Renamed successfully',
        oldPath: dto.path,
        newPath: newRelativePath,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`Entry not found: ${dto.path}`);
      }
      throw error;
    }
  }

  /**
   * Delete Entry
   * Deletes a file or directory safely and recursively.
   */
  async deleteEntry(workspaceId: string, entryPath: string, userId: string) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const projectPath = getProjectPath(workspaceId);
    const safePath = resolveSafeWorkspacePath(projectPath, entryPath);

    // Prevent deleting the root workspace directory
    if (safePath === projectPath) {
      throw new BadRequestException(
        'Cannot delete the root workspace directory',
      );
    }

    try {
      await fs.stat(safePath);
      await fs.rm(safePath, { recursive: true, force: true });

      return { message: 'Entry deleted', path: entryPath };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new NotFoundException(`Entry not found: ${entryPath}`);
      }
      throw error;
    }
  }

  // ==========================================
  // Private Helper Methods
  // ==========================================

  /**
   *
   * Ensures the requesting user is either the workspace owner or an authorized member.
   */
  async verifyWorkspaceAccess(workspaceId: string, userId: string) {
    const isMember = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
    });

    if (!isMember) {
      throw new ForbiddenException('User is not a member of the workspace');
    }

    return isMember;
  }

  /**
   * Constructs and validates safe paths for in-place renaming.
   * Ensures the operation stays in the same parent folder and does not touch workspace root.
   */
  private resolveRenamePaths(
    projectPath: string,
    relativeSourcePath: string,
    rawNewName: string,
  ) {
    const trimmedNewName = rawNewName.trim();
    if (!trimmedNewName || trimmedNewName === '.' || trimmedNewName === '..') {
      throw new BadRequestException('Invalid new name provided');
    }

    if (trimmedNewName.includes('/') || trimmedNewName.includes('\\')) {
      throw new BadRequestException(
        'Renaming cannot move an entry to a different directory. Only rename within the same folder is allowed.',
      );
    }

    const safeOldPath = resolveSafeWorkspacePath(
      projectPath,
      relativeSourcePath,
    );

    // Prevent renaming the root workspace directory
    if (safeOldPath === projectPath) {
      throw new BadRequestException(
        'Cannot rename the root workspace directory',
      );
    }

    // Construct target path strictly within the same parent folder
    const parentDir = path.dirname(safeOldPath);
    const safeNewPath = path.join(parentDir, trimmedNewName);

    // Construct the client-facing relative path (e.g. "workspaceId/src/NewName.tsx")
    const oldDirRelative = path.dirname(relativeSourcePath);
    const newRelativePath =
      oldDirRelative === '.'
        ? trimmedNewName
        : `${oldDirRelative}/${trimmedNewName}`;

    return {
      safeOldPath,
      safeNewPath,
      newRelativePath,
      trimmedNewName,
    };
  }

  /**
   * Helper to strip absolute server host path and make all node paths relative to workspace root
   */
  private sanitizeTree(item: any, basePath: string, workspaceId: string): any {
    if (!item) return item;

    // Convert absolute server path to relative path inside workspace
    const relativePath = path.relative(basePath, item.path);

    // if relativePath is empty string (means it's the root), return workspaceId
    // else replace windows path separators with posix path separators and prefix with workspaceId
    const fullWorkspacePath = relativePath
      ? path.posix.join(workspaceId, relativePath.split(path.sep).join('/'))
      : workspaceId;

    const isDir = Array.isArray(item.children);

    return {
      name: item.name,
      path: fullWorkspacePath,
      type: isDir ? 'directory' : 'file',
      ...(item.size !== undefined && { size: item.size }),
      ...(item.extension && { extension: item.extension }),
      ...(isDir && {
        // recursive call to sanitize the tree
        children: item.children.map((child: any) =>
          this.sanitizeTree(child, basePath, workspaceId),
        ),
      }),
    };
  }
}
