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
    },
  })
}
