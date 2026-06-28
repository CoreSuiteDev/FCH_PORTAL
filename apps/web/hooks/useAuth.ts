import { useMutation } from "@tanstack/react-query"
import { ZTCLoginSchema, ZTCRegisterSchema } from "@workspace/types/index"
import { authClient } from "@/lib/auth"
import { api } from "@/lib/api-client"

export const useRegistration = () => {
  return useMutation({
    mutationFn: async (data: ZTCRegisterSchema) => {
      const { data: resData, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (error) {
        throw new Error(
          error.message || "Registration failed. Please try again."
        )
      }

      return resData
    },
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: ZTCLoginSchema & { otp?: string }) => {
      try {
        const response = await api.post("/auth/login", data)
        return response.data
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message ||
            err.message ||
            "Invalid email or password."
        )
      }
    },
  })
}

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string
      type: "forget-password" | "email-verification" | "sign-in"
    }) => {
      try {
        const response = await api.post("/auth/send-otp", data)
        return response.data
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || err.message || "Failed to send OTP."
        )
      }
    },
  })
}

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string
      otp: string
      type: "forget-password" | "email-verification" | "sign-in"
    }) => {
      try {
        const response = await api.post("/auth/verify-otp", data)
        return response.data
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || err.message || "Failed to verify OTP."
        )
      }
    },
  })
}

export const useResetPasswordWithOtp = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string
      otp: string
      newPassword: string
    }) => {
      try {
        const response = await api.post("/auth/reset-password-otp", data)
        return response.data
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message ||
            err.message ||
            "Failed to reset password."
        )
      }
    },
  })
}
