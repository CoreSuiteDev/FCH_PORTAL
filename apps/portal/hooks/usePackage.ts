import { api } from "@/lib/axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ZTCMembershipPackage,
  ZTCCreatePackage,
  ZTCUpdatePackage,
} from "@workspace/types"

export const usePackages = () => {
  return useQuery<ZTCMembershipPackage[]>({
    queryKey: ["membership-packages"],
    queryFn: () => api.get("/package").then((res) => res.data),
  })
}

export const useCreatePackage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ZTCCreatePackage) =>
      api.post("/package", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-packages"] })
    },
  })
}

export const useUpdatePackage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ZTCUpdatePackage }) =>
      api.patch(`/package/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-packages"] })
    },
  })
}

export const useDeletePackage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/package/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership-packages"] })
    },
  })
}
