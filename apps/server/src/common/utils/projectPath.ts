import path from 'path';

export const getProjectPath = (projectId?: string) => {
  if (projectId == null) {
    return path.join(process.cwd(), 'code-runner-workspaces');
  }

  return path.join(process.cwd(), 'code-runner-workspaces', projectId);
};

export const resolveCommandPath = (command: string, projectId: string) => {
  const projectDir = getProjectPath(projectId);
  return {
    projectDir,
    cmd: command.replace(/\.\//g, `"${projectDir}"`),
  };
};
