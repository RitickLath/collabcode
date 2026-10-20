import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from '../mail.service';
import {
  MAIL_QUEUE_NAME,
  SEND_VERIFICATION_EMAIL_JOB,
  VerificationEmailJobData,
} from '../mail.types';

@Processor(MAIL_QUEUE_NAME)
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<VerificationEmailJobData>): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case SEND_VERIFICATION_EMAIL_JOB: {
        const { email, token, username } = job.data;
        await this.mailService.sendVerificationEmail(email, token, username);
        break;
      }
      default: {
        this.logger.warn(`Unknown job name: ${job.name}`);
      }
    }
  }
}
