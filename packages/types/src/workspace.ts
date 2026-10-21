export enum ProjectTemplate {
  REACT = "REACT",
  NEXTJS = "NEXTJS",
  NODE = "NODE",
  PYTHON = "PYTHON",
  NESTJS = "NESTJS",
  FASTAPI = "FASTAPI",
  EXPRESSJS = "EXPRESSJS",
  VITE = "VITE",
  TURBOREPO = "TURBOREPO",
}

export type WorkspaceVisibility = "PRIVATE" | "PUBLIC" | "UNLISTED"

export type WorkspaceStatus = "CREATING" | "READY" | "ARCHIVED" | "ERROR"

export type WorkspaceRole = "OWNER" | "EDITOR" | "VIEWER"

export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED"

export interface WorkspaceItem {
  id: string
  ownerId: string
  name: string
  slug: string
  description?: string | null
  framework: ProjectTemplate | string
  gitUrl?: string | null
  visibility: WorkspaceVisibility
  status: WorkspaceStatus
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
    role?: WorkspaceRole | string
    user: {
      id: string
      username: string
      email: string
    }
  }>
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedWorkspacesResponse {
  items: WorkspaceItem[]
  meta: PaginationMeta
}

export interface GetWorkspacesParams {
  page?: number
  limit?: number
  role?: "all" | "owner" | "member"
  search?: string
}

export type WorkspaceCreationType = "TEMPLATE" | "GIT"

export interface CreateWorkspaceTemplatePayload {
  type?: "TEMPLATE"
  framework: ProjectTemplate | string
  name: string
  description?: string
}

export interface CreateWorkspaceGitPayload {
  type?: "GIT"
  gitUrl: string
  name: string
  description?: string
}

export type CreateWorkspacePayload =
  | (CreateWorkspaceTemplatePayload & { type?: "TEMPLATE" })
  | (CreateWorkspaceGitPayload & { type: "GIT" })

export interface UpdateWorkspacePayload {
  name?: string
  description?: string
  visibility?: WorkspaceVisibility
}

export interface SendWorkspaceInvitePayload {
  email: string
  role?: "EDITOR" | "VIEWER"
}

export interface AcceptWorkspaceInvitePayload {
  token: string
}
