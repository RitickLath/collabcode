import React from "react"
import { ChevronRight } from "lucide-react"
import { FileIcon } from "@workspace/ui/components/atom/FileIcon"
import { ActiveFile } from "@/store/useExplorer"

interface BreadcrumbsBarProps {
  currentActiveFile: ActiveFile | null
}

export const BreadcrumbsBar: React.FC<BreadcrumbsBarProps> = ({
  currentActiveFile,
}) => {
  if (!currentActiveFile) return null

  const segments = currentActiveFile.path.split("/").filter(Boolean)

  return (
    <div className="flex h-6 shrink-0 items-center gap-1 border-b border-border/30 bg-background/50 px-3 font-mono text-[11px] text-muted-foreground select-none">
      {segments.map((segment, idx) => {
        const isLast = idx === segments.length - 1

        return (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-1 hover:text-foreground">
              {isLast && (
                <span className="flex h-3.5 w-3.5 items-center justify-center">
                  <FileIcon name={segment} />
                </span>
              )}
              <span
                className={
                  isLast
                    ? "font-medium text-foreground/90"
                    : "text-muted-foreground/80"
                }
              >
                {segment}
              </span>
            </div>
            {!isLast && (
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
