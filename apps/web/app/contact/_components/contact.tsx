"use client"

import { Button } from "@workspace/ui/components/button"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Users,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface ContactFormData {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const t = useTranslations("contact")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    setIsSubmitted(true)
    reset()
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return ( 
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 md:py-20">
      {/* Subtle Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[960px] overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Sidebar Section */}
          <div className="flex flex-col justify-between bg-primary p-8 text-primary-foreground md:col-span-5 md:p-10">
            <div>
              <h2 className="font-trajan text-2xl font-bold tracking-wide">
                {t("sidebar.title")}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-primary-foreground/85">
                {t("sidebar.subtitle")}
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-primary-foreground/15 p-2.5 backdrop-blur-sm">
                    <BookOpen size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      {t("sidebar.items.mission.title")}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-primary-foreground/75">
                      {t("sidebar.items.mission.description")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-primary-foreground/15 p-2.5 backdrop-blur-sm">
                    <GraduationCap size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      {t("sidebar.items.formation.title")}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-primary-foreground/75">
                      {t("sidebar.items.formation.description")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-xl bg-primary-foreground/15 p-2.5 backdrop-blur-sm">
                    <Users size={20} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      {t("sidebar.items.community.title")}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-primary-foreground/75">
                      {t("sidebar.items.community.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social / Community Link */}
            <div className="mt-10 border-t border-primary-foreground/20 pt-6">
              <a
                href="https://www.facebook.com/FCHcatechesis"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl bg-primary-foreground/10 px-4 py-3 text-xs font-medium text-primary-foreground transition-all hover:bg-primary-foreground/20"
              >
                <span>{t("sidebar.socialLabel")}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 md:col-span-7 md:p-10">
            {isSubmitted && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>{t("form.successMessage")}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {t("form.nameLabel")}
                  </label>
                  <input
                    {...register("name", { required: true })}
                    className="flex h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder={t("form.namePlaceholder")}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {t("form.emailLabel")}
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="flex h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder={t("form.emailPlaceholder")}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {t("form.messageLabel")}
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={4}
                    className="flex w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder={t("form.messagePlaceholder")}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-lg bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  t("form.submitButton")
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
