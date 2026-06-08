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

  // Computed Logics / Stats
  getNeedsAttentionCount: () => number
  getActivePrivilegedCount: () => number
  getMfaPercentage: () => number
}

export const useBoardAccessStore = create<BoardAccessState>((set, get) => ({
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

  // 1. Needs Attention Logic (Filters Inactive Accounts)
  getNeedsAttentionCount: () => {
    const list = get().accessList
    return list.filter(
      (m) => m.lastActive.includes("Yesterday") || m.lastActive.includes("days")
    ).length
  },

  // 2. Active Privileged Scope Logic
  getActivePrivilegedCount: () => {
    const list = get().accessList
    return list.filter(
      (m) =>
        (m.clearanceLevel === "Board" || m.clearanceLevel === "Pastoral") &&
        !m.lastActive.includes("Yesterday")
    ).length
  },

  // 3. MFA System Health Percentage Logic
  getMfaPercentage: () => {
    const list = get().accessList
    const total = list.length
    if (total === 0) return 0
    const mfaEnabled = list.filter((m) => m.mfaStatus === "Enabled").length
    return Math.round((mfaEnabled / total) * 100)
  },
}))
