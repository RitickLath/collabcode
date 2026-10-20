import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailService } from './mail.service';
import { MailQueue } from './queue/mail.queue';
import { MailProcessor } from './queue/mail.processor';
import { MAIL_QUEUE_NAME } from './mail.types';

@Module({
  imports: [
    BullModule.registerQueue({
      name: MAIL_QUEUE_NAME,
    }),
  ],
  providers: [MailService, MailQueue, MailProcessor],
  exports: [MailQueue],
})
export class MailModule {}
