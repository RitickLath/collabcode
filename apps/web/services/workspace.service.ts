import { ApiClient } from "@/lib/axiosInstance"
import {
  WorkspaceItem,
  CreateWorkspaceTemplatePayload,
  CreateWorkspaceGitPayload,
} from "@/types/workspace"

export const WorkspaceService = {
  /**
   * Fetch all workspaces for the current user
   */
  getAllWorkspaces: async (): Promise<WorkspaceItem[]> => {
    try {
      const response: any = await ApiClient.get("/workspace")
      const data = response?.data ?? response
      return Array.isArray(data) ? data : []
    } catch {
      // Fallback if backend route is /project
      try {
        const response: any = await ApiClient.get("/project")
        const data = response?.data ?? response
        return Array.isArray(data) ? data : []
      } catch {
        return []
      }
    }
  },

  /**
   * Get single workspace details
   */
  getWorkspaceById: async (id: string): Promise<WorkspaceItem> => {
    try {
      const response: any = await ApiClient.get(`/workspace/${id}`)
      return response?.data ?? response
    } catch {
      const response: any = await ApiClient.get(`/project/${id}`)
      return response?.data ?? response
    }
  },

  /**
   * Create workspace from template
   */
  createWithTemplate: async (
    payload: CreateWorkspaceTemplatePayload
  ): Promise<any> => {
    try {
      const response = await ApiClient.post("/workspace", payload)
      return response
    } catch {
      return await ApiClient.post("/project", payload)
    }
  },

  /**
   * Create workspace by importing git repository
   */
  createWithGit: async (payload: CreateWorkspaceGitPayload): Promise<any> => {
    try {
      const response = await ApiClient.post("/workspace/git", payload)
      return response
    } catch {
      return await ApiClient.post("/project/git", payload)
    }
  },
}
