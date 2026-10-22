import React, { useEffect, useState } from "react"
import { FileTreeNodeData } from "@/types/ide"
import { Button } from "@workspace/ui/components/button"
import {
  FileIcon,
  ChevronRight,
  ChevronDown,
} from "@workspace/ui/components/atom/FileIcon"

interface FileTreeItemProps {
  child: FileTreeNodeData
  col: Boolean
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ child, col }) => {
  const isDirectory = child.type === "directory"
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setIsExpanded(false)
  }, [col])

  return (
    <div>
      <Button
        variant="ghost"
        className="flex h-7 w-full items-center justify-start gap-1.5 rounded-none px-1 text-xs font-normal hover:bg-muted/50"
        onClick={() => {
          if (isDirectory) {
            setIsExpanded((prev) => !prev)
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
      {isDirectory && isExpanded && <FileTree col={col} tree={child} />}
    </div>
  )
}

const FileTree = ({ col, tree }: { tree: FileTreeNodeData; col: Boolean }) => {
  return (
    <div className="w-full">
      <div className="pl-4">
        {tree.children?.map((child) => (
          <FileTreeItem
            col={col}
            key={child.path || child.name}
            child={child}
          />
        ))}
      </div>
    </div>
  )
}

export default FileTree
