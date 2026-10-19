"use client"

import React from "react"
import { GitBranch, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"

interface DashboardBannerProps {
  displayName: string
  onOpenModal: (view: "template" | "git") => void
}

export const DashboardBanner: React.FC<DashboardBannerProps> = ({
  displayName,
  onOpenModal,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/40 to-background p-6 shadow-xs backdrop-blur-md sm:p-8">
      <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Cloud IDE Engine Online
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {displayName} 👋
          </h1>
          <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
            Monitor your active sandboxes, collaborate with your team, or spin
            up a new isolated container workspace in seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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
            <span>New Project</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
