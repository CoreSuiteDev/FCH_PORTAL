"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { toast } from "@workspace/ui/components/sonner"
import { usePackageStore } from "@/store/use-membership-store"
import { usePackages } from "@/hooks/usePackage"
import { useTranslations } from "next-intl"

export default function MembershipPackages() {
  const router = useRouter()
  const { selectPackage, billingCycle, setBillingCycle } = usePackageStore()
  const t = useTranslations("membership.packages")

  const { data: packages, isLoading, isError } = usePackages()

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load membership packages. Please try again later.")
    }
  }, [isError])

  const handleSelection = (slug: string) => {
    selectPackage(slug)
    router.push(`/membership/${slug}`)
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-white px-4 py-20">
        <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#E5DCD5]/40 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase">
              {t("plan")}
            </span>
            <h1 className="mt-3 pt-4 font-trajan text-4xl font-extrabold tracking-tight whitespace-pre-line text-[#2C2927] sm:text-5xl">
              {t("title")}
            </h1>

            <div className="mt-8 inline-flex items-center rounded-full border border-border bg-white p-1 shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-primary text-white"
                    : "text-muted-foreground"
                }`}
              >
                {t("monthly")}
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                  billingCycle === "yearly"
                    ? "bg-primary text-white"
                    : "text-muted-foreground"
                }`}
              >
                {t("yearly")}
              </button>
            </div>
          </div>

          <div className="mx-auto grid max-w-3xl items-stretch gap-8 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-8 shadow-md h-[450px]"
              >
                <div>
                  <div className="mb-5">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="mt-3 h-4 w-28" />
                    <Skeleton className="mt-2 h-16 w-full" />
                  </div>
                  <div className="mb-6 border-b border-border/60 pb-6">
                    <Skeleton className="h-10 w-24" />
                  </div>
                  <div className="mb-8 space-y-3.5">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const filteredPackages = packages?.filter(
    (pkg) => pkg.isActive && pkg.billingCycle === (billingCycle === "monthly" ? "MONTHLY" : "YEARLY")
  ) || []

  const registryItems = filteredPackages.map((pkg) => {
    const baseSlug = pkg.slug.split("-")[0]
    let title = pkg.name
    let description = pkg.description || ""
    let features = Array.isArray(pkg.features) ? (pkg.features as string[]) : []

    try {
      title = t(`items.${baseSlug}.title`)
      description = t(`items.${baseSlug}.description`)
      features = t.raw(`items.${baseSlug}.features`) as string[]
    } catch (e) {
      // fallback to DB if localization fails
    }

    return {
      ...pkg,
      title,
      description,
      features,
    }
  })

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 py-20">
      <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#E5DCD5]/40 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase">
            {t("plan")}
          </span>
          <h1 className="mt-3 pt-4 font-trajan text-4xl font-extrabold tracking-tight whitespace-pre-line text-[#2C2927] sm:text-5xl">
            {t("title")}
          </h1>

          <div className="mt-8 inline-flex items-center rounded-full border border-border bg-white p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-primary text-white"
                  : "text-muted-foreground"
              }`}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-full px-6 py-2 text-sm font-bold transition-all ${
                billingCycle === "yearly"
                  ? "bg-primary text-white"
                  : "text-muted-foreground"
              }`}
            >
              {t("yearly")}
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-3xl items-stretch gap-8 md:grid-cols-2">
          {registryItems.map((item) => {
            const isPastoral = item.type === "PASTORAL"

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-2xl border bg-card p-8 shadow-md transition-all duration-300 hover:shadow-xl ${
                  isPastoral
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/60"
                }`}
              >
                {item.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
                    {t("recommended")}
                  </span>
                )}

                <div>
                  <div className="mb-5">
                    <h3 className="font-trajan text-xl font-extrabold text-[#2C2927]">
                      {item.title}
                    </h3>
                    <h3 className="mt-3 text-xs font-semibold">
                      {item.subTitle}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <div className="mb-6 flex items-baseline border-b border-border/60 pb-6">
                    <span className="text-4xl font-extrabold">
                      ${Number(item.price)}
                    </span>
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      /{" "}
                      {billingCycle === "monthly"
                        ? t("monthSuffix")
                        : t("yearSuffix")}
                    </span>
                  </div>

                  <ul className="mb-8 space-y-3.5 text-sm text-foreground/90">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleSelection(item.slug)}
                  variant={isPastoral ? "default" : "secondary"}
                  className="h-11 w-full font-semibold"
                >
                  {t("select")}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
