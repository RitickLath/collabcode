import { FileExplorerService } from "@/services/fileExplorer.service"
import { useExplorer } from "@/store/useExplorer"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export function useFileOpener(workspaceName: string) {
  const queryClient = useQueryClient()
  const {
    activeFiles,
    addActiveFile,
    updateActiveFileContent,
    removeActiveFile,
  } = useExplorer()

  const onSelectFile = async (
    filePath: string,
    focusLine?: number | string
  ) => {
    const alreadyOpen = activeFiles.find((file) => file.path === filePath)
    if (alreadyOpen) {
      addActiveFile({
        ...alreadyOpen,
        focusLine: focusLine !== undefined ? String(focusLine) : undefined,
      })
      return
    }

    // Extract name and extension from path for immediate tab display
    const fileName = filePath.split("/").pop() || filePath
    const fileExt = fileName.includes(".")
      ? `.${fileName.split(".").pop()}`
      : ""

    // 1. Instantly open tab in editor with loading indicator
    addActiveFile({
      id: filePath,
      name: fileName,
      path: filePath,
      extension: fileExt,
      content: "",
      isLoading: true,
      focusLine: focusLine !== undefined ? String(focusLine) : undefined,
    })

    // 2. Fetch full file content and hydrate buffer
    try {
      const data = await queryClient.ensureQueryData({
        queryKey: ["file-content", workspaceName, filePath],
        queryFn: () =>
          FileExplorerService.getFileContent(workspaceName, filePath),
        staleTime: 1000 * 60 * 2,
      })

      updateActiveFileContent(filePath, data.content)
    } catch (err: any) {
      // Cleanly revert optimistic tab if fetch fails
      removeActiveFile(filePath)
      toast.error(err?.message || "Failed to open file")
    }
  }

  return { onSelectFile }
}
