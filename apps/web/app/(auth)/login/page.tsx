"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
import { ZCLoginSchema, ZTCLoginSchema } from "@workspace/types/index"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "@/hooks/useAuth"
import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth"
import { toast } from "@workspace/ui/components/sonner"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const t = useTranslations("auth.login")

  const { mutate: login, isPending: isLoginPending } = useLogin()

  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL:
          process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/",
      })
      if (error) {
        throw new Error(error.message || "Google sign-in failed")
      }
    },
  })

  const form = useForm<ZTCLoginSchema>({
    resolver: zodResolver(ZCLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = (data: ZTCLoginSchema) => {
    login(data, {
      onSuccess: () => {
        toast.success("Signed in successfully!")
        window.location.href =
          process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/"
      },
      onError: (err: Error) => {
        toast.error(err.message || "Invalid email or password.")
      },
    })
  }

  const onGoogleLogin = () => {
    googleLoginMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Signed in with Google successfully!")
      },
      onError: (err: Error) => {
        toast.error(err.message || "Google sign-in failed.")
      },
    })
  }

  const isLoading = isLoginPending || googleLoginMutation.isPending

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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                  <FieldLabel
                    htmlFor="login-email"
                    className="text-sm font-medium tracking-wide text-foreground/90"
                  >
                    {t("emailLabel")}
                  </FieldLabel>
                  <div className="group relative">
                    <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                      <Mail size={18} />
                    </span>
                    <Input
                      {...field}
                      id="login-email"
                      placeholder="name@example.com"
                      type="email"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-3 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
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
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor="login-password"
                      className="text-sm font-medium tracking-wide text-foreground/90"
                    >
                      {t("passwordLabel")}
                    </FieldLabel>
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
                    <Input
                      {...field}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Remember Me Field */}
            <Controller
              name="rememberMe"
              control={form.control}
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
                    className="shrink-0 border-primary"
                  />
                  <FieldLabel
                    htmlFor="login-rememberMe"
                    className="cursor-pointer text-xs leading-none font-medium text-muted-foreground select-none"
                  >
                    {t("rememberMe")}
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
            className="h-11 w-full cursor-pointer font-medium shadow-md shadow-primary/20 transition-all active:scale-[0.99]"
          >
            <span className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t("signIn")}
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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
            <span className="bg-card px-3">{t("orContinueWith")}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={onGoogleLogin}
          className="h-11 w-full cursor-pointer gap-2 border border-border/40 font-medium transition-all hover:bg-secondary/80"
          disabled={isLoading}
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