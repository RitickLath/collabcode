"use client"

import React, { useState } from "react"
import {
  Search as SearchIcon,
  CaseSensitive,
  Regex,
  WholeWord,
  RefreshCw,
} from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"

interface SearchSidebarProps {
  onSearch?: (query: string) => void
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("")
  const [matchCase, setMatchCase] = useState(false)
  const [matchWord, setMatchWord] = useState(false)
  const [useRegex, setUseRegex] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch?.(query)
    }
  }

  return (
    <aside className="flex h-full w-full flex-col border-r border-border/50 bg-card/25 backdrop-blur-xs select-none">
      {/* Header */}
      <div className="flex h-9 items-center justify-between border-b border-border/40 px-3">
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Search
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => query && onSearch?.(query)}
          title="Refresh Search"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Search Input Bar with VS Code Filters */}
      <div className="p-2">
        <div className="relative flex items-center rounded border border-border/60 bg-background/50 px-2 focus-within:border-primary/80 focus-within:ring-1 focus-within:ring-primary/40">
          <SearchIcon className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-7 w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          {/* Quick toggle filters */}
          <div className="flex items-center gap-0.5 pl-1">
            <button
              type="button"
              onClick={() => setMatchCase((prev) => !prev)}
              className={`rounded p-0.5 transition-colors ${
                matchCase
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
              title="Match Case (Alt+C)"
            >
              <CaseSensitive className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMatchWord((prev) => !prev)}
              className={`rounded p-0.5 transition-colors ${
                matchWord
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
              title="Match Whole Word (Alt+W)"
            >
              <WholeWord className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setUseRegex((prev) => !prev)}
              className={`rounded p-0.5 transition-colors ${
                useRegex
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
              title="Use Regular Expression (Alt+R)"
            >
              <Regex className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results placeholder */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center text-muted-foreground">
        <SearchIcon className="mb-2 h-7 w-7 stroke-[1.5] text-muted-foreground/40" />
        <p className="text-[11px] font-medium">
          {query ? "Press Enter to search" : "No search query entered"}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground/60">
          Find text across all files in workspace
        </p>
      </div>
    </aside>
  )
}
