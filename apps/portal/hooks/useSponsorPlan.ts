import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ZTCSponsorPlan,
  ZTCSponsorPlanResponse,
  ZTCSponsorPlanUpdateInput,
} from "@workspace/types"

export const useSponsorPlans = () => {
  return useQuery<ZTCSponsorPlanResponse[]>({
    queryKey: ["sponsor-plans"],
    queryFn: () => api.get("/sponsor-plan/get").then((res) => res.data),
  })
}

export const useCreateSponsorPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ZTCSponsorPlan) =>
      api.post("/sponsor-plan/create", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-plans"] })
    },
  })
}

export const useUpdateSponsorPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ZTCSponsorPlanUpdateInput) => {
      const { id, ...data } = body
      return api.put(`/sponsor-plan/${id}`, data).then((res) => res.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-plans"] })
    },
  })
}

export const useDeleteSponsorPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/sponsor-plan/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sponsor-plans"] })
    },
  })
}
