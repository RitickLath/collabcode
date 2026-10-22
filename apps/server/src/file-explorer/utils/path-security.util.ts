import { ForbiddenException } from '@nestjs/common';
import path from 'path';

/**
 * Resolves a workspaceId-prefixed relative path to its absolute filesystem path,
 * ensuring it stays strictly within the workspace directory.
 */
export function resolveSafeWorkspacePath(
  projectDir: string,
  relativePath: string = '',
): string {
  // projectDir is: .../code-runner-workspaces/<workspaceId>
  // workspaceRoot is: .../code-runner-workspaces
  const workspacesRoot = path.dirname(projectDir);

  // relativePath is: <workspaceId>/path/to/file.ext
  // resolved is: .../code-runner-workspaces/<workspaceId>/path/to/file.ext
  const resolved = path.resolve(workspacesRoot, relativePath);

  // Security guard: Ensure resolved path is strictly inside projectDir
  if (!resolved.startsWith(projectDir)) {
    throw new ForbiddenException(
      'Access denied: path escapes workspace sandbox',
    );
  }

  return resolved;
}
