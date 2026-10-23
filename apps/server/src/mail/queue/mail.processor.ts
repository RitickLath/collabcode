import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from '../mail.service';
import {
  MAIL_QUEUE_NAME,
  MailJobData,
  SEND_VERIFICATION_EMAIL_JOB,
  SEND_WORKSPACE_INVITE_EMAIL_JOB,
  VerificationEmailJobData,
  WorkspaceInviteEmailJobData,
} from '../mail.types';

@Processor(MAIL_QUEUE_NAME)
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<MailJobData>): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case SEND_VERIFICATION_EMAIL_JOB: {
        const { email, token, username } = job.data as VerificationEmailJobData;
        await this.mailService.sendVerificationEmail(email, token, username);
        break;
      }
      case SEND_WORKSPACE_INVITE_EMAIL_JOB: {
        const { email, token, workspaceName, inviterName, role } =
          job.data as WorkspaceInviteEmailJobData;
        await this.mailService.sendWorkspaceInviteEmail(email, {
          token,
          workspaceName,
          inviterName,
          role,
        });
        break;
      }

      default: {
        this.logger.warn(`Unknown job name: ${job.name}`);
      }
    }
  }
}
