export interface VerificationEmailJobData {
  email: string;
  token: string;
  username: string;
}

export const MAIL_QUEUE_NAME = 'mail-queue';
export const SEND_VERIFICATION_EMAIL_JOB = 'send-verification-email';
