export interface SearchFilePayload {
  workspaceId: string
  keyword: string
  searchType?: "case-sensitive" | "case-insensitive"
  searchIn?: "filename" | "content"
}

export interface ContentSearchMatch {
  path: string
  lineNumber: number
  content: string
}

export interface FilenameSearchMatch {
  path: string
}

export type SearchFileMatch = ContentSearchMatch | FilenameSearchMatch

export interface SearchFileResponse {
  success: boolean
  files: SearchFileMatch[]
  error?: string
}
