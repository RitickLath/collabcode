export interface WorkspaceInviteEmailTemplateProps {
  workspaceName: string;
  inviterName: string;
  inviteLink: string;
  role: string;
}

export function workspaceInviteEmailTemplate({
  workspaceName,
  inviterName,
  inviteLink,
  role,
}: WorkspaceInviteEmailTemplateProps): { subject: string; html: string } {
  return {
    subject: `You've been invited to join ${workspaceName} on CollabCode`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; color: #111;">
        <h2>Workspace Invitation</h2>
        <p><strong>${inviterName}</strong> has invited you to join the workspace <strong>${workspaceName}</strong> as a <strong>${role}</strong> on CollabCode.</p>
        <p style="margin: 24px 0;">
          <a href="${inviteLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Accept Invitation
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
        <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${inviteLink}</p>
        <p style="color: #888; font-size: 12px; margin-top: 32px;">If you weren't expecting this invitation, you can safely ignore this email.</p>
      </div>
    `,
  };
}
