export interface IdeTab {
  path: string
  name: string
  isDirty?: boolean
  content?: string
}

export interface FileTreeNodeData {
  id: string
  name: string
  path: string
  type: "file" | "directory"
  size?: number
  extension?: string
  children?: FileTreeNodeData[]
}

export type ActivityTab = "files" | "search" | "git" | "settings"

export type EntryType = "FILE" | "DIRECTORY"

export interface CreateEntryPayload {
  path: string
  type: EntryType
  content?: string
}

export interface UpdateContentPayload {
  path: string
  content: string
}

export interface RenameEntryPayload {
  path: string
  newName: string
}

export interface FileContentResponse {
  path: string
  content: string
}
