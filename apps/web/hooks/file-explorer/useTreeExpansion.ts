import { useState } from "react"
import { useExplorer } from "@/store/useExplorer"

export function useTreeExpansion() {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const { setLastActivityPath } = useExplorer()

  const handleToggleFolder = (folderPath: string) => {
    setLastActivityPath(folderPath)

    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(folderPath)) {
        next.delete(folderPath)
      } else {
        next.add(folderPath)
      }
      return next
    })
  }

  const handleCollapseAll = () => {
    setExpandedPaths(new Set())
  }

  const expandPaths = (paths: string[]) => {
    setExpandedPaths((prev) => new Set([...prev, ...paths]))
  }

  return {
    expandedPaths,
    handleToggleFolder,
    handleCollapseAll,
    expandPaths,
  }
}
