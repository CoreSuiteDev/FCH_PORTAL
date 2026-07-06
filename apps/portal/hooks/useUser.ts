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

export const useUsers = (page = 1, limit = 10) => {
  return useQuery<GetUsersResponse>({
    queryKey: ["users", page, limit],
    queryFn: () =>
      api.get("/users/list", { params: { page, limit } }).then((res) => res.data),
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
