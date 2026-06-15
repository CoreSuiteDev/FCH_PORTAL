"use client"

import React, { useState } from "react"
import { Mail, Loader2, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import {
  CodeFormValues,
  EmailFormValues,
  useCodeForm,
  useEmailForm,
} from "@/store/auth/use-forget-password-store"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"

type ForgotPasswordStep = "ENTER_EMAIL" | "VERIFY_CODE" | "SUCCESS"

export default function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword")
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("ENTER_EMAIL")
  const [userEmail, setUserEmail] = useState<string>("")
  const [otpCode, setOtpCode] = useState<string>("")
  const [apiError, setApiError] = useState<string | null>(null)

  const emailForm = useEmailForm()
  const codeForm = useCodeForm()

  const sendOtpMutation = useMutation({
    mutationFn: async (data: EmailFormValues) => {
      setApiError(null)
      const res = await fetch("http://localhost:5000/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, type: "forget-password" }),
      })
      
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.message || "Failed to send OTP code")
      }
      return result
    },
    onSuccess: (_, variables) => {
      setUserEmail(variables.email)
      setCurrentStep("VERIFY_CODE")
    },
    onError: (error: any) => {
      setApiError(error.message || "Could not send verification code. Please check your email.")
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: CodeFormValues) => {
      setApiError(null)
      const res = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          otp: data.code,
          type: "forget-password",
        }),
      })
      
      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.message || "Invalid or expired OTP code")
      }
      return result
    },
    onSuccess: (_, variables) => {
      setOtpCode(variables.code)
      setCurrentStep("SUCCESS")
    },
    onError: (error: any) => {
      setApiError(error.message || "Invalid OTP code. Please try again.")
    },
  })

  const onEmailSubmit = (data: EmailFormValues) => {
    sendOtpMutation.mutate(data)
  }

  const onCodeSubmit = (data: CodeFormValues) => {
    verifyOtpMutation.mutate(data)
  }

  const isLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        {/* STEP 1: Enter Email */}
        {currentStep === "ENTER_EMAIL" && (
          <div className="animate-in duration-300 fade-in">
            <div className="mb-8 flex flex-col items-center text-center">
              <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
                {t("step1Title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("step1Subtitle")}
              </p>
            </div>

            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium tracking-wide text-foreground/90">
                  {t("emailLabel")}
                </label>
                <div className="group relative">
                  <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Mail size={18} />
                  </span>
                  <input
                    placeholder="name@example.com"
                    type="email"
                    disabled={isLoading}
                    className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-3 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
                    {...emailForm.register("email")}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="mt-1 px-1 text-xs font-medium text-destructive">
                    {emailForm.formState.errors.email.message}
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
                disabled={isLoading}
                className="h-11 w-full font-medium shadow-md transition-all active:scale-[0.99]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>{t("sendCode")}</span>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* STEP 2: Verify OTP */}
        {currentStep === "VERIFY_CODE" && (
          <div className="animate-in duration-300 zoom-in-95 fade-in">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                <KeyRound size={20} className="text-primary-foreground" />
              </div>
              <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
                {t("step2Title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("step2Subtitle")}
              </p>
            </div>

            <form
              onSubmit={codeForm.handleSubmit(onCodeSubmit)}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium tracking-wide text-foreground/90">
                  {t("codeLabel")}
                </label>
                <div className="group relative">
                  <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <KeyRound size={18} />
                  </span>
                  <input
                    placeholder="000000"
                    type="text"
                    maxLength={6}
                    disabled={isLoading}
                    className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-3 pl-11 text-sm tracking-widest ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
                    {...codeForm.register("code")}
                  />
                </div>
                {codeForm.formState.errors.code && (
                  <p className="mt-1 px-1 text-xs font-medium text-destructive">
                    {codeForm.formState.errors.code.message}
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
                disabled={isLoading}
                className="h-11 w-full font-medium shadow-md transition-all active:scale-[0.99]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>{t("verifyCode")}</span>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* STEP 3: Success */}
        {currentStep === "SUCCESS" && (
          <div className="flex animate-in flex-col items-center text-center duration-300 zoom-in-95 fade-in">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-md">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t("step3Title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("step3Subtitle")}
            </p>

            <Button
              type="button"
              className="mt-6 h-11 w-full font-medium shadow-md"
              onClick={() => {
                window.location.href = `/reset-password?email=${encodeURIComponent(userEmail)}&otp=${encodeURIComponent(otpCode)}`
              }}
            >
              {t("resetPasswordNow")}
            </Button>
          </div>
        )}

        {/* Footer */}
        {currentStep !== "SUCCESS" && (
          <div className="mt-8 text-center text-sm">
            <Link
              href="/login"
              className="group inline-flex items-center gap-1.5 font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              {t("backToSignIn")}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
