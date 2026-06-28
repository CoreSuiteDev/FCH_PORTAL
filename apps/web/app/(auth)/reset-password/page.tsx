"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

const ZCResetPasswordSchema = z
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
    path: ["confirmPassword"],
  })

type ZTCResetPasswordFormValues = z.infer<typeof ZCResetPasswordSchema>

export default function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const [email, setEmail] = useState<string>("")
  const [otp, setOtp] = useState<string>("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get("email") || "")
    setOtp(params.get("otp") || "")
  }, [])

  const form = useForm<ZTCResetPasswordFormValues>({
    resolver: zodResolver(ZCResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: ZTCResetPasswordFormValues) => {
    // Just logging the form data
    console.log("Reset Password Data Submitted:", {
      email,
      otp,
      newPassword: data.password,
    })

    // Triggering success UI
    setIsSuccess(true)
  }

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

            <Link href="/login" className="mt-6 w-full">
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
                Warning: Missing verification data. Please request password
                reset from the forgot password page.
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                {/* New Password */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-1.5"
                    >
                      <FieldLabel className="text-sm font-medium tracking-wide text-foreground/90">
                        {t("newPasswordLabel")}
                      </FieldLabel>
                      <div className="group relative">
                        <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                          <Lock size={18} />
                        </span>
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={!email || !otp}
                          aria-invalid={fieldState.invalid}
                          className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none disabled:opacity-50"
                        />
                        <button
                          type="button"
                          disabled={!email || !otp}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
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

                {/* Confirm Password */}
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-1.5"
                    >
                      <FieldLabel className="text-sm font-medium tracking-wide text-foreground/90">
                        {t("confirmPasswordLabel")}
                      </FieldLabel>
                      <div className="group relative">
                        <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                          <Lock size={18} />
                        </span>
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={!email || !otp}
                          aria-invalid={fieldState.invalid}
                          className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none disabled:opacity-50"
                        />
                        <button
                          type="button"
                          disabled={!email || !otp}
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
              </FieldGroup>

              <Button
                type="submit"
                disabled={!email || !otp}
                className="mt-2 h-11 w-full font-medium shadow-md shadow-primary/20 transition-all disabled:opacity-50"
              >
                <span>{t("resetPassword")}</span>
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
