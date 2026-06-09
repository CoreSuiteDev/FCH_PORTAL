"use client"

import React, { useState, useEffect } from "react"
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  useResetPasswordStore,
  useResetPasswordForm,
  ResetPasswordFormValues,
} from "@/store/auth/use-reset-password-store"

export default function ResetPasswordForm() {
  const { updatePassword, isLoading, isSuccess, resetStatus } =
    useResetPasswordStore()

  // Independent visibility toggles for password fields
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // Initialize validation configuration via the custom hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useResetPasswordForm()

  // Clear store values when the component unmounts
  useEffect(() => {
    return () => resetStatus()
  }, [resetStatus])

  const onSubmit = (data: ResetPasswordFormValues) => {
    updatePassword(data)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        {/* Conditional Rendering: Success Confirmation View */}
        {isSuccess ? (
          <div className="flex animate-in flex-col items-center text-center duration-300 zoom-in-95 fade-in">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-md">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground">
              Password Reset Complete
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your password has been successfully updated. You can now use your
              new security credentials to sign in.
            </p>

            <Button
              type="button"
              className="mt-6 h-11 w-full font-medium shadow-md shadow-primary/20"
              onClick={() => (window.location.href = "/login")}
            >
              Sign In
            </Button>
          </div>
        ) : (
          /* Main Configuration Form View */
          <>
            {/* Header Section */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                <Lock size={20} className="text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Set New Password
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please construct a secure and completely unique password for
                your account protection.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password Input Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium tracking-wide text-foreground/90">
                  New Password
                </label>
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

              {/* Confirm Password Input Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium tracking-wide text-foreground/90">
                  Confirm Password
                </label>
                <div className="group relative">
                  <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
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

              {/* Submit Form Action Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="mt-2 h-11 w-full cursor-pointer font-medium shadow-md shadow-primary/20 transition-all active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Reset Password</span>
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
