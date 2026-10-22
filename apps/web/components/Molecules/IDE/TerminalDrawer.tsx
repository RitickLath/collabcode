"use client"

import React, { useState } from "react"
import { X, Terminal as TerminalIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"

interface TerminalDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"terminal" | "output" | "ports">(
    "terminal"
  )

  if (!isOpen) return null

  return (
    <div className="flex h-44 shrink-0 flex-col border-t border-border/50 bg-black/60 backdrop-blur-md select-none">
      {/* Header Tabs */}
      <div className="flex h-7 items-center justify-between border-b border-border/30 bg-muted/20 px-3">
        <div className="flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`cursor-pointer transition-colors ${
              activeTab === "terminal"
                ? "border-b border-primary pb-0.5 text-foreground"
                : "hover:text-foreground"
            }`}
          >
            TERMINAL
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`cursor-pointer transition-colors ${
              activeTab === "output"
                ? "border-b border-primary pb-0.5 text-foreground"
                : "hover:text-foreground"
            }`}
          >
            OUTPUT
          </button>
          <button
            onClick={() => setActiveTab("ports")}
            className={`cursor-pointer transition-colors ${
              activeTab === "ports"
                ? "border-b border-primary pb-0.5 text-foreground"
                : "hover:text-foreground"
            }`}
          >
            PORTS
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Terminal View Area */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px] leading-5 text-zinc-300">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TerminalIcon className="h-3 w-3" />
          <span>
            Interactive terminal ready. Commands will execute in workspace
            container.
          </span>
        </div>
      </div>
    </div>
  )
}
