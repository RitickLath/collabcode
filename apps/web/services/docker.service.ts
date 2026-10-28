import { ApiClient } from "@/lib/axiosInstance"

export interface WorkspaceContainerResponse {
  id: string
  containerId: string
  containerName: string
  workspaceId: string
  userId: string
  image: string
  status: "STARTING" | "RUNNING" | "STOPPED" | "FAILED"
  lastActiveAt: string
  createdAt?: string
  updatedAt?: string
}

export const DockerService = {
  /**
   * Initialize or get the running container for the workspace
   */
  initContainer: async (
    workspaceId: string
  ): Promise<WorkspaceContainerResponse> => {
    const res: any = await ApiClient.post(
      `/docker/workspaces/${workspaceId}/init`
    )
    return res?.data ?? res
  },

  /**
   * Get the current status and health of a workspace container
   */
  getContainerStatus: async (
    workspaceId: string
  ): Promise<WorkspaceContainerResponse> => {
    const res: any = await ApiClient.get(
      `/docker/workspaces/${workspaceId}/status`
    )
    return res?.data ?? res
  },

  /**
   * Get forwarded ports and host URLs for a running container
   */
  getWorkspacePorts: async (workspaceId: string) => {
    const res: any = await ApiClient.get(
      `/docker/workspaces/${workspaceId}/ports`
    )
    return res?.data ?? res
  },

  /**
   * Stop a running workspace container
   */
  stopContainer: async (workspaceId: string) => {
    const res: any = await ApiClient.post(
      `/docker/workspaces/${workspaceId}/stop`
    )
    return res?.data ?? res
  },
}
