import { Types } from "mongoose";
import { create } from "zustand"

type User = { username: string; fullname: string, idUser: Types.ObjectId }

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
