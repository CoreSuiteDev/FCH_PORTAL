import { create } from "zustand"
import { SupportTicket } from "@/constants/communication-data"
import { PaginationState, Updater } from "@tanstack/react-table"

interface CommunicationState {
  memberPagination: PaginationState
  supportPagination: PaginationState
  memberFilter: string
  supportFilter: string
  selectedSupport: SupportTicket | null
  setMemberPagination: (updater: Updater<PaginationState>) => void
  setSupportPagination: (updater: Updater<PaginationState>) => void
  setMemberFilter: (filter: string) => void
  setSupportFilter: (filter: string) => void
  setSelectedSupport: (ticket: SupportTicket | null) => void
}

export const useCommunicationStore = create<CommunicationState>((set) => ({
  memberPagination: { pageIndex: 0, pageSize: 5 },
  supportPagination: { pageIndex: 0, pageSize: 5 },
  memberFilter: "",
  supportFilter: "",
  selectedSupport: null,
  setMemberPagination: (updater) =>
    set((state) => ({
      memberPagination:
        typeof updater === "function"
          ? updater(state.memberPagination)
          : updater,
    })),
  setSupportPagination: (updater) =>
    set((state) => ({
      supportPagination:
        typeof updater === "function"
          ? updater(state.supportPagination)
          : updater,
    })),
  setMemberFilter: (filter) => set({ memberFilter: filter }),
  setSupportFilter: (filter) => set({ supportFilter: filter }),
  setSelectedSupport: (ticket) => set({ selectedSupport: ticket }),
}))
