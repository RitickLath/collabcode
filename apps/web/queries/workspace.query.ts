import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { WorkspaceService } from "@/services/workspace.service"
import {
  PaginatedWorkspacesResponse,
  GetWorkspacesParams,
  CreateWorkspaceTemplatePayload,
  CreateWorkspaceGitPayload,
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

  const createWithTemplate = useMutation({
    mutationFn: (payload: CreateWorkspaceTemplatePayload) =>
      WorkspaceService.createWithTemplate(payload),
    onSuccess: () => {
      toast.success("Workspace initialization started!")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create workspace")
    },
  })

  const createWithGit = useMutation({
    mutationFn: (payload: CreateWorkspaceGitPayload) =>
      WorkspaceService.createWithGit(payload),
    onSuccess: () => {
      toast.success("Workspace repository import initiated!")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to import workspace repository")
    },
  })

  return {
    createWithTemplate,
    createWithGit,
  }
}
