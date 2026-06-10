import { create } from "zustand"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// 1. Validation Schema for Reset Password with field matching confirmation
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirmation password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Sets the error specifically on the confirmPassword field
  })

// Infer the form values from the validation schema
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

// 2. Zustand Store State Interface
interface ResetPasswordState {
  isLoading: boolean
  isSuccess: boolean
  updatePassword: (data: ResetPasswordFormValues) => Promise<void>
  resetStatus: () => void
}

// 3. Zustand Global Store
export const useResetPasswordStore = create<ResetPasswordState>((set) => ({
  isLoading: false,
  isSuccess: false,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatePassword: async (_data: ResetPasswordFormValues) => {
    set({ isLoading: true })
    try {
      console.log("Updating password...")
      // Add your API endpoint execution here (e.g., await axios.post('/api/auth/reset', { password: data.password }))

      set({ isSuccess: true })
    } catch (error) {
      console.error("Failed to update password:", error)
    } finally {
      set({ isLoading: false })
    }
  },

  resetStatus: () => set({ isSuccess: false, isLoading: false }),
}))

// 4. Custom React Hook Form Configuration
export const useResetPasswordForm = () => {
  return useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })
}
