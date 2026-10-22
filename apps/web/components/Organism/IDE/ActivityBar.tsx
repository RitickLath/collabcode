"use client"

import React from "react"
import { Files, Search, GitBranch, Settings } from "lucide-react"
import { ActivityTab } from "@/types/ide"

interface ActivityBarProps {
  activeTab: ActivityTab
  leftSidebarOpen: boolean
  onSelectTab: (tab: ActivityTab) => void
  onToggleLeftSidebar: () => void
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeTab,
  leftSidebarOpen,
  onSelectTab,
  onToggleLeftSidebar,
}) => {
  const handleTabClick = (tab: ActivityTab) => {
    // 1. If clicking a different tab: activate it and ensure sidebar is opened
    if (activeTab !== tab) {
      onSelectTab(tab)
      if (!leftSidebarOpen) {
        onToggleLeftSidebar()
      }
      return
    }

    // 2. If clicking the already-active tab: toggle sidebar open/closed
    onToggleLeftSidebar()
  }

  const isTabActive = (tab: ActivityTab) => activeTab === tab && leftSidebarOpen

  return (
    <nav className="flex w-11 shrink-0 flex-col items-center justify-between border-r border-border/50 bg-card/40 py-2.5 select-none">
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={() => handleTabClick("files")}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            isTabActive("files")
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          title="Explorer"
        >
          <Files className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleTabClick("search")}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            isTabActive("search")
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleTabClick("git")}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            isTabActive("git")
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
          onClick={() => handleTabClick("settings")}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            isTabActive("settings")
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
