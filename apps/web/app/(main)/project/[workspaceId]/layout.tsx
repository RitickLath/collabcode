"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { IdeHeader } from "@/components/Organism/IDE/IdeHeader"
import { ActivityBar } from "@/components/Organism/IDE/ActivityBar"
import { FileExplorerSidebar } from "@/components/Organism/IDE/FileExplorerSidebar"
import { AiCopilotSidebar } from "@/components/Organism/IDE/AiCopilotSidebar"
import { IdeStatusBar } from "@/components/Organism/IDE/IdeStatusBar"
import { ActivityTab } from "@/types/ide"
import { useGetTreeQuery } from "@/queries/fileExplorer.query"
import { Group, Panel, Separator } from "react-resizable-panels"

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
  const {
    data: tree,
    isLoading: isTreeLoading,
    refetch: refetchTree,
  } = useGetTreeQuery(workspaceId)

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
        {/* Fixed Leftmost Activity Bar */}
        <ActivityBar
          activeTab={leftNavActive}
          onSelectTab={handleSelectActivityTab}
        />

        {/* Resizable Panels Group (v4 API: Group, Panel, Separator) */}
        <Group orientation="horizontal" className="h-full flex-1">
          {/* Collapsible Left Panel (Explorer / Search / Git / Settings) */}
          {leftSidebarOpen && leftNavActive === "files" && (
            <>
              <Panel defaultSize="20%" minSize="15%" maxSize="35%">
                <FileExplorerSidebar
                  workspaceName={workspaceId}
                  tree={tree}
                  isLoading={isTreeLoading}
                  onRefresh={() => refetchTree()}
                />
              </Panel>
              <Separator className="w-1 cursor-col-resize bg-border/40 transition-colors hover:bg-primary/50" />
            </>
          )}

          {/* Center: Editor Canvas & Content */}
          <Panel minSize="30%">
            <main className="flex h-full flex-col overflow-hidden bg-background">
              {children}
            </main>
          </Panel>

          {/* Rightmost: AI Copilot Sidebar */}
          {rightChatOpen && (
            <>
              <Separator className="w-1 cursor-col-resize bg-border/40 transition-colors hover:bg-primary/50" />
              <Panel defaultSize="25%" minSize="20%" maxSize="40%">
                <AiCopilotSidebar onClose={() => setRightChatOpen(false)} />
              </Panel>
            </>
          )}
        </Group>
      </div>

      {/* 3. BOTTOM STATUSBAR */}
      <IdeStatusBar branchName="main" runtime="Node 22" status="connected" />
    </div>
  )
}
