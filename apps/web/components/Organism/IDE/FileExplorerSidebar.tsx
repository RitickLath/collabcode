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
import FileTree, {
  CreatingEntryState,
} from "@/components/Molecules/IDE/FileTree"
import { useExplorer } from "@/store/useExplorer"
import { FileExplorerService } from "@/services/fileExplorer.service"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

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
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  const queryClient = useQueryClient()

  const {
    activeFiles,
    currentActiveFile,
    lastActivityPath,
    setLastActivityPath,
    addActiveFile,
    setCurrentActiveFile,
  } = useExplorer()

  const handleToggleFolder = (folderPath: string) => {
    // Record directory click as last activity path
    setLastActivityPath(folderPath)

    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(folderPath)) {
        next.delete(folderPath)
      } else {
        next.add(folderPath)
      }
      return next
    })
  }

  const handleCollapseAll = () => {
    setExpandedPaths(new Set())
  }

  const onSelectFile = async (filePath: string) => {
    // 1. Check if already open in tabs
    const alreadyOpen = activeFiles.find((file) => file.path === filePath)
    if (alreadyOpen) {
      setCurrentActiveFile(alreadyOpen)
      return
    }

    // 2. Fetch file content, name, and extension directly from server
    try {
      const data = await queryClient.ensureQueryData({
        queryKey: ["file-content", workspaceName, filePath],
        queryFn: () =>
          FileExplorerService.getFileContent(workspaceName, filePath),
        staleTime: 1000 * 60 * 2,
      })

      addActiveFile({
        id: filePath,
        name: data.name,
        path: filePath,
        extension: data.extension,
        content: data.content,
      })
    } catch (err: any) {
      toast.error(err?.message || "Failed to open file")
    }
  }

  const [creatingEntry, setCreatingEntry] = useState<CreatingEntryState | null>(
    null
  )

  // Determine target folder path based on lastActivityPath
  const getTargetDirPath = () => {
    if (!lastActivityPath) return ""

    const parts = lastActivityPath.split("/").filter(Boolean)
    // If it's a file (contains an extension), strip the filename to get its directory
    if (parts.length > 0 && parts[parts.length - 1]?.includes(".")) {
      parts.pop()
    }
    return parts.join("/")
  }

  // Helper to ensure target folder and all its parent directories are expanded
  const expandTargetHierarchy = (targetDir: string) => {
    if (!targetDir) return
    const segments = targetDir.split("/").filter(Boolean)
    const pathsToExpand: string[] = []

    let current = ""
    for (const seg of segments) {
      // ["folder1", "folder2", "folder3"] => parent of folder3
      // current = "folder1"
      // current = "folder1/folder2"
      // current = "folder1/folder2/folder3"
      current = current ? `${current}/${seg}` : seg
      pathsToExpand.push(current)
    }

    setExpandedPaths((prev) => new Set([...prev, ...pathsToExpand]))
  }

  const onCreateFile = () => {
    const parentPath = getTargetDirPath()
    // If the parent path is empty, it means we are creating the file in the root directory.
    // In that case, we don't need to expand any hierarchy.
    // Else we will expand all the parent directories to show the newly created file.
    expandTargetHierarchy(parentPath)
    setCreatingEntry({ parentPath, type: "FILE" })
  }

  const onCreateFolder = () => {
    const parentPath = getTargetDirPath()
    expandTargetHierarchy(parentPath)
    setCreatingEntry({ parentPath, type: "DIRECTORY" })
  }

  const onSubmitCreateEntry = async (name: string) => {
    if (!creatingEntry) return
    const parent = creatingEntry.parentPath
    const fullPath = parent ? `${parent}/${name}` : name
    const type = creatingEntry.type

    setCreatingEntry(null)

    try {
      await FileExplorerService.createEntry(workspaceName, {
        path: fullPath,
        type: type,
        content: type === "FILE" ? "" : undefined,
      })

      // Invalidate tree cache and trigger refresh
      await queryClient.invalidateQueries({
        queryKey: ["file-tree", workspaceName],
      })
      onRefresh?.()

      if (type === "FILE") {
        const ext = fullPath.includes(".")
          ? `.${fullPath.split(".").pop()}`
          : ""
        addActiveFile({
          id: fullPath,
          name,
          path: fullPath,
          extension: ext,
          content: "",
        })
        toast.success(`Created file ${name}`)
      } else {
        setExpandedPaths((prev) => new Set([...prev, fullPath]))
        toast.success(`Created folder ${name}`)
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create entry"
      )
    }
  }

  const onCancelCreateEntry = () => {
    setCreatingEntry(null)
  }

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
