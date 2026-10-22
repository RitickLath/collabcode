"use client"

import React from "react"
import { Files, Search, GitBranch, Settings } from "lucide-react"
import { ActivityTab } from "@/types/ide"

interface ActivityBarProps {
  activeTab: ActivityTab
  onSelectTab: (tab: ActivityTab) => void
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav className="flex w-11 shrink-0 flex-col items-center justify-between border-r border-border/50 bg-card/40 py-2.5 select-none">
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={() => onSelectTab("files")}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            activeTab === "files"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          title="Explorer"
        >
          <Files className="h-4 w-4" />
        </button>
        <button
          onClick={() => onSelectTab("search")}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            activeTab === "search"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          onClick={() => onSelectTab("git")}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            activeTab === "git"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          title="Source Control"
        >
          <GitBranch className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => onSelectTab("settings")}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            activeTab === "settings"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}
