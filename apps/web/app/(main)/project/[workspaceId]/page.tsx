"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Terminal, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"
import { EditorTab } from "@/components/Molecules/IDE/EditorTab"
import { BreadcrumbsBar } from "@/components/Molecules/IDE/BreadcrumbsBar"
import { TerminalDrawer } from "@/components/Molecules/IDE/TerminalDrawer"
import { MonacoEditorCanvas } from "@/components/Organism/IDE/MonacoEditorCanvas"
import { SandboxStatusOverlay } from "@/components/Molecules/IDE/SandboxStatusOverlay"
import { useExplorer } from "@/store/useExplorer"
import { useIdeLayout } from "@/store/useIdeLayout"
import { useInitContainer } from "@/queries/docker.query"

export default function ProjectEditorPage() {
  const params = useParams()
  const workspaceId = params?.workspaceId as string
  const {
    mutate: initContainer,
    isPending: isBootingContainer,
    isError,
    isSuccess,
    error,
  } = useInitContainer()

  const {
    activeFiles,
    currentActiveFile,
    setCurrentActiveFile,
    removeActiveFile,
  } = useExplorer()

  const [terminalOpen, setTerminalOpen] = useState(false)
  const {
    leftSidebarOpen,
    rightChatOpen,
    setLeftSidebarOpen,
    setRightChatOpen,
  } = useIdeLayout()

  // Track initialized workspace to prevent duplicate React StrictMode / re-render calls
  const initializedWorkspaceRef = React.useRef<string | null>(null)

  // Initialize or verify the workspace container on mount
  useEffect(() => {
    if (workspaceId && initializedWorkspaceRef.current !== workspaceId) {
      initializedWorkspaceRef.current = workspaceId
      initContainer(workspaceId)
    }
  }, [workspaceId, initContainer])

  const areBothCollapsed = !leftSidebarOpen && !rightChatOpen

  const handleToggleSidebars = () => {
    if (areBothCollapsed) {
      setLeftSidebarOpen(true)
      setRightChatOpen(true)
    } else {
      setLeftSidebarOpen(false)
      setRightChatOpen(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Support Command on macOS and Ctrl on Windows/Linux
      const isMod = e.metaKey || e.ctrlKey

      if (isMod && e.key.toLowerCase() === "b") {
        e.preventDefault()
        e.stopPropagation()
        setLeftSidebarOpen((prev) => !prev)
      } else if (isMod && (e.key === "`" || e.key === "~")) {
        e.preventDefault()
        e.stopPropagation()
        setTerminalOpen((prev) => !prev)
      } else if (isMod && e.key.toLowerCase() === "j") {
        e.preventDefault()
        e.stopPropagation()
        setRightChatOpen((prev) => !prev)
      } else if (isMod && e.key.toLocaleLowerCase() == "w") {
        e.preventDefault()
        e.stopPropagation()
        if (currentActiveFile) removeActiveFile(currentActiveFile.id)
      }
    }

    window.addEventListener("keydown", handleKeyDown, { capture: true })

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true })
    }
  }, [setLeftSidebarOpen, setRightChatOpen])

  // 1. Show sleek loading screen while container is being spun up / mounted
  if (isBootingContainer || (!isSuccess && !isError)) {
    return <SandboxStatusOverlay status="loading" workspaceName={workspaceId} />
  }

  // 2. Show clear error overlay with retry button if Docker container boot failed
  if (isError) {
    return (
      <SandboxStatusOverlay
        status="error"
        errorMessage={
          (error as any)?.response?.data?.message || (error as any)?.message
        }
        onRetry={() => initContainer(workspaceId)}
      />
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* 1. EDITOR TABS BAR */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border/40 bg-card/20 px-1 select-none">
        <div className="flex h-full items-center gap-0.5 overflow-x-auto">
          {activeFiles.map((file) => (
            <EditorTab
              key={file.path}
              tab={file}
              isActive={file.path === currentActiveFile?.path}
              onSelect={() => setCurrentActiveFile(file)}
              onClose={() => removeActiveFile(file.id)}
            />
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1 pr-2">
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 text-muted-foreground hover:text-foreground ${terminalOpen ? "bg-muted/50 text-foreground" : ""}`}
            onClick={() => setTerminalOpen((prev) => !prev)}
            title="Toggle Bottom Terminal"
          >
            <Terminal className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSidebars}
            title={areBothCollapsed ? "Restore Panels" : "Maximize Editor"}
            className={`h-6 w-6 text-muted-foreground hover:text-foreground ${areBothCollapsed ? "bg-muted/50 text-foreground" : ""}`}
          >
            {areBothCollapsed ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* 2. VS CODE BREADCRUMBS BAR */}
      <BreadcrumbsBar currentActiveFile={currentActiveFile} />

      {/* 3. EDITOR CANVAS */}
      <div className="relative flex flex-1 overflow-hidden">
        <MonacoEditorCanvas />
      </div>

      {/* 3. BOTTOM TERMINAL DRAWER */}
      <TerminalDrawer
        isOpen={terminalOpen}
        workspaceId={workspaceId}
        onClose={() => setTerminalOpen(false)}
      />
    </div>
  )
}
