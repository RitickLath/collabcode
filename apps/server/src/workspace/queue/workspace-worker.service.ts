import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  ITemplateWorkspaceJob,
  IGitWorkspaceJob,
  IS3CleanUpJob,
} from '../dto/workspace.types';
import { execAsync } from 'src/common/utils/exec';
import {
  getProjectPath,
  resolveCommandPath,
} from 'src/common/utils/projectPath';
import * as fs from 'fs/promises';

@Injectable()
export class WorkspaceWorkerService {
  private readonly logger = new Logger(WorkspaceWorkerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Provisions a workspace based on a starter framework template:
   * 1. Creates local project directory recursively
   * 2. Scaffolds framework files using non-interactive command from .env
   * 3. Updates workspace status to READY (or ERROR on failure)
   */
  async processTemplateWorkspace(data: ITemplateWorkspaceJob): Promise<void> {
    const projectDir = getProjectPath(data.workspaceId);

    this.logger.log(
      `Starting template provisioning for workspace: ${data.workspaceId} (${data.framework}) at ${projectDir}`,
    );

    try {
      // 1. Ensure project directory exists
      await fs.mkdir(projectDir, { recursive: true });

      // 2. Resolve non-interactive scaffold command from .env
      const envKey = `CMD_TEMPLATE_${data.framework.toUpperCase()}`;
      const scaffoldCmd = this.configService.get<string>(envKey);

      if (scaffoldCmd) {
        const { cmd, projectDir: targetDir } = resolveCommandPath(
          scaffoldCmd,
          data.workspaceId,
        );
        this.logger.log(`Executing scaffolding command: ${cmd}`);

        const { stdout, stderr } = await execAsync(cmd, {
          cwd: process.cwd(),
        });
        if (stdout) this.logger.debug(stdout);
        if (stderr) this.logger.warn(stderr);
      } else {
        // Fallback for Python / FastAPI or other templates without an npx CLI
        await this.fallbackScaffold(data.framework, projectDir);
      }

      // 3. Mark workspace status as READY in database
      await this.prisma.workspace.update({
        where: { id: data.workspaceId },
        data: { status: 'READY' },
      });

      this.logger.log(
        `Workspace ${data.workspaceId} provisioned successfully!`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to provision workspace ${data.workspaceId}: ${error.message}`,
        error.stack,
      );

      // On failure, mark workspace status as ERROR
      await this.prisma.workspace.update({
        where: { id: data.workspaceId },
        data: { status: 'ERROR' },
      });
      throw error;
    }
  }

  /**
   * Fallback file generator for frameworks (like Python/FastAPI) that don't need interactive CLI generators.
   */
  private async fallbackScaffold(
    framework: string,
    projectDir: string,
  ): Promise<void> {
    const normalized = framework.toUpperCase();

    if (normalized === 'FASTAPI') {
      await fs.writeFile(
        `${projectDir}/main.py`,
        `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"message": "Hello from FastAPI!"}\n`,
      );
      await fs.writeFile(
        `${projectDir}/requirements.txt`,
        `fastapi\nuvicorn[standard]\n`,
      );
    } else if (normalized === 'PYTHON') {
      await fs.writeFile(
        `${projectDir}/main.py`,
        `# Python Application\nprint("Hello, World!")\n`,
      );
      await fs.writeFile(`${projectDir}/requirements.txt`, ``);
    } else {
      // Generic fallback: empty package.json
      await fs.writeFile(
        `${projectDir}/package.json`,
        JSON.stringify(
          {
            name: 'workspace',
            version: '1.0.0',
            private: true,
          },
          null,
          2,
        ),
      );
    }
  }

  /**
   * Provisions a workspace by cloning a remote Git repository:
   * 1. Creates local project directory recursively
   * 2. Clones the remote repository into projectDir
   * 3. Updates workspace status to READY (or ERROR on failure)
   */
  async processGitWorkspace(data: IGitWorkspaceJob): Promise<void> {
    const projectDir = getProjectPath(data.workspaceId);
    this.logger.log(
      `Starting git provisioning for workspace: ${data.workspaceId} from ${data.gitUrl} at ${projectDir}`,
    );

    try {
      await fs.mkdir(projectDir, { recursive: true });

      // Clone git repository non-interactively into current project directory
      await execAsync(`git clone ${data.gitUrl} .`, {
        cwd: projectDir,
      });

      await this.prisma.workspace.update({
        where: { id: data.workspaceId },
        data: { status: 'READY' },
      });

      this.logger.log(`Git workspace ${data.workspaceId} cloned and ready!`);
    } catch (error) {
      this.logger.error(
        `Failed to clone git workspace ${data.workspaceId}: ${error.message}`,
        error.stack,
      );

      await this.prisma.workspace.update({
        where: { id: data.workspaceId },
        data: { status: 'ERROR' },
      });
      throw error;
    }
  }

  /**
   * Processes S3 cleanup job: marks workspace as deletable in database
   */
  async processS3CleanUpJob(data: IS3CleanUpJob) {}
}
