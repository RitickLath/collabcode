import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  GIT_WORKSPACE_JOB,
  IGitWorkspaceJob,
  IS3CleanUpJob,
  ITemplateWorkspaceJob,
  S3_CLEANUP_JOB,
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

  async addS3CleanUpJob(payload: IS3CleanUpJob) {
    return this.queue.add(S3_CLEANUP_JOB, payload, {
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
