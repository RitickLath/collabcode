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
import { Duplex } from 'stream';

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);
  docker: Docker;
  private terminalStreams = new Map<string, Duplex>();

  // Store terminal history per workspace
  private terminalHistories = new Map<string, string>();
  // Limit history size to e.g. 50KB to prevent memory leaks
  private readonly MAX_HISTORY_LENGTH = 50000;

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
    let targetContainer: Docker.Container;
    let targetContainerId: string;

    try {
      const newContainer = await this.docker.createContainer({
        name: containerName,
        Image: image,
        ExposedPorts: {
          '3000/tcp': {},
          '3001/tcp': {},
          '5173/tcp': {},
          '8080/tcp': {},
        },
        HostConfig: {
          Binds: [`${hostPath}:/workspace:rw`],
          PortBindings: {
            '3000/tcp': [{ HostPort: '0' }], // '0' tells docker to pick a random available port
            '3001/tcp': [{ HostPort: '0' }],
            '5173/tcp': [{ HostPort: '0' }],
            '8080/tcp': [{ HostPort: '0' }],
          },
        },
        WorkingDir: '/workspace',
        Tty: true,
        OpenStdin: true,
        Cmd: ['/bin/sh'],
      });
      targetContainer = newContainer;
      targetContainerId = newContainer.id;
      this.logger.log(
        `[InitDocker] Container created with ID: ${targetContainerId}`,
      );

      // 5. Start the container
      this.logger.log(
        `[InitDocker] Step 5: Starting container ${targetContainerId}...`,
      );
      await targetContainer.start();
      this.logger.log(`[InitDocker] Container started successfully.`);
    } catch (createErr: any) {
      // If container already exists due to parallel creation race (HTTP 409), reuse it
      if (createErr.statusCode === 409) {
        this.logger.warn(
          `[InitDocker] Container ${containerName} already created by concurrent request. Reusing.`,
        );
        targetContainer = this.docker.getContainer(containerName);
        const info = await targetContainer.inspect();
        targetContainerId = info.Id;
        if (!info.State.Running) {
          await targetContainer.start();
        }
      } else {
        throw createErr;
      }
    }

    // 6. Create or update the WorkspaceContainer record in the database
    this.logger.log(
      `[InitDocker] Step 6: Saving container record to database...`,
    );
    const created = await this.prisma.workspaceContainer.upsert({
      where: { workspaceId },
      update: {
        containerId: targetContainerId,
        containerName,
        status: ContainerStatus.RUNNING,
        lastActiveAt: new Date(),
      },
      create: {
        containerId: targetContainerId,
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
   * Get mapped host ports and preview URLs for a running workspace container
   */
  async getWorkspacePorts(workspaceId: string) {
    const container = this.docker.getContainer(
      `collabcode-runner-${workspaceId}`,
    );

    try {
      const inspect = await container.inspect();
      const rawPorts = inspect.NetworkSettings?.Ports || {};

      const forwardedPorts: {
        containerPort: number;
        hostPort: number;
        url: string;
      }[] = [];

      // raw ports:- {"3000/tcp": [{ HostIp: "0.0.0.0", HostPort: "55000" }] }
      for (const [containerSpec, bindings] of Object.entries(rawPorts)) {
        if (bindings && bindings.length > 0) {
          const containerPort = parseInt(containerSpec.split('/')[0], 10);
          const hostPort = parseInt(bindings[0].HostPort, 10);

          forwardedPorts.push({
            containerPort,
            hostPort,
            url: `http://localhost:${hostPort}`,
          });
        }
      }

      return forwardedPorts.sort((a, b) => a.containerPort - b.containerPort);
    } catch (err) {
      this.logger.warn(
        `[GetWorkspacePorts] Failed to inspect container for workspace ${workspaceId}`,
      );
      return [];
    }
  }

  getTerminalHistory(workspaceId: string): string {
    return this.terminalHistories.get(workspaceId) || '';
  }

  async createTerminalExec(
    workspaceId: string,
    onOutput: (chunk: string) => void,
  ) {
    // If a stream already exists for this workspace, don't create a new one.
    if (this.terminalStreams.has(workspaceId)) {
      return;
    }

    try {
      const container = this.docker.getContainer(
        `collabcode-runner-${workspaceId}`,
      );

      await container.inspect();

      // 1. Create an exec instance
      const execInstance = await container.exec({
        AttachStdin: true,
        AttachStdout: true,
        Tty: true,
        Cmd: ['/bin/sh'],
      });

      // 2. Attach a Duplex stream to the exec instance
      const stream: Duplex = await execInstance.start({
        hijack: true,
        stdin: true,
        Tty: true,
      });

      // 3. Save the Duplex stream in our map
      this.terminalStreams.set(workspaceId, stream);

      // 4. Handle incoming data from the container & forward it to the client
      stream.on('data', (chunk: Buffer) => {
        // Accumulate history with a max cap
        const text = chunk.toString('utf-8');

        const currentHistory = this.terminalHistories.get(workspaceId) || '';
        const updatedHistory = (currentHistory + text).slice(
          -this.MAX_HISTORY_LENGTH,
        );
        this.terminalHistories.set(workspaceId, updatedHistory);

        onOutput(text);
      });

      // 5. Handle stream-end / container-disconnect
      stream.on('close', () => {
        this.logger.log(
          `[Terminal] Stream closed for workspace ${workspaceId}`,
        );
        this.terminalStreams.delete(workspaceId);
        this.terminalHistories.delete(workspaceId);
      });

      // 6. Handle any other errors
      stream.on('error', (err: Error) => {
        this.logger.error(
          `[Terminal] Stream error for workspace ${workspaceId}:`,
          err,
        );
        this.terminalStreams.delete(workspaceId);
        this.terminalHistories.delete(workspaceId);
      });
    } catch (error) {
      console.log({ error });
    }
  }

  async writeToTerminal(workspaceId: string, data: string) {
    this.terminalStreams.get(workspaceId)?.write(data);
  }
}
