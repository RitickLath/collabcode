import { ApiClient } from "@/lib/axiosInstance"
import {
  WorkspaceItem,
  PaginatedWorkspacesResponse,
  GetWorkspacesParams,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
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
   * Unified create workspace (Template or Git)
   */
  createWorkspace: async (payload: CreateWorkspacePayload): Promise<any> => {
    return ApiClient.post("/workspace", payload)
  },

  /**
   * Delete workspace
   */
  deleteWorkspace: async (id: string): Promise<void> => {
    return ApiClient.delete(`/workspace/${id}`)
  },

  /**
   * Update workspace (name, description, visibility)
   */
  updateWorkspace: async (
    id: string,
    payload: UpdateWorkspacePayload
  ): Promise<any> => {
    return ApiClient.patch(`/workspace/${id}`, payload)
  },

  /**
   * Get pending invitations for the current user
   */
  getMyPendingInvites: async (): Promise<any[]> => {
    try {
      const response: any = await ApiClient.get("/workspace/invites/my-invites")
      return response?.data ?? response ?? []
    } catch {
      return []
    }
  },

  /**
   * Accept an invitation using its token
   */
  acceptInvite: async (token: string): Promise<any> => {
    return ApiClient.post("/workspace/invites/accept", { token })
  },

  /**
   * Reject an invitation using its token
   */
  rejectInvite: async (token: string): Promise<any> => {
    return ApiClient.post("/workspace/invites/reject", { token })
  },

  /**
   * Send an invitation email to a user for a specific workspace
   */
  sendInvite: async (
    workspaceId: string,
    payload: { email: string; role?: "EDITOR" | "VIEWER" }
  ): Promise<any> => {
    return ApiClient.post(`/workspace/${workspaceId}/invites`, payload)
  },

  /**
   * Get all active/pending invitations for a workspace (owner only)
   */
  getWorkspaceInvites: async (workspaceId: string): Promise<any[]> => {
    try {
      const response: any = await ApiClient.get(
        `/workspace/${workspaceId}/invites`
      )
      return response?.data ?? response ?? []
    } catch {
      return []
    }
  },

  /**
   * Revoke a pending workspace invitation
   */
  revokeInvite: async (workspaceId: string, inviteId: string): Promise<any> => {
    return ApiClient.delete(`/workspace/${workspaceId}/invites/${inviteId}`)
  },

  /**
   * Remove a member from a workspace
   */
  removeMember: async (workspaceId: string, memberId: string): Promise<any> => {
    return ApiClient.delete(`/workspace/${workspaceId}/members/${memberId}`)
  },
}
