"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import Container from "@/components/shared/container"

export default function Sponsorship() {
  const t = useTranslations("sponsorship.tiers")
  const tiers = t.raw("items") as any[]

  return (
    <div className="bg-white py-16">
      <Container className="mx-auto">
        <h2 className="mb-12 text-center font-serif text-4xl tracking-wide whitespace-pre-line text-red-900 uppercase">
          {t("sectionTitle")}
        </h2>

        {/* Top Row: Diamond & Platinum */}
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          {tiers.slice(0, 2).map((tier) => (
            <div
              key={tier.id}
              className="relative flex flex-col rounded-lg border-2 border-red-900 p-8"
            >
              {tier.isFeatured && (
                <span className="absolute top-0 right-0 bg-red-800 px-3 py-1 text-xs text-white uppercase">
                  Most Impactful
                </span>
              )}
              <p className="mb-2 text-sm font-bold text-red-800 uppercase">
                {tier.tierLabel}
              </p>
              <h3 className="mb-1 font-serif text-3xl font-bold">
                {tier.title}
              </h3>
              <p className="mb-6 text-2xl font-bold text-red-800">
                {tier.price}{" "}
                <span className="text-sm font-normal text-gray-600">
                  {tier.period}
                </span>
              </p>
              <ul className="mb-8 flex-grow space-y-4">
                {tier.features.map((feat: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {feat}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full py-5 text-white ${tier.id === "diamond" ? "bg-red-700 hover:bg-red-800" : "bg-black hover:bg-gray-800"}`}
              >
                {t("cta")}
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom Row: Gold, Silver, Bronze */}
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.slice(2).map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col rounded-lg border-2 border-red-900 p-6"
            >
              <p className="mb-2 text-sm font-bold text-red-800 uppercase">
                {tier.tierLabel}
              </p>
              <h3 className="mb-1 font-serif text-2xl font-bold">
                {tier.title}
              </h3>
              <p className="mb-6 text-xl font-bold text-red-800">
                {tier.price}{" "}
                <span className="text-sm font-normal text-gray-600">
                  {tier.period}
                </span>
              </p>
              <ul className="mb-8 flex-grow space-y-3">
                {tier.features.map((feat: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {feat}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full border-red-900 py-5 text-red-900"
              >
                {t("cta")}
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}
