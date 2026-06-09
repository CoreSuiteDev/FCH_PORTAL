import { create } from "zustand"
import {
  EVENTS,
  EventItem,
  ClearanceLevel,
  EventStatus,
} from "@/constants/manage-event"

interface EventState {
  events: EventItem[]
  userRole: ClearanceLevel | "All"
  filterStatus: EventStatus | "All"
  selectedEvent: EventItem | null

  setUserRole: (role: ClearanceLevel | "All") => void
  setFilterStatus: (status: EventStatus | "All") => void
  setSelectedEvent: (event: EventItem | null) => void
  getFilteredEvents: () => EventItem[]
}

export const useEventStore = create<EventState>((set, get) => ({
  events: EVENTS,
  userRole: "All",
  filterStatus: "All",
  selectedEvent: null,

  setUserRole: (role) => set({ userRole: role }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),

  getFilteredEvents: () => {
    const { events, userRole, filterStatus } = get()
    const hierarchy: Record<ClearanceLevel, number> = {
      General: 1,
      Pastoral: 2,
      Board: 3,
    }

    return events.filter((e) => {
      const hasAccess =
        userRole === "All" ||
        hierarchy[e.minClearance] <= hierarchy[userRole as ClearanceLevel]
      const matchesStatus = filterStatus === "All" || e.status === filterStatus
      return hasAccess && matchesStatus
    })
  },
}))
