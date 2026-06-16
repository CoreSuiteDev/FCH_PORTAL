// store/use-sponsor-store.ts
import { create } from "zustand"

interface SponsorState {
  searchQuery: string
  selectedTier: string
  selectedSponsorship: string
  selectedDate: Date | undefined
  minAmount: string
  maxAmount: string
  setSearchQuery: (query: string) => void
  setSelectedTier: (tier: string) => void
  setSelectedSponsorship: (sponsorship: string) => void
  setSelectedDate: (date: Date | undefined) => void
  setMinAmount: (amount: string) => void
  setMaxAmount: (amount: string) => void
}

export const useSponsorStore = create<SponsorState>((set) => ({
  searchQuery: "",
  selectedTier: "All",
  selectedSponsorship: "All",
  selectedDate: undefined,
  minAmount: "",
  maxAmount: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTier: (selectedTier) => set({ selectedTier }),
  setSelectedSponsorship: (selectedSponsorship) => set({ selectedSponsorship }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setMinAmount: (minAmount) => set({ minAmount }),
  setMaxAmount: (maxAmount) => set({ maxAmount }),
}))
