import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  GIT_WORKSPACE_JOB,
  IGitWorkspaceJob,
  ITemplateWorkspaceJob,
  TEMPLATE_WORKSPACE_JOB,
  WORKSPACE_QUEUE_NAME,
} from '../dto/workspace.types';
import { WorkspaceWorkerService } from './workspace-worker.service';

@Processor(WORKSPACE_QUEUE_NAME)
export class WorkspaceProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkspaceProcessor.name);

  constructor(private readonly workspaceWorkerService: WorkspaceWorkerService) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case TEMPLATE_WORKSPACE_JOB: {
        const data = job.data as ITemplateWorkspaceJob;
        await this.workspaceWorkerService.processTemplateWorkspace(data);
        break;
      }
      case GIT_WORKSPACE_JOB: {
        const data = job.data as IGitWorkspaceJob;
        await this.workspaceWorkerService.processGitWorkspace(data);
        break;
      }
      default: {
        this.logger.warn(`Unknown job name: ${job.name}`);
      }
    }
  }
}
