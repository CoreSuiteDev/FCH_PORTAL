// @/store/use-board-access-store.ts

import { create } from "zustand"
import {
  BoardMemberAccess,
  boardMembersAccessData,
  AllowedClearance,
} from "@/constants/board-access-data"

interface BoardAccessState {
  accessList: BoardMemberAccess[]
  globalFilter: string
  selectedTier: string
  setGlobalFilter: (filter: string) => void
  setSelectedTier: (tier: string) => void
  updateClearanceLevel: (id: string, level: AllowedClearance) => void
  rotateTokens: () => void
}

export const useBoardAccessStore = create<BoardAccessState>((set) => ({
  accessList: boardMembersAccessData,
  globalFilter: "",
  selectedTier: "All",
  setGlobalFilter: (filter) => set({ globalFilter: filter }),
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  updateClearanceLevel: (id, level) =>
    set((state) => ({
      accessList: state.accessList.map((member) =>
        member.id === id ? { ...member, clearanceLevel: level } : member
      ),
    })),
  rotateTokens: () => {
    alert("Privilege tokens rotated successfully across cloud directories.")
  },
}))
