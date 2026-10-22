import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FileExplorerService } from "@/services/fileExplorer.service"
import {
  CreateEntryPayload,
  FileContentResponse,
  FileTreeNodeData,
  RenameEntryPayload,
  UpdateContentPayload,
} from "@/types/ide"
import { toast } from "sonner"

export const useGetTreeQuery = (workspaceId: string) => {
  return useQuery<FileTreeNodeData>({
    queryKey: ["workspace-tree", workspaceId],
    queryFn: () => FileExplorerService.getTree(workspaceId),
    enabled: Boolean(workspaceId),
  })
}

export const useGetFileContentQuery = (
  workspaceId: string,
  filePath: string,
  enabled: boolean = true
) => {
  return useQuery<FileContentResponse>({
    queryKey: ["file-content", workspaceId, filePath],
    queryFn: () => FileExplorerService.getFileContent(workspaceId, filePath),
    enabled: Boolean(workspaceId && filePath && enabled),
    staleTime: 1000 * 60 * 2, // cache 2 minutes
  })
}

export const useCreateEntryMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()

  const createEntry = useMutation({
    mutationFn: (payload: CreateEntryPayload) =>
      FileExplorerService.createEntry(workspaceId, payload),
    onSuccess: (_, variables) => {
      toast.success(
        `${variables.type === "DIRECTORY" ? "Folder" : "File"} created`
      )
      queryClient.invalidateQueries({
        queryKey: ["workspace-tree", workspaceId],
      })
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create entry"
      )
    },
  })

  return { createEntry }
}

export const useUpdateFileContentMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()

  const updateFileContent = useMutation({
    mutationFn: (payload: UpdateContentPayload) =>
      FileExplorerService.updateFileContent(workspaceId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["file-content", workspaceId, variables.path],
      })
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to save file"
      )
    },
  })

  return { updateFileContent }
}

export const useRenameEntryMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()

  const renameEntry = useMutation({
    mutationFn: (payload: RenameEntryPayload) =>
      FileExplorerService.renameEntry(workspaceId, payload),
    onSuccess: () => {
      toast.success("Renamed successfully")
      queryClient.invalidateQueries({
        queryKey: ["workspace-tree", workspaceId],
      })
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to rename entry"
      )
    },
  })

  return { renameEntry }
}

export const useDeleteEntryMutation = (workspaceId: string) => {
  const queryClient = useQueryClient()

  const deleteEntry = useMutation({
    mutationFn: (path: string) =>
      FileExplorerService.deleteEntry(workspaceId, path),
    onSuccess: () => {
      toast.success("Deleted successfully")
      queryClient.invalidateQueries({
        queryKey: ["workspace-tree", workspaceId],
      })
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to delete entry"
      )
    },
  })

  return { deleteEntry }
}
