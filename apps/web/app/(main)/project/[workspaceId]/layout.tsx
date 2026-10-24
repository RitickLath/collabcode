"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { IdeHeader } from "@/components/Organism/IDE/IdeHeader"
import { ActivityBar } from "@/components/Organism/IDE/ActivityBar"
import { FileExplorerSidebar } from "@/components/Organism/IDE/FileExplorerSidebar"
import { SearchSidebar } from "@/components/Organism/IDE/SearchSidebar"
import { AiCopilotSidebar } from "@/components/Organism/IDE/AiCopilotSidebar"
import { IdeStatusBar } from "@/components/Organism/IDE/IdeStatusBar"
import { ActivityTab } from "@/types/ide"
import { useGetTreeQuery } from "@/queries/fileExplorer.query"
import { useGetWorkspaceByIdQuery } from "@/queries/workspace.query"
import { useMeQuery } from "@/queries/auth.query"
import { WorkspaceInviteModal } from "@/components/Organism/Workspace/WorkspaceInviteModal"
import { Group, Panel, Separator } from "react-resizable-panels"
import { useIdeLayout } from "@/store/useIdeLayout"
import useWorkspaceSocket from "@/hooks/common/useWorkspaceSocket"

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const workspaceId = (params?.workspaceId as string) || "workspace"

  const [leftNavActive, setLeftNavActive] = useState<ActivityTab>("files")
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const { data: workspace } = useGetWorkspaceByIdQuery(workspaceId)
  const { data: currentUser } = useMeQuery()

  const user =
    (currentUser as any)?.user ||
    (currentUser as any)?.data?.user ||
    currentUser
  const currentUserId = user?.id
  const currentUsername = user?.username

  const isOwner = Boolean(
    currentUserId && workspace?.ownerId && workspace.ownerId === currentUserId
  )

  // workspace socket connection
  const { isConnected, socket } = useWorkspaceSocket({
    workspaceId,
    userId: currentUserId,
    username: currentUsername || "user",
  })

  const {
    leftSidebarOpen,
    rightChatOpen,
    setLeftSidebarOpen,
    setRightChatOpen,
  } = useIdeLayout()

  const {
    data: tree,
    isLoading: isTreeLoading,
    refetch: refetchTree,
  } = useGetTreeQuery(workspaceId)

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background font-sans text-foreground select-none">
      {/* 1. TOP HEADER / TOOLBAR */}
      <IdeHeader
        workspaceName={workspace?.name || workspaceId}
        rightChatOpen={rightChatOpen}
        onToggleRightChat={() => setRightChatOpen((prev) => !prev)}
        onShare={isOwner ? () => setIsInviteOpen(true) : undefined}
      />

      {/* Workspace Share/Invite Modal */}
      <WorkspaceInviteModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        workspaceId={workspaceId}
        workspaceName={workspace?.name || "Workspace"}
        members={workspace?.members}
        ownerId={workspace?.ownerId}
        currentUserId={(currentUser as any)?.id}
      />

      {/* 2. MAIN WORKSPACE BODY */}
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar
          activeTab={leftNavActive}
          leftSidebarOpen={leftSidebarOpen}
          onSelectTab={(tab) => {
            setLeftNavActive(tab)
            setLeftSidebarOpen(true)
          }}
          onToggleLeftSidebar={() => setLeftSidebarOpen((prev) => !prev)}
        />

        {/* Resizable Panels Group (v4 API: Group, Panel, Separator) */}
        <Group orientation="horizontal" className="h-full flex-1">
          {/* Collapsible Left Panel (Explorer / Search / Git / Settings) */}
          {leftSidebarOpen && (
            <>
              <Panel defaultSize="20%" minSize="15%" maxSize="35%">
                {leftNavActive === "files" && (
                  <FileExplorerSidebar
                    workspaceName={workspaceId}
                    tree={tree}
                    isLoading={isTreeLoading}
                    onRefresh={() => refetchTree()}
                  />
                )}
                {leftNavActive === "search" && (
                  <SearchSidebar workspaceId={workspaceId} />
                )}
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
