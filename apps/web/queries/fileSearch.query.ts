import { useMutation, useQuery } from "@tanstack/react-query"
import { FileSearchService } from "@/services/fileSearch.service"
import {
  SearchFilePayload,
  SearchFileResponse,
} from "@workspace/types/fileSearch"
import { toast } from "sonner"

/**
 * Mutation hook for triggering on-demand search (e.g. form submit, debounce trigger)
 */
export const useFileSearchMutation = () => {
  const searchMutation = useMutation<
    SearchFileResponse,
    Error,
    SearchFilePayload
  >({
    mutationFn: (payload: SearchFilePayload) =>
      FileSearchService.search(payload),
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || "Search failed"
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    },
  })

  return {
    search: searchMutation.mutate,
    searchAsync: searchMutation.mutateAsync,
    isSearching: searchMutation.isPending,
    results: searchMutation.data?.files || [],
    data: searchMutation.data,
    error: searchMutation.error,
    reset: searchMutation.reset,
  }
}

/**
 * Query hook for continuous search as user types with enabled guard
 */
export const useFileSearchQuery = (
  payload: SearchFilePayload,
  options?: { enabled?: boolean }
) => {
  const isEnabled =
    options?.enabled !== undefined
      ? options.enabled && Boolean(payload.keyword.trim())
      : Boolean(payload.keyword.trim().length > 2 && payload.workspaceId)

  return useQuery<SearchFileResponse>({
    queryKey: [
      "file-search",
      payload.workspaceId,
      payload.keyword,
      payload.searchType,
      payload.searchIn,
    ],
    queryFn: () => FileSearchService.search(payload),
    enabled: isEnabled,
    staleTime: 1000 * 30, // 30 seconds
  })
}
