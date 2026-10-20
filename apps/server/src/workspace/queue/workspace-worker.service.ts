import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  ITemplateWorkspaceJob,
  IGitWorkspaceJob,
} from '../dto/workspace.types';

@Injectable()
export class WorkspaceWorkerService {
  private readonly logger = new Logger(WorkspaceWorkerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Provisions a workspace based on a starter framework template:
   * 1. Creates local temporary workspace directory
   * 2. Scaffolds / copies framework template files
   * 3. Syncs directory to S3 under s3Prefix
   * 4. Updates workspace status to READY (or ERROR on failure)
   */
  async processTemplateWorkspace(data: ITemplateWorkspaceJob): Promise<void> {
    this.logger.log(
      `Starting template provisioning for workspace: ${data.workspaceId} (${data.framework})`,
    );

    // TODO: Implement local directory creation, template generation, and S3 upload
  }

  /**
   * Provisions a workspace by cloning a remote Git repository:
   * 1. Creates local temporary workspace directory
   * 2. Clones the git repository
   * 3. Syncs directory to S3 under s3Prefix
   * 4. Updates workspace status to READY (or ERROR on failure)
   */
  async processGitWorkspace(data: IGitWorkspaceJob): Promise<void> {
    this.logger.log(
      `Starting git provisioning for workspace: ${data.workspaceId} from ${data.gitUrl}`,
    );

    // TODO: Implement git clone and S3 upload
  }
}
