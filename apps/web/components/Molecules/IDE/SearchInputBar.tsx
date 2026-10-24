"use client"

import React from "react"
import { Search as SearchIcon, CaseSensitive, X } from "lucide-react"

interface SearchInputBarProps {
  query: string
  searchIn: "content" | "filename"
  matchCase: boolean
  onQueryChange: (val: string) => void
  onToggleMatchCase: () => void
  onClear: () => void
}

export const SearchInputBar: React.FC<SearchInputBarProps> = ({
  query,
  searchIn,
  matchCase,
  onQueryChange,
  onToggleMatchCase,
  onClear,
}) => {
  return (
    <div className="p-2">
      <div className="relative flex items-center rounded border border-border/60 bg-background/50 px-2 focus-within:border-primary/80 focus-within:ring-1 focus-within:ring-primary/40">
        <SearchIcon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
        <input
          type="text"
          placeholder={
            searchIn === "content"
              ? "Search code, text..."
              : "Search filename..."
          }
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="h-7 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
          autoFocus
        />

        {query && (
          <button
            type="button"
            onClick={onClear}
            className="mr-1 text-muted-foreground/60 hover:text-foreground"
            title="Clear input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {searchIn === "content" && (
          <button
            type="button"
            onClick={onToggleMatchCase}
            className={`rounded p-0.5 transition-colors ${
              matchCase
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground/60 hover:text-foreground"
            }`}
            title="Match Case (Case-Sensitive)"
          >
            <CaseSensitive className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
