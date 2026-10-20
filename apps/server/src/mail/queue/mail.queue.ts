import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  MAIL_QUEUE_NAME,
  SEND_VERIFICATION_EMAIL_JOB,
  VerificationEmailJobData,
} from '../mail.types';

@Injectable()
export class MailQueue {
  private readonly logger = new Logger(MailQueue.name);

  constructor(
    @InjectQueue(MAIL_QUEUE_NAME)
    private readonly queue: Queue<VerificationEmailJobData>,
  ) {}

  async queueVerificationEmail(
    email: string,
    token: string,
    username: string,
  ): Promise<void> {
    this.logger.log(`Enqueuing verification email job for ${email}`);
    await this.queue.add(
      SEND_VERIFICATION_EMAIL_JOB,
      { email, token, username },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
