import { ApiClient } from "@/lib/axiosInstance"
import {
  WorkspaceItem,
  PaginatedWorkspacesResponse,
  GetWorkspacesParams,
  CreateWorkspaceTemplatePayload,
  CreateWorkspaceGitPayload,
} from "@/types/workspace"

export const WorkspaceService = {
  /**
   * Fetch paginated workspaces for the current user
   */
  getAllWorkspaces: async (
    params?: GetWorkspacesParams
  ): Promise<PaginatedWorkspacesResponse> => {
    try {
      const response: any = await ApiClient.get("/workspace", {
        page: params?.page ?? 1,
        limit: params?.limit ?? 6,
        role: params?.role,
        search: params?.search,
      })

      const data = response?.data ?? response

      // Handle paginated response
      if (data && Array.isArray(data.items)) {
        return data as PaginatedWorkspacesResponse
      }

      // Handle legacy flat array fallback
      if (Array.isArray(data)) {
        return {
          items: data,
          meta: {
            page: 1,
            limit: data.length,
            total: data.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }
      }

      return {
        items: [],
        meta: {
          page: 1,
          limit: 6,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }
    } catch {
      return {
        items: [],
        meta: {
          page: 1,
          limit: 6,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
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
