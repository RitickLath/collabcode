export interface WorkspaceItem {
  id: string
  ownerId: string
  name: string
  slug: string
  description?: string | null
  framework: string
  gitUrl?: string | null
  visibility: "PRIVATE" | "PUBLIC" | "UNLISTED"
  status: "CREATING" | "READY" | "ARCHIVED" | "ERROR"
  createdAt: string
  updatedAt: string
  lastAccessedAt?: string
  storageBytes?: number | string
  owner?: {
    id: string
    username: string
    email: string
  }
  members?: Array<{
    id?: string
    role?: string
    user: {
      id: string
      username: string
      email: string
    }
  }>
}

export interface CreateWorkspaceTemplatePayload {
  framework: string
  name: string
  description?: string
}

export interface CreateWorkspaceGitPayload {
  gitUrl: string
  name: string
  description?: string
}
