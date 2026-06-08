import { create } from "zustand"

interface PaymentStore {
  // Filter States
  searchQuery: string
  selectedTier: string
  selectedDate: Date | undefined
  minAmount: string
  maxAmount: string

  // State Mutators
  setSearchQuery: (val: string) => void
  setSelectedTier: (val: string) => void
  setSelectedDate: (date: Date | undefined) => void
  setMinAmount: (val: string) => void
  setMaxAmount: (val: string) => void
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  searchQuery: "",
  selectedTier: "All",
  selectedDate: undefined,
  minAmount: "",
  maxAmount: "",

  setSearchQuery: (val) => set({ searchQuery: val }),
  setSelectedTier: (val) => set({ selectedTier: val }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setMinAmount: (val) => set({ minAmount: val }),
  setMaxAmount: (val) => set({ maxAmount: val }),
}))
