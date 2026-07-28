import { api } from "@/lib/axios"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { ZTPaginatedDonationHistory } from "@workspace/types"

export const useDonationHistory = (page: number, limit: number) => {
  return useQuery<ZTPaginatedDonationHistory>({
    queryKey: ["donation-history", page, limit],
    queryFn: () =>
      api
        .get("/payment/donation-history", {
          params: { page, limit },
        })
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  })
}

export const useDonationStats = () => {
  return useQuery({
    queryKey: ["donation-stats"],
    queryFn: () =>
      api.get("/payment/donation/stats").then((res) => res.data),
  })
}

export const useFilterDonations = (params: {
  page?: number
  limit?: number
  skip?: number
  status?: string
  search?: string
  minAmount?: number
  maxAmount?: number
  createdAt?: string
  role?: string
}) => {
  return useQuery({
    queryKey: ["donation-history-filtered", params],
    queryFn: () =>
      api.get("/payment/donation/filter", { params }).then((res) => res.data),
    placeholderData: keepPreviousData,
  })
}
