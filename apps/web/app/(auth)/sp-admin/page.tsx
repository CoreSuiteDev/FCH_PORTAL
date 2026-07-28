"use client"

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

import { useLogin, useSendOtp } from "@/hooks/useAuth"
import { authClient } from "@/lib/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZCLoginSchema, ZTCLoginSchema } from "@workspace/types/index"
import { toast } from "@workspace/ui/components/sonner"
import z from "zod"

const ZCEmailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

type ZTCEmailSchema = z.infer<typeof ZCEmailSchema>

export default function SuperAdminAuthPage() {
  const router = useRouter()
  const [view, setView] = useState<"login" | "forgot-password">("login")
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // API hooks
  const { mutate: login, isPending: isLoginPending } = useLogin()
  const { mutate: sendOtp, isPending: isSendOtpPending } = useSendOtp()

  // Forms
  const loginForm = useForm<ZTCLoginSchema>({
    resolver: zodResolver(ZCLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const forgotForm = useForm<ZTCEmailSchema>({
    resolver: zodResolver(ZCEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  const onLoginSubmit = (data: ZTCLoginSchema) => {
    login(data, {
      onSuccess: async () => {
        try {
          const sessionRes = await fetch("/api/auth/session-info")
          if (sessionRes.ok) {
            const sessionInfo = await sessionRes.json()
            const roles: string[] = sessionInfo?.user?.roles || []
            if (!roles.includes("SUPER_ADMIN")) {
              await authClient.signOut()
              toast.error("Access denied. Only Super Admins can log in here.")
              return
            }
          } else {
            await authClient.signOut()
            toast.error("Failed to verify user privileges.")
            return
          }
          toast.success("Signed in successfully as Super Admin!")
          window.location.href =
            process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/"
        } catch (err: unknown) {
          await authClient.signOut()
          toast.error(
            err instanceof Error
              ? err.message
              : "An error occurred during authentication."
          )
        }
      },
      onError: (err: Error) => {
        toast.error(err.message || "Invalid email or password.")
      },
    })
  }

  const onForgotPasswordSubmit = (data: ZTCEmailSchema) => {
    sendOtp(
      { email: data.email, type: "forget-password" },
      {
        onSuccess: () => {
          toast.success("OTP sent to your email successfully!")
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`)
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to send OTP.")
        },
      }
    )
  }

  const isLoading = isLoginPending || isSendOtpPending

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-red-900/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-red-950/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[460px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        {view === "login" ? (
          /* LOGIN VIEW */
          <div className="animate-in duration-300 fade-in">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-900/10 text-red-700 shadow-sm">
                <ShieldAlert size={24} />
              </div>
              <h2 className="font-trajan text-2xl font-extrabold tracking-tight text-foreground">
                Super Admin Portal
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your credentials to access the system backend
              </p>
            </div>

            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <FieldGroup>
                {/* Email Field */}
                <Controller
                  name="email"
                  control={loginForm.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-1.5"
                    >
                      <FieldLabel
                        htmlFor="login-email"
                        className="text-sm font-medium tracking-wide text-foreground/90"
                      >
                        Email Address
                      </FieldLabel>
                      <div className="group relative">
                        <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-red-700">
                          <Mail size={18} />
                        </span>
                        <Input
                          {...field}
                          id="login-email"
                          placeholder="admin@fch-catechesis.org"
                          type="email"
                          disabled={isLoading}
                          aria-invalid={fieldState.invalid}
                          className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-3 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-red-700 focus-visible:ring-2 focus-visible:ring-red-700/20 focus-visible:outline-none"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Password Field */}
                <Controller
                  name="password"
                  control={loginForm.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <FieldLabel
                          htmlFor="login-password"
                          className="text-sm font-medium tracking-wide text-foreground/90"
                        >
                          Password
                        </FieldLabel>
                        <button
                          type="button"
                          onClick={() => {
                            setView("forgot-password")
                          }}
                          className="text-xs font-semibold text-red-700 transition-colors hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="group relative">
                        <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-red-700">
                          <Lock size={18} />
                        </span>
                        <Input
                          {...field}
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isLoading}
                          aria-invalid={fieldState.invalid}
                          className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-red-700 focus-visible:ring-2 focus-visible:ring-red-700/20 focus-visible:outline-none"
                        />
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Remember Me */}
                <Controller
                  name="rememberMe"
                  control={loginForm.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation="horizontal"
                      className="items-center space-y-0 space-x-2 py-0.5"
                    >
                      <Checkbox
                        id="login-rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        aria-invalid={fieldState.invalid}
                        className="shrink-0 border-red-700 data-[state=checked]:bg-red-700 data-[state=checked]:text-white"
                      />
                      <FieldLabel
                        htmlFor="login-rememberMe"
                        className="cursor-pointer text-xs leading-none font-medium text-muted-foreground select-none"
                      >
                        Keep me logged in
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-11 w-full cursor-pointer bg-red-700 font-medium text-white shadow-md shadow-red-700/20 transition-all hover:bg-red-800 active:scale-[0.99]"
              >
                <span className="flex w-full items-center justify-center gap-2">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Sign In
                  {!isLoading && (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  )}
                </span>
              </Button>
            </form>
          </div>
        ) : (
          /* FORGOT PASSWORD VIEW */
          <div className="animate-in duration-300 fade-in">
            <div className="mb-8 flex flex-col items-center text-center">
              <h2 className="font-trajan text-2xl font-extrabold tracking-tight text-foreground">
                Recover Password
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email address to receive a password reset code
              </p>
            </div>

            <form
              onSubmit={forgotForm.handleSubmit(onForgotPasswordSubmit)}
              className="space-y-5"
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={forgotForm.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-1.5"
                    >
                      <FieldLabel
                        htmlFor="forgot-password-email"
                        className="text-sm font-medium tracking-wide text-foreground/90"
                      >
                        Email Address
                      </FieldLabel>
                      <div className="group relative">
                        <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-red-700">
                          <Mail size={18} />
                        </span>
                        <Input
                          {...field}
                          id="forgot-password-email"
                          placeholder="admin@fch-catechesis.org"
                          type="email"
                          disabled={isLoading}
                          aria-invalid={fieldState.invalid}
                          className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-3 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-red-700 focus-visible:ring-2 focus-visible:ring-red-700/20 focus-visible:outline-none"
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full bg-red-700 font-medium text-white shadow-md shadow-red-700/20 transition-all hover:bg-red-800 active:scale-[0.99]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <span>Send Reset Code</span>
              </Button>
            </form>

            <div className="mt-8 text-center text-sm">
              <button
                onClick={() => setView("login")}
                className="group inline-flex items-center gap-1.5 font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
