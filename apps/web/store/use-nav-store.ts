import { create } from "zustand"

interface NavState {
  isOpen: boolean
  setOpen: (open: boolean) => void
}

export const useNavStore = create<NavState>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}))
