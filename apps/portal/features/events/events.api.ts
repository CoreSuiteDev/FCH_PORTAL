import { api } from "@/lib/axios"

export const eventApi = {
  getEvents: async () => {
    const res = await api.get("/events")

    return res.data
  },

  createEvents: async () => {
    const res = await api.post("/events")
    return res.data
  },

  updateEvents: async ({ eventId }: { eventId: string }) => {
    const res = await api.put(`/events/${eventId}`)
    return res.data
  },

  deleteEvents: async ({ eventId }: { eventId: string }) => {
    const res = await api.delete(`/events/${eventId}`)
    return res.data
  },
}

export const eventCategoryApi = {
  getEventCategory: async () => {
    const res = await api.get("/event-categories")
    return res.data
  },
  createEventCategory: async () => {
    const res = await api.post("/event-categories")
    return res.data
  },
  updateEventCategory: async ({ categoryId }: { categoryId: string }) => {
    const res = await api.put(`/event-categories/${categoryId}`)
    return res.data
  },
  deleteEventCategory: async ({ categoryId }: { categoryId: string }) => {
    const res = await api.delete(`/event-categories/${categoryId}`)
    return res.data
  },
}
