import { create } from "zustand"

export interface ActiveFile {
  id: string | number
  name: string
  path: string
  content?: string
  extension?: string
  isLoading?: boolean
  focusLine?: string
}

export interface ExplorerStore {
  activeFiles: ActiveFile[]
  currentActiveFile: ActiveFile | null
  lastActivityPath: string
  setLastActivityPath: (path: string) => void
  addActiveFile: (newActiveFile: ActiveFile) => void
  removeActiveFile: (id: string | number) => void
  setCurrentActiveFile: (currentActiveFile: ActiveFile | null) => void
  updateActiveFileContent: (path: string, content: string) => void
  clearFocusLine: (path: string) => void
}

export const useExplorer = create<ExplorerStore>((set) => ({
  activeFiles: [],
  currentActiveFile: null,
  // Tracks the most recently clicked directory or tab path to target file/folder creation
  lastActivityPath: "",

  setLastActivityPath: (lastActivityPath) => set({ lastActivityPath }),

  addActiveFile: (newActiveFile) =>
    set((state) => {
      // Prevent duplicate tabs by path or id, update if already open
      const exists = state.activeFiles.some(
        (file) =>
          file.path === newActiveFile.path || file.id === newActiveFile.id
      )
      if (exists) {
        return {
          activeFiles: state.activeFiles.map((file) =>
            file.path === newActiveFile.path || file.id === newActiveFile.id
              ? { ...file, ...newActiveFile }
              : file
          ),
          currentActiveFile: newActiveFile,
          lastActivityPath: newActiveFile.path,
        }
      }
      return {
        activeFiles: [...state.activeFiles, newActiveFile],
        currentActiveFile: newActiveFile,
        lastActivityPath: newActiveFile.path,
      }
    }),

  removeActiveFile: (id) =>
    set((state) => {
      const remainingFiles = state.activeFiles.filter((file) => file.id !== id)
      const nextActiveFile =
        state.currentActiveFile?.id === id
          ? remainingFiles[remainingFiles.length - 1] || null
          : state.currentActiveFile

      return {
        activeFiles: remainingFiles,
        currentActiveFile: nextActiveFile,
        lastActivityPath: nextActiveFile ? nextActiveFile.path : "",
      }
    }),

  setCurrentActiveFile: (currentActiveFile) =>
    set({
      currentActiveFile,
      lastActivityPath: currentActiveFile ? currentActiveFile.path : "",
    }),

  updateActiveFileContent: (path, content) =>
    set((state) => ({
      activeFiles: state.activeFiles.map((file) =>
        file.path === path ? { ...file, content, isLoading: false } : file
      ),
      currentActiveFile:
        state.currentActiveFile?.path === path
          ? { ...state.currentActiveFile, content, isLoading: false }
          : state.currentActiveFile,
    })),

  clearFocusLine: (path) =>
    set((state) => ({
      activeFiles: state.activeFiles.map((file) =>
        file.path === path ? { ...file, focusLine: undefined } : file
      ),
      currentActiveFile:
        state.currentActiveFile?.path === path
          ? { ...state.currentActiveFile, focusLine: undefined }
          : state.currentActiveFile,
    })),
}))
