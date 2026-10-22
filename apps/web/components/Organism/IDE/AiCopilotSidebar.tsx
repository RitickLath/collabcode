"use client"

import React, { useState } from "react"
import { Sparkles, Bot, PanelRightClose, Send } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"

interface AiCopilotSidebarProps {
  onClose: () => void
}

export const AiCopilotSidebar: React.FC<AiCopilotSidebarProps> = ({
  onClose,
}) => {
  const [prompt, setPrompt] = useState("")

  return (
    <aside className="flex h-full w-full flex-col border-l border-border/50 bg-card/30 backdrop-blur-md select-none">
      {/* Header */}
      <div className="flex h-9 items-center justify-between border-b border-border/40 px-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>CollabCode AI</span>
          <span className="py-0.2 rounded-full bg-primary/10 px-1.5 text-[9px] font-semibold text-primary">
            Copilot
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={onClose}
          title="Close AI Assistant"
        >
          <PanelRightClose className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Message thread */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3 text-xs">
        <div className="flex gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <div className="rounded-xl border border-border/40 bg-muted/40 p-2.5 text-foreground/90 shadow-2xs">
            <p className="leading-relaxed">
              Hello! I&apos;m your coding assistant for this workspace. Ask me
              to explain code, generate components, or help fix bugs.
            </p>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border/40 p-2.5">
        <div className="relative flex items-center rounded-xl border border-border/60 bg-muted/30 p-1.5 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI or type /..."
            className="w-full bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          <Button
            size="icon"
            className="h-6 w-6 shrink-0 rounded-lg"
            disabled={!prompt.trim()}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
        <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-muted-foreground/60">
          <span>Press Enter to send</span>
          <span>CollabCode Agent</span>
        </div>
      </div>
    </aside>
  )
}
