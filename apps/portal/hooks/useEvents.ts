import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ZTEvent,
  ZTCCreateEvent,
  ZTUpdateEvent,
  ZTEventCategory,
  ZTCCreateEventCategory,
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
