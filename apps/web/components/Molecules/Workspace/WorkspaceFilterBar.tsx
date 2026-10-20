"use client"

import React from "react"
import { Search, Crown, Users } from "lucide-react"
import { Input } from "@workspace/ui/components/atom/input"

export type RoleFilterOption = "all" | "owner" | "member"

interface WorkspaceFilterBarProps {
  categories: readonly string[]
  activeCategory: string
  onSelectCategory: (cat: string) => void
  search: string
  onSearchChange: (search: string) => void
  roleFilter: RoleFilterOption
  onRoleFilterChange: (role: RoleFilterOption) => void
  placeholder?: string
}

export const WorkspaceFilterBar: React.FC<WorkspaceFilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  placeholder = "Search workspaces...",
}) => {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        {/* Ownership Segment Control: All / Owned by me / Shared with me */}
        <div className="flex items-center gap-1 rounded-xl border border-border/50 bg-muted/20 p-1">
          <button
            type="button"
            onClick={() => onRoleFilterChange("all")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              roleFilter === "all"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>All Workspaces</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleFilterChange("owner")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              roleFilter === "owner"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Crown className="h-3 w-3 text-amber-400" />
            <span>Owned by me</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleFilterChange("member")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              roleFilter === "member"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-3 w-3 text-blue-400" />
            <span>Shared with me</span>
          </button>
        </div>

        {/* Search Input */}
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

      {/* Tech Stack / Framework Categories */}
      <div className="flex w-fit flex-wrap items-center gap-1.5 rounded-lg border border-border/40 bg-muted/15 p-1">
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
    </div>
  )
}
