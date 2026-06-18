"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import { RegisterFormValues, useRegisterForm } from "@/store/auth/use-register-store"
import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth"
import Link from "next/link"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const t = useTranslations("auth.register")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRegisterForm()

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      setApiError(null)
      const { data: resData, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (error) {
        throw new Error(error.message || "Registration failed")
      }
      return resData
    },
    onSuccess: () => {
      setIsSuccess(true)
    },
    onError: (error: any) => {
      setApiError(error.message || "Something went wrong. Please try again.")
    },
  })

  const googleSignupMutation = useMutation({
    mutationFn: async () => {
      setApiError(null)
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/",
      })
      if (error) {
        throw new Error(error.message || "Google registration failed")
      }
    },
    onError: (error: any) => {
      setApiError(error.message || "Google registration failed")
    },
  })

  const onSubmit = (data: RegisterFormValues): void => {
    registerMutation.mutate(data)
  }

  const isLoading = registerMutation.isPending || googleSignupMutation.isPending

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
        <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

        <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md text-center">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-md">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
              Registration Successful!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account has been created successfully. You can now sign in to your account.
            </p>
          </div>
          <Link href="/login" className="w-full block">
            <Button className="w-full h-11 font-medium">
              Go to Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium tracking-wide text-foreground/90">
              {t("nameLabel")}
            </label>
            <div className="group relative">
              <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <User size={18} />
              </span>
              <input
                placeholder="John Doe"
                type="text"
                disabled={isLoading}
                className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-3 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="mt-1 px-1 text-xs font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
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
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 px-1 text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium tracking-wide text-foreground/90">
              {t("passwordLabel")}
            </label>
            <div className="group relative">
              <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading}
                className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
                {...register("password")}
              />
              <button
                type="button"
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
                disabled={isLoading}
                className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 px-1 text-xs font-medium text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex flex-row items-start space-y-0 space-x-2 py-0.5">
            <input
              type="checkbox"
              id="acceptTerms"
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-input"
              {...register("acceptTerms")}
            />
            <label
              htmlFor="acceptTerms"
              className="cursor-pointer text-xs leading-normal font-medium text-muted-foreground select-none"
            >
              {t("agreeTerms")}{" "}
              <a
                href="/terms"
                className="font-semibold text-primary hover:underline"
              >
                {t("termsOfService")}
              </a>{" "}
              {t("and")}{" "}
              <a
                href="/privacy"
                className="font-semibold text-primary hover:underline"
              >
                {t("privacyPolicy")}
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="px-1 text-xs font-medium text-destructive">
              {t("mustAcceptTerms")}
            </p>
          )}

          {apiError && (
            <p className="mt-1 px-1 text-center text-xs font-medium text-destructive">
              {apiError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full font-medium transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>{t("createAccount")}</span>
            )}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs text-muted-foreground uppercase">
            <span className="bg-card px-3">{t("orSignUpWith")}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => googleSignupMutation.mutate()}
          disabled={isLoading}
          className="h-11 w-full gap-2 border border-border/40 font-medium"
        >
          {t("signUpWithGoogle")}
        </Button>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            {t("signInHere")}
          </Link>
        </div>
      </div>
    </div>
  )
}
