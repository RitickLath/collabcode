import { create } from "zustand"

export interface ActiveFile {
  id: string | number
  name: string
  path: string
  content?: string
  extension?: string
}

export interface ExplorerStore {
  activeFiles: ActiveFile[]
  currentActiveFile: ActiveFile | null
  addActiveFile: (newActiveFile: ActiveFile) => void
  removeActiveFile: (id: string | number) => void
  setCurrentActiveFile: (currentActiveFile: ActiveFile | null) => void
  updateActiveFileContent: (path: string, content: string) => void
}

export const useExplorer = create<ExplorerStore>((set) => ({
  activeFiles: [],
  currentActiveFile: null,

  addActiveFile: (newActiveFile) =>
    set((state) => {
      // Prevent duplicate tabs by path or id
      const exists = state.activeFiles.some(
        (file) =>
          file.path === newActiveFile.path || file.id === newActiveFile.id
      )
      if (exists) {
        return { currentActiveFile: newActiveFile }
      }
      return {
        activeFiles: [...state.activeFiles, newActiveFile],
        currentActiveFile: newActiveFile,
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
      }
    }),

  setCurrentActiveFile: (currentActiveFile) => set({ currentActiveFile }),

  updateActiveFileContent: (path, content) =>
    set((state) => ({
      activeFiles: state.activeFiles.map((file) =>
        file.path === path ? { ...file, content } : file
      ),
      currentActiveFile:
        state.currentActiveFile?.path === path
          ? { ...state.currentActiveFile, content }
          : state.currentActiveFile,
    })),
}))
