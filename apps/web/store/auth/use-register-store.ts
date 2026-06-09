import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, UseFormReturn } from "react-hook-form"
import * as z from "zod"
import { create } from "zustand"

// 1. Zod Runtime Schema Setup with Password Match Check
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // sets error path directly on confirmPassword field
  })

// 2. Strict Type Inference for Registration Values
export type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterState {
  isLoading: boolean
  error: string | null
  registerUser: (data: RegisterFormValues) => Promise<void>
  registerWithGoogle: () => Promise<void>
}

// 3. Centralized Zustand Store Implementation
export const useRegisterStore = create<RegisterState>((set) => ({
  isLoading: false,
  error: null,

  registerUser: async (data: RegisterFormValues) => {
    set({ isLoading: true, error: null })
    try {
      // Simulating API latency endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log(
        "Registration Action Data Payload Trapped Successfully:",
        data
      )
      set({ isLoading: false })
      alert(`Account created successfully for ${data.email}!`)
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Registration failed",
        isLoading: false,
      })
    }
  },

  registerWithGoogle: async () => {
    set({ isLoading: true })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Google Signup System Executed.")
      set({ isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },
}))

// 4. Custom Hook Wrapper enforcing strict type compilation
export function useRegisterForm(): UseFormReturn<RegisterFormValues> {
  return useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false, // strictly mapping primitive boolean matching
    },
  })
}
