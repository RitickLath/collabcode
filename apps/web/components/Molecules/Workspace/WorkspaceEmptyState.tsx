"use client"

import React from "react"
import { Folder, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"

interface WorkspaceEmptyStateProps {
  title?: string
  description?: string
  hasFilter?: boolean
  onCreateClick: () => void
}

export const WorkspaceEmptyState: React.FC<WorkspaceEmptyStateProps> = ({
  title = "No workspaces found",
  description,
  hasFilter = false,
  onCreateClick,
}) => {
  const defaultDesc = hasFilter
    ? "No workspaces match your selected filter criteria."
    : "You haven't created any workspaces yet. Launch one below."

  return (
    <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-card/10 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card/40 text-muted-foreground">
        <Folder className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="max-w-xs text-xs text-muted-foreground">
          {description || defaultDesc}
        </p>
      </div>
      <Button
        size="sm"
        onClick={onCreateClick}
        className="mt-2 h-8 gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-95"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Create Workspace</span>
      </Button>
    </div>
  )
}
