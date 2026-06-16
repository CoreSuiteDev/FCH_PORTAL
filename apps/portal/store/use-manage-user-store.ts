import { create } from "zustand"
import { UserMember, userMembersData } from "@/constants/manage-users-data"

interface ManageUserStore {
  users: UserMember[]
  globalFilter: string
  selectedTier: string
  selectedStatus: string
  isDeleteDialogOpen: boolean
  userToDeleteId: string | null

  setGlobalFilter: (filter: string) => void
  setSelectedTier: (tier: string) => void
  setSelectedStatus: (status: string) => void
  toggleUserStatus: (id: string) => void
  openDeleteDialog: (id: string) => void
  closeDeleteDialog: () => void
  confirmDeleteUser: () => void
}

export const useManageUserStore = create<ManageUserStore>((set) => ({
  users: userMembersData,
  globalFilter: "",
  selectedTier: "All",
  selectedStatus: "All",
  isDeleteDialogOpen: false,
  userToDeleteId: null,

  setGlobalFilter: (filter) => set({ globalFilter: filter }),
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),

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
      if (!state.userToDeleteId) return state
      return {
        users: state.users.filter((user) => user.id !== state.userToDeleteId),
        isDeleteDialogOpen: false,
        userToDeleteId: null,
      }
    }),
}))
