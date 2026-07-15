import { api } from "@/lib/api-client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { ZTEvent } from "@workspace/types"

interface GetEventsResponse {
  data: ZTEvent[]
  meta: {
    totalCount: number
    page: number
    limit: number
    totalPages: number
  }
}

export const usePublicEvents = (params?: {
  page?: number
  limit?: number
  eventType?: "EVENT" | "WEBINAR"
}) => {
  return useQuery<GetEventsResponse>({
    queryKey: ["public-events", params],
    queryFn: () =>
      api
        .get("/events", {
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 50,
            eventType: params?.eventType,
          },
        })
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useEventById = (id: string) => {
  return useQuery<ZTEvent>({
    queryKey: ["event-detail", id],
    queryFn: () => api.get(`/events/${id}`).then((res) => res.data),
    enabled: !!id,
  })
}

export const useRegisterEvent = () => {
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/events/${id}/register`).then((res) => res.data),
  })
}

