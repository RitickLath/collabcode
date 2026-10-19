"use client"

import React from "react"
import { Badge } from "@workspace/ui/components/atom/badge"
import {
  Check,
  Box,
  Component,
  TerminalSquare,
  Bot,
  Code2,
  Layers,
} from "lucide-react"
import { StarterTemplate } from "@/constants/template"

interface TemplateCardProps {
  template: StarterTemplate
  isSelected: boolean
  onClick: () => void
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onClick,
}) => {
  const getIcon = (iconName: StarterTemplate["iconName"]) => {
    switch (iconName) {
      case "Box":
        return <Box className="h-4 w-4" />
      case "Component":
        return <Component className="h-4 w-4" />
      case "TerminalSquare":
        return <TerminalSquare className="h-4 w-4" />
      case "Bot":
        return <Bot className="h-4 w-4" />
      case "Code2":
        return <Code2 className="h-4 w-4" />
      case "Layers":
        return <Layers className="h-4 w-4" />
      default:
        return <Box className="h-4 w-4" />
    }
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      className={`relative flex h-full cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all duration-200 outline-none select-none ${
        isSelected
          ? "border-primary bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary))] ring-1 ring-primary/40"
          : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-gradient-to-tr ${template.color}`}
          >
            {getIcon(template.iconName)}
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              {template.title}
            </span>
          </div>
        </div>

        {isSelected && (
          <Badge
            variant="secondary"
            className="h-5 border border-primary/30 bg-primary/15 px-2 text-[10px] font-semibold text-primary"
          >
            <Check className="mr-1 h-3 w-3" />
            Selected
          </Badge>
        )}
      </div>

      <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
        {template.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        {template.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="h-5 border-border/60 bg-muted/30 px-1.5 text-[10px] font-normal text-muted-foreground"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
