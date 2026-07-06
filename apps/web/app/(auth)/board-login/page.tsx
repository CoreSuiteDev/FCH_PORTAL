"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, Loader2, KeyRound } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
import { ZCLoginSchema, ZTCLoginSchema } from "@workspace/types/index"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin, useChangePasswordForced } from "@/hooks/useAuth"
import { toast } from "@workspace/ui/components/sonner"

export default function BoardLoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  
  // States for forced first-time password change
  const [isForcedChange, setIsForcedChange] = useState<boolean>(false)
  const [tempPassword, setTempPassword] = useState<string>("")
  const [newPasswordVal, setNewPasswordVal] = useState<string>("")
  const [confirmPasswordVal, setConfirmPasswordVal] = useState<string>("")

  const { mutate: login, isPending: isLoginPending } = useLogin()
  const { mutate: changePasswordForced, isPending: isChangePending } = useChangePasswordForced()

  const form = useForm<ZTCLoginSchema>({
    resolver: zodResolver(ZCLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: ZTCLoginSchema) => {
    login(
      { ...data },
      {
        onSuccess: (res) => {
          // If password change is required
          if (res.user?.passwordChangeRequired) {
            toast.info("First-time login detected. Please set a permanent password.")
            setTempPassword(data.password)
            setIsForcedChange(true)
          } else {
            toast.success("Signed in successfully!")
            window.location.href =
              process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/"
          }
        },
        onError: (err: Error) => {
          toast.error(err.message || "Invalid email or password.")
        },
      }
    )
  }

  const handleForcedPasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPasswordVal.length < 6) {
      toast.error("Password must be at least 6 characters long.")
      return
    }

    if (newPasswordVal !== confirmPasswordVal) {
      toast.error("Passwords do not match.")
      return
    }

    const email = form.getValues("email")

    changePasswordForced(
      {
        email,
        currentPassword: tempPassword,
        newPassword: newPasswordVal,
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully! Logging you in...")
          
          // Log in with new credentials automatically
          login(
            { email, password: newPasswordVal },
            {
              onSuccess: () => {
                window.location.href =
                  process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/"
              },
              onError: (err: Error) => {
                toast.error(err instanceof Error? err.message : "")
                setIsForcedChange(false)
                setNewPasswordVal("")
                setConfirmPasswordVal("")
                form.setValue("password", "")
              }
            }
          )
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to update password.")
        },
      }
    )
  }

  const isLoading = isLoginPending || isChangePending

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
            {isForcedChange ? "Set Permanent Password" : "Board Member Portal"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isForcedChange 
              ? "Please update your password to secure your board member access." 
              : "Sign in with your board member credentials to access the FCH Portal."}
          </p>
        </div>

        {!isForcedChange ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              {/* Email Field */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-1.5"
                  >
                    <FieldLabel
                      htmlFor="login-email"
                      className="text-sm font-medium tracking-wide text-foreground/90"
                    >
                      Email Address
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
                  <Field
                    data-invalid={fieldState.invalid}
                    className="space-y-1.5"
                  >
                    <FieldLabel
                      htmlFor="login-password"
                      className="text-sm font-medium tracking-wide text-foreground/90"
                    >
                      Password
                    </FieldLabel>
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
            </FieldGroup>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full cursor-pointer font-medium shadow-md shadow-primary/20 transition-all active:scale-[0.99]"
            >
              <span className="flex w-full items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign In
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
        ) : (
          <form onSubmit={handleForcedPasswordChangeSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium tracking-wide text-foreground/90">
                New Password
              </label>
              <div className="group relative">
                <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <KeyRound size={18} />
                </span>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  disabled={isLoading}
                  required
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium tracking-wide text-foreground/90">
                Confirm New Password
              </label>
              <div className="group relative">
                <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Lock size={18} />
                </span>
                <Input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPasswordVal}
                  onChange={(e) => setConfirmPasswordVal(e.target.value)}
                  disabled={isLoading}
                  required
                  className="flex h-11 w-full rounded-md border border-input bg-background/50 py-2 pr-11 pl-11 text-sm ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full cursor-pointer font-medium shadow-md shadow-primary/20 transition-all active:scale-[0.99] mt-2"
            >
              <span className="flex w-full items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update Password & Login
              </span>
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
