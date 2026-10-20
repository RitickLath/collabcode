"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/atom/button"
import { PaginationMeta } from "@/types/workspace"

interface WorkspacePaginationProps {
  meta: PaginationMeta
  onPageChange: (newPage: number) => void
}

export const WorkspacePagination: React.FC<WorkspacePaginationProps> = ({
  meta,
  onPageChange,
}) => {
  const { page, totalPages, total, limit } = meta

  if (totalPages <= 1 && total <= limit) {
    return null
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-4 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{start}</span>–
        <span className="font-semibold text-foreground">{end}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span>{" "}
        workspaces
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(page - 1)}
          className="h-8 gap-1 border-border/50 bg-card/40 px-2.5 text-xs hover:bg-muted"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <span className="rounded-md border border-border/50 bg-card/60 px-2.5 py-1 font-mono text-foreground shadow-2xs">
            {page}
          </span>
          <span>/</span>
          <span className="px-1 font-mono">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="h-8 gap-1 border-border/50 bg-card/40 px-2.5 text-xs hover:bg-muted"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
