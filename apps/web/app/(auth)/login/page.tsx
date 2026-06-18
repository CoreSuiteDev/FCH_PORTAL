"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import { useLoginForm, LoginFormValues } from "@/store/auth/use-auth-store"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const t = useTranslations("auth.login")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm()

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      setApiError(null)
      const { data: sessionData, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })
      
      if (error) {
        throw new Error(error.message || "Failed to sign in")
      }
      return sessionData
    },
    onSuccess: () => {
      // Redirect to the portal dashboard on success
      window.location.href = process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/"
    },
    onError: (error: any) => {
      setApiError(error.message || "Invalid email or password")
    },
  })

  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      setApiError(null)
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/",
      })
      if (error) {
        throw new Error(error.message || "Google sign-in failed")
      }
    },
    onError: (error: any) => {
      setApiError(error.message || "Google sign-in failed")
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data)
  }

  const isLoading = loginMutation.isPending || googleLoginMutation.isPending

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-3 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 px-1 text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium tracking-wide text-foreground/90">
                {t("passwordLabel")}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-secondary-foreground transition-colors hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <div className="group relative">
              <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading}
                className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
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

          <div className="flex flex-row items-center space-y-0 space-x-2 py-0.5">
            <input
              type="checkbox"
              id="rememberMe"
              disabled={isLoading}
              className="h-4 w-4 cursor-pointer rounded border-input text-primary accent-primary focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("rememberMe")}
            />
            <label
              htmlFor="rememberMe"
              className="cursor-pointer text-xs leading-none font-medium text-muted-foreground select-none"
            >
              {t("rememberMe")}
            </label>
          </div>

          {apiError && (
            <p className="mt-1 px-1 text-center text-xs font-medium text-destructive">
              {apiError}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full cursor-pointer font-medium shadow-md shadow-primary/20 transition-all active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                {t("signIn")}
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
              </span>
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs text-muted-foreground uppercase">
            <span className="bg-card px-3">{t("orContinueWith")}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => googleLoginMutation.mutate()}
          disabled={isLoading}
          className="h-11 w-full cursor-pointer gap-2 border border-border/40 font-medium transition-all hover:bg-secondary/80"
        >
          Continue with Google
        </Button>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/registation"
            className="font-semibold text-primary transition-colors hover:underline"
          >
            {t("signUp")}
          </Link>
        </div>
      </div>
    </div>
  )
}
