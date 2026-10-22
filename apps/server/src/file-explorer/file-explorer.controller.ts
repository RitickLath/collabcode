import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { FileExplorerService } from './file-explorer.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  CreateEntryDto,
  DeleteEntryQueryDto,
  GetContentQueryDto,
  RenameEntryDto,
  UpdateContentDto,
} from './dto/file-explorer.dto';

@Controller('workspaces/:workspaceId/files')
export class FileExplorerController {
  constructor(private readonly fileExplorerService: FileExplorerService) {}

  /**
   * Get File Tree
   * Retrieves the full recursive directory and file hierarchy of the workspace.
   * Filters out high-noise folders (e.g., node_modules, .git, .next, dist).
   */
  @Get()
  async getFileTree(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.fileExplorerService.getFileTree(workspaceId, userId);
  }

  /**
   * Get File Content
   * Reads and returns the UTF-8 text/code content of a specific file for the editor.
   */
  @Get('content')
  async getFileContent(
    @Param('workspaceId') workspaceId: string,
    @Query() query: GetContentQueryDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.fileExplorerService.getFileContent(
      workspaceId,
      query.path,
      userId,
    );
  }

  /**
   * Create Entry
   * Creates a new file or directory at the specified relative workspace path.
   * Recursively ensures parent directories exist and writes initial content if provided.
   */
  @Post()
  async createEntry(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateEntryDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.fileExplorerService.createEntry(workspaceId, dto, userId);
  }

  /**
   * Update File Content
   * Saves updated code/text content from the editor into the designated file.
   */
  @Put('content')
  async updateFileContent(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: UpdateContentDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.fileExplorerService.updateFileContent(workspaceId, dto, userId);
  }

  /**
   * Rename File/Folder
   * Renames an existing file or directory within the workspace sandbox.
   */
  @Patch('rename')
  async renameEntry(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: RenameEntryDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.fileExplorerService.renameEntry(workspaceId, dto, userId);
  }

  /**
   * Delete Entry
   * Deletes a specific file or directory (and all its nested contents) recursively.
   */
  @Delete()
  async deleteEntry(
    @Param('workspaceId') workspaceId: string,
    @Query() query: DeleteEntryQueryDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.fileExplorerService.deleteEntry(
      workspaceId,
      query.path,
      userId,
    );
  }
}
