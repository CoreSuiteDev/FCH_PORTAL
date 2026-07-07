import { api } from "@/lib/api-client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { ZTCMembershipPackage } from "@workspace/types"

export const usePackages = () => {
  return useQuery<ZTCMembershipPackage[]>({
    queryKey: ["membership-packages"],
    queryFn: () => api.get("/package").then((res) => res.data),
  })
}

export const usePackageBySlug = (slug: string) => {
  return useQuery<ZTCMembershipPackage>({
    queryKey: ["membership-package", slug],
    queryFn: () => api.get(`/package/${slug}`).then((res) => res.data),
    enabled: !!slug,
  })
}

export interface BuyPackagePayload {
  packageId: string
  name: string
  email: string
  phone?: string
  userId: string
  paymentMethodId: string
}

export const useBuyPackage = () => {
  return useMutation({
    mutationFn: async (payload: BuyPackagePayload) => {
      const res = await api.post("/payment/buy-package", payload)
      return res.data
    },
  })
}
