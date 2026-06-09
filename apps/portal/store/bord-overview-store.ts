import { create } from "zustand"

interface BoardState {
  isBoardMember: boolean
  nextMeeting: string | null
  pendingVotes: number
  // Actions
  setBoardStatus: (status: boolean) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  isBoardMember: false, // This would be populated from your Okta/Auth session
  nextMeeting: "June 25, 2026 - 10:00 AM",
  pendingVotes: 3,
  setBoardStatus: (status) => set({ isBoardMember: status }),
}))
