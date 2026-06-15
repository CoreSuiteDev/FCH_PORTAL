import { create } from "zustand"
import { UpcomingMeeting } from "@/constants/bord-meeting-data"

export type Meeting = {
  id: string
  title: string
  date: string
  status: "Public" | "Private"
}

interface MeetingStore {
  meetings: Meeting[]
  upcomingMeetings: UpcomingMeeting[]
  searchQuery: string
  filterStatus: string

  setSearchQuery: (query: string) => void
  setFilterStatus: (status: string) => void
  updateStatus: (id: string, status: "Public" | "Private") => void
  addMeeting: (newMeeting: UpcomingMeeting) => void
  deleteMeeting: (id: string) => void
}

const initialUpcoming: UpcomingMeeting[] = [
  {
    id: "u1",
    title: "Q3 Board Strategy & Audit",
    platform: "Zoom",
    date: "2026-09-10",
    time: "10:00 AM",
    link: "#",
  },
  {
    id: "u2",
    title: "Product Roadmap Review",
    platform: "Google Meet",
    date: "2026-09-12",
    time: "02:30 PM",
    link: "#",
  },
  {
    id: "u3",
    title: "Client Feedback Sync",
    platform: "Teams",
    date: "2026-09-15",
    time: "11:00 AM",
    link: "#",
  },
  {
    id: "u4",
    title: "Quarterly Performance Review",
    platform: "Zoom",
    date: "2026-09-18",
    time: "03:00 PM",
    link: "#",
  },
]

export const useMeetingStore = create<MeetingStore>((set) => ({
  meetings: Array.from({ length: 25 }).map((_, i) => ({
    id: `${i + 1}`,
    title: `Board Meeting ${i + 1}`,
    date: `2026-06-${(i % 25) + 1}`,
    status: i % 2 === 0 ? "Public" : "Private",
  })),

  upcomingMeetings: initialUpcoming,
  searchQuery: "",
  filterStatus: "All",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  updateStatus: (id, status) =>
    set((state) => ({
      meetings: state.meetings.map((m) => (m.id === id ? { ...m, status } : m)),
    })),

  addMeeting: (newMeeting) =>
    set((state) => ({
      upcomingMeetings: [...state.upcomingMeetings, newMeeting],
    })),

  deleteMeeting: (id) =>
    set((state) => ({
      upcomingMeetings: state.upcomingMeetings.filter((m) => m.id !== id),
    })),
}))
