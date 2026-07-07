import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface UserMember {
  id: string
  name: string
  email: string
  tier: "General" | "Pastoral" | "Board"
  packageName: string
  billingCycle: "MONTHLY" | "YEARLY"
  joinedDate: string
  expiryDate: string
  amountPaid: string
  status: "Active" | "Pending" | "Expired" | "Canceled" | "Suspended"
  // Payment info
  paymentStatus: string | null
  stripePaymentIntentId: string | null
  cardBrand: string | null
  cardLast4: string | null
  paymentMethod: string | null
  receiptUrl: string | null
}

interface GetMembershipsResponse {
  data: UserMember[]
  totalCount: number
  stats: {
    total: number
    active: number
    pending: number
    expiredOrCanceled: number
  }
  pricingStats: {
    general: { earnings: number; monthlyCount: number; yearlyCount: number }
    pastoral: { earnings: number; monthlyCount: number; yearlyCount: number }
  }
}

export const useMemberships = (
  page = 1,
  limit = 10,
  search = "",
  tier = "ALL",
  status = "ALL"
) => {
  return useQuery<GetMembershipsResponse>({
    queryKey: ["memberships", page, limit, search, tier, status],
    queryFn: () =>
      api
        .get("/payment/memberships", {
          params: { page, limit, search, tier, status },
        })
        .then((res) => res.data),
  })
}

export const useUpdateMembershipStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserMember["status"] }) =>
      api.patch(`/payment/memberships/${id}/status`, { status }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
    },
  })
}

export const useDeleteMembership = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/payment/memberships/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
    },
  })
}

// ── User-facing cancellation hooks ───────────────────────────────────────────

export interface UserSubscriptionDetails {
  id: string
  tier: "General" | "Pastoral" | "Board"
  packageName: string
  billingCycle: "MONTHLY" | "YEARLY"
  joinedDate: string
  expiryDate: string
  amountPaid: string
  status: "Active" | "Pending" | "Expired" | "Canceled" | "Suspended"
  paymentStatus: string | null
  stripePaymentIntentId: string | null
}

export interface UserCancellationRequest {
  id: string
  createdAt: string
  reason: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  adminNote: string | null
  refundAmount: number | null
  processedAt: string | null
  packageName: string
  subscriptionId: string
}

export const useMyMemberships = (userId: string) => {
  return useQuery<UserSubscriptionDetails[]>({
    queryKey: ["my-memberships", userId],
    queryFn: () =>
      api
        .get("/payment/my-memberships", { params: { userId } })
        .then((res) => res.data),
    enabled: !!userId,
  })
}

export const useMyCancellationRequests = (userId: string) => {
  return useQuery<UserCancellationRequest[]>({
    queryKey: ["my-cancel-requests", userId],
    queryFn: () =>
      api
        .get("/payment/my-cancel-requests", { params: { userId } })
        .then((res) => res.data),
    enabled: !!userId,
  })
}

export const useRequestCancellation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      userId: string
      subscriptionId: string
      reason: string
    }) =>
      api
        .post("/payment/cancel-request", body)
        .then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-cancel-requests", variables.userId] })
      queryClient.invalidateQueries({ queryKey: ["my-memberships", variables.userId] })
    },
  })
}

