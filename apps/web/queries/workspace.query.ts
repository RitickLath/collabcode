import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { WorkspaceService } from "@/services/workspace.service"
import {
  PaginatedWorkspacesResponse,
  GetWorkspacesParams,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
} from "@/types/workspace"
import { toast } from "sonner"

export const useGetWorkspacesQuery = (params?: GetWorkspacesParams) => {
  return useQuery<PaginatedWorkspacesResponse>({
    queryKey: [
      "workspaces",
      params?.page,
      params?.limit,
      params?.role,
      params?.search,
    ],
    queryFn: () => WorkspaceService.getAllWorkspaces(params),
    // Only poll if at least one workspace is currently in "CREATING" status
    refetchInterval: (query) => {
      const data = query.state.data as PaginatedWorkspacesResponse | undefined
      const hasPending = data?.items?.some((w) => w.status === "CREATING")
      return hasPending ? 3000 : false
    },
  })
}

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient()

  const createWorkspace = useMutation({
    mutationFn: (payload: CreateWorkspacePayload) =>
      WorkspaceService.createWorkspace(payload),
    onSuccess: () => {
      toast.success("Workspace initialization started!")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create workspace")
    },
  })

  return {
    createWorkspace,
  }
}

export const useDeleteWorkspaceMutation = () => {
  const queryClient = useQueryClient()

  const deleteWorkspace = useMutation({
    mutationFn: (id: string) => WorkspaceService.deleteWorkspace(id),
    onSuccess: () => {
      toast.success("Workspace deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete workspace")
    },
  })

  return {
    deleteWorkspace,
  }
}

export const useUpdateWorkspaceMutation = () => {
  const queryClient = useQueryClient()

  const updateWorkspace = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateWorkspacePayload
    }) => WorkspaceService.updateWorkspace(id, payload),
    onSuccess: () => {
      toast.success("Workspace updated successfully")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update workspace")
    },
  })

  return {
    updateWorkspace,
  }
}
