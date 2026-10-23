import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CreatingEntryState } from "@/components/Molecules/IDE/FileTree"
import { FileExplorerService } from "@/services/fileExplorer.service"
import { useExplorer } from "@/store/useExplorer"

interface UseEntryCreationOptions {
  expandPaths: (paths: string[]) => void
  onRefresh?: () => void
}

export function useEntryCreation(
  workspaceName: string,
  { expandPaths, onRefresh }: UseEntryCreationOptions
) {
  const queryClient = useQueryClient()

  const { lastActivityPath, addActiveFile } = useExplorer()
  const [creatingEntry, setCreatingEntry] = useState<CreatingEntryState | null>(
    null
  )

  const getTargetDirPath = () => {
    if (!lastActivityPath) return ""
    const parts = lastActivityPath.split("/").filter(Boolean)
    if (parts.length > 0 && parts[parts.length - 1]?.includes(".")) {
      parts.pop()
    }
    return parts.join("/")
  }

  const expandTargetHierarchy = (targetDir: string) => {
    if (!targetDir) return
    const segments = targetDir.split("/").filter(Boolean)
    const pathsToExpand: string[] = []
    let current = ""
    for (const seg of segments) {
      current = current ? `${current}/${seg}` : seg
      pathsToExpand.push(current)
    }
    expandPaths(pathsToExpand)
  }

  const onCreateFile = () => {
    const parentPath = getTargetDirPath()
    expandTargetHierarchy(parentPath)
    setCreatingEntry({ parentPath, type: "FILE" })
  }

  const onCreateFolder = () => {
    const parentPath = getTargetDirPath()
    expandTargetHierarchy(parentPath)
    setCreatingEntry({ parentPath, type: "DIRECTORY" })
  }

  const onSubmitCreateEntry = async (name: string) => {
    if (!creatingEntry) return
    const parent = creatingEntry.parentPath
    const fullPath = parent ? `${parent}/${name}` : name
    const type = creatingEntry.type

    setCreatingEntry(null)

    try {
      await FileExplorerService.createEntry(workspaceName, {
        path: fullPath,
        type,
        content: type === "FILE" ? "" : undefined,
      })

      await queryClient.invalidateQueries({
        queryKey: ["file-tree", workspaceName],
      })
      onRefresh?.()

      if (type === "FILE") {
        const ext = fullPath.includes(".")
          ? `.${fullPath.split(".").pop()}`
          : ""
        addActiveFile({
          id: fullPath,
          name,
          path: fullPath,
          extension: ext,
          content: "",
        })
        toast.success(`Created file ${name}`)
      } else {
        expandPaths([fullPath])
        toast.success(`Created folder ${name}`)
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to create entry"
      )
    }
  }

  const onCancelCreateEntry = () => {
    setCreatingEntry(null)
  }

  return {
    creatingEntry,
    onCreateFile,
    onCreateFolder,
    onSubmitCreateEntry,
    onCancelCreateEntry,
  }
}
