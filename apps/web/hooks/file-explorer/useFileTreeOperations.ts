import { useTreeExpansion } from "./useTreeExpansion"
import { useFileOpener } from "./useFileOpener"
import { useEntryCreation } from "./useEntryCreation"

interface UseFileTreeOperationsProps {
  workspaceName: string
  onRefresh?: () => void
}

const useFileTreeOperations = ({
  workspaceName,
  onRefresh,
}: UseFileTreeOperationsProps) => {
  const { expandedPaths, handleToggleFolder, handleCollapseAll, expandPaths } =
    useTreeExpansion()

  const { onSelectFile } = useFileOpener(workspaceName)

  const {
    creatingEntry,
    onCreateFile,
    onCreateFolder,
    onSubmitCreateEntry,
    onCancelCreateEntry,
  } = useEntryCreation(workspaceName, { expandPaths, onRefresh })

  return {
    expandedPaths,
    creatingEntry,
    handleToggleFolder,
    handleCollapseAll,
    onSelectFile,
    onCreateFile,
    onCreateFolder,
    onSubmitCreateEntry,
    onCancelCreateEntry,
  }
}

export default useFileTreeOperations
