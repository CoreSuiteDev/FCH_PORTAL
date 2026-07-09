import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { ZTPaginatedSponsorshipHistory } from "@workspace/types"

export const useSponsorshipHistory = (page = 1, limit = 10) => {
  return useQuery<ZTPaginatedSponsorshipHistory>({
    queryKey: ["sponsorship-history", page, limit],
    queryFn: () =>
      api
        .get("/payment/sponsorship-history", { params: { page, limit } })
        .then((res) => res.data),
    placeholderData: (prev) => prev,
  })
}

export const useDeleteSponsorship = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/payment/sponsorship/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsorship-history"] })
      queryClient.invalidateQueries({ queryKey: ["sponsorship-history-filtered"] })
    },
  })
}

export const useFilterSponsorship = (params: {
  page?: number
  limit?: number
  skip?: number
  status?: string
  search?: string
  minAmount?: number
  maxAmount?: number
  startDate?: string
  endDate?: string
  tier?: string
  role?: string
}) => {
  return useQuery<ZTPaginatedSponsorshipHistory>({
    queryKey: ["sponsorship-history-filtered", params],
    queryFn: () =>
      api
        .get("/payment/sponsorship/filter", { params })
        .then((res) => res.data),
    placeholderData: (prev) => prev,
  })
}

export const useSponsorStats = () => {
  return useQuery({
    queryKey: ["sponsorship-stats"],
    queryFn: () =>
      api.get("/payment/sponsorship/stats").then((res) => res.data),
  })
}
