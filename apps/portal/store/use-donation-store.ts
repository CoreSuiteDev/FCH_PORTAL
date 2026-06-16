import { create } from "zustand"

interface DonationState {
  searchQuery: string
  selectedTier: string
  selectedDate: Date | undefined
  minAmount: string
  maxAmount: string
  setSearchQuery: (query: string) => void
  setSelectedTier: (tier: string) => void
  setSelectedDate: (date: Date | undefined) => void
  setMinAmount: (amount: string) => void
  setMaxAmount: (amount: string) => void
}

export const useDonationStore = create<DonationState>((set) => ({
  searchQuery: "",
  selectedTier: "All",
  selectedDate: undefined,
  minAmount: "",
  maxAmount: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTier: (selectedTier) => set({ selectedTier }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setMinAmount: (minAmount) => set({ minAmount }),
  setMaxAmount: (maxAmount) => set({ maxAmount }),
}))
