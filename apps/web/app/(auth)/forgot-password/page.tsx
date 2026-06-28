"use client"

import React from "react"
import { Mail, ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"

// Workspace UI Components
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"


const ZCEmailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

type ZTCEmailSchema = z.infer<typeof ZCEmailSchema>


export default function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword")

  // Extract control and handleSubmit from the form store
  const form = useForm<ZTCEmailSchema>({
    resolver: zodResolver(ZCEmailSchema),
    defaultValues: { email: "" },
  })

  const onEmailSubmit = (data: ZTCEmailSchema) => {
    
    console.log("Forgot Password Form Submitted:", data)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 font-sans text-foreground transition-colors duration-300">
      <div className="pointer-events-none absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[440px] rounded-2xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl backdrop-blur-md">
        {/* STEP 1: Enter Email */}
        <div className="animate-in duration-300 fade-in">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-foreground">
              {t("step1Title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("step1Subtitle")}
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(onEmailSubmit)}
            className="space-y-5"
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel
                      htmlFor="forgot-password-email"
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
                        id="forgot-password-email"
                        placeholder="name@example.com"
                        type="email"
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
            </FieldGroup>

            <Button
              type="submit"
              className="h-11 w-full font-medium shadow-md transition-all active:scale-[0.99]"
            >
              <span>{t("sendCode")}</span>
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm">
          <Link
            href="/login"
            className="group inline-flex items-center gap-1.5 font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            {t("backToSignIn")}
          </Link>
        </div>
      </div>
    </div>
  )
}