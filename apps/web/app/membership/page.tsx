"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { PackageTier, usePackageStore } from "@/store/use-membership-store"
import { MEMBERSHIP_REGISTRY } from "@/constents/membership"

export default function MembershipPackagesPage() {
  const router = useRouter()
  const selectPackage = usePackageStore((state) => state.selectPackage)

  const handleSelection = (tier: PackageTier) => {
    selectPackage(tier)
    router.push(`/membership/${tier}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F4F2] px-4 py-20">
      <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#E5DCD5]/40 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-widest text-primary uppercase">
            Membership Plan
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#2C2927] sm:text-5xl">
            Select Your Workspace Access Level
          </h1>
        </div>

        <div className="mx-auto grid max-w-3xl items-stretch gap-8 md:grid-cols-2">
          {Object.values(MEMBERSHIP_REGISTRY).map((item) => {
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
                    Recommended
                  </span>
                )}

                <div>
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-[#2C2927]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <div className="mb-6 flex items-baseline border-b border-border/60 pb-6">
                    <span className="text-4xl font-extrabold">
                      ${item.price}
                    </span>
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      / {item.billingPeriod}
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
                  Select Package
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
