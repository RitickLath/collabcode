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

export const useGetWorkspaceByIdQuery = (id?: string) => {
  return useQuery({
    queryKey: ["workspace", id],
    queryFn: () => (id ? WorkspaceService.getWorkspaceById(id) : null),
    enabled: Boolean(id),
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

export const useGetMyPendingInvitesQuery = () => {
  return useQuery({
    queryKey: ["my-pending-invites"],
    queryFn: () => WorkspaceService.getMyPendingInvites(),
  })
}

export const useAcceptInviteMutation = () => {
  const queryClient = useQueryClient()

  const acceptInvite = useMutation({
    mutationFn: (token: string) => WorkspaceService.acceptInvite(token),
    onSuccess: (data) => {
      toast.success(data?.message || "Invitation accepted!")
      queryClient.invalidateQueries({ queryKey: ["my-pending-invites"] })
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to accept invitation"
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    },
  })

  return {
    acceptInvite,
  }
}

export const useRejectInviteMutation = () => {
  const queryClient = useQueryClient()

  const rejectInvite = useMutation({
    mutationFn: (token: string) => WorkspaceService.rejectInvite(token),
    onSuccess: (data) => {
      toast.success(data?.message || "Invitation declined")
      queryClient.invalidateQueries({ queryKey: ["my-pending-invites"] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to decline invitation"
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    },
  })

  return {
    rejectInvite,
  }
}

export const useGetWorkspaceInvitesQuery = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["workspace-invites", workspaceId],
    queryFn: () =>
      workspaceId ? WorkspaceService.getWorkspaceInvites(workspaceId) : [],
    enabled: Boolean(workspaceId),
  })
}

export const useSendWorkspaceInviteMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()

  const sendInvite = useMutation({
    mutationFn: (payload: { email: string; role?: "EDITOR" | "VIEWER" }) =>
      WorkspaceService.sendInvite(workspaceId, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Invitation sent successfully!")
      queryClient.invalidateQueries({
        queryKey: ["workspace-invites", workspaceId],
      })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send invitation"
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    },
  })

  return {
    sendInvite,
  }
}

export const useRevokeInviteMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()

  const revokeInvite = useMutation({
    mutationFn: (inviteId: string) =>
      WorkspaceService.revokeInvite(workspaceId, inviteId),
    onSuccess: (data) => {
      toast.success(data?.message || "Invitation revoked")
      queryClient.invalidateQueries({
        queryKey: ["workspace-invites", workspaceId],
      })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to revoke invitation"
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    },
  })

  return {
    revokeInvite,
  }
}

export const useRemoveMemberMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()

  const removeMember = useMutation({
    mutationFn: (memberId: string) =>
      WorkspaceService.removeMember(workspaceId, memberId),
    onSuccess: (data) => {
      toast.success(data?.message || "Member removed from workspace")
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to remove member"
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    },
  })

  return {
    removeMember,
  }
}
