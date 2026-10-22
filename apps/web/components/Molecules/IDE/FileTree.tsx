import React from "react"
import { FileTreeNodeData } from "@/types/ide"
import { Button } from "@workspace/ui/components/button"
import {
  FileIcon,
  ChevronRight,
  ChevronDown,
} from "@workspace/ui/components/atom/FileIcon"

interface FileTreeProps {
  tree: FileTreeNodeData
  expandedPaths: Set<string>
  selectedPath?: string | null
  onToggleFolder: (path: string) => void
  onSelectFile?: (path: string) => void
}

interface FileTreeItemProps {
  child: FileTreeNodeData
  expandedPaths: Set<string>
  selectedPath?: string | null
  onToggleFolder: (path: string) => void
  onSelectFile?: (path: string) => void
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  child,
  expandedPaths,
  selectedPath,
  onToggleFolder,
  onSelectFile,
}) => {
  const isDirectory = child.type === "directory"
  const itemPath = child.path || child.name
  const isExpanded = isDirectory && expandedPaths.has(itemPath)
  const isSelected = selectedPath === itemPath

  return (
    <div>
      <Button
        variant="ghost"
        className={`flex h-7 w-full cursor-pointer items-center justify-start gap-1.5 rounded-none px-1 text-xs font-normal transition-colors ${
          isSelected
            ? "bg-primary/15 font-medium text-primary"
            : "text-foreground/90 hover:bg-muted/50"
        }`}
        onClick={() => {
          if (isDirectory) {
            onToggleFolder(itemPath)
          } else {
            onSelectFile?.(itemPath)
          }
        }}
      >
        {/* Chevron arrow indicator for directories */}
        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-muted-foreground/70">
          {isDirectory ? (
            isExpanded ? (
              <ChevronDown />
            ) : (
              <ChevronRight />
            )
          ) : (
            <span className="w-3.5" />
          )}
        </span>

        {/* VS Code file/folder icon */}
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <FileIcon name={child.name} isFolder={isDirectory} />
        </span>

        {/* Entry name */}
        <span className="truncate">{child.name}</span>
      </Button>

      {/* Nested children */}
      {isDirectory && isExpanded && (
        <FileTree
          tree={child}
          expandedPaths={expandedPaths}
          selectedPath={selectedPath}
          onToggleFolder={onToggleFolder}
          onSelectFile={onSelectFile}
        />
      )}
    </div>
  )
}

const FileTree: React.FC<FileTreeProps> = ({
  tree,
  expandedPaths,
  selectedPath,
  onToggleFolder,
  onSelectFile,
}) => {
  return (
    <div className="w-full">
      <div className="pl-3.5">
        {tree.children?.map((child) => (
          <FileTreeItem
            key={child.path || child.name}
            child={child}
            expandedPaths={expandedPaths}
            selectedPath={selectedPath}
            onToggleFolder={onToggleFolder}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  )
}

export default FileTree
