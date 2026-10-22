import { create } from "zustand"

interface IdeLayoutStore {
  leftSidebarOpen: boolean
  rightChatOpen: boolean
  setLeftSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  setRightChatOpen: (open: boolean | ((prev: boolean) => boolean)) => void
}

export const useIdeLayout = create<IdeLayoutStore>((set) => ({
  leftSidebarOpen: true,
  rightChatOpen: true,

  // Supports both direct value (true/false) or functional updater ((prev) => !prev)
  setLeftSidebarOpen: (action) =>
    set((state) => ({
      leftSidebarOpen:
        typeof action === "function" ? action(state.leftSidebarOpen) : action,
    })),

  setRightChatOpen: (action) =>
    set((state) => ({
      rightChatOpen:
        typeof action === "function" ? action(state.rightChatOpen) : action,
    })),
}))
