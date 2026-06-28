import { useMutation } from "@tanstack/react-query"
import { ZTCLoginSchema, ZTCRegisterSchema } from "@workspace/types/index"
import { authClient } from "@/lib/auth" 

export const useRegistration = () => {
  return useMutation({
    mutationFn: async (data: ZTCRegisterSchema) => {
      const { data: resData, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name, 
      })

      if (error) {
        throw new Error(error.message || "Registration failed. Please try again.")
      }

      return resData
    },
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: ZTCLoginSchema) => {
      const { data: sessionData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw new Error(error.message || "Invalid email or password.")
      }

      return sessionData
    },
  })
}