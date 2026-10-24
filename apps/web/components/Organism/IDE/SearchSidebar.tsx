"use client"

import React, { useState } from "react"
import {
  Search as SearchIcon,
  FileCode,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"
import { useFileSearchQuery } from "@/queries/fileSearch.query"
import { useFileOpener } from "@/hooks/file-explorer/useFileOpener"
import { SearchInputBar } from "@/components/Molecules/IDE/SearchInputBar"
import { SearchResultsList } from "@/components/Molecules/IDE/SearchResultsList"
import useDebounce from "@/hooks/common/useDebounce"

interface SearchSidebarProps {
  workspaceId: string
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({
  workspaceId,
}) => {
  const [query, setQuery] = useState("")
  const [matchCase, setMatchCase] = useState(false)
  const [searchIn, setSearchIn] = useState<"content" | "filename">("content")

  const { onSelectFile } = useFileOpener(workspaceId)

  const debouncedQuery = useDebounce({ query })

  // Live auto search
  const { data, isLoading, refetch, isFetching } = useFileSearchQuery(
    {
      workspaceId,
      keyword: debouncedQuery,
      searchType: matchCase ? "case-sensitive" : "case-insensitive",
      searchIn,
    },
    { enabled: query.length >= 3 }
  )

  const results = data?.files || []

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
          onClick={() => refetch()}
          disabled={!query.trim() || isFetching}
          title="Refresh Search"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-primary" : ""}`}
          />
        </Button>
      </div>

      {/* Mode Selector */}
      <div className="flex border-b border-border/40 bg-muted/20 p-1">
        <button
          type="button"
          onClick={() => setSearchIn("content")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded py-1 text-[11px] font-medium transition ${
            searchIn === "content"
              ? "bg-background text-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-3 w-3" />
          <span>In Content</span>
        </button>
        <button
          type="button"
          onClick={() => setSearchIn("filename")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded py-1 text-[11px] font-medium transition ${
            searchIn === "filename"
              ? "bg-background text-foreground shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCode className="h-3 w-3" />
          <span>Files by Name</span>
        </button>
      </div>

      {/* Search Input Bar Molecule */}
      <SearchInputBar
        query={query}
        searchIn={searchIn}
        matchCase={matchCase}
        onQueryChange={setQuery}
        onToggleMatchCase={() => setMatchCase((prev) => !prev)}
        onClear={() => setQuery("")}
      />

      {/* Results Header Count */}
      {query.trim() && !isLoading && (
        <div className="border-b border-border/30 px-3 py-1 text-[10px] text-muted-foreground">
          {results.length} {results.length === 1 ? "result" : "results"}
        </div>
      )}

      {/* Results Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Loader2 className="mb-2 h-6 w-6 animate-spin text-primary" />
            <span className="text-xs">Searching workspace...</span>
          </div>
        ) : !query.trim() ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
            <SearchIcon className="mb-2 h-7 w-7 stroke-[1.5] text-muted-foreground/40" />
            <p className="text-[11px] font-medium">Type to search</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/60">
              {searchIn === "content"
                ? "Find text occurrences across your project"
                : "Quickly locate files by name"}
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
            <p className="text-xs font-medium">No results found</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground/60">
              No matching {searchIn === "content" ? "text" : "files"} found for
              &ldquo;{query}&rdquo;
            </p>
          </div>
        ) : (
          <SearchResultsList
            searchIn={searchIn}
            results={results}
            onOpenFile={onSelectFile}
          />
        )}
      </div>
    </aside>
  )
}
