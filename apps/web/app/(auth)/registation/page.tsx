"use client"

import React, { useState } from "react"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"

// Workspace UI Components
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { ZCRegisterSchema, ZTCRegisterSchema } from "@workspace/types"
import { useRegistration } from "@/hooks/useAuth"
import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth"
import { toast } from "@workspace/ui/components/sonner"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const t = useTranslations("auth.register")

  const {
    mutate: signup,
    isPending: isRegisterPending,
    isSuccess,
  } = useRegistration()

  const googleSignupMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL:
          process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/",
      })
      if (error) {
        throw new Error(error.message || "Google registration failed")
      }
    },
  })

  const form = useForm<ZTCRegisterSchema>({
    resolver: zodResolver(ZCRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  const onSubmit = (data: ZTCRegisterSchema): void => {
    signup(data, {
      onSuccess: () => {
        toast.success("Account created successfully!")
      },
      onError: (err: Error) => {
        toast.error(err.message || "Registration failed. Please try again.")
      },
    })
  }

  const onGoogleSignup = (): void => {
    googleSignupMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Signed in with Google successfully!")
      },
      onError: (err: Error) => {
        toast.error(err.message || "Google registration failed.")
      },
    })
  }

  const isLoading = isRegisterPending || googleSignupMutation.isPending

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
        <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

        <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-border/60 bg-card p-8 text-center text-card-foreground shadow-xl backdrop-blur-md">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-md">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
              Registration Successful!
            </h2>
            <p className="animate-fade-in mt-2 text-sm text-muted-foreground">
              Your account has been successfully created. You can now use your
              security credentials to sign in.
            </p>

            <Link href="/login" className="mt-6 w-full">
              <Button
                type="button"
                className="h-11 w-full font-medium shadow-md shadow-primary/20"
              >
                {t("signInHere")}
              </Button>
            </Link>
          </div>
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
          <FieldGroup>
            {/* Full Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="space-y-1.5"
                >
                  <FieldLabel
                    htmlFor="register-name"
                    className="text-sm font-medium tracking-wide text-foreground/90"
                  >
                    {t("nameLabel")}
                  </FieldLabel>
                  <div className="group relative">
                    <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                      <User size={18} />
                    </span>
                    <Input
                      {...field}
                      id="register-name"
                      placeholder="John Doe"
                      type="text"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="h-11 bg-background/50 pl-11 placeholder:text-muted-foreground/60"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="space-y-1.5"
                >
                  <FieldLabel
                    htmlFor="register-email"
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
                      id="register-email"
                      placeholder="name@example.com"
                      type="email"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="h-11 bg-background/50 pl-11 placeholder:text-muted-foreground/60"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="space-y-1.5"
                >
                  <FieldLabel
                    htmlFor="register-password"
                    className="text-sm font-medium tracking-wide text-foreground/90"
                  >
                    {t("passwordLabel")}
                  </FieldLabel>
                  <div className="group relative">
                    <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                      <Lock size={18} />
                    </span>
                    <Input
                      {...field}
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="h-11 bg-background/50 px-11 placeholder:text-muted-foreground/60"
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
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

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="space-y-1.5"
                >
                  <FieldLabel
                    htmlFor="register-confirm-password"
                    className="text-sm font-medium tracking-wide text-foreground/90"
                  >
                    {t("confirmPasswordLabel")}
                  </FieldLabel>
                  <div className="group relative">
                    <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                      <Lock size={18} />
                    </span>
                    <Input
                      {...field}
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="h-11 bg-background/50 px-11 placeholder:text-muted-foreground/60"
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      {showConfirmPassword ? (
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

            {/* Terms Checkbox */}
            <Controller
              name="acceptTerms"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  orientation="horizontal"
                  className="items-center space-y-0 space-x-2 py-0.5"
                >
                  <Checkbox
                    id="register-terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                    className="shrink-0 border-primary"
                  />
                  <div className="space-y-1 leading-none">
                    <FieldLabel
                      htmlFor="register-terms"
                      className="cursor-pointer text-xs leading-normal font-medium text-muted-foreground"
                    >
                      {t("agreeTerms")}{" "}
                      <Link
                        href="/terms"
                        className="font-semibold text-primary hover:underline"
                      >
                        {t("termsOfService")}
                      </Link>{" "}
                      {t("and")}{" "}
                      <Link
                        href="/privacy"
                        className="font-semibold text-primary hover:underline"
                      >
                        {t("privacyPolicy")}
                      </Link>
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full font-medium transition-all"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            <span>{t("createAccount")}</span>
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
          onClick={onGoogleSignup}
          className="h-11 w-full gap-2 border border-border/40 font-medium"
          disabled={isLoading}
        >
          <svg
            viewBox="-3 0 262 262"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            fill="#000000"
            className="h-4 w-4"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              ></path>
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              ></path>
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              ></path>
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              ></path>
            </g>
          </svg>
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
