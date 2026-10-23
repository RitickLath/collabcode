"use client"

import React, { useState } from "react"
import {
  FolderTree,
  FilePlus,
  FolderPlus,
  RefreshCw,
  Folder,
} from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"
import { CollapseAllIcon } from "@workspace/ui/components/atom/ExplorerIcons"
import { FileTreeNodeData } from "@/types/ide"
import FileTree from "@/components/Molecules/IDE/FileTree"
import { useExplorer } from "@/store/useExplorer"
import useFileTreeOperations from "@/hooks/file-explorer/useFileTreeOperations"

interface FileExplorerSidebarProps {
  workspaceName?: string
  tree?: FileTreeNodeData | null
  isLoading?: boolean
  selectedPath?: string | null
  onRefresh?: () => void
}

export const FileExplorerSidebar: React.FC<FileExplorerSidebarProps> = ({
  workspaceName = "WORKSPACE",
  tree,
  isLoading = false,
  selectedPath,
  onRefresh,
}) => {
  const { currentActiveFile } = useExplorer()

  const {
    expandedPaths,
    creatingEntry,
    handleToggleFolder,
    handleCollapseAll,
    onSelectFile,
    onCreateFile,
    onCreateFolder,
    onSubmitCreateEntry,
    onCancelCreateEntry,
  } = useFileTreeOperations({ workspaceName, onRefresh })

  return (
    <aside className="flex h-full w-full flex-col border-r border-border/50 bg-card/25 backdrop-blur-xs select-none">
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
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleCollapseAll}
            title="Collapse Folders in Explorer"
          >
            <CollapseAllIcon size={14} />
          </Button>
        </div>
      </div>

      {/* Tree View container */}
      <div className="flex-1 overflow-y-auto p-2 text-xs">
        <div className="mb-1.5 flex gap-1.5 px-1 font-semibold text-muted-foreground">
          <Folder className="h-3.5 w-3.5 text-primary" />
          <span className="truncate uppercase">{workspaceName}</span>
        </div>

        {/* Tree Content: Loading Skeleton, Empty State, or Tree Items */}
        {isLoading ? (
          <FileExplorerSkeleton />
        ) : !tree || !tree.children || tree.children.length === 0 ? (
          <div className="flex flex-col items-start px-4 py-10 text-left text-muted-foreground">
            <FolderTree className="mb-2 h-7 w-7 stroke-[1.5] text-muted-foreground/40" />
            <p className="text-[11px]">No files in workspace</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/60">
              Create a file or folder above to get started
            </p>
          </div>
        ) : (
          <div className="text-left">
            {/* Real FileTreeNode items */}
            <FileTree
              tree={tree}
              expandedPaths={expandedPaths}
              selectedPath={currentActiveFile?.path || selectedPath}
              creatingEntry={creatingEntry}
              onToggleFolder={handleToggleFolder}
              onSelectFile={onSelectFile}
              onSubmitCreateEntry={onSubmitCreateEntry}
              onCancelCreateEntry={onCancelCreateEntry}
            />
          </div>
        )}
      </div>
    </aside>
  )
}

/**
 * Skeleton loader for the file explorer tree
 */
const FileExplorerSkeleton: React.FC = () => {
  return (
    <div className="space-y-1.5 py-1">
      {/* Folder 1 */}
      <div className="flex items-center gap-2 px-1 py-1">
        <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-muted-foreground/15" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted-foreground/15" />
      </div>
      {/* Folder 1 children */}
      <div className="flex items-center gap-2 py-1 pr-1 pl-5">
        <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-muted-foreground/15" />
        <div className="h-3 w-28 animate-pulse rounded bg-muted-foreground/15" />
      </div>
      <div className="flex items-center gap-2 py-1 pr-1 pl-5">
        <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-muted-foreground/15" />
        <div className="h-3 w-20 animate-pulse rounded bg-muted-foreground/15" />
      </div>

      {/* Folder 2 */}
      <div className="flex items-center gap-2 px-1 py-1">
        <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-muted-foreground/15" />
        <div className="h-3 w-20 animate-pulse rounded bg-muted-foreground/15" />
      </div>
      {/* Folder 2 child */}
      <div className="flex items-center gap-2 py-1 pr-1 pl-5">
        <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-muted-foreground/15" />
        <div className="h-3 w-32 animate-pulse rounded bg-muted-foreground/15" />
      </div>

      {/* Root-level files */}
      <div className="flex items-center gap-2 px-1 py-1">
        <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-muted-foreground/15" />
        <div className="h-3 w-28 animate-pulse rounded bg-muted-foreground/15" />
      </div>
      <div className="flex items-center gap-2 px-1 py-1">
        <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded bg-muted-foreground/15" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted-foreground/15" />
      </div>
    </div>
  )
}
