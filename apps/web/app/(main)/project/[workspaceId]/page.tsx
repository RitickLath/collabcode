"use client"

import React, { useState } from "react"
import { Terminal, Maximize2, Code2 } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"
import { EditorTab } from "@/components/Molecules/IDE/EditorTab"
import { TerminalDrawer } from "@/components/Molecules/IDE/TerminalDrawer"
import { IdeTab } from "@/types/ide"

export default function ProjectEditorPage() {
  const [tabs, setTabs] = useState<IdeTab[]>([])
  const [activeTabPath, setActiveTabPath] = useState<string | null>(null)
  const [terminalOpen, setTerminalOpen] = useState(false)

  const activeTab = tabs.find((t) => t.path === activeTabPath)

  const handleCloseTab = (path: string) => {
    const nextTabs = tabs.filter((t) => t.path !== path)
    setTabs(nextTabs)
    if (activeTabPath === path) {
      setActiveTabPath(nextTabs[0]?.path || null)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* 1. EDITOR TABS BAR */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-border/40 bg-card/20 px-1 select-none">
        <div className="flex h-full items-center gap-0.5 overflow-x-auto">
          {tabs.map((tab) => (
            <EditorTab
              key={tab.path}
              tab={tab}
              isActive={tab.path === activeTabPath}
              onSelect={() => setActiveTabPath(tab.path)}
              onClose={() => handleCloseTab(tab.path)}
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
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* 2. EDITOR CANVAS */}
      <div className="relative flex flex-1 overflow-hidden font-mono text-xs">
        {activeTab ? (
          <div className="flex-1 overflow-y-auto p-4 text-foreground/90">
            {activeTab.content || "// Start writing code..."}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
            <Code2 className="mb-3 h-10 w-10 stroke-[1.2] text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground/80">
              No file open
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Select a file from the explorer sidebar on the left to start
              editing
            </p>
          </div>
        )}
      </div>

      {/* 3. BOTTOM TERMINAL DRAWER */}
      <TerminalDrawer
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
    </div>
  )
}
