export interface VerificationEmailTemplateProps {
  username: string;
  verifyLink: string;
}

export function verificationEmailTemplate({
  username,
  verifyLink,
}: VerificationEmailTemplateProps): { subject: string; html: string } {
  return {
    subject: 'Verify your CollabCode email address',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
        <h2>Welcome to CollabCode, ${username}!</h2>
        <p>Thank you for signing up. Please verify your email address to activate your account:</p>
        <p style="margin: 24px 0;">
          <a href="${verifyLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Verify Email Address
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
        <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${verifyLink}</p>
        <p style="color: #888; font-size: 12px; margin-top: 32px;">This link expires in 24 hours.</p>
      </div>
    `,
  };
}
