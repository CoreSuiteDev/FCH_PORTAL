"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { usePackageStore } from "@/store/use-membership-store"
import { MEMBERSHIP_REGISTRY } from "@/constants/membership"
import { useTranslations } from "next-intl"

export default function MembershipPackages() {
  const router = useRouter()
  const { selectPackage, billingCycle, setBillingCycle } = usePackageStore()
  const t = useTranslations("membership.packages")

  const handleSelection = (tier: any) => {
    selectPackage(tier)
    router.push(`/membership/${tier}`)
  }

  const getPrice = (price: number) => {
    if (billingCycle === "monthly") return price
    return Math.round(price * 10) // 2 months free calculation
  }

  const registryItems = Object.values(MEMBERSHIP_REGISTRY).map((pkg) => {
    const localizedTitle = t(`items.${pkg.id}.title`)
    const localizedDescription = t(`items.${pkg.id}.description`)
    const localizedFeatures = t.raw(`items.${pkg.id}.features`) as string[]

    return {
      ...pkg,
      title: localizedTitle,
      description: localizedDescription,
      features: localizedFeatures,
    }
  })

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F4F2] px-4 py-20">
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
            const isPastoral = item.id === "pastoral"

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-2xl border bg-card p-8 shadow-md transition-all duration-300 hover:shadow-xl ${
                  isPastoral
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/60"
                }`}
              >
                {isPastoral && (
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
                      {item.subtitle}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <div className="mb-6 flex items-baseline border-b border-border/60 pb-6">
                    <span className="text-4xl font-extrabold">
                      ${getPrice(item.price)}
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
                  onClick={() => handleSelection(item.id)}
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
