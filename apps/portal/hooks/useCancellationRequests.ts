import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface CancellationSubscriptionInfo {
  id: string
  status: string
  packageName: string
  tier: string
  billingCycle: string
  amountPaid: number
  currency: string
  currentPeriodEnd: string
  stripePaymentIntentId: string | null
}

export interface CancellationRequest {
  id: string
  createdAt: string
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  adminNote: string | null
  refundAmount: number | null
  processedAt: string | null
  estimatedRefund: number
  user: { id: string; name: string; email: string }
  subscription: CancellationSubscriptionInfo
}

interface CancellationRequestsResponse {
  data: CancellationRequest[]
  totalCount: number
}

export const useCancellationRequests = (
  page = 1,
  limit = 10,
  search = "",
  tier = "ALL",
  status = "ALL"
) => {
  return useQuery<CancellationRequestsResponse>({
    queryKey: ["cancellationRequests", page, limit, search, tier, status],
    queryFn: () =>
      api
        .get("/payment/cancel-requests", { params: { page, limit, search, tier, status } })
        .then((res) => res.data),
  })
}

export const useProcessCancellation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      requestId: string
      action: "APPROVE" | "REJECT"
      refundAmount?: number
      adminNote?: string
    }) =>
      api
        .post(`/payment/cancel-requests/${body.requestId}/process`, body)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cancellationRequests"] })
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
    },
  })
}
