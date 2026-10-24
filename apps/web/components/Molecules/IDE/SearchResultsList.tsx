"use client"

import React, { useState } from "react"
import { FileCode, ChevronRight, ChevronDown } from "lucide-react"
import {
  ContentSearchMatch,
  FilenameSearchMatch,
  SearchFileMatch,
} from "@workspace/types/fileSearch"

interface SearchResultsListProps {
  searchIn: "content" | "filename"
  results: SearchFileMatch[]
  onOpenFile: (path: string, lineNumber?: number) => void
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  searchIn,
  results,
  onOpenFile,
}) => {
  const [collapsedFiles, setCollapsedFiles] = useState<Record<string, boolean>>(
    {}
  )

  // Group content results by file path
  const groupedResults = React.useMemo(() => {
    if (searchIn === "filename") return {}

    const groups: Record<string, ContentSearchMatch[]> = {}
    ;(results as ContentSearchMatch[]).forEach((match) => {
      if (!groups[match.path]) {
        groups[match.path] = []
      }
      groups[match.path]!.push(match)
    })
    return groups
  }, [results, searchIn])

  const toggleFileCollapse = (path: string) => {
    setCollapsedFiles((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  if (searchIn === "filename") {
    return (
      <div className="divide-y divide-border/20">
        {(results as FilenameSearchMatch[]).map((match, i) => {
          const fileName = match.path.split("/").pop() || match.path
          const dirName = match.path.includes("/")
            ? match.path.substring(0, match.path.lastIndexOf("/"))
            : ""

          return (
            <button
              key={`${match.path}-${i}`}
              type="button"
              onClick={() => onOpenFile(match.path)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition hover:bg-muted/40"
            >
              <FileCode className="h-3.5 w-3.5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {fileName}
                </p>
                {dirName && (
                  <p className="truncate text-[10px] text-muted-foreground/70">
                    {dirName}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="divide-y divide-border/20">
      {Object.entries(groupedResults).map(([filePath, matches]) => {
        const isCollapsed = collapsedFiles[filePath]
        const fileName = filePath.split("/").pop() || filePath
        const dirName = filePath.includes("/")
          ? filePath.substring(0, filePath.lastIndexOf("/"))
          : ""

        return (
          <div key={filePath} className="group/file">
            {/* File group header */}
            <div
              onClick={() => toggleFileCollapse(filePath)}
              className="flex cursor-pointer items-center justify-between px-2.5 py-1.5 transition hover:bg-muted/40"
            >
              <div className="flex min-w-0 items-center gap-1.5">
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                )}
                <FileCode className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="truncate text-xs font-medium text-foreground">
                  {fileName}
                </span>
                {dirName && (
                  <span className="truncate text-[10px] text-muted-foreground/60">
                    {dirName}
                  </span>
                )}
              </div>
              <span className="ml-2 rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {matches.length}
              </span>
            </div>

            {/* Matching lines inside this file */}
            {!isCollapsed && (
              <div className="bg-background/25">
                {matches.map((m, idx) => (
                  <button
                    key={`${filePath}-${m.lineNumber}-${idx}`}
                    type="button"
                    onClick={() => onOpenFile(filePath, m?.lineNumber || 0)}
                    className="flex w-full items-start gap-2 py-1 pr-3 pl-7 text-left transition hover:bg-primary/10"
                  >
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">
                      {m.lineNumber}:
                    </span>
                    <span className="line-clamp-1 font-mono text-xs text-foreground/90">
                      {m.content}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
