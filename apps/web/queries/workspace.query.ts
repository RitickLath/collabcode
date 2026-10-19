import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { WorkspaceService } from "@/services/workspace.service"
import {
  WorkspaceItem,
  CreateWorkspaceTemplatePayload,
  CreateWorkspaceGitPayload,
} from "@/types/workspace"
import { toast } from "sonner"

export const useGetWorkspacesQuery = () => {
  return useQuery<WorkspaceItem[]>({
    queryKey: ["workspaces"],
    queryFn: () => WorkspaceService.getAllWorkspaces(),
    refetchInterval: 10000, // Poll occasionally to update CREATING -> READY status
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
