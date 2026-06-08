"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { MEMBERSHIP_REGISTRY } from "@/constents/membership"
import { PackageTier, usePackageStore } from "@/store/use-membership-store"

export default function MembershipPackagesPage() {
  const router = useRouter()
  const selectPackage = usePackageStore((state) => state.selectPackage)

  const handleSelection = (tier: PackageTier) => {
    // Save the selected tier locally inside your global Zustand slice state
    selectPackage(tier)

    // Redirect cleanly using the explicit dynamic dynamic slug route target path
    router.push(`/membership/${tier}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F4F2] px-4 py-20 font-sans text-[#1C1A19]">
      {/* Background Decorative Element */}
      <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#E5DCD5]/40 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Page Top Title Headers Header */}
        <div className="mb-16 text-center">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase">
            Membership Plan
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#2C2927] sm:text-5xl">
            Select Your Workspace Access Level
          </h1>
        </div>

        {/* Dynamic Card Generation Grid layout */}
        <div className="grid items-stretch gap-8 md:grid-cols-3">
          {(Object.keys(MEMBERSHIP_REGISTRY) as PackageTier[]).map((key) => {
            const item = MEMBERSHIP_REGISTRY[key]
            const isPastoral = item.id === "pastoral"

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-2xl border bg-card p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isPastoral
                    ? "z-20 scale-[1.02] border-primary ring-2 ring-primary/20 md:top-[-8px]"
                    : "border-border/60"
                }`}
              >
                {/* Popular Item Badge Indicator */}
                {isPastoral && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground uppercase">
                    Most Popular Tier
                  </span>
                )}

                <div>
                  {/* Package Titles Block Info */}
                  <div className="mb-5">
                    <h3 className="text-xl font-bold tracking-tight text-[#2C2927]">
                      {item.title}
                    </h3>
                    <p className="mt-2 min-h-[48px] text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {/* Financial Metrics Information Block */}
                  <div className="mb-6 flex items-baseline border-b border-border/60 pb-6 text-[#1C1A19]">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ${item.price}
                    </span>
                    <span className="ml-1.5 text-xs font-medium text-muted-foreground">
                      / {item.billingPeriod}
                    </span>
                  </div>

                  {/* Feature Checklist Breakdown Items list */}
                  <ul className="mb-8 space-y-3.5 text-sm text-foreground/90">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="text-xs leading-tight font-medium text-muted-foreground">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confirm Action Button Selection */}
                <Button
                  onClick={() => handleSelection(item.id)}
                  variant={isPastoral ? "default" : "secondary"}
                  className="group h-11 w-full gap-2 font-semibold transition-all"
                >
                  Select Package
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
