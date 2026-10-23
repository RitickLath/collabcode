import React from "react"
import { FileTreeNodeData } from "@/types/ide"
import { Button } from "@workspace/ui/components/button"
import {
  FileIcon,
  ChevronRight,
  ChevronDown,
} from "@workspace/ui/components/atom/FileIcon"

export interface CreatingEntryState {
  parentPath: string
  type: "FILE" | "DIRECTORY"
}

interface InlineEntryInputProps {
  type: "FILE" | "DIRECTORY"
  onSubmit: (name: string) => void
  onCancel: () => void
}

interface FileTreeProps {
  tree: FileTreeNodeData
  expandedPaths: Set<string>
  selectedPath?: string | null
  creatingEntry?: CreatingEntryState | null
  onToggleFolder: (path: string) => void
  onSelectFile?: (path: string) => void
  onSubmitCreateEntry: (name: string) => void
  onCancelCreateEntry: () => void
}

interface FileTreeItemProps {
  child: FileTreeNodeData
  expandedPaths: Set<string>
  selectedPath?: string | null
  creatingEntry?: CreatingEntryState | null
  onToggleFolder: (path: string) => void
  onSelectFile?: (path: string) => void
  onSubmitCreateEntry: (name: string) => void
  onCancelCreateEntry: () => void
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  child,
  expandedPaths,
  selectedPath,
  creatingEntry,
  onToggleFolder,
  onSelectFile,
  onSubmitCreateEntry,
  onCancelCreateEntry,
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
          creatingEntry={creatingEntry}
          onToggleFolder={onToggleFolder}
          onSelectFile={onSelectFile}
          onSubmitCreateEntry={onSubmitCreateEntry}
          onCancelCreateEntry={onCancelCreateEntry}
        />
      )}
    </div>
  )
}

const InlineEntryInput: React.FC<InlineEntryInputProps> = ({
  type,
  onSubmit,
  onCancel,
}) => {
  const [val, setVal] = React.useState("")

  return (
    <div className="flex h-7 items-center gap-1.5 px-1 py-0.5">
      <span className="w-3.5" />
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        <FileIcon
          name={val || (type === "DIRECTORY" ? "folder" : "file")}
          isFolder={type === "DIRECTORY"}
        />
      </span>
      <input
        type="text"
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            if (val.trim()) onSubmit(val.trim())
            else onCancel()
          } else if (e.key === "Escape") {
            onCancel()
          }
        }}
        onBlur={() => {
          if (val.trim()) onSubmit(val.trim())
          else onCancel()
        }}
        className="h-5 w-full rounded border border-primary/50 bg-background px-1 font-mono text-xs text-foreground ring-1 ring-primary/30 outline-none"
        placeholder={type === "DIRECTORY" ? "folder name..." : "file.ext..."}
      />
    </div>
  )
}

const FileTree: React.FC<FileTreeProps> = ({
  tree,
  expandedPaths,
  selectedPath,
  creatingEntry,
  onToggleFolder,
  onSelectFile,
  onSubmitCreateEntry,
  onCancelCreateEntry,
}) => {
  const currentDirPath = tree.path || ""
  const isCreatingHere = creatingEntry?.parentPath === currentDirPath

  return (
    <div className="w-full">
      <div className="pl-3.5">
        {/* Render inline input at the top of the directory when creating in this folder */}
        {isCreatingHere && (
          <InlineEntryInput
            type={creatingEntry.type}
            onSubmit={onSubmitCreateEntry}
            onCancel={onCancelCreateEntry}
          />
        )}

        {tree.children?.map((child) => (
          <FileTreeItem
            key={child.path || child.name}
            child={child}
            expandedPaths={expandedPaths}
            selectedPath={selectedPath}
            creatingEntry={creatingEntry}
            onToggleFolder={onToggleFolder}
            onSelectFile={onSelectFile}
            onSubmitCreateEntry={onSubmitCreateEntry}
            onCancelCreateEntry={onCancelCreateEntry}
          />
        ))}
      </div>
    </div>
  )
}

export default FileTree
