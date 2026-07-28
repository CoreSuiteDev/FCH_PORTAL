import { api } from "@/lib/api-client"
import { useMutation } from "@tanstack/react-query"
import type { ZTCreateNewsletter } from "@workspace/types"

export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: async (payload: ZTCreateNewsletter) => {
      const res = await api.post("/newsletter/subscribe", payload)
      return res.data
    },
  })
}
