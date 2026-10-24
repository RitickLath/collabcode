import { ApiClient } from "@/lib/axiosInstance"
import {
  SearchFilePayload,
  SearchFileResponse,
} from "@workspace/types/fileSearch"

export const FileSearchService = {
  /**
   * Search workspace files by filename or keyword content
   */
  search: async (payload: SearchFilePayload): Promise<SearchFileResponse> => {
    return ApiClient.post<SearchFileResponse, SearchFilePayload>(
      "/file-search",
      payload
    )
  },
}
