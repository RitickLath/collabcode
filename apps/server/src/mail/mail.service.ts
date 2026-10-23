import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  verificationEmailTemplate,
  workspaceInviteEmailTemplate,
  WorkspaceInviteEmailTemplateProps,
} from './templates';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  async sendVerificationEmail(email: string, token: string, username: string) {
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const verifyLink = `${clientUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    this.logger.log(`Sending verification email to ${email} (${username})`);

    const { subject, html } = verificationEmailTemplate({
      username,
      verifyLink,
    });

    try {
      const from = this.configService.get<string>('SMTP_FROM')!;

      await this.transporter.sendMail({
        from,
        to: email,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}:`,
        error,
      );
      throw error;
    }
  }

  async sendWorkspaceInviteEmail(
    email: string,
    params: Omit<WorkspaceInviteEmailTemplateProps, 'inviteLink'> & {
      token: string;
    },
  ) {
    const clientUrl = this.configService.get<string>('CLIENT_URL')!;
    const inviteLink = `${clientUrl}/invite?token=${params.token}&email=${encodeURIComponent(email)}`;

    this.logger.log(`Sending workspace invite email to ${email}`);

    const { subject, html } = workspaceInviteEmailTemplate({
      workspaceName: params.workspaceName,
      inviterName: params.inviterName,
      role: params.role,
      inviteLink,
    });

    try {
      const from = this.configService.get<string>('SMTP_FROM')!;

      await this.transporter.sendMail({
        from,
        to: email,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send workspace invite email to ${email}:`,
        error,
      );
      throw error;
    }
  }
}
