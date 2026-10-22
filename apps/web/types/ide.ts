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
