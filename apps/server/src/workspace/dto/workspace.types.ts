export const WORKSPACE_QUEUE_NAME = 'workspace-queue';

export const TEMPLATE_WORKSPACE_JOB = 'template-workspace-job';
export const GIT_WORKSPACE_JOB = 'git-workspace-job';

export interface ITemplateWorkspaceJob {
  workspaceId: string;
  userId: string;
  name: string;
  framework: string;
  s3Bucket: string;
  s3Prefix: string;
}

export interface IGitWorkspaceJob {
  workspaceId: string;
  userId: string;
  name: string;
  gitUrl: string;
  s3Bucket: string;
  s3Prefix: string;
}
