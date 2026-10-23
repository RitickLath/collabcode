export interface VerificationEmailJobData {
  email: string;
  token: string;
  username: string;
}

export interface WorkspaceInviteEmailJobData {
  email: string;
  token: string;
  workspaceName: string;
  inviterName: string;
  role: string;
}

export type MailJobData =
  VerificationEmailJobData | WorkspaceInviteEmailJobData;

export const MAIL_QUEUE_NAME = 'mail-queue';

export const SEND_VERIFICATION_EMAIL_JOB = 'send-verification-email';
export const SEND_WORKSPACE_INVITE_EMAIL_JOB = 'send-workspace-invite-email';
