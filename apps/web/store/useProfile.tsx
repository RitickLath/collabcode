import { create } from "zustand"

export const useProfile = create((set) => ({
  profile: null,
  setProfile: (profile: any) => set({ profile }),
}))
