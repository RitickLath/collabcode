import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  GIT_WORKSPACE_JOB,
  IGitWorkspaceJob,
  ITemplateWorkspaceJob,
  TEMPLATE_WORKSPACE_JOB,
  WORKSPACE_QUEUE_NAME,
} from '../dto/workspace.types';

@Injectable()
export class WorkspaceQueue {
  constructor(
    @InjectQueue(WORKSPACE_QUEUE_NAME) private readonly queue: Queue,
  ) {}

  async addTemplateWorkspaceJob(payload: ITemplateWorkspaceJob) {
    return this.queue.add(TEMPLATE_WORKSPACE_JOB, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addGitWorkspaceJob(payload: IGitWorkspaceJob) {
    return this.queue.add(GIT_WORKSPACE_JOB, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}
