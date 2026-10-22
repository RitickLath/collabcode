import { ApiClient } from "@/lib/axiosInstance"
import {
  CreateEntryPayload,
  FileContentResponse,
  FileTreeNodeData,
  RenameEntryPayload,
  UpdateContentPayload,
} from "@/types/ide"

export const FileExplorerService = {
  getTree: async (workspaceId: string): Promise<FileTreeNodeData> => {
    return ApiClient.get<FileTreeNodeData>(
      `/workspaces/${workspaceId}/file-tree`
    )
  },

  getFileContent: async (
    workspaceId: string,
    filePath: string
  ): Promise<FileContentResponse> => {
    return ApiClient.get<FileContentResponse>(
      `/workspaces/${workspaceId}/file?path=${encodeURIComponent(filePath)}`
    )
  },

  createEntry: async (
    workspaceId: string,
    payload: CreateEntryPayload
  ): Promise<{ message: string; path: string }> => {
    return ApiClient.post<{ message: string; path: string }>(
      `/workspaces/${workspaceId}/entry`,
      payload
    )
  },

  updateFileContent: async (
    workspaceId: string,
    payload: UpdateContentPayload
  ): Promise<{ message: string; path: string }> => {
    return ApiClient.put<{ message: string; path: string }>(
      `/workspaces/${workspaceId}/content`,
      payload
    )
  },

  renameEntry: async (
    workspaceId: string,
    payload: RenameEntryPayload
  ): Promise<{ message: string; oldPath: string; newPath: string }> => {
    return ApiClient.patch<{
      message: string
      oldPath: string
      newPath: string
    }>(`/workspaces/${workspaceId}/rename-entry`, payload)
  },

  deleteEntry: async (
    workspaceId: string,
    path: string
  ): Promise<{ message: string; path: string }> => {
    return ApiClient.delete<{ message: string; path: string }>(
      `/workspaces/${workspaceId}/entry?path=${encodeURIComponent(path)}`
    )
  },
}
