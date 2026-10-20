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

@Processor(WORKSPACE_QUEUE_NAME)
export class WorkspaceProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkspaceProcessor.name);

  async process(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === TEMPLATE_WORKSPACE_JOB) {
      const data = job.data as ITemplateWorkspaceJob;
      this.logger.log(
        `Setting up template workspace ${data.workspaceId} (${data.framework}) at ${data.s3Prefix}`,
      );
      // TODO: PROCESS THE TEMPLATE JOB (e.g. copy boilerplate to S3 and update workspace status to READY)
    }

    if (job.name === GIT_WORKSPACE_JOB) {
      const data = job.data as IGitWorkspaceJob;
      this.logger.log(
        `Setting up git workspace ${data.name} from ${data.gitUrl}`,
      );
      // TODO: PROCESS THE GIT JOB
    }
  }
}
