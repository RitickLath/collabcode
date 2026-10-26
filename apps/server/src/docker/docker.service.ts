import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import Docker from 'dockerode';
import {
  ContainerStatus,
  ProjectTemplate,
  WorkspaceStatus,
} from 'generated/prisma/enums';
import path from 'path';
import { getProjectPath } from 'src/common/utils/projectPath';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);
  docker: Docker;

  constructor(private prisma: PrismaService) {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  /**
   * Pull a Docker image
   */
  async pullImage(image: string) {
    // Check if image is already present in the machine
    const images = await this.docker.listImages();
    const imageExists = images.some((img) => img.RepoTags?.includes(image));
    if (imageExists) {
      this.logger.log(`[Docker] Image ${image} already cached locally.`);
      return;
    }
    // Only pull if image is not present
    this.logger.log(`[Docker] Pulling image ${image} from registry...`);
    return new Promise((resolve, reject) => {
      this.docker.pull(image, (err: any, stream: any) => {
        if (err) return reject(err);
        // follow progress of pulling image
        this.docker.modem.followProgress(stream, (err: any, res: any) => {
          if (err) return reject(err);
          this.logger.log(`[Docker] Successfully pulled image ${image}`);
          resolve(res);
        });
      });
    });
  }

  /**
   * Inspect container to get its current state ('running', 'exited', 'not_found', etc.)
   */
  async getContainerStatus(containerId: string) {
    const container = this.docker.getContainer(containerId);
    const status = await container.inspect();
    return status;
  }

  /**
   * Start a stopped workspace container
   */
  async startWorkspaceContainer(containerId: string) {
    const container = this.docker.getContainer(containerId);
    await container.start();
  }

  /**
   * Resolve Docker image based on workspace template/framework
   */
  getImageFileForFramework(framework: ProjectTemplate | string): string {
    const FRAMEWORK_IMAGES: Record<string, string> = {
      [ProjectTemplate.NODE]: 'node:20-alpine',
      [ProjectTemplate.REACT]: 'node:20-alpine',
      [ProjectTemplate.NEXTJS]: 'node:20-alpine',
      [ProjectTemplate.NESTJS]: 'node:20-alpine',
      [ProjectTemplate.EXPRESSJS]: 'node:20-alpine',
      [ProjectTemplate.VITE]: 'node:20-alpine',
      [ProjectTemplate.TURBOREPO]: 'node:20-alpine',
      [ProjectTemplate.PYTHON]: 'python:3.11-alpine',
      [ProjectTemplate.FASTAPI]: 'python:3.11-alpine',
    };

    return FRAMEWORK_IMAGES[framework] || 'node:20-alpine';
  }

  /**
   * Initialize Dockerode connection / verify docker daemon is accessible
   */
  async initDocker(workspaceId: string, userId: string) {
    this.logger.log(
      `[InitDocker] Starting initialization for workspace ${workspaceId} (requested by user ${userId})`,
    );

    // 0. Authorization check: verify workspace exists and requesting user is owner or member
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
    });

    if (!workspace) {
      this.logger.warn(
        `[InitDocker] Access denied or workspace not found for ${workspaceId} (user ${userId})`,
      );
      throw new ForbiddenException(
        'You do not have access to this workspace or it does not exist',
      );
    }

    const containerName = `collabcode-runner-${workspaceId}`;

    // 1. Direct Docker check: Check if container exists in Docker by its deterministic name
    try {
      this.logger.log(
        `[InitDocker] Checking Docker daemon for "${containerName}"...`,
      );
      const dockerContainer = this.docker.getContainer(containerName);
      const dockerStatus = await dockerContainer.inspect();

      if (dockerStatus.State.Running) {
        this.logger.log(
          `[InitDocker] Container "${containerName}" is already RUNNING in Docker. Updating DB & returning.`,
        );
        const updated = await this.prisma.workspaceContainer.upsert({
          where: { workspaceId },
          update: { lastActiveAt: new Date(), status: ContainerStatus.RUNNING },
          create: {
            containerId: dockerStatus.Id,
            containerName,
            workspaceId,
            userId,
            image: dockerStatus.Config.Image,
            status: ContainerStatus.RUNNING,
          },
        });
        return updated;
      }

      // If it exists in Docker but is stopped, restart it immediately
      this.logger.log(
        `[InitDocker] Container "${containerName}" exists in Docker but is STOPPED. Restarting...`,
      );
      await dockerContainer.start();
      const updated = await this.prisma.workspaceContainer.upsert({
        where: { workspaceId },
        update: { lastActiveAt: new Date(), status: ContainerStatus.RUNNING },
        create: {
          containerId: dockerStatus.Id,
          containerName,
          workspaceId,
          userId,
          image: dockerStatus.Config.Image,
          status: ContainerStatus.RUNNING,
        },
      });
      this.logger.log(
        `[InitDocker] Successfully restarted "${containerName}". Returning.`,
      );
      return updated;
    } catch (err: any) {
      this.logger.log(
        `[InitDocker] Container "${containerName}" not found in Docker. Proceeding to creation.`,
      );
      // Clean up any stale DB record that points to a non-existent Docker container
      await this.prisma.workspaceContainer.deleteMany({
        where: { workspaceId },
      });
    }

    // 2. Resolve the Docker image for the framework (workspace already verified)
    const image = this.getImageFileForFramework(workspace.framework);
    this.logger.log(
      `[InitDocker] Step 2: Resolved image ${image} for framework ${workspace.framework}`,
    );
    await this.pullImage(image);

    // 3. Resolve the absolute host path for mounting:
    const hostPath = getProjectPath(workspace.id);
    this.logger.log(
      `[InitDocker] Step 3: Resolved host workspace mount path: ${hostPath}`,
    );

    // 4. Create container via Dockerode
    this.logger.log(
      `[InitDocker] Step 4: Creating container ${containerName} with bind mount...`,
    );
    const newContainer = await this.docker.createContainer({
      name: containerName,
      Image: image,
      HostConfig: {
        Binds: [`${hostPath}:/workspace:rw`],
      },
      WorkingDir: '/workspace',
      Tty: true,
      OpenStdin: true,
      Cmd: ['/bin/sh'],
    });
    this.logger.log(
      `[InitDocker] Container created with ID: ${newContainer.id}`,
    );

    // 5. Start the container
    this.logger.log(
      `[InitDocker] Step 5: Starting container ${newContainer.id}...`,
    );
    await newContainer.start();
    this.logger.log(`[InitDocker] Container started successfully.`);

    // 6. Create or update the WorkspaceContainer record in the database
    this.logger.log(
      `[InitDocker] Step 6: Saving container record to database...`,
    );
    const created = await this.prisma.workspaceContainer.create({
      data: {
        containerId: newContainer.id,
        containerName,
        workspaceId,
        userId,
        image,
        status: ContainerStatus.RUNNING,
      },
    });
    this.logger.log(
      `[InitDocker] Container initialization complete for workspace ${workspaceId}!`,
    );
    return created;
  }

  /**
   * Get an existing running container or create & start one for the workspace
   */
  async getOrCreateWorkspaceContainer(workspaceId: string, userId: string) {
    return await this.initDocker(workspaceId, userId);
  }

  /**
   * Stop a running workspace container
   */
  async stopContainer(workspaceId: string) {
    const containerRecord = await this.prisma.workspaceContainer.findUnique({
      where: { workspaceId },
    });
    if (!containerRecord) return null;

    try {
      const container = this.docker.getContainer(containerRecord.containerId);
      await container.stop();
    } catch (error) {}

    return await this.prisma.workspaceContainer.update({
      where: { id: containerRecord.id },
      data: { status: ContainerStatus.STOPPED },
    });
  }

  /**
   * Create an interactive TTY exec instance inside the workspace container
   * (Used by DockerGateway / terminal socket)
   */
  async createTerminalExec(
    workspaceId: string,
    options?: { cols?: number; rows?: number; cmd?: string[] },
  ) {
    // TODO: container.exec({ AttachStdin: true, AttachStdout: true, Tty: true, ... })
  }
}
