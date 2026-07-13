import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ZTEvent,
  ZTCCreateEvent,
  ZTUpdateEvent,
  ZTEventCategory,
  ZTCCreateEventCategory,
  ZTCUpdateEventCategory,
} from "@workspace/types"

// --- Response Types ---

interface GetEventsResponse {
  data: ZTEvent[]
  meta: {
    totalCount: number
    page: number
    limit: number
    totalPages: number
  }
}

// --- Event List ---

export const useEventsList = (params?: {
  page?: number
  limit?: number
}) => {
  return useQuery<GetEventsResponse>({
    queryKey: ["events-list", params],
    queryFn: () =>
      api.get("/events", { params }).then((res) => res.data),
  })
}

// --- Single Event ---

export const useEventById = (id: string) => {
  return useQuery<ZTEvent>({
    queryKey: ["event", id],
    queryFn: () => api.get(`/events/${id}`).then((res) => res.data),
    enabled: !!id,
  })
}

// --- Create Event ---

export const useCreateEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ZTCCreateEvent) =>
      api.post("/events", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events-list"] })
    },
  })
}

// --- Update Event ---

export const useUpdateEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ZTUpdateEvent }) =>
      api.patch(`/events/${id}`, { ...data, id }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events-list"] })
      queryClient.invalidateQueries({ queryKey: ["event"] })
    },
  })
}

// --- Delete Event ---

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/events/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events-list"] })
    },
  })
}

// --- Categories ---

export const useEventCategories = () => {
  return useQuery<ZTEventCategory[]>({
    queryKey: ["event-categories"],
    queryFn: () => api.get("/event-categories").then((res) => res.data),
  })
}

export const useCreateEventCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ZTCCreateEventCategory) =>
      api.post("/event-categories", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-categories"] })
    },
  })
}

export const useDeleteEventCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/event-categories/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-categories"] })
    },
  })
}

export const useUpdateEventCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ZTCUpdateEventCategory }) =>
      api.patch(`/event-categories/${id}`, { ...data, id }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-categories"] })
    },
  })
}

// --- Register for Event ---

export const useRegisterEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (eventId: string) =>
      api.post(`/events/${eventId}/register`).then((res) => res.data),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["events-list"] })
      queryClient.invalidateQueries({ queryKey: ["event", eventId] })
    },
  })
}

// --- Check in to Event ---

export const useCheckinEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId?: string }) =>
      api.post(`/events/${id}/checkin`, { userId }).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events-list"] })
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] })
    },
  })
}

// --- Event Registrations (Admin) ---

export interface EventRegistrant {
  id: string
  eventId: string
  userId: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  checkedIn: boolean
  registeredAt: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

export const useEventRegistrations = (eventId: string | null) => {
  return useQuery<EventRegistrant[]>({
    queryKey: ["event-registrations", eventId],
    queryFn: () =>
      api.get(`/events/${eventId}/registrations`).then((res) => res.data),
    enabled: !!eventId,
  })
}

// --- Admin Check-in (check in another user by userId) ---

export const useAdminCheckinUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      api
        .post(`/events/${eventId}/checkin`, { userId })
        .then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["event-registrations", variables.eventId],
      })
      queryClient.invalidateQueries({ queryKey: ["events-list"] })
    },
  })
}
