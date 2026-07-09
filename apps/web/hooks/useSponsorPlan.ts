import { api } from "@/lib/api-client"
import { queryClient } from "@/providers/query-provider"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useSponsorPlan = () => {
  return useQuery({
    queryKey: ["sponsor-plans"],
    queryFn: async () => {
      const res = await api.get("/sponsor-plan/get")
      return res.data
    },
  })
}

export const useSponsorPlanById = (id: string) => {
  return useQuery({
    queryKey: ["sponsor-plans", id],
    queryFn: async () => {
      const res = await api.get(`/sponsor-plan/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export interface CreateSponsorshipPayload {
  amount: number
  currency: "USD" | "EUR"
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND"
  description: string
  name: string
  email: string
  phone?: string
  paymentMethodId: string
  userId?: string
}

export const useCreateSponsorship = () => {
  return useMutation({
    mutationFn: async (payload: CreateSponsorshipPayload) => {
      const res = await api.post("/payment/sponsorship", payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsorship-history"] })
      queryClient.invalidateQueries({ queryKey: ["sponsorship-history-filtered"] })
    },
  })
}
