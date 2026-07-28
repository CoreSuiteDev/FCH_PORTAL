import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api-client"

export interface DonatePayload {
  amount: number
  name: string
  email: string
  phone?: string
  paymentMethodId: string
  userId?: string
}

export const useDonate = () => {
  return useMutation({
    mutationFn: async (payload: DonatePayload) => {
      const res = await api.post("/payment/donate", {
        amount: payload.amount,
        currency: "USD",
        description: "Standard Donation",
        name: payload.name,
        email: payload.email,
        phone: payload.phone || undefined,
        paymentMethodId: payload.paymentMethodId,
        userId: payload.userId,
      })

      return res.data
    },
  })
}
