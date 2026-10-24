import { create } from "zustand"

export interface JoinedUser {
  userId: string
  username: string
  workspaceId: string
}
interface WorkspaceSocketStore {
  joinedUsers: JoinedUser[]
  setUserJoin: (data: JoinedUser) => void
  setUserLeave: (data: JoinedUser) => void
  setUsers: (data: JoinedUser[]) => void
}

export const useWorkspaceSocketStore = create<WorkspaceSocketStore>((set) => ({
  joinedUsers: [],

  setUserJoin: (data) =>
    set((state) => ({
      joinedUsers: [
        ...state.joinedUsers.filter((user) => user.userId !== data.userId),
        data,
      ],
    })),

  setUserLeave: (data) =>
    set((state) => ({
      joinedUsers: state.joinedUsers.filter(
        (user) => user.userId !== data.userId
      ),
    })),

  setUsers: (data) =>
    set({
      joinedUsers: data,
    }),
}))
