"use client"

import React from "react"
import {
  FolderTree,
  FilePlus,
  FolderPlus,
  RefreshCw,
  Folder,
} from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"
import { FileTreeNodeData } from "@/types/ide"

interface FileExplorerSidebarProps {
  workspaceName?: string
  tree?: FileTreeNodeData | null
  isLoading?: boolean
  selectedPath?: string | null
  onSelectFile?: (path: string) => void
  onRefresh?: () => void
  onCreateFile?: () => void
  onCreateFolder?: () => void
}

export const FileExplorerSidebar: React.FC<FileExplorerSidebarProps> = ({
  workspaceName = "WORKSPACE",
  tree,
  isLoading = false,
  selectedPath,
  onSelectFile,
  onRefresh,
  onCreateFile,
  onCreateFolder,
}) => {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border/50 bg-card/25 backdrop-blur-xs select-none">
      {/* Header bar with actions */}
      <div className="flex h-9 items-center justify-between border-b border-border/40 px-3">
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Explorer
        </span>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={onCreateFile}
            title="New File"
          >
            <FilePlus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={onCreateFolder}
            title="New Folder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={onRefresh}
            title="Refresh Explorer"
          >
            <RefreshCw
              className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Tree View container */}
      <div className="flex-1 overflow-y-auto p-2 text-xs">
        <div className="mb-1 flex items-center gap-1.5 px-1 font-semibold text-muted-foreground">
          <Folder className="h-3.5 w-3.5 text-primary" />
          <span className="truncate uppercase">{workspaceName}</span>
        </div>

        {/* Tree Content: Empty state placeholder ready for Step-by-Step API connection */}
        {isLoading ? (
          <div className="flex items-center justify-center p-6 text-xs text-muted-foreground">
            <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
            Loading files...
          </div>
        ) : !tree || !tree.children || tree.children.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center text-muted-foreground">
            <FolderTree className="mb-2 h-7 w-7 stroke-[1.5] text-muted-foreground/40" />
            <p className="text-[11px]">No files in workspace</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/60">
              Create a file or folder above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {/* Real FileTreeNode items will render here in Phase 1 */}
          </div>
        )}
      </div>
    </aside>
  )
}
