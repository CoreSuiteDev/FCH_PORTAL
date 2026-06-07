// src/store/use-manage-user-store.ts
import { create } from "zustand"
import { UserMember, userMembersData } from "@/constants/manage-users-data"

interface ManageUserStore {
  // State
  users: UserMember[]
  globalFilter: string
  selectedTier: string

  // Dialog State
  isDeleteDialogOpen: boolean
  userToDeleteId: string | null

  // Actions
  setGlobalFilter: (filter: string) => void
  setSelectedTier: (tier: string) => void
  toggleUserStatus: (id: string) => void

  // Dialog Actions
  openDeleteDialog: (id: string) => void
  closeDeleteDialog: () => void
  confirmDeleteUser: () => void
}

export const useManageUserStore = create<ManageUserStore>((set) => ({
  // Initial State
  users: userMembersData,
  globalFilter: "",
  selectedTier: "All",
  isDeleteDialogOpen: false,
  userToDeleteId: null,

  // Actions
  setGlobalFilter: (filter) => set({ globalFilter: filter }),
  setSelectedTier: (tier) => set({ selectedTier: tier }),

  toggleUserStatus: (id) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Suspended" : "Active",
            }
          : user
      ),
    })),

  openDeleteDialog: (id) =>
    set({ isDeleteDialogOpen: true, userToDeleteId: id }),
  closeDeleteDialog: () =>
    set({ isDeleteDialogOpen: false, userToDeleteId: null }),

  confirmDeleteUser: () =>
    set((state) => {
      if (!state.userToDeleteId) return {}
      return {
        users: state.users.filter((user) => user.id !== state.userToDeleteId),
        isDeleteDialogOpen: false,
        userToDeleteId: null,
      }
    }),
}))
