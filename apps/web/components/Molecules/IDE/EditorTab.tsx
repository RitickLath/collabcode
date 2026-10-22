"use client"

import React from "react"
import { X } from "lucide-react"
import { IdeTab } from "@/types/ide"

interface EditorTabProps {
  tab: IdeTab
  isActive: boolean
  onSelect: () => void
  onClose: () => void
}

export const EditorTab: React.FC<EditorTabProps> = ({
  tab,
  isActive,
  onSelect,
  onClose,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group flex h-full cursor-pointer items-center gap-1.5 border-r border-border/30 px-3 text-xs transition-colors select-none ${
        isActive
          ? "border-t-2 border-t-primary bg-background font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
      }`}
    >
      <span className="truncate">{tab.name}</span>

      {tab.isDirty ? (
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
