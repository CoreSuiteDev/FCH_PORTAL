"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  RegisterFormValues,
  useRegisterForm,
  useRegisterStore,
} from "@/store/use-register-store"

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // Direct asynchronous store state mapping
  const { registerUser, registerWithGoogle, isLoading } = useRegisterStore()

  // Pulling explicit schema generic configurations
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
      {/* Background Decorative Premium Aura */}
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        {/* Header Section */}
        <div className="mb-6 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with your free account setup today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Full Name Input Field */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium tracking-wide text-foreground/90"
              htmlFor="name"
            >
              Full Name
            </label>
            <div className="group relative">
              <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <User size={18} />
              </span>
              <input
                id="name"
                placeholder="John Doe"
                type="text"
                disabled={isLoading}
                className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-3 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="mt-1 px-1 text-xs font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium tracking-wide text-foreground/90"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="group relative">
              <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <Mail size={18} />
              </span>
              <input
                id="email"
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

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium tracking-wide text-foreground/90"
              htmlFor="password"
            >
              Password
            </label>
            <div className="group relative">
              <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <Lock size={18} />
              </span>
              <input
                id="password"
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
            <label
              className="text-sm font-medium tracking-wide text-foreground/90"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="group relative">
              <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <Lock size={18} />
              </span>
              <input
                id="confirmPassword"
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
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 px-1 text-xs font-medium text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex flex-row items-start space-y-0 space-x-2 py-0.5">
            <input
              type="checkbox"
              id="acceptTerms"
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 cursor-pointer rounded border-input text-primary accent-primary focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("acceptTerms")}
            />
            <label
              htmlFor="acceptTerms"
              className="cursor-pointer text-xs leading-normal font-medium text-muted-foreground select-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              I agree to the{" "}
              <a
                href="/terms"
                className="font-semibold text-primary hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-semibold text-primary hover:underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="px-1 text-xs font-medium text-destructive">
              Must accept terms and conditions
            </p>
          )}

          {/* Submit Registration Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full cursor-pointer font-medium shadow-md shadow-primary/20 transition-all active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="group flex items-center gap-2">
                Create Account
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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

        {/* Separator */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs text-muted-foreground uppercase">
            <span className="bg-card px-3">Or sign up with</span>
          </div>
        </div>

        {/* Google OAuth Access Control Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={registerWithGoogle}
          disabled={isLoading}
          className="h-11 w-full cursor-pointer gap-2 border border-border/40 font-medium transition-all hover:bg-secondary/80"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.742 1.055 15.014 0 12 0 7.354 0 3.391 2.664 1.49 6.564l3.776 3.201z"
            />
            <path
              fill="#4285F4"
              d="M23.455 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.418a5.49 5.49 0 01-2.382 3.6l3.727 2.891c2.182-2.009 3.455-4.973 3.455-8.627z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235L1.49 17.436A11.944 11.944 0 010 12c0-1.99.49-3.864 1.355-5.527l3.91 3.145A7.033 7.033 0 004.91 12c0 .79.13 1.554.356 2.235z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.955-1.073 7.94-2.918l-3.727-2.89c-1.036.69A4.744 4.744 0 0112 19.09a7.072 7.072 0 01-6.727-4.855l-3.784 2.927C3.386 21.318 7.345 24 12 24z"
            />
          </svg>
          Sign up with Google
        </Button>

        {/* Login Redirection Footer Link */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-primary transition-colors hover:underline"
          >
            Sign in here
          </a>
        </div>
      </div>
    </div>
  )
}
