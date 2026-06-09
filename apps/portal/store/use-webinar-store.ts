import { create } from "zustand"
// ১. এখানে আপনার ডাটা ফাইলটি ইমপোর্ট করুন (যেখানে webinars অ্যারেটি আছে)
import { webinars, Webinar } from "@/constants/webinars-data"

interface WebinarState {
  webinars: Webinar[]
  filterCategory: string
  filterStatus: string
  searchQuery: string
  selectedWebinar: Webinar | null
  setFilterCategory: (cat: string) => void
  setFilterStatus: (status: string) => void
  setSearchQuery: (query: string) => void
  setSelectedWebinar: (w: Webinar | null) => void
  getFilteredWebinars: () => Webinar[]
}

export const useWebinarStore = create<WebinarState>((set, get) => ({
  // ২. এখানে ডাটাটি প্রোভাইড করুন
  webinars: webinars,

  filterCategory: "All",
  filterStatus: "All",
  searchQuery: "",
  selectedWebinar: null,

  setFilterCategory: (cat) => set({ filterCategory: cat }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedWebinar: (w) => set({ selectedWebinar: w }),

  getFilteredWebinars: () => {
    const { webinars, filterCategory, filterStatus, searchQuery } = get()
    return webinars.filter(
      (w) =>
        (filterCategory === "All" || w.category === filterCategory) &&
        (filterStatus === "All" || w.status === filterStatus) &&
        (w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.speaker.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  },
}))
