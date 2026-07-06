import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ZTContactInquery,
  ZTPaginatedInqueries,
  ZTNewsletter,
  ZTPaginatedNewsletters,
} from "@workspace/types"

// --- Contact Inquiries Hooks ---

export const useInqueriesList = (params?: {
  page?: number
  limit?: number
}) => {
  return useQuery<ZTPaginatedInqueries>({
    queryKey: ["inqueries-list", params],
    queryFn: () =>
      api.get("/inquery/list", { params }).then((res) => res.data),
  })
}

export const useDeleteInquery = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/inquery/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inqueries-list"] })
    },
  })
}

// --- Newsletter Subscribers Hooks ---

export const useNewsletterList = (params?: {
  page?: number
  limit?: number
}) => {
  return useQuery<ZTPaginatedNewsletters>({
    queryKey: ["newsletter-list", params],
    queryFn: () =>
      api.get("/newsletter/list", { params }).then((res) => res.data),
  })
}

export const useDeleteNewsletter = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/newsletter/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-list"] })
    },
  })
}
