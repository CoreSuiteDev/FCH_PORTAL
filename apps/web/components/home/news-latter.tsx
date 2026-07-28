"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { toast } from "@workspace/ui/components/sonner"

import { useSubscribeNewsletter } from "@/hooks/useNewsletter"
import type { ZTCreateNewsletter } from "@workspace/types"
import { ZCICreateNewsletterSchema } from "@workspace/types"

export function NewsletterSection() {
  const t = useTranslations("home.newsletter")

  const form = useForm<ZTCreateNewsletter>({
    resolver: zodResolver(ZCICreateNewsletterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  })

  const { mutate: subscribe, isPending } = useSubscribeNewsletter()

  const onSubmit = (data: ZTCreateNewsletter) => {
    subscribe(data, {
      onSuccess: () => {
        toast.success("Successfully subscribed to the newsletter!")
        form.reset()
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to subscribe. Please try again.")
      },
    })
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-base shadow-sm transition-colors focus-visible:border-[#c42028] focus-visible:ring-2 focus-visible:ring-[#c42028]/20"

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/news-latter.jpg')" }}
      />

      <div className="relative z-10 mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-2xl md:p-12">
        <h2 className="mb-10 text-center font-trajan text-3xl font-extrabold text-[#c42028]">
          {t("title")}
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* First Name */}
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="space-y-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className="text-sm font-semibold text-slate-800">
                      {t("firstNameLabel")}{" "}
                      <span className="text-red-600">*</span>
                    </FieldLabel>

                    <Input
                      {...field}
                      placeholder={t("firstNamePlaceholder")}
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      className={inputClass}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Last Name */}
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    className="space-y-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel className="text-sm font-semibold text-slate-800">
                      {t("lastNameLabel")}
                    </FieldLabel>

                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder={t("lastNamePlaceholder")}
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      className={inputClass}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="space-y-2"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel className="text-sm font-semibold text-slate-800">
                    {t("emailLabel")} <span className="text-red-600">*</span>
                  </FieldLabel>

                  <Input
                    {...field}
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                    className={inputClass}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-8 h-12 w-full rounded-lg bg-[#c42028] text-lg font-bold text-white transition-colors hover:cursor-pointer hover:bg-[#a91b22] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {t("button")}
          </Button>
        </form>
      </div>
    </section>
  )
}