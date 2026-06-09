import { create } from "zustand"
import { useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// 1. Zod Schema - rememberMe optional holeo return pipeline jeno strict thake
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  rememberMe: z.boolean(), // Optional keyword drop kore direct typing rakha safe default values matching er jonno
})

// 2. Derive Form Values directly from Zod output
export type LoginFormValues = z.infer<typeof loginSchema>

export interface AuthenticatedUser {
  email: string
  name?: string
}

interface AuthState {
  isLoading: boolean
  user: AuthenticatedUser | null
  error: string | null
  login: (data: LoginFormValues) => Promise<void>
  loginWithGoogle: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  user: null,
  error: null,

  login: async (data: LoginFormValues) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      set({ user: { email: data.email }, isLoading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Authentication failed",
        isLoading: false,
      })
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      set({ isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))

// 3. Custom hook fix - UseFormReturn generic overload pass kore strict typing enforce kora holo
export function useLoginForm(): UseFormReturn<LoginFormValues> {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false, // directly matching input boolean mapping
    },
  })
}
