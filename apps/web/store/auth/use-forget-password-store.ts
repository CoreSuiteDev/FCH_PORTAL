import { create } from "zustand"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Steps layout configuration
type ForgotPasswordStep = "ENTER_EMAIL" | "VERIFY_CODE" | "SUCCESS"

// Validation Schemas
export const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export const codeSchema = z.object({
  code: z.string().min(6, { message: "Code must be at least 6 characters" }),
})

export type EmailFormValues = z.infer<typeof emailSchema>
export type CodeFormValues = z.infer<typeof codeSchema>

interface ForgotPasswordState {
  isLoading: boolean
  currentStep: ForgotPasswordStep
  userEmail: string
  sendOtpCode: (data: EmailFormValues) => Promise<void>
  verifyOtpCode: (data: CodeFormValues) => Promise<void>
  resetStatus: () => void
}

export const useForgotPasswordStore = create<ForgotPasswordState>(
  (set, get) => ({
    isLoading: false,
    currentStep: "ENTER_EMAIL",
    userEmail: "",

    // Step 1: Send OTP verification code to user email
    sendOtpCode: async (data: EmailFormValues) => {
      set({ isLoading: true })
      try {
        console.log("Sending OTP code to:", data.email)
        // Add your API action here (e.g., await axios.post('/api/auth/send-otp', data))

        set({ userEmail: data.email, currentStep: "VERIFY_CODE" })
      } catch (error) {
        console.error("Failed to send OTP code:", error)
      } finally {
        set({ isLoading: false })
      }
    },

    // Step 2: Validate the code provided by the user
    verifyOtpCode: async (data: CodeFormValues) => {
      set({ isLoading: true })
      try {
        const email = get().userEmail
        console.log(`Verifying code ${data.code} for email: ${email}`)
        // Add your API validation here (e.g., await axios.post('/api/auth/verify-otp', { email, code: data.code }))

        set({ currentStep: "SUCCESS" })
      } catch (error) {
        console.error("Verification code invalid:", error)
      } finally {
        set({ isLoading: false })
      }
    },

    resetStatus: () =>
      set({ currentStep: "ENTER_EMAIL", userEmail: "", isLoading: false }),
  })
)

// Custom hooks configuration for React Hook Form definitions
export const useEmailForm = () => {
  return useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  })
}

export const useCodeForm = () => {
  return useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  })
}
