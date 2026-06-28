"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, CheckCircle2, KeyRound } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"

// Workspace UI Components
import { Button } from "@workspace/ui/components/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

type VerifyOtpStep = "VERIFY_CODE" | "SUCCESS"

export const ZCCodeSchema = z.object({
  code: z.string().min(6, { message: "Code must be at least 6 characters" }),
})

type ZTCCodeSchema = z.infer<typeof ZCCodeSchema>

export default function VerifyOtpForm() {
  const t = useTranslations("auth.forgotPassword")
  const [currentStep, setCurrentStep] = useState<VerifyOtpStep>("VERIFY_CODE")
  const [email, setEmail] = useState<string>("")
  const [otpCode, setOtpCode] = useState<string>("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get("email") || "")
  }, [])

 const form = useForm<ZTCCodeSchema>({
  resolver: zodResolver(ZCCodeSchema),
  defaultValues: { code: "" },
 })

  const onSubmit = (data: ZTCCodeSchema) => {
    // Just logging the form data
    console.log("OTP Verification Data Submitted:", data)
    
    // Simulating success flow
    setOtpCode(data.code)
    setCurrentStep("SUCCESS")
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        {/* STEP 2: Verify OTP */}
        {currentStep === "VERIFY_CODE" && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                <KeyRound size={20} className="text-primary-foreground" />
              </div>
              <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
                {t("step2Title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("step2Subtitle")}
              </p>
            </div>

            {!email && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-center text-xs font-medium text-destructive">
                Warning: Missing email parameter. Please return to the forgot password page.
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                control={form.control}
                name="code"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col items-center justify-center space-y-3"
                  >
                    <FieldLabel className="w-full text-left text-sm font-medium tracking-wide text-foreground/90 align-self-start">
                      {t("codeLabel")}
                    </FieldLabel>

                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!email}
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="flex h-12 w-12 items-center justify-center rounded-md border border-input bg-background/50 text-lg font-bold shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="w-full text-left px-1 mt-1 text-xs"
                      />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                disabled={!email}
                className="h-11 w-full font-medium shadow-md transition-all active:scale-[0.99]"
              >
                <span>{t("verifyCode")}</span>
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
            <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
              {t("step3Title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("step3Subtitle")}
            </p>

            <Button
              type="button"
              className="mt-6 h-11 w-full font-medium shadow-md shadow-primary/20"
              onClick={() => {
                window.location.href = `/reset-password?email=${encodeURIComponent(
                  email
                )}&otp=${encodeURIComponent(otpCode)}`
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
              href="/forgot-password"
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