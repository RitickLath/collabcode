"use client"

import React from "react"
import { Search } from "lucide-react"
import { Input } from "@workspace/ui/components/atom/input"

interface WorkspaceFilterBarProps {
  categories: readonly string[]
  activeCategory: string
  onSelectCategory: (cat: string) => void
  search: string
  onSearchChange: (search: string) => void
  placeholder?: string
}

export const WorkspaceFilterBar: React.FC<WorkspaceFilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  search,
  onSearchChange,
  placeholder = "Search workspaces...",
}) => {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/40 bg-muted/15 p-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              activeCategory === cat
                ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8.5 w-full border-border/50 bg-card/40 pr-3 pl-8 text-xs sm:w-72"
        />
      </div>
    </div>
  )
}
