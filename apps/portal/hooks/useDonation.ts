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
