"use client"

import React from "react"
import Link from "next/link"
import {
  Code2,
  Play,
  Terminal,
  Share2,
  PanelLeftClose,
  Sparkles,
} from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"

interface IdeHeaderProps {
  workspaceName?: string
  rightChatOpen: boolean
  onToggleRightChat: () => void
  onShare?: () => void
}

export const IdeHeader: React.FC<IdeHeaderProps> = ({
  workspaceName = "workspace",
  rightChatOpen,
  onToggleRightChat,
  onShare,
}) => {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-border/50 bg-card/60 px-3 backdrop-blur-md select-none">
      {/* Left: Brand + Breadcrumbs */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 transition hover:text-foreground"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 className="h-3.5 w-3.5" />
          </div>
          <span className="hidden sm:inline">CollabCode</span>
        </Link>
      </div>

      {/* Center: Quick Execution Actions */}
      <div className="hidden items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 p-1 md:flex">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 gap-1 px-2 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
        >
          <Play className="h-3 w-3 fill-emerald-400" />
          <span>Run</span>
        </Button>
        <div className="h-3 w-px bg-border/60" />
        <Button
          size="sm"
          variant="ghost"
          className="h-6 gap-1 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          <Terminal className="h-3 w-3" />
          <span>Terminal</span>
        </Button>
      </div>

      {/* Right: Layout toggles and Share */}
      <div className="flex items-center gap-1.5">
        {onShare && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 px-2 text-xs font-medium hover:bg-primary/10 hover:text-primary"
            onClick={onShare}
          >
            <Share2 className="h-3 w-3" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        )}

        {/* Toggle AI Copilot */}
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 text-muted-foreground hover:text-foreground ${rightChatOpen ? "bg-primary/10 text-primary" : ""}`}
          onClick={onToggleRightChat}
          title="Toggle AI Code Assistant"
        >
          <Sparkles className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  )
}
