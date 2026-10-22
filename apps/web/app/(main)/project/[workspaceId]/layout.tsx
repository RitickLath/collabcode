"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { IdeHeader } from "@/components/Organism/IDE/IdeHeader"
import { ActivityBar } from "@/components/Organism/IDE/ActivityBar"
import { FileExplorerSidebar } from "@/components/Organism/IDE/FileExplorerSidebar"
import { AiCopilotSidebar } from "@/components/Organism/IDE/AiCopilotSidebar"
import { IdeStatusBar } from "@/components/Organism/IDE/IdeStatusBar"
import { ActivityTab } from "@/types/ide"

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const workspaceId = (params?.workspaceId as string) || "workspace"

  const [leftNavActive, setLeftNavActive] = useState<ActivityTab>("files")
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightChatOpen, setRightChatOpen] = useState(true)

  const handleSelectActivityTab = (tab: ActivityTab) => {
    setLeftNavActive(tab)
    setLeftSidebarOpen(true)
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background font-sans text-foreground select-none">
      {/* 1. TOP HEADER / TOOLBAR */}
      <IdeHeader
        workspaceName={workspaceId}
        branchName="main"
        leftSidebarOpen={leftSidebarOpen}
        onToggleLeftSidebar={() => setLeftSidebarOpen((prev) => !prev)}
        rightChatOpen={rightChatOpen}
        onToggleRightChat={() => setRightChatOpen((prev) => !prev)}
      />

      {/* 2. MAIN WORKSPACE BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* Leftmost Activity Bar */}
        <ActivityBar
          activeTab={leftNavActive}
          onSelectTab={handleSelectActivityTab}
        />

        {/* Collapsible Left Panel (Explorer / Search / Git / Settings) */}
        {leftSidebarOpen && leftNavActive === "files" && (
          <FileExplorerSidebar
            workspaceName={workspaceId}
            tree={null}
            isLoading={false}
          />
        )}

        {/* Center: Editor Canvas & Content */}
        <main className="flex flex-1 flex-col overflow-hidden bg-background">
          {children}
        </main>

        {/* Rightmost: AI Copilot Sidebar */}
        {rightChatOpen && (
          <AiCopilotSidebar onClose={() => setRightChatOpen(false)} />
        )}
      </div>

      {/* 3. BOTTOM STATUSBAR */}
      <IdeStatusBar branchName="main" runtime="Node 22" status="connected" />
    </div>
  )
}
