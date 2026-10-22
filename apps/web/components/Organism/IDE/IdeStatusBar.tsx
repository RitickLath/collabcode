"use client"

import React from "react"
import { GitBranch } from "lucide-react"

interface IdeStatusBarProps {
  branchName?: string
  runtime?: string
  status?: "connected" | "connecting" | "disconnected"
}

export const IdeStatusBar: React.FC<IdeStatusBarProps> = ({
  branchName = "main",
  runtime = "Node 22",
  status = "connected",
}) => {
  return (
    <footer className="flex h-6 shrink-0 items-center justify-between border-t border-border/40 bg-card/60 px-3 text-[11px] text-muted-foreground select-none">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {status === "connected" ? "Connected" : status}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <GitBranch className="h-3 w-3" />
          {branchName}
        </span>
        <span>{runtime}</span>
      </div>

      <div className="flex items-center gap-3">
        <span>UTF-8</span>
        <span>TypeScript JSX</span>
        <span>Spaces: 2</span>
      </div>
    </footer>
  )
}
