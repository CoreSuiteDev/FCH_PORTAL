"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"

import Container from "@/components/shared/container"
import { useSponsorPlan } from "@/hooks/useSponsorPlan"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { AlertCircle } from "lucide-react"

export default function Sponsorship() {
  const t = useTranslations("sponsorship.tiers")
  const { data, isLoading, error } = useSponsorPlan()

  const displayTiers = data

  if (isLoading) {
    return (
      <div className="bg-white py-16">
        <Container className="mx-auto">
          {/* Skeleton Title */}
          <div className="mb-12 flex justify-center">
            <Skeleton className="h-10 w-3/4 max-w-md rounded-md" />
          </div>

          {/* Top Row Skeleton: 2 Cards */}
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-lg border-2 border-slate-100 p-8 shadow-sm"
              >
                <Skeleton className="mb-2 h-4 w-24 rounded" />
                <Skeleton className="mb-1 h-8 w-48 rounded" />
                <Skeleton className="mb-6 h-6 w-32 rounded" />

                <div className="mb-8 grow space-y-4">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-4/6 rounded" />
                </div>

                <Skeleton className="h-14 w-full rounded-md" />
              </div>
            ))}
          </div>

          {/* Bottom Row Skeleton: 3 Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-lg border-2 border-slate-100 p-6 shadow-sm"
              >
                <Skeleton className="mb-2 h-4 w-20 rounded" />
                <Skeleton className="mb-1 h-6 w-36 rounded" />
                <Skeleton className="mb-6 h-5 w-28 rounded" />

                <div className="mb-8 grow space-y-3">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>

                <Skeleton className="h-14 w-full rounded-md" />
              </div>
            ))}
          </div>
        </Container>
      </div>
    )
  }

  // -------------------------
  // 2. Error State
  // -------------------------
  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center bg-white py-16 text-slate-500">
        <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
        <h2 className="text-xl font-semibold text-slate-700">
          Failed to load plans
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Please try refreshing the page later.
        </p>
      </div>
    )
  }

  // -------------------------
  // 3. Success State (Data Loaded)
  // -------------------------
  return (
    <div className="bg-white py-16">
      <Container className="mx-auto">
        <h2 className="mb-12 text-center font-trajan text-4xl font-extrabold tracking-wide whitespace-pre-line text-primary">
          {t("sectionTitle")}
        </h2>

        {/* Top Row: Diamond & Platinum */}
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          {displayTiers.slice(0, 2).map((tier: any) => (
            <div
              key={tier.id}
              className="relative flex flex-col rounded-lg border-2 border-primary p-8"
            >
              {tier.isFeatured && (
                <span className="absolute top-0 right-0 bg-primary px-3 py-1 text-xs text-white uppercase">
                  Most Impactful
                </span>
              )}
              <p className="mb-2 text-sm font-bold text-primary uppercase">
                {tier.tierLabel || tier.tier}
              </p>
              <h3 className="mb-1 font-trajan text-3xl font-bold">
                {tier.title || tier.planName}
              </h3>
              <p className="mb-6 text-2xl font-bold text-primary">
                {tier.price ||
                  `${tier.currency === "USD" ? "$" : "€"} ${tier.amount}`}{" "}
                <span className="text-sm font-normal text-gray-600">
                  {tier.period || "/ yr"}
                </span>
              </p>

              <ul className="mb-8 grow space-y-4">
                {(tier.features || tier.benefits || []).map(
                  (feat: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      {feat}
                    </li>
                  )
                )}
              </ul>

              <Link href={`/sponsor/${tier.id}`}>
                <Button
                  className={`w-full py-5 font-semibold text-white ${
                    tier.tier === "DIAMOND" || tier.id === "diamond"
                      ? "bg-red-700 hover:bg-primary"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {t("cta")}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Row: Gold, Silver, Bronze */}
        <div className="grid gap-8 md:grid-cols-3">
          {displayTiers.slice(2).map((tier: any) => (
            <div
              key={tier.id}
              className="flex flex-col rounded-lg border-2 border-primary p-6"
            >
              <p className="mb-2 text-sm font-bold text-primary uppercase">
                {tier.tierLabel || tier.tier}
              </p>
              <h3 className="mb-1 font-trajan text-2xl font-bold">
                {tier.title || tier.planName}
              </h3>
              <p className="mb-6 text-xl font-bold text-primary">
                {tier.price ||
                  `${tier.currency === "USD" ? "$" : "€"} ${tier.amount}`}{" "}
                <span className="text-sm font-normal text-gray-600">
                  {tier.period || "/ yr"}
                </span>
              </p>

              <ul className="mb-8 grow space-y-3">
                {(tier.features || tier.benefits || []).map(
                  (feat: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      {feat}
                    </li>
                  )
                )}
              </ul>

              <Link href={`/sponsor/${tier.id}`}>
                <Button
                  variant="outline"
                  className="w-full border-primary py-5 font-semibold text-primary"
                >
                  {t("cta")}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
