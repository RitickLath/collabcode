import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  DockerService,
  WorkspaceContainerResponse,
} from "@/services/docker.service"

export const DOCKER_QUERY_KEYS = {
  containerStatus: (workspaceId: string) =>
    ["docker", "status", workspaceId] as const,
}

/**
 * Mutation hook to initialize or ensure workspace container is running
 */
export const useInitContainer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workspaceId: string) =>
      DockerService.initContainer(workspaceId),
    onSuccess: (data: WorkspaceContainerResponse, workspaceId: string) => {
      queryClient.setQueryData(
        DOCKER_QUERY_KEYS.containerStatus(workspaceId),
        data
      )
    },
  })
}

/**
 * Query hook to fetch and poll container status
 */
export const useContainerStatus = (workspaceId: string, enabled = true) => {
  return useQuery({
    queryKey: DOCKER_QUERY_KEYS.containerStatus(workspaceId),
    queryFn: () => DockerService.getContainerStatus(workspaceId),
    enabled: !!workspaceId && enabled,
    refetchInterval: (query) => {
      // If container is STARTING, poll every 2s until RUNNING or FAILED
      return query.state.data?.status === "STARTING" ? 2000 : false
    },
  })
}

/**
 * Mutation hook to stop a running container
 */
export const useStopContainer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (workspaceId: string) =>
      DockerService.stopContainer(workspaceId),
    onSuccess: (_, workspaceId: string) => {
      queryClient.invalidateQueries({
        queryKey: DOCKER_QUERY_KEYS.containerStatus(workspaceId),
      })
    },
  })
}
