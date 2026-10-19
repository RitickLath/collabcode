"use client"

import React from "react"
import { Layers, GitBranch, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"

interface WorkspacesHeaderProps {
  onOpenModal: (view: "template" | "git") => void
}

export const WorkspacesHeader: React.FC<WorkspacesHeaderProps> = ({
  onOpenModal,
}) => {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Workspaces
          </h1>
        </div>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Manage, launch, and configure all your collaborative cloud
          environments.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenModal("git")}
          className="h-9 gap-1.5 border-border/60 bg-card/40 text-xs hover:bg-muted"
        >
          <GitBranch className="h-3.5 w-3.5 text-primary" />
          <span>Import Git</span>
        </Button>
        <Button
          size="sm"
          onClick={() => onOpenModal("template")}
          className="h-9 gap-1.5 bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Workspace</span>
        </Button>
      </div>
    </div>
  )
}
