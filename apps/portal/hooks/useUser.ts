import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ZTCIUserOutput } from "@workspace/types"

interface GetUsersResponse {
  data: ZTCIUserOutput[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const useUsers = (
  page = 1,
  limit = 10,
  search = "",
  role = "ALL",
  status = "ALL"
) => {
  return useQuery<GetUsersResponse>({
    queryKey: ["users", page, limit, search, role, status],
    queryFn: () =>
      api
        .get("/users/filter", {
          params: { page, limit, search, role, status },
        })
        .then((res) => res.data),
  })
}

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: "ACTIVE" | "RESTRICTED" | "SUSPENDED" | "BANNED" }) =>
      api.patch(`/users/${userId}/status`, { status }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) =>
      api.delete(`/users/${userId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      api.patch(`/users/${userId}/role`, { role }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export const useCreateBoardMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string }) =>
      api.post("/users/create-board", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export interface UserMatrixResponse {
  total: number
  activeCount: number
  suspendedCount: number
  restrictedCount: number
  generalCount: number
  pastoralCount: number
  boardCount: number
}

export const useUserMatrix = () => {
  return useQuery<UserMatrixResponse>({
    queryKey: ["users", "matrix"],
    queryFn: () => api.get("/users/matrix").then((res) => res.data),
  })
}

export interface MemberDetailsResponse {
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    image: string | null
    status: string
    createdAt: string
    roles: string[]
  }
  membership: {
    hasActiveMembership: boolean
    activePackageName: string | null
    activePeriodStart: string | null
    activePeriodEnd: string | null
    totalPurchases: number
    subscriptions: Array<{
      id: string
      packageName: string
      packageType: string
      price: number
      status: string
      startsAt: string
      expiresAt: string
      createdAt: string
    }>
  }
  donations: {
    hasDonated: boolean
    totalCount: number
    totalAmount: number
    list: Array<{
      id: string
      amount: number
      currency: string
      status: string
      createdAt: string
      isAnonymous: boolean
      message: string | null
    }>
  }
  sponsorships: {
    hasSponsored: boolean
    totalCount: number
    totalAmount: number
    list: Array<{
      id: string
      packageName: string
      tier: string
      amount: number
      status: string
      startsAt: string | null
      expiresAt: string | null
      createdAt: string
    }>
  }
  transactionHistory: Array<{
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
    type: "MEMBERSHIP" | "DONATION" | "SPONSORSHIP"
    description: string
  }>
}

export const useMemberDetails = (userId: string) => {
  return useQuery<MemberDetailsResponse>({
    queryKey: ["users", "details", userId],
    queryFn: () => api.get(`/users/${userId}/details`).then((res) => res.data),
    enabled: !!userId,
  })
}

export interface AdminOverviewResponse {
  membersCount: {
    total: number
    active: number
    suspended: number
    restricted: number
    roles: {
      SUPER_ADMIN: number
      ADMIN: number
      BOARD: number
      PASTORAL: number
      MEMBER: number
      USER: number
    }
  }
  revenue: {
    total: number
    subscriptions: number
    donations: number
    sponsorships: number
  }
  recentBoardMembers: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
  }>
  recentDonations: Array<{
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
    donatorName: string
  }>
  recentSponsorships: Array<{
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
    sponsorName: string
    packageName: string
  }>
  pendingTasks: Array<{
    id: string
    title: string
    priority: string
  }>
  membershipTrends: Array<{
    month: string
    general: number
    pastoral: number
    board: number
    revenue: number
  }>
  platformUpkeepMetrics: Array<{
    id: number
    label: string
    value: string
  }>
}

export const useAdminOverview = () => {
  return useQuery<AdminOverviewResponse>({
    queryKey: ["admin", "overview"],
    queryFn: () => api.get("/users/admin-overview").then((res) => res.data),
  })
}



