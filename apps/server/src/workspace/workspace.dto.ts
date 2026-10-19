export class CreateWorkspaceTemplateDto {
  name: string;
  framework: string;
  description?: string;
}

export class CreateWorkspaceGitDto {
  name: string;
  gitUrl: string;
  description?: string;
}
