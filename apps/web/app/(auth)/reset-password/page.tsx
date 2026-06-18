"use client"

import React, { useState, useEffect } from "react"
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import {
  useResetPasswordForm,
  ResetPasswordFormValues,
} from "@/store/auth/use-reset-password-store"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"

export default function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const [email, setEmail] = useState<string>("")
  const [otp, setOtp] = useState<string>("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get("email") || "")
    setOtp(params.get("otp") || "")
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useResetPasswordForm()

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormValues) => {
      setApiError(null)
      if (!email || !otp) {
        throw new Error("Missing email or OTP verification code. Please request a new password reset link.")
      }
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const res = await fetch(`${apiBase}/api/v1/auth/reset-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword: data.password,
        }),
      })
      
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.message || "Failed to reset password")
      }
      return result
    },
    onSuccess: () => {
      setIsSuccess(true)
    },
    onError: (error: any) => {
      setApiError(error.message || "Something went wrong. Please try again.")
    },
  })

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(data)
  }

  const isLoading = resetPasswordMutation.isPending

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        {isSuccess ? (
          <div className="flex animate-in flex-col items-center text-center duration-300 zoom-in-95 fade-in">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-md">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
              {t("successTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("successSubtitle")}
            </p>

            <Link href="/login" className="w-full mt-6">
              <Button
                type="button"
                className="h-11 w-full font-medium shadow-md shadow-primary/20"
              >
                {t("signIn")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                <Lock size={20} className="text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {t("title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("subtitle")}
              </p>
            </div>

            {(!email || !otp) && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-xs font-medium text-destructive">
                Warning: Missing verification data. Please request password reset from the forgot password page.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium tracking-wide text-foreground/90">
                  {t("newPasswordLabel")}
                </label>
                <div className="group relative">
                  <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading || !email || !otp}
                    className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none disabled:opacity-50"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    disabled={!email || !otp}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 px-1 text-xs font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium tracking-wide text-foreground/90">
                  {t("confirmPasswordLabel")}
                </label>
                <div className="group relative">
                  <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading || !email || !otp}
                    className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none disabled:opacity-50"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    disabled={!email || !otp}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 px-1 text-xs font-medium text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {apiError && (
                <p className="text-center text-xs font-medium text-destructive">
                  {apiError}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email || !otp}
                className="mt-2 h-11 w-full font-medium shadow-md shadow-primary/20 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>{t("resetPassword")}</span>
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
