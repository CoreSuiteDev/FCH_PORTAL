import { create } from "zustand"
import { EVENTS, EventItem } from "@/constants/event-data"

interface EventStore {
  events: EventItem[]
  search: string
  filter: string
  selectedDate: string
  currentPage: number
  setSearch: (search: string) => void
  setFilter: (filter: string) => void
  setSelectedDate: (date: string) => void
  setCurrentPage: (page: number) => void
  filteredEvents: () => EventItem[]
}

// এই ফাংশনটি এখন একই ফাইলে থাকল, তাই আর এরর দিবে না
const generateDummyEvents = (): EventItem[] => {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `extra-${i + 1}`,
    name: `Dummy Event ${i + 1}`,
    imageUrl: "assets/event-1.jpg",
    date: i % 2 === 0 ? "July 15, 2026" : "August 20, 2026",
    time: "10:00 AM",
    location: "Grand Ballroom",
    description: "।",
    speaker: "Unknown Speaker",
    registrationLink: "#",
    capacity: 50,
    status: "Upcoming",
    minClearance: i % 3 === 0 ? "Board" : "General",
    attendees: 0,
    registeredMembers: [],
    category: "Workshop",
  }))
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [...EVENTS, ...generateDummyEvents()],
  search: "",
  filter: "All",
  selectedDate: "",
  currentPage: 1,

  setSearch: (search) => set({ search, currentPage: 1 }),
  setFilter: (filter) => set({ filter, currentPage: 1 }),
  setSelectedDate: (selectedDate) => set({ selectedDate, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  filteredEvents: () => {
    const { events, search, filter, selectedDate } = get()
    return events.filter((event) => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory = filter === "All" || event.minClearance === filter
      const matchesDate =
        selectedDate === "" ||
        event.date.toLowerCase().includes(selectedDate.toLowerCase())

      return matchesSearch && matchesCategory && matchesDate
    })
  },
}))
