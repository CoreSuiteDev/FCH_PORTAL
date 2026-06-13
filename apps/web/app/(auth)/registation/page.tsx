"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl" // Import useTranslations
import { Button } from "@workspace/ui/components/button"
import {
  RegisterFormValues,
  useRegisterForm,
  useRegisterStore,
} from "@/store/auth/use-register-store"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const t = useTranslations("auth.register") // Initialize translations

  const { registerUser, registerWithGoogle, isLoading } = useRegisterStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRegisterForm()

  const onSubmit = (data: RegisterFormValues): void => {
    registerUser(data)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
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
          onClick={registerWithGoogle}
          className="h-11 w-full gap-2 border border-border/40 font-medium"
        >
          {/* Google Icon SVG... */}
          {t("signUpWithGoogle")}
        </Button>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
          <a
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            {t("signInHere")}
          </a>
        </div>
      </div>
    </div>
  )
}
